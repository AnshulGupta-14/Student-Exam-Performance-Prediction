import pickle
import numpy as np
import pandas as pd

from src.pipeline.predict_pipeline import CustomData, PredictPipeline

from flask import Flask, request, render_template, jsonify
from flask_cors import CORS

from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['GET', 'POST'])
def predict_datapoint():
    if request.method == 'POST':
        form_data = request.get_json()
        data = CustomData(
            gender=form_data.get('gender'),
            race_ethnicity=form_data.get('ethnicity'),
            parental_level_of_education=form_data.get('parental_level_of_education'),
            lunch=form_data.get('lunch'),
            test_preparation_course=form_data.get('test_preparation_course'),
            reading_score=float(form_data.get('reading_score')),
            writing_score=float(form_data.get('writing_score')),
        )
        pred_df = data.get_data_as_data_frame()
        predict_pipeline = PredictPipeline()
        result = predict_pipeline.predict(pred_df)
        return jsonify(prediction= 0 if result[0] < 0 else result[0])
    else:
        return jsonify({'message': 'Please submit a POST request with prediction data'})
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')