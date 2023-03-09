import sys

from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB

import data_dealing

dir = sys.path[0].split('Code')[0]  # 项目根目录
casesPath = dir + 'CasesData/'  # 病人数据路径


def MyGauss(testSize, datas, datasLabel, refinedData):
    X_train, X_test, Y_train, Y_test = train_test_split(datas, datasLabel, test_size=testSize)
    #  标准化数据，保证每个维度的特征数据方差为1，均值为0，使得预测结果不会被某些维度过大的特征值而主导
    model = GaussianNB()
    model.fit(X_train, Y_train)
    #  计算模型准确度
    scores = model.score(X_test, Y_test) * 100
    #  作出预测
    predictResult = model.predict([refinedData])
    return scores, predictResult[0]


#  对病人提交的病例进行分析与判断
def predict(refinedData, datas, datasLable):
    #  GaussNB算法进行判断
    testSize = 0.2
    preResults = {}
    accTotal = {'1': 0, '0': 0}
    for i in range(0, 10):
        accuracy, predictResult = MyGauss(testSize, datas, datasLable, refinedData)
        if predictResult not in preResults.keys():
            preResults.update({'{}'.format(predictResult): 1})
        else:
            preResults['{}'.format(predictResult)] += 1
        accTotal[predictResult] += accuracy

    predictResult = sorted(preResults.items(), key=lambda item: item[1], reverse=True)

    accuracy = round(accTotal[predictResult[0][0]] / predictResult[0][1], 3)
    predictResult = predictResult[0][0]

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
    # print(str(accuracy) + '%')
    # print(predictResult)
    print("病人{}的概率是".format(disease[predictResult]) + str(accuracy) + '%')