# %%


import pandas as pd
import requests
import os
from datetime import datetime

import requests_cache
import json

from config.config import Config
bearer_token = Config.BEARER_TOKEN

gcs_developer_key = Config.GCS_DEVELOPER_KEY
gcs_CX = Config.GCS_CX

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
        bearer_token = os.environ.get("BEARER_TOKEN")
        print("bearer_token")
        print(bearer_token)
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


def get_woeid_trends():
    """
    get raw JSON format data from twitter
    """
    available_data_to_woeid = pd.read_excel(
        "./data/ELT_JP_WOEID.xlsx", index_col="Area"
    ).astype("string")
    bearer_token = os.environ.get("BEARER_TOKEN")
    available_data_to_woeid = available_data_to_woeid.to_dict("dict")["WOEID"]

    woeid_trends = {}

    for area, woeid_str in available_data_to_woeid.items():
        print(area + ": " + woeid_str)
        json_response = get_trends(woeid_str)
        woeid_trends[area] = json_response

    return woeid_trends

def process_data():
    woeid_trends = get_woeid_trends()
    """
        process data
    """
    col = ['keyword', 'region', 'rank']

    national_df = pd.DataFrame(columns = col)
    regional_df = pd.DataFrame(columns = col)

    for region in woeid_trends.keys():


        
        keyword_objs = woeid_trends[region][0]["trends"]
            

            
        for index, keyword_obj in enumerate(keyword_objs):
            proxy_lst = []
            rank = index + 1
            keyword = keyword_obj["name"]

            proxy_lst.append(keyword)
            proxy_lst.append(region)
            proxy_lst.append(rank)

            proxy_df = pd.DataFrame(index = col, data = proxy_lst).T
            
            if (region == "日本"):
                national_df = national_df.append(proxy_df)
            else:
                regional_df = regional_df.append(proxy_df)        
    
 
    return regional_df, national_df


def prepare_url(regional_df, national_df):            
    """
        prepare url
    """
    gcs_developer_key = os.environ.get("GCS_DEVELOPER_KEY")
    gcs_CX = os.environ.get("GCS_CX")

    keyword_national_set = set(national_df.keyword)
    keyword_regional_set = set(regional_df.keyword)

    keywords = keyword_national_set.union(keyword_regional_set)

    from google_images_search import GoogleImagesSearch

    gis = GoogleImagesSearch(gcs_developer_key, gcs_CX)
    keyword_to_image = {}

    _search_params = {
        "num": 1,
    }

    for index, gcs_search_keyword in enumerate(keywords):
        _search_params["q"] = gcs_search_keyword
        print("index: " + str(index) + ", keyword: " + str(gcs_search_keyword))

        # this will only search for images:
        res = gis.search(search_params=_search_params)
        for image in gis.results():
            img_url = image.url
            keyword_to_image[gcs_search_keyword] = img_url
   
    national_df.reset_index(drop = True, inplace = True)
    regional_df.reset_index(drop = True, inplace = True)

    national_df['imgURL'] = ''
    regional_df['imgURL'] = ''
    for keyword in keyword_national_set:
        national_df['imgURL'][national_df.keyword == keyword]  = keyword_to_image[keyword]
     
    for keyword in keyword_regional_set:
        regional_df['imgURL'][regional_df.keyword==keyword] = keyword_to_image[keyword]


    national_df.reset_index(inplace = True)
    regional_df.reset_index(inplace = True)  
    
    return regional_df, national_df


def prepare_meta_n_dump(regional_df, national_df):
    """
        prepare meta data and dump
    """


    national_df_json_data = {'data': {}, 'meta': {}}

    for col in national_df.columns:
        national_df_json_data['data'][col] = national_df[col].values.tolist()

    regional_df_json_data = {'data': {}, 'meta': {}}
    for col in regional_df.columns:
        regional_df_json_data['data'][col] = regional_df[col].values.tolist()
        
    meta = prepare_meta_data()

    regional_df_json_data['meta']['preloadMeta'] = meta
    national_df_json_data['meta']['preloadMeta'] = meta

    def save_dict_as_json(data: dict, name: str, path="data/preloadJSON/"):

        out_file = open(path + name + ".json", "wt")
        out_file.seek(0)
        res = json.dump(data, out_file)
        out_file.close()
        return res

    save_dict_as_json(regional_df_json_data, "regional_df_json_data")
    save_dict_as_json(national_df_json_data, "national_df_json_data")


# def clean_woeid_trends_test(woeid_trends):
#     """
#     ================
#     convert from noSQL to dataframe and prepare for further data cleansing
#     ================
#     Returns dataframe, Japan trendings keywords (list), as_of as timestep
#     """
#     wip_woeid_trends_df = pd.DataFrame()
#     national_trends = set()
#     regional_trends = set()
#     as_of = []
#     for area in woeid_trends.keys():

#         toptrending_all_areas = woeid_trends[area][0]["trends"]
#         SQLite_timeformatted = (
#             woeid_trends[area][0]["as_of"].replace("T", " ").replace("Z", "")
#         )
#         as_of.append(SQLite_timeformatted)
#         row = []
#         for toptrending_all_each_area in toptrending_all_areas:
#             keyword = toptrending_all_each_area["name"]
#             row.append(keyword)
#             if area == "日本":
#                 national_trends.add(keyword)
#             else:
#                 regional_trends.add(keyword)
#         validate = 50 - len(row)
#         if validate > 0:
#             empty_lst = [""] * validate
#             row.extend(empty_lst)
#         elif validate < 0:
#             row = row[:50]
#         wip_woeid_trends_df[area] = row
#         national_trends = national_trends.union(regional_trends)
#     return wip_woeid_trends_df, national_trends, as_of

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


# def init_preload_data(meta):
#     """
#     initialize preload data
#         note: the rule of name is that "key_to_value".
#         In the other words, user inputs variable on the most left side to get most right side.
#     """

#     region_to_rank_to_keyword = {"data": {}, "preloadMeta": meta}
#     rank_to_keyword_agg = {"data": {}, "preloadMeta": meta}

#     keyword_to_region_to_rank = {"data": {}, "preloadMeta": meta}
#     keyword_to_rank_agg = {"data": {}, "preloadMeta": meta}

#     region_to_unqiue_keyword = {"data": {}, "preloadMeta": meta}

#     return (
#         region_to_rank_to_keyword,
#         rank_to_keyword_agg,
#         keyword_to_region_to_rank,
#         keyword_to_rank_agg,
#         region_to_unqiue_keyword,
#     )


# def process_rank_data(woeid_trends,
#     region_to_rank_to_keyword,
#     rank_to_keyword_agg,
#     keyword_to_region_to_rank,
#     keyword_to_rank_agg,
#     region_to_unqiue_keyword,
# ):
#     """
#     process data
#     """
#     for region in woeid_trends.keys():

#         keyword_objs = woeid_trends[region][0]["trends"]

#         if region != "日本":
#             region_to_rank_to_keyword["data"][region] = {}
#         for index, keyword_obj in enumerate(keyword_objs):
#             rank = index + 1
#             keyword = keyword_obj["name"]

#             if region == "日本":
#                 rank_to_keyword_agg["data"][rank] = keyword

#                 has_key = keyword in keyword_to_rank_agg["data"]
#                 if not has_key:
#                     keyword_to_rank_agg["data"][keyword] = {}
#                 keyword_to_rank_agg["data"][keyword]["rank"] = rank

#             else:
#                 region_to_rank_to_keyword["data"][region][rank] = keyword

#                 has_key = keyword in keyword_to_region_to_rank["data"]
#                 if not has_key:
#                     keyword_to_region_to_rank["data"][keyword] = {}
#                 keyword_to_region_to_rank["data"][keyword][region] = rank

#     general_hit_keywords = list(keyword_to_rank_agg["data"].keys())

#     for region, rank_to_keyword_dict in region_to_rank_to_keyword["data"].items():
#         print(region)
#         region_to_unqiue_keyword["data"][region] = []
#         keywords = rank_to_keyword_dict.values()
#         for keyword in keywords:
#             if keyword not in general_hit_keywords:
#                 region_to_unqiue_keyword["data"][region].append(keyword)
#                 print("   " + keyword)
#         print(len(region_to_unqiue_keyword["data"][region]))

#     return (
#         region_to_rank_to_keyword,
#         rank_to_keyword_agg,
#         keyword_to_region_to_rank,
#         keyword_to_rank_agg,
#         region_to_unqiue_keyword,
#     )


# # %%


# def add_img_url(keyword_to_rank_agg):
#     """
#     get url of images to display from Google
#         CAUTION: this one is not free. be careful to use. $5 per thousand queries
#     """

#     from google_images_search import GoogleImagesSearch

#     gis = GoogleImagesSearch(gcs_developer_key, gcs_CX)

#     _search_params = {
#         "num": 1,
#     }
#     gcs_search_keywords = list(keyword_to_rank_agg["data"].keys())
#     for index, gcs_search_keyword in enumerate(gcs_search_keywords):
#         _search_params["q"] = gcs_search_keyword
#         print("index: " + str(index) + ", keyword: " + str(gcs_search_keyword))

#         # this will only search for images:
#         res = gis.search(search_params=_search_params)
#         for image in gis.results():
#             img_url = image.url
#             keyword_to_rank_agg["data"][gcs_search_keyword]["imgURL"] = img_url
#     return keyword_to_rank_agg


# # %%


# def save_file(
#     region_to_rank_to_keyword,
#     rank_to_keyword_agg,
#     keyword_to_region_to_rank,
#     keyword_to_rank_agg,
#     region_to_unqiue_keyword,
# ):
#     def save_dict_as_json(data: dict, name: str, path="data/preloadJSON/"):

#         out_file = open(path + name + ".json", "wt")
#         out_file.seek(0)
#         res = json.dump(data, out_file)
#         out_file.close()
#         return res

#     save_dict_as_json(rank_to_keyword_agg, "rank_to_keyword_agg")
#     save_dict_as_json(region_to_rank_to_keyword, "region_to_rank_to_keyword")
#     save_dict_as_json(keyword_to_rank_agg, "keyword_to_rank_agg")
#     save_dict_as_json(keyword_to_region_to_rank, "keyword_to_region_to_rank")
#     save_dict_as_json(region_to_unqiue_keyword, "region_to_unqiue_keyword")


# %%
