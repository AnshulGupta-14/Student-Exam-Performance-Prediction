import os
import sys

import numpy as np
import pandas as pd 
import dill

from sklearn.metrics import r2_score
from sklearn.model_selection import GridSearchCV

from src.exception import CustomException

def save_object(file_path, obj):
    try:
        dir_path = os.path.dirname(file_path)

        os.makedirs(dir_path, exist_ok=True)

        with open(file_path, "wb") as file_obj:
            dill.dump(obj, file_obj)

    except Exception as e:
        raise CustomException(e, sys)
    
def select_best_model(X_train, y_train, X_test, y_test, models):
    try:
        report = []

        for name, model, params in models:

            grid = GridSearchCV(model, params, cv=3, n_jobs=-1)
            grid.fit(X_train, y_train)

            y_train_pred = grid.predict(X_train)
            y_test_pred = grid.predict(X_test)

            train_model_score = r2_score(y_train, y_train_pred)
            test_model_score = r2_score(y_test, y_test_pred)

            report.append({
                "model": model,
                "params": grid.best_params_,
                "score": test_model_score
            })

            report = sorted(report, key=lambda x: x['score'], reverse=True)
            best_model = report[0]['model']
            best_model_score = report[0]['score']
            best_model_params = report[0]['params']

        return best_model, best_model_score, best_model_params
    except Exception as e:
        raise CustomException(e, sys)
    
def load_object(file_path):
    try:
        with open(file_path, "rb") as file_obj:
            return dill.load(file_obj)
    except Exception as e:
        raise CustomException(e, sys)