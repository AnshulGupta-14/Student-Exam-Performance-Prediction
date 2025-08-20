from src.components.data_ingestion import DataIngestion
from src.components.data_transformation import DataTransformation
from src.components.model_trainer import ModelTrainer
from src.logger import logging

class TrainPipeline:
    def start_training(self):
        logging.info("Starting training pipeline")
        
        # Step 1: Data Ingestion
        ingestion = DataIngestion()
        train_path, test_path = ingestion.initiate_data_ingestion()
        
        # Step 2: Data Transformation
        transformation = DataTransformation()
        train_arr, test_arr, _ = transformation.initiate_data_transformation(train_path, test_path)
        
        # Step 3: Model Training
        trainer = ModelTrainer()
        print(trainer.initiate_model_trainer(train_arr, test_arr))
        
        logging.info("Training pipeline completed")

if __name__ == "__main__":
    pipeline = TrainPipeline()
    pipeline.start_training()
