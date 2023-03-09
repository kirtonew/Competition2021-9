from fastapi import FastAPI
from sklearn.model_selection import train_test_split

import adaBoosting_predict
import data_dealing
import grandientBoosting_predict
import knn_predict
import randomForest_predict
import svc_predict
import uvicorn

app = FastAPI()


def ensemble_predict(diseaseType, refinedData, datas, datasLabel):
    accuracyTotal = {'1': 0, '0': 0}

    tempAccuracy, tempResult = adaBoosting_predict.predict(diseaseType, refinedData, datas, datasLabel)
    accuracyTotal[tempResult] += tempAccuracy
    print("adaBoostingResult:{}, accuracy:{}".format(tempResult, tempAccuracy))
    tempAccuracy, tempResult = grandientBoosting_predict.predict(diseaseType, refinedData, datas, datasLabel)
    accuracyTotal[tempResult] += tempAccuracy
    print("GradientBoostingResult:{}, accuracy:{}".format(tempResult, tempAccuracy))
    tempAccuracy, tempResult = knn_predict.predict(diseaseType, refinedData, datas, datasLabel)
    accuracyTotal[tempResult] += tempAccuracy
    print("KNNResult:{}, accuracy:{}".format(tempResult, tempAccuracy))
    tempAccuracy, tempResult = randomForest_predict.predict(diseaseType, refinedData, datas, datasLabel)
    accuracyTotal[tempResult] += tempAccuracy
    print("randomForestResult:{}, accuracy:{}".format(tempResult, tempAccuracy))
    tempAccuracy, tempResult = svc_predict.predict(diseaseType, refinedData, datas, datasLabel)
    accuracyTotal[tempResult] += tempAccuracy
    print("SVMResult:{}, accuracy:{}".format(tempResult, tempAccuracy))

    #  对五个分类器的结果进行排序
    accuracyTotal = sorted(accuracyTotal.items(), key=lambda item: item[1], reverse=True)

    #  得到票数最多的结果
    predictResult = accuracyTotal[0][0]

    return predictResult


def predict(diseaseType):
    disease = {'0': "正常", '1': "患病"}
    rightCount = 0

    #  获取需要判断的病例数据
    caseData = data_dealing.getCaseData(diseaseType)

    #  提取caseData中的关键信息
    refinedData = data_dealing.refineCaseData(caseData, diseaseType)

    #  获得模型数据
    readModelDatasStatus, datas, datasLabel = data_dealing.readModelDatas(diseaseType)

    #  将模型数据分为训练集和验证集
    X_train, X_test, Y_train, Y_test = train_test_split(datas, datasLabel, test_size=0.2, random_state=200)

    #  作出预测
    if readModelDatasStatus == 1:
        predictResult = ensemble_predict(diseaseType, refinedData, X_train, Y_train)

    #  计算模型准确度
    print('------------------------')
    accuracy = data_dealing.getAccuracy(diseaseType, 'EnsembleModel')
    if accuracy == 0:
        #  计算集成学习的准确率
        for i in range(0, len(X_test)):
            tempResult = ensemble_predict(diseaseType, X_test[i], datas, datasLabel)
            if tempResult == Y_test[i]:
                rightCount += 1
            print("测试总数:{}  测试正确数量:{}  测试结果:{}  真实结果:{}".format(len(X_test), rightCount, tempResult, Y_test[i]))
        accuracy = round(rightCount * 100.0 / len(X_test), 3)
        data_dealing.saveAccuracy(diseaseType, 'EnsembleModel', accuracy)
    #  输出结果
    print("病人{}的概率是".format(disease[predictResult]) + str(accuracy) + '%')

    result = "病人{}的概率是".format(disease[predictResult]) + str(accuracy) + '%'
    return result


@app.get("/predict/{diseaseType}")
async def serve(diseaseType: str):
    return predict(diseaseType)


if __name__ == '__main__':
    predict('gk')
    # uvicorn.run(app, host="127.0.0.1", port=80)
