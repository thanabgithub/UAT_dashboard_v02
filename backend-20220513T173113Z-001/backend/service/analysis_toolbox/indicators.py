

import pandas as pd
import talib as ta
import numpy as np
from datetime import datetime
import timeit
import matplotlib.pyplot as plt 


# %% from quantnet

def clean_target(target_: pd.DataFrame):

    clean_target_ = target_.copy()
    clean_target_.ffill(inplace = True)
    clean_target_.bfill(inplace = True)
    clean_target_.replace(np.nan, 0, inplace = True)
    clean_target_.replace(np.inf, 0, inplace = True)   
    return clean_target_

def MA(target_: pd.DataFrame, period_: int)->pd.DataFrame:
    period_ = int(period_)
    data_exist = (target_.isnull()==False).astype(np.float64).replace(0, np.nan)
    data_exist = data_exist*(data_exist.shift(period_))
    target_ = clean_target(target_)
    SMA_ = target_.apply(lambda col: ta.SMA(col.astype(np.float64), period_))
    return SMA_

def ROC(target_: pd.DataFrame, period_: int)-> pd.DataFrame:
    period_ = int(period_)
    data_exist = (target_.isnull()==False).astype(np.float64).replace(0, np.nan)
    data_exist = data_exist*(data_exist.shift(period_))
    target_ = clean_target(target_)       
    ROC_ = target_.apply(lambda col: ta.ROC(col, period_)).astype(np.float64)
    ROC_.replace(np.inf, 0, inplace = True)
    ROC_ = ROC_*data_exist    
    return ROC_