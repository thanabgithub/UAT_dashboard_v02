# %%
from datetime import datetime

import os
import requests
import requests_cache
import pandas as pd
import numpy as np
from service.analysis_toolbox import indicators
from service.twitter_preload_service import prepare_meta_data
import json
# %%
from config.config import Config
bearer_token = Config.BEARER_TOKEN

print(bearer_token)

# %%
expire_after_param = 5*60; # 5 minutes
requests_cache.install_cache(
    'data/twitter_service_cache', backend='sqlite', expire_after=expire_after_param)

def bearer_oauth(r):
    print(bearer_token)
    r.headers["Authorization"] = f"Bearer {bearer_token}"
    return r



def get_count_keyword_7_days(keyword: str):
    """
    ================
    TWITTER: GET /2/tweets/counts/recent
    ================
    Returns count of Tweets from the last seven days that match a query.


    # https://developer.twitter.com/en/docs/twitter-api/tweets/counts/api-reference/get-tweets-counts-recent

    """


    def connect_to_endpoint(url, params):
        response = requests.get(url, auth=bearer_oauth, params=params)
        print(response.status_code)
        if response.status_code != 200:
            raise Exception(response.status_code, response.text)
        return response.json()

    endpoint_url = "https://api.twitter.com/2/tweets/counts/recent"
    query_params = {"query": keyword}
    return connect_to_endpoint(endpoint_url, query_params)


def get_twitter_keyword_timeseries_service(keyword):

    time_now_dt = datetime.now()
    requestDatetime = time_now_dt.strftime("%Y-%m-%d %H:%M:%S")
    requestTimestampMillisec = datetime.timestamp(time_now_dt) * 1000
    requestId = hex(int(requestTimestampMillisec * 1000))

    meta = {
        "requestDatetime": requestDatetime,
        "requestTimestampMillisec": requestTimestampMillisec,
        "requestId": requestId,
        "comment": 'cache/real-time'
    }
    
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
            "data": {
                keyword: { 
                    "rawCount": df.values.tolist(),
                    "smoothCount": df_sm.values.tolist(),
                    "count1DatChg": round(df_chg_1.values.tolist()[-1][-1], 1),
                    "count3DayChg": round(df_chg_3.values.tolist()[-1][-1], 1),
                    "count7DayChg": df_chg_7,}
                },
            "status": "success",
            "meta": meta
        }

        return res
    except:
        print("invalid request")
        res = {
            "data": {
                keyword: { 
                    "rawCount": [],
                    "smoothCount": [],
                    "count1DatChg": [],
                    "count3DayChg": [],
                    "count7DayChg": [],}
                },
            "status": "fail",
            "meta": meta
        }

        return res

# %%

######################################

def get_twitter_national_ranks_keywords_service():
    time_now_dt = datetime.now()
    requestDatetime = time_now_dt.strftime("%Y-%m-%d %H:%M:%S")
    requestTimestampMillisec = datetime.timestamp(time_now_dt) * 1000
    requestId = hex(int(requestTimestampMillisec * 1000))

    meta = {
        "requestDatetime": requestDatetime,
        "requestTimestampMillisec": requestTimestampMillisec,
        "requestId": requestId,
        "comment": 'cache/real-time'
    }
    
    with open("./data/preloadJSON/national_df_json_data.json") as jsonFile:
        res = json.load(jsonFile)
        jsonFile.close()
    res['meta'] = meta
    return res

def get_twitter_regional_ranks_keywords_service():
    print('in get_twitter_regional_ranks_keywords_service')
    time_now_dt = datetime.now()
    requestDatetime = time_now_dt.strftime("%Y-%m-%d %H:%M:%S")
    requestTimestampMillisec = datetime.timestamp(time_now_dt) * 1000
    requestId = hex(int(requestTimestampMillisec * 1000))

    meta = {
        "requestDatetime": requestDatetime,
        "requestTimestampMillisec": requestTimestampMillisec,
        "requestId": requestId,
        "comment": 'cache/real-time'
    }
    
    with open("./data/preloadJSON/regional_df_json_data.json") as jsonFile:
        res = json.load(jsonFile)
        jsonFile.close()
    res['meta'] = meta
    return res

# def get_twitter_all_keywords_all_national_ranks_service():
#     time_now_dt = datetime.now()
#     requestDatetime = time_now_dt.strftime("%Y-%m-%d %H:%M:%S")
#     requestTimestampMillisec = datetime.timestamp(time_now_dt) * 1000
#     requestId = hex(int(requestTimestampMillisec * 1000))

#     meta = {
#         "requestDatetime": requestDatetime,
#         "requestTimestampMillisec": requestTimestampMillisec,
#         "requestId": requestId,
#         "comment": 'cache/real-time'
#     }
    
#     with open("./data/preloadJSON/keyword_to_rank_agg.json") as jsonFile:
#         res = json.load(jsonFile)
#         jsonFile.close()
#     res['meta'] = meta
#     return res

    