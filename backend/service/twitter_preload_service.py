# %%


import pandas as pd
import requests
import os
from datetime import datetime
from dotenv import load_dotenv
import requests_cache
import json

load_dotenv()
bearer_token = os.environ.get("BEARER_TOKEN")
gcs_developer_key = os.environ.get("GCS_DEVELOPER_KEY")
gcs_CX = os.environ.get("GCS_CX")

expire_after_param = 6 * 60 * 60
# 6 hours
requests_cache.install_cache(
    "data/twitter_service_cache", backend="sqlite", expire_after=expire_after_param
)

# %%
def get_trends(url):
    """
    ================
    TWITTER: GET trends/place
    ================
    Returns the top 50 trending topics for a specific id, if trending information is available for it.
    Note: The id parameter for this endpoint is the "where on earth identifier" or WOEID

    # https://developer.twitter.com/en/docs/twitter-api/v1/trends/trends-for-location/api-reference/get-trends-place

    """

    def bearer_oauth(r):
        """
        Method required by bearer token authentication.
        """
        r.headers["Authorization"] = f"Bearer {bearer_token}"
        return r

    def connect_to_endpoint(WOEID: str):
        if not isinstance(WOEID, str):
            WOEID = str(WOEID)
        url = "https://api.twitter.com/1.1/trends/place.json?id=" + WOEID
        response = requests.get(url, auth=bearer_oauth)
        print(response.status_code)
        if response.status_code != 200:
            raise Exception(response.status_code, response.text)
        return response.json()

    return connect_to_endpoint(url)


def clean_woeid_trends_test(woeid_trends):
    """
    ================
    convert from noSQL to dataframe and prepare for further data cleansing
    ================
    Returns dataframe, Japan trendings keywords (list), as_of as timestep
    """
    wip_woeid_trends_df = pd.DataFrame()
    national_trends = set()
    regional_trends = set()
    as_of = []
    for area in woeid_trends.keys():

        toptrending_all_areas = woeid_trends[area][0]["trends"]
        SQLite_timeformatted = (
            woeid_trends[area][0]["as_of"].replace("T", " ").replace("Z", "")
        )
        as_of.append(SQLite_timeformatted)
        row = []
        for toptrending_all_each_area in toptrending_all_areas:
            keyword = toptrending_all_each_area["name"]
            row.append(keyword)
            if area == "日本":
                national_trends.add(keyword)
            else:
                regional_trends.add(keyword)
        validate = 50 - len(row)
        if validate > 0:
            empty_lst = [""] * validate
            row.extend(empty_lst)
        elif validate < 0:
            row = row[:50]
        wip_woeid_trends_df[area] = row
        national_trends = national_trends.union(regional_trends)
    return wip_woeid_trends_df, national_trends, as_of

def get_woeid_trends():
    """
    get raw JSON format data from twitter
    """
    available_data_to_woeid = pd.read_excel(
        "./data/ELT_JP_WOEID.xlsx", index_col="Area"
    ).astype("string")
    available_data_to_woeid = available_data_to_woeid.to_dict("dict")["WOEID"]

    woeid_trends = {}

    for area, woeid_str in available_data_to_woeid.items():
        print(area + ": " + woeid_str)
        json_response = get_trends(woeid_str)
        woeid_trends[area] = json_response

    return woeid_trends


def prepare_meta_data():
    """
    prepare meta data
    """

    time_now_dt = datetime.now()
    preloadDatetime = time_now_dt.strftime("%Y-%m-%d %H:%M:%S")
    preloadTimestampMillisec = datetime.timestamp(time_now_dt) * 1000
    preloadId = hex(int(preloadTimestampMillisec * 1000))

    meta = {
        "preloadDatetime": preloadDatetime,
        "preloadTimestampMillisec": preloadTimestampMillisec,
        "preloadId": preloadId,
    }

    return meta


def init_preload_data(meta):
    """
    initialize preload data
        note: the rule of name is that "key_to_value".
        In the other words, user inputs variable on the most left side to get most right side.
    """

    region_to_rank_to_keyword = {"data": {}, "preloadMeta": meta}
    rank_to_keyword_agg = {"data": {}, "preloadMeta": meta}

    keyword_to_region_to_rank = {"data": {}, "preloadMeta": meta}
    keyword_to_rank_agg = {"data": {}, "preloadMeta": meta}

    region_to_unqiue_keyword = {"data": {}, "preloadMeta": meta}

    return (
        region_to_rank_to_keyword,
        rank_to_keyword_agg,
        keyword_to_region_to_rank,
        keyword_to_rank_agg,
        region_to_unqiue_keyword,
    )


def process_rank_data(woeid_trends,
    region_to_rank_to_keyword,
    rank_to_keyword_agg,
    keyword_to_region_to_rank,
    keyword_to_rank_agg,
    region_to_unqiue_keyword,
):
    """
    process data
    """
    for region in woeid_trends.keys():

        keyword_objs = woeid_trends[region][0]["trends"]

        if region != "日本":
            region_to_rank_to_keyword["data"][region] = {}
        for index, keyword_obj in enumerate(keyword_objs):
            rank = index + 1
            keyword = keyword_obj["name"]

            if region == "日本":
                rank_to_keyword_agg["data"][rank] = keyword

                has_key = keyword in keyword_to_rank_agg["data"]
                if not has_key:
                    keyword_to_rank_agg["data"][keyword] = {}
                keyword_to_rank_agg["data"][keyword]["rank"] = rank

            else:
                region_to_rank_to_keyword["data"][region][rank] = keyword

                has_key = keyword in keyword_to_region_to_rank["data"]
                if not has_key:
                    keyword_to_region_to_rank["data"][keyword] = {}
                keyword_to_region_to_rank["data"][keyword][region] = rank

    general_hit_keywords = list(keyword_to_rank_agg["data"].keys())

    for region, rank_to_keyword_dict in region_to_rank_to_keyword["data"].items():
        print(region)
        region_to_unqiue_keyword["data"][region] = []
        keywords = rank_to_keyword_dict.values()
        for keyword in keywords:
            if keyword not in general_hit_keywords:
                region_to_unqiue_keyword["data"][region].append(keyword)
                print("   " + keyword)
        print(len(region_to_unqiue_keyword["data"][region]))

    return (
        region_to_rank_to_keyword,
        rank_to_keyword_agg,
        keyword_to_region_to_rank,
        keyword_to_rank_agg,
        region_to_unqiue_keyword,
    )


# %%


def add_img_url(keyword_to_rank_agg):
    """
    get url of images to display from Google
        CAUTION: this one is not free. be careful to use. $5 per thousand queries
    """

    from google_images_search import GoogleImagesSearch

    gis = GoogleImagesSearch(gcs_developer_key, gcs_CX)

    _search_params = {
        "num": 1,
    }
    gcs_search_keywords = list(keyword_to_rank_agg["data"].keys())
    for index, gcs_search_keyword in enumerate(gcs_search_keywords):
        _search_params["q"] = gcs_search_keyword
        print("index: " + str(index) + ", keyword: " + str(gcs_search_keyword))

        # this will only search for images:
        res = gis.search(search_params=_search_params)
        for image in gis.results():
            img_url = image.url
            keyword_to_rank_agg["data"][gcs_search_keyword]["imgURL"] = img_url
    return keyword_to_rank_agg


# %%


def save_file(
    region_to_rank_to_keyword,
    rank_to_keyword_agg,
    keyword_to_region_to_rank,
    keyword_to_rank_agg,
    region_to_unqiue_keyword,
):
    def save_dict_as_json(data: dict, name: str, path="data/preloadJSON/"):

        out_file = open(path + name + ".json", "wt")
        out_file.seek(0)
        res = json.dump(data, out_file)
        out_file.close()
        return res

    save_dict_as_json(rank_to_keyword_agg, "rank_to_keyword_agg")
    save_dict_as_json(region_to_rank_to_keyword, "region_to_rank_to_keyword")
    save_dict_as_json(keyword_to_rank_agg, "keyword_to_rank_agg")
    save_dict_as_json(keyword_to_region_to_rank, "keyword_to_region_to_rank")
    save_dict_as_json(region_to_unqiue_keyword, "region_to_unqiue_keyword")


# %%
