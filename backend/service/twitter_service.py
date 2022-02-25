# %%
from datetime import datetime
from dotenv import load_dotenv
import os
import requests
import requests_cache
import pandas as pd
import numpy as np
from service.analysis_toolbox import indicators
import json
# %%

load_dotenv()
bearer_token = os.environ.get("BEARER_TOKEN")

print(bearer_token)

# %%
expire_after_param = 15*60; # 15 minutes
requests_cache.install_cache(
    'data/twitter_service_cache', backend='sqlite', expire_after=expire_after_param)


def get_count_keyword_7_days(keyword: str):
    """
    ================
    TWITTER: GET /2/tweets/counts/recent
    ================
    Returns count of Tweets from the last seven days that match a query.


    # https://developer.twitter.com/en/docs/twitter-api/tweets/counts/api-reference/get-tweets-counts-recent

    """

    def bearer_oauth(r):
        r.headers["Authorization"] = f"Bearer {bearer_token}"
        return r

    def connect_to_endpoint(url, params):
        response = requests.get(url, auth=bearer_oauth, params=params)
        print(response.status_code)
        if response.status_code != 200:
            raise Exception(response.status_code, response.text)
        return response.json()

    endpoint_url = "https://api.twitter.com/2/tweets/counts/recent"
    query_params = {"query": keyword}
    return connect_to_endpoint(endpoint_url, query_params)


def get_tw_kw_count_ts_service(keyword):

    time_now_dt = datetime.now()
    time_now = time_now_dt.strftime("%Y-%m-%d %H:%M:%S")
    time_now_timestamp = datetime.timestamp(time_now_dt)
    request_id = hex(int(time_now_timestamp*1000000))
    try:
        json_response = get_count_keyword_7_days(keyword)

        df = pd.DataFrame(json_response["data"])
        df.drop("start", axis=1, inplace=True)

        col_name = ["datetime", "sample_count"]
        df.columns = col_name

        df_ = df.set_index("datetime", drop=True)
        df_sm_ = indicators.MA(df_, 3).round(0).dropna()
        df_sm = df_sm_.reset_index()
        df_chg_1 = indicators.ROC(df_.shift(), 24).reset_index().dropna()
        df_chg_3 = indicators.ROC(df_.shift(), 24*3).reset_index().dropna()
        print(df_sm_)
        df_chg_7 = (df_sm_.T.values[0][-2]/df_sm_.T.values[0][0]-1)*100
        df_chg_7 = round(float(np.nan_to_num(df_chg_7, 0.0)), 2)
        print(df_sm_.T.values[0][0])
        print(df_sm_.T.values[0][-2])
        print(type(df_chg_7))
        res = {
            "status": "success",
            # I intentionally use list because visualization tool in frontend requires data in this format
            "rawCount": df.values.tolist(),
            "smoothCount": df_sm.values.tolist(),
            "count1DatChg": round(df_chg_1.values.tolist()[-1][-1], 1),
            "count3DayChg": round(df_chg_3.values.tolist()[-1][-1], 1),
            "count7DayChg": df_chg_7,
            "id": request_id,
                "meta": {
                    "keyword": keyword,
                    "col_name": col_name,
                    "description": "count tweets from Twitter sample pool 1 hour timeframe over 7 days",
                    "notes": {
                        "extract_datetime": {"timezone": "TH", "value": time_now},
                        "data_datetime": {"timezone": "UTC"}
                    }
            }
        }

        return res
    except:
        print("invalid request")
        res = {
            "status": "fail",
            "rawCount": [],  # I intentionally use list because visualization tool in frontend requires data in this format
            "smoothCount": [],
            "count1DatChg": [],
            "count3DayChg": [],
            "count7DayChg": [],
            "id": request_id,
            "meta": {
                "keyword": "",
                "col_name": [],
                "description": "count tweets from Twitter sample pool 1 hour timeframe over 7 days",
                "notes": {
                    "extract_datetime": {"timezone": "TH", "value": time_now},
                    "data_datetime": {"timezone": "UTC"}
                }
            }
        }
        return res

# %%

######################################
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

def get_woeid_trends():
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


def clean_woeid_trends_test(woeid_trends):
    """
    ================
    convert from noSQL to dataframe and prepare for further data cleansing
    ================
    Returns dataframe, Japan trendings keywords (list), as_of as timestep
    """
    wip_woeid_trends_df = pd.DataFrame()
    national_trends = set()
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
            national_trends.add(keyword)

        validate = 50 - len(row)
        if validate > 0:
            empty_lst = [""] * validate
            row.extend(empty_lst)
        elif validate < 0:
            row = row[:50]
        wip_woeid_trends_df[area] = row
    return wip_woeid_trends_df, national_trends, as_of

def get_tw_region_kw_lst_service():
    try:
        print('in twitter service: get_tw_region_kw_lst_service')
        woeid_trends = get_woeid_trends()

        wip_woeid_trends_df, keywordList, as_of = clean_woeid_trends_test(woeid_trends)    

        time_now_dt = datetime.now()
        time_now = time_now_dt.strftime("%Y-%m-%d %H:%M:%S")
        time_now_timestamp = datetime.timestamp(time_now_dt)
        request_id = hex(int(time_now_timestamp*1000000))
        available_regions = ['北九州', '埼玉', '千葉', '福岡', '浜松', '広島', '川崎', '神戸', '熊本', '名古屋', '新潟', '相模原', '札幌', '仙台', '高松', '東京', '横浜', '沖縄', '大阪', '京都', '岡山', '日本']
        res = {
        "status": "success",
    
        "keywordList": list(keywordList),

        "id": request_id,
        "timestamp": time_now_timestamp*1000, # adjust it to be the same with javascript
            "meta": {
                "description": "top 50 of all available regions",
                "notes": {
                    "available regions": available_regions
                }
        }
        }

        return res
    except:

        print('response preload data')

        with open("./data/preloadRes.json") as jsonFile:
            res = json.load(jsonFile)
            jsonFile.close()
        return res


def get_tw_region_preload_kw_lst_service():
    
    print('response preload data')

    with open("./data/preloadRes.json") as jsonFile:
        res = json.load(jsonFile)
        jsonFile.close()
    return res

def set_tw_region_preload_kw_lst_service():

    print('routine dump preload data')
    print('in twitter service: get_tw_region_preload_kw_lst')
    woeid_trends = get_woeid_trends()

    wip_woeid_trends_df, keywordList, as_of = clean_woeid_trends_test(woeid_trends)    

    time_now_dt = datetime.now()
    time_now = time_now_dt.strftime("%Y-%m-%d %H:%M:%S")
    time_now_timestamp = datetime.timestamp(time_now_dt)
    request_id = hex(int(time_now_timestamp*1000000))
    available_regions = ['北九州', '埼玉', '千葉', '福岡', '浜松', '広島', '川崎', '神戸', '熊本', '名古屋', '新潟', '相模原', '札幌', '仙台', '高松', '東京', '横浜', '沖縄', '大阪', '京都', '岡山', '日本']
    preload_res = {
    "status": "preload",

    "keywordList": list(keywordList),

    "id": request_id,
    "timestamp": time_now_timestamp*1000, # adjust it to be the same with javascript
        "meta": {
            "description": "top 50 of all available regions",
            "notes": {
                "available regions": available_regions
            }
    }
    }
    
    out_file = open("data/preloadRes.json", "w")
    json.dump(preload_res, out_file)
    out_file.close()
# %%
# import json

# dummy_res = {
#     "id": "0x5d8dc93e53a03",
#     "keywordList": [
#         "アニポケ",
#         "おつまーれ",
#         "MINI Tunes",
#         "HiMERU",
#         "BLゲーム",
#         "#エルデンリング",
#         "NUカーニバル",
#         "#フロイニ",
#         "甘噛み/葛葉",
#         "あんスタ",
#         "中10問正解",
#         "かしいかえん",
#         "正気度P",
#         "アドニス",
#         "連続ドキュメンタリー",
#         "Wordle 252",
#         "百合検定",
#         "女性たち",
#         "小宮さん",
#         "正気度喪失",
#         "第36回",
#         "生粋の大阪人",
#         "スローループ",
#         "From INI",
#         "mini tunes",
#         "やかじー",
#         "量産型大阪人",
#         "#ノムlive",
#         "らんねーちゃん",
#         "#bananamoon",
#         "#金スマ",
#         "Hulu",
#         "プーチン政権",
#         "#ねほりんぱほりん",
#         "#激むず関西弁クイズ",
#         "貨物船被弾",
#         "mahjong handle 24",
#         "田原総一朗",
#         "結婚発表",
#         "国連UNHCR協会",
#         "どん兵衛",
#         "#エセ大阪人じゃなきゃ分かるはず",
#         "ぱしゃっつ",
#         "優勝予想",
#         "#三四郎ANN0",
#         "こたつトーク",
#         "フー・ファイターズ",
#         "ウクライナ沖",
#         "アノニマス",
#         "中国総領事",
#         "マルギット",
#         "根性育成",
#         "スペオダ",
#         "ツリーガード",
#         "WHIP THAT",
#         "#サガFES",
#         "U.F.O",
#         "プッチ神父",
#         "#となりのスターさん",
#         "cassette tape",
#         "Anonymous",
#         "船橋総選挙",
#         "青葉つむぎ",
#         "中野くん",
#         "#NoWar",
#         "#ドールズフロントライン",
#         "LEO様",
#         "和泉兄弟",
#         "缶バッジ",
#         "級の大阪人",
#         "Mahjong Handle 24",
#         "最初のボス",
#         "エルデンリング",
#         "田原さん",
#         "ミハイル編",
#         "轟焦凍の旗あげ特訓ゲーム",
#         "日本企業運航の可能性",
#         "ユルッと6人",
#         "Cassette Tape",
#         "交換優先",
#         "#Hi_JO1",
#         "kyouさん",
#         "Namura Queen",
#         "相田さん"
#     ],
#     "meta": {
#         "description": "top 50 of all available regions",
#         "notes": {
#             "available regions": [
#                 "北九州",
#                 "埼玉",
#                 "千葉",
#                 "福岡",
#                 "浜松",
#                 "広島",
#                 "川崎",
#                 "神戸",
#                 "熊本",
#                 "名古屋",
#                 "新潟",
#                 "相模原",
#                 "札幌",
#                 "仙台",
#                 "高松",
#                 "東京",
#                 "横浜",
#                 "沖縄",
#                 "大阪",
#                 "京都",
#                 "岡山",
#                 "日本"
#             ]
#         }
#     },
#     "status": "dummy",
#     "timestamp": 1645816769.231363
# }
# out_file = open("data/dummyRes.json", "w")
# json.dump(dummy_res, out_file)
# out_file.close()