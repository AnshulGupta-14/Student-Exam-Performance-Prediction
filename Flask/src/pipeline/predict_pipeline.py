import sys
import os

import pandas as pd

from src.exception import CustomException
from src.logger import logging
from src.utils import load_object

from huggingface_hub import hf_hub_download

from dotenv import load_dotenv
load_dotenv()

HF_REPO_ID = os.getenv("HF_MODEL_REPO")
HF_MODEL_FILENAME = os.getenv("HF_MODEL_FILENAME")
HF_PREPROCESSOR_FILENAME = os.getenv("HF_PREPROCESSOR_FILENAME")
HF_REVISION = os.getenv("HF_MODEL_REVISION")
HF_TOKEN = os.getenv("HF_TOKEN")

class PredictPipeline:
    def predict(self,features):
        try:
            preprocessor_path = hf_hub_download(
                repo_id=HF_REPO_ID,
                filename=HF_PREPROCESSOR_FILENAME,
                revision=HF_REVISION,
                token=HF_TOKEN,
            )
            model_path = hf_hub_download(
                repo_id=HF_REPO_ID,
                filename=HF_MODEL_FILENAME,
                revision=HF_REVISION,
                token=HF_TOKEN,
            )

            preprocessor = load_object(file_path=preprocessor_path)
            model = load_object(file_path=model_path)

            data_scaled = preprocessor.transform(features)
            pred = model.predict(data_scaled)
            return pred
        except Exception as e:
            raise CustomException(e,sys)

class CustomData:
    def __init__(  self,gender: str,race_ethnicity: str,parental_level_of_education,lunch: str,test_preparation_course: str,reading_score: int,writing_score: int):
        self.gender = gender
        self.race_ethnicity = race_ethnicity
        self.parental_level_of_education = parental_level_of_education
        self.lunch = lunch
        self.test_preparation_course = test_preparation_course
        self.reading_score = reading_score
        self.writing_score = writing_score

    def get_data_as_data_frame(self):
        try:
            custom_data_input_dict = self.get_data_as_dict()
            return pd.DataFrame([custom_data_input_dict])
        except Exception as e:
            raise CustomException(e,sys) 
        
    def get_data_as_dict(self):
        try:
            return self.__dict__
        except Exception as e:
            raise CustomException(e,sys)