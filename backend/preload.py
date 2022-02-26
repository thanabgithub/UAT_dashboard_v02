from service.twitter_preload_service import *
import json

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger

scheduler = BlockingScheduler()


@scheduler.scheduled_job(IntervalTrigger(hours=6))
def execute_scheduled_preload_routine():
    woeid_trends = get_woeid_trends()
    meta = prepare_meta_data()

    (
        region_to_rank_to_keyword,
        rank_to_keyword_agg,
        keyword_to_region_to_rank,
        keyword_to_rank_agg,
        region_to_unqiue_keyword,
    ) = init_preload_data(meta)
    #
    (
        region_to_rank_to_keyword,
        rank_to_keyword_agg,
        keyword_to_region_to_rank,
        keyword_to_rank_agg,
        region_to_unqiue_keyword,
    ) = process_rank_data(
        region_to_rank_to_keyword,
        rank_to_keyword_agg,
        keyword_to_region_to_rank,
        keyword_to_rank_agg,
        region_to_unqiue_keyword,
    )

    keyword_to_rank_agg = add_img_url(keyword_to_rank_agg)

    save_file(
        region_to_rank_to_keyword,
        rank_to_keyword_agg,
        keyword_to_region_to_rank,
        keyword_to_rank_agg,
        region_to_unqiue_keyword,
    )

    
if __name__ == "__main__":
    scheduler.start()
