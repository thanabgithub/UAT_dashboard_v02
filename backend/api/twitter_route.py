
from service.twitter_service import get_tw_count_service
import pandas as pd
from flask import Blueprint, request
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

@twitter_route.route("/twitter/keywords/", methods=['GET'])
def get_tw_count():
    keyword = request.args.get("query")

    print(keyword)

    return get_tw_count_service(keyword)


@twitter_route.route("/twitter/keywords/<keyword>/statistics/count", methods=['GET'])
def get_tw_kw_stats_mirror(keyword):


    print(keyword)

    return get_tw_count_service(keyword)


# @twitter_route.route("/twitter/keywords/<keyword>/stats/count", methods=['GET'])
# def get_tw_count_mirror(keyword):


#     print(keyword)

#     return get_tw_count_service(keyword)
