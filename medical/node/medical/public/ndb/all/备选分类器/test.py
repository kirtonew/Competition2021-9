import adaBoosting_predict
import kmeans_predict
import knn_predict
import gauss_predict
import randomForest_predict
import svc_predict

if __name__ == '__main__':
    disease = 'xxg'
    adaBoosting_predict.predict(disease)
    kmeans_predict.predict(disease)
    knn_predict.predict(disease)
    gauss_predict.predict(disease)
    randomForest_predict.predict(disease)
    svc_predict.predict(disease)
