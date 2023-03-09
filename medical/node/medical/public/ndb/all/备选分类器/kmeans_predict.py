import random
import sys

import numpy as np
import data_dealing

dir = sys.path[0].split('Code')[0]  # 项目根目录
casesPath = dir + 'CasesData/'  # 病人数据路径


def Kmeans(testRate, datas, clusters, datasLabel, refinedData):
    #  将数据分为训练组和测试组
    flag, trainData, testData = dataSetSplit(testRate, datas)
    if flag != 1:
        return 0

    #  随机取k个作为中心点
    k_index = random.sample(trainData, clusters)
    tmp_labels = []  # 统计保存蔟群中点一定范围内中不同蔟群类数量
    for i in k_index:
        tmp_labels.append({'{}'.format(datasLabel[i]): 0})

    #  找到离第i个结点最近的蔟群中心
    for i in trainData:
        if i in k_index:
            continue
        else:
            minDis = 99999999
            minK = 0
            for j in k_index:
                tmpDistance = EucliDis(datas[j], datas[i])
                if minDis > tmpDistance:
                    minDis = tmpDistance
                    minK = j
            #  每找到一个结对对应更新聚类中心点信息
            for col in range(0, len(datas[minK])):
                datas[minK][col] = (datas[minK][col] + datas[i][col]) / 2.0

            #  该结点与中心结点标签相同或不相同的处理(统计每个中心点相较于其他结点更近的点的信息)
            if datasLabel[i] not in tmp_labels[k_index.index(minK)].keys():
                tmp_labels[k_index.index(minK)].update({'{}'.format(datasLabel[i]): 1})
            else:
                tmp_labels[k_index.index(minK)]['{}'.format(datasLabel[i])] += 1

    #  通过比较中心点周围患病与正常的数量，给中心点进行赋值
    k_labels = []
    for i in tmp_labels:
        i = sorted(i.items(), key=lambda item: item[1], reverse=True)
        k_labels.append(i[0][0])

    #  测试模型准确度
    testResult = []
    for i in testData:
        minDis = 99999999
        minK = 0
        for j in k_index:
            tmp_d = EucliDis(datas[j], datas[i])
            if minDis > tmp_d:
                minDis = tmp_d
                minK = j
        testResult.append(k_labels[k_index.index(minK)])

    #  计算模型准确度
    accuracy = 0.0
    for i in range(0, len(testResult)):
        if datasLabel[testData[i]] == testResult[i]:
            accuracy += 1
    accuracy = (accuracy / float(len(testResult))) * 100.0

    #  判断predictData
    minDis = 99999999
    minK = 0
    for j in k_index:
        tmp_d = EucliDis(datas[j], refinedData)
        if minDis > tmp_d:
            minDis = tmp_d
            minK = j
    predictResult = k_labels[k_index.index(minK)]

    return accuracy, predictResult


def EucliDis(ndbdata, TestData):
    Eudistance = 0.0

    for i in range(0, len(TestData)):
        Eudistance += pow(TestData[i] - ndbdata[i], 2.0)
    Eudistance = np.sqrt(Eudistance)
    return Eudistance


def dataSetSplit(testRate, datas):
    temp = []
    for i in range(0, len(datas)):
        temp.append(i)

    np.random.shuffle(temp)

    testData = []
    trainData = []
    testDataSize = int(len(datas) * testRate)

    for i in range(0, testDataSize):
        testData.append(temp[i])

    for i in range(testDataSize, len(datas)):
        trainData.append(temp[i])

    return 1, trainData, testData


#  对病人提交的病例进行分析与判断
def predict(refinedData, datas, datasLabel):
    #  Kmeans算法进行判断
    clusters = 4
    testRate = 0.2
    preResults = {}
    accTotal = {'1': 0, '0': 0}
    for i in range(0, 10):
        accuracy, predictResult = Kmeans(testRate, datas, clusters, datasLabel, refinedData)
        if predictResult not in preResults.keys():
            preResults.update({'{}'.format(predictResult): 1})
        else:
            preResults['{}'.format(predictResult)] += 1
        accTotal[predictResult] += accuracy

    #  将10次结果进行排序，票数最多的为最终结果
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
