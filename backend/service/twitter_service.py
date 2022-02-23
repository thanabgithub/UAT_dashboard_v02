# %%
from datetime import datetime
from dotenv import load_dotenv
import os
import requests
import requests_cache
import pandas as pd
import numpy as np
from service.analysis_toolbox import indicators

# %%

load_dotenv()
bearer_token = os.environ.get("BEARER_TOKEN")

print(bearer_token)

# %%

requests_cache.install_cache(
    'data/twitter_service_cache', backend='sqlite', expire_after=180)


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


def get_tw_count_service(keyword):

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
