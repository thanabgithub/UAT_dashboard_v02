from service.twitter_preload_service import *
import json

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger

scheduler = BlockingScheduler()


@scheduler.scheduled_job(IntervalTrigger(hours=6))
def execute_scheduled_preload_routine():
    print("get_woeid_trends")
    woeid_trends = get_woeid_trends()
    meta = prepare_meta_data()

    (
        region_to_rank_to_keyword,
        rank_to_keyword_agg,
        keyword_to_region_to_rank,
        keyword_to_rank_agg,
        region_to_unqiue_keyword,
    ) = init_preload_data(meta)
    print("process_rank_data")
    (
        region_to_rank_to_keyword,
        rank_to_keyword_agg,
        keyword_to_region_to_rank,
        keyword_to_rank_agg,
        region_to_unqiue_keyword,
    ) = process_rank_data(woeid_trends,
        region_to_rank_to_keyword,
        rank_to_keyword_agg,
        keyword_to_region_to_rank,
        keyword_to_rank_agg,
        region_to_unqiue_keyword,
    )
    print("add_img_url")
    keyword_to_rank_agg = add_img_url(keyword_to_rank_agg)
    print("save_file")
    save_file(
        region_to_rank_to_keyword,
        rank_to_keyword_agg,
        keyword_to_region_to_rank,
        keyword_to_rank_agg,
        region_to_unqiue_keyword,
    )
    print('success')
    
if __name__ == "__main__":
    print('start preload')
    execute_scheduled_preload_routine()
    scheduler.start()
