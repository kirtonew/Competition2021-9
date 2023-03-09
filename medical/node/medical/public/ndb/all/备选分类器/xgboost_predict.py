import numpy as np
from sklearn.ensemble import AdaBoostClassifier
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

import data_dealing


#  对病人提交的病例进行分析与判断
def xgBoost(testSize, datas, datasLabel, refinedData):
    X_train, X_test, Y_train, Y_test = train_test_split(datas, datasLabel, test_size=testSize)

    #  训练模型
    model = XGBClassifier()
    X_train = np.array(X_train)
    Y_train = np.array(Y_train)
    X_test = np.array(X_test)
    Y_test = np.array(Y_test)
    refinedData = np.array([refinedData])

    model.fit(X_train, Y_train)

    #  计算模型准确度
    accuracy = model.score(X_test, Y_test) * 100

    #  作出预测
    predictResult = model.predict(refinedData)

    return accuracy, predictResult[0]


def predict(refinedData, datas, datasLabel):
    #  adaBoosting算法进行判断
    testSize = 0.2
    accuracy, predictResult = xgBoost(testSize, datas, datasLabel, refinedData)
    accuracy = round(accuracy, 3)

    return accuracy, predictResult


if __name__ == '__main__':
    disease = {'0': "正常", '1': "患病"}
    diseaseType = 'xzb'

    #  获取需要判断的病例数据
    caseData = data_dealing.getCaseData(diseaseType)
    #  提取caseData中的关键信息和获取模型路径
    refinedData, modelPath = data_dealing.refineCaseData(caseData, diseaseType)
    #  获得模型数据
    readModelDatasStatus, datasLabel, datas = data_dealing.readModelDatas(modelPath)

    if readModelDatasStatus == 1:
        accuracy, predictResult = predict(refinedData, datas, datasLabel)

    #  输出结果
    print("病人{}的概率是".format(disease[predictResult]) + str(accuracy) + '%')
