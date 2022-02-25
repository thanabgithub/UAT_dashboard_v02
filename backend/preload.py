from service.twitter_service import *
import json

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger

scheduler = BlockingScheduler()


@scheduler.scheduled_job(IntervalTrigger(hours=1))
def execute_scheduled_preload_routine():
    set_tw_region_preload_kw_lst_service()
    
if __name__ == "__main__":
    scheduler.start()
