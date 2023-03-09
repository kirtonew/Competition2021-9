from sklearn.model_selection import cross_val_score
from sklearn.neighbors import KNeighborsClassifier
from sklearn.utils import shuffle

import data_dealing


def trainModel(diseaseType, datas, datasLabel):
    #  训练模型
    if diseaseType == 'xzb':
        k = 4
    if diseaseType == 'gk':
        k = 7
    if diseaseType == 'tnb':
        k = 17
    if diseaseType == 'xxg':
        k = 30
    #  重新排列数据及其标签
    datas, datasLabel = shuffle(datas, datasLabel)
    model = KNeighborsClassifier(n_neighbors=k)

    #  计算模型准确率
    scores = cross_val_score(model, datas, datasLabel, cv=5)
    accuracy = round(scores.mean(), 3)

    #  训练模型
    model.fit(datas, datasLabel)

    #  存储模型数据
    data_dealing.saveModel(diseaseType, 'KNNModel', model)
    data_dealing.saveAccuracy(diseaseType, 'KNNModel', accuracy)

    return model, accuracy


def predict(diseaseType, refinedData, datas, datasLabel):
    #  获得模型及其准确率
    model = data_dealing.getModel(diseaseType, 'KNNModel')
    accuracy = data_dealing.getAccuracy(diseaseType, 'KNNModel')

    #  若没用训练好的模型就训练一个模型
    if model == 0:
        model, accuracy = trainModel(diseaseType, datas, datasLabel)

    #  作出预测
    predictResult = model.predict([refinedData])

    return accuracy, predictResult[0]


if __name__ == '__main__':
    disease = {'0': "正常", '1': "患病"}
    diseaseType = 'xzb'
    predictResult = 1
    accuracy = 0

    #  获取需要判断的病例数据
    caseData = data_dealing.getCaseData(diseaseType)
    #  提取caseData中的关键信息和获取模型路径
    refinedData = data_dealing.refineCaseData(caseData, diseaseType)
    #  获得模型数据
    readModelDatasStatus, datas, datasLabel = data_dealing.readModelDatas(diseaseType)

    if readModelDatasStatus == 1:
        accuracy, predictResult = predict(diseaseType, refinedData, datas, datasLabel)

    #  输出结果
    print("病人{}的概率是".format(disease[predictResult]) + str(accuracy * 100) + '%')
