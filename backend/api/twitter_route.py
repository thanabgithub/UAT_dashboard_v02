
from service.twitter_client_service import *
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




@twitter_route.route("/twitter/keywords/<keyword>/time-series", methods=['GET'])
def get_twitter_keyword_timeseries(keyword):


    print('in route: /twitter/keywords/<keyword>/time-series')

    return get_twitter_keyword_timeseries_service(keyword)


@twitter_route.route("/twitter/national-ranks/keywords", methods=['GET'])
def get_twitter_national_rank_data():
    print('in route: /twitter/national-ranks/keywords')
    return get_twitter_national_ranks_keywords_service()

@twitter_route.route("/twitter/regional-ranks/keywords", methods=['GET'])
def get_twitter_regional_rank_data():
    print('in route: /twitter/regional-ranks/keywords')
    return get_twitter_regional_ranks_keywords_service()

# @twitter_route.route("/twitter/keywords/all/regions/all/ranks/all", methods=['GET'])
# def get_twitter_all_keywords_all_regions_all_ranks():
#     print('in route: /twitter/keywords/all/regions/all/ranks/all')
#     return get_twitter_all_keywords_all_regions_all_ranks_service()

# @twitter_route.route("/twitter/national-ranks/all/keywords/all", methods=['GET'])
# def get_twitter_all_national_ranks_all_keywords():
#     print('in route: /twitter/national-ranks/all/keywords/all')
#     return get_twitter_all_national_ranks_all_keywords_service()


# @twitter_route.route("/twitter/regions/all/ranks/all/keywords/all", methods=['GET'])
# def get_twitter_all_regions_all_ranks_all_keywords():
#     print('in route: /twitter/regions/all/ranks/all/keywords/all')
#     return get_twitter_all_regions_all_ranks_all_keywords_service()


# @twitter_route.route("/twitter/regions/all/unique-keywords/all", methods=['GET'])
# def get_twitter_all_regions_all_ranks_all_keywords():
#     print('in route: /twitter/regions/all/unique-keywords/all')
#     return get_twitter_all_regions_all_uniquekeywords_service()

