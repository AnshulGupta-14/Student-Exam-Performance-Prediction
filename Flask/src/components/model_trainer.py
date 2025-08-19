import os
import sys
from dataclasses import dataclass

from catboost import CatBoostRegressor
from sklearn.ensemble import AdaBoostRegressor, RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.neighbors import KNeighborsRegressor
from sklearn.tree import DecisionTreeRegressor
from xgboost import XGBRegressor
from sklearn.svm import SVR
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

from src.exception import CustomException
from src.logger import logging
from src.utils import save_object, evaluate_model

@dataclass
class ModelTrainerConfig:
    trained_model_file_path = os.path.join('artifacts', 'model.pkl')

class ModelTrainer:
    def __init__(self):
        self.model_trainer_config = ModelTrainerConfig()

    def initiate_model_trainer(self, train_array, test_array):
        try:
            logging.info('Spliting training and test input data')
            X_train, y_train, X_test, y_test = (
                train_array[:,:-1],
                train_array[:,-1],
                test_array[:,:-1],
                test_array[:,-1],
            )

            models = [
                ('Linear Regression', LinearRegression(), {}),
                ('Ridge', Ridge(), {}),
                ('Lasso', Lasso(), {}),
                ('KNN', KNeighborsRegressor(), {}),
                ('Decision Tree', DecisionTreeRegressor(),  {
                    'criterion':['squared_error', 'friedman_mse', 'absolute_error', 'poisson'],
                    'splitter':['best','random'],
                    'max_features':['sqrt','log2'],
                }),
                ('Random Forest', RandomForestRegressor(), {
                    'criterion':['squared_error', 'friedman_mse', 'absolute_error', 'poisson'],
                 
                    'max_features':['sqrt','log2',None],
                    'n_estimators': [8,16,32,64,128,256]
                }),
                ('AdaBoost', AdaBoostRegressor(), {
                    'learning_rate':[.1,.01,0.5,.001],
                    'loss':['linear','square','exponential'],
                    'n_estimators': [8,16,32,64,128,256]
                }),
                ('SVM', SVR(), {}),
                ('CatBoost', CatBoostRegressor(verbose=0), {
                    'depth': [6,8,10],
                    'learning_rate': [0.01, 0.05, 0.1],
                    'iterations': [30, 50, 100]
                }),
                ('XGBoost', XGBRegressor(), {
                    'learning_rate':[.1,.01,.05,.001],
                    'n_estimators': [8,16,32,64,128,256]
                }),
            ]

            model_report=evaluate_model(X_train=X_train, y_train=y_train, X_test=X_test, y_test=y_test, models = models)

            print(model_report)
            best_model_score = max(sorted(model_report.values()))
            best_model_name = list(model_report.keys())[list(model_report.values()).index(best_model_score)]
            best_model = None
            for name, model, params in models:
                if name == best_model_name:
                    best_model = model
                    break

            if best_model_score < 0.6:
                raise CustomException("No best model found")
            
            logging.info("Best model found for both train and test data")

            save_object(
                file_path=self.model_trainer_config.trained_model_file_path,
                obj=best_model
            )

            predicted = best_model.predict(X_test)
            accuracy = r2_score(y_test, predicted)
            return accuracy

        except Exception as e:
            raise CustomException(e, sys)