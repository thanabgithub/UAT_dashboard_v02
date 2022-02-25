
from service.twitter_service import *
import pandas as pd
from flask import Blueprint
twitter_route = Blueprint('twitter_route', __name__)


@twitter_route.route("/")
def index():
    return "稼働中"

# %%
# GET /tw-count?query=hi HTTP
"""
    further develop should follow this guidelines
    https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design
"""




@twitter_route.route("/twitter/keywords/<keyword>/statistics/count", methods=['GET'])
def get_tw_kw_count_ts(keyword):


    print('in route get_tw_region_kw_lst')

    return get_tw_kw_count_ts_service(keyword)


@twitter_route.route("/twitter/regions/keyword-list", methods=['GET'])
def get_tw_region_kw_lst():


    print('in route: get_tw_region_kw_lst')

    return get_tw_region_kw_lst_service()

@twitter_route.route("/twitter/regions/preload-keyword-list", methods=['GET'])
def get_tw_region_preload_kw_lst():


    print('in route: get_tw_region_kw_lst')

    return get_tw_region_preload_kw_lst_service()

