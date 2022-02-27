from service.twitter_preload_service import *
import json

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger

scheduler = BlockingScheduler()


@scheduler.scheduled_job(IntervalTrigger(hours=3))
def execute_scheduled_preload_routine():
    print("start execute_scheduled_preload_routine ")
    regional_df, national_df = process_data()
    regional_df, national_df = prepare_url(regional_df, national_df)
    prepare_meta_n_dump(regional_df, national_df)
    print('success')
    
if __name__ == "__main__":
    print('start main')
    execute_scheduled_preload_routine()
    scheduler.start()
