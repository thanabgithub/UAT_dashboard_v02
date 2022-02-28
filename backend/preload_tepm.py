
# %%

from service.twitter_preload_service import *
import json

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger

scheduler = BlockingScheduler()


print("start execute_scheduled_preload_routine ")
regional_df, national_df = process_data()
# %%
regional_df, national_df = prepare_url(regional_df, national_df)
prepare_meta_n_dump(regional_df, national_df)
print('success')
    
# %%

# %%
def prepare_meta_n_dump(regional_df, national_df):
    """
        prepare meta data and dump
    """


    national_df_json_data = {'data': {}}

    for col in national_df.columns:
        national_df_json_data['data'][col] = national_df[col].values.tolist()

    regional_df_json_data = {'data': {}}
    for col in regional_df.columns:
        regional_df_json_data['data'][col] = regional_df[col].values.tolist()
        
    meta = prepare_meta_data()

    regional_df_json_data['data']['preloadMeta'] = meta
    national_df_json_data['data']['preloadMeta'] = meta

    def save_dict_as_json(data: dict, name: str, path="data/preloadJSON/"):

        out_file = open(path + name + ".json", "wt")
        out_file.seek(0)
        res = json.dump(data, out_file)
        out_file.close()
        return res

    save_dict_as_json(regional_df_json_data, "regional_df_json_data")
    save_dict_as_json(national_df_json_data, "national_df_json_data")


# %%
