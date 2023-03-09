import sys
import os

import joblib

dir = sys.path[0].split('node')[0]  # 项目根目录
casesPath = sys.path[0].split('ndb')[0] + 'texts/'  # 病人数据路径
modelDataPaths = {'xzb': dir + "model/心脏病/Datas/xzbDatas.csv",
                  'tnb': dir + "model/糖尿病/Datas/tnbDatas.csv",
                  'gk': dir + "model/骨科疾病/Datas/gkDatas.csv",
                  'xxg': dir + "model/心血管疾病/Datas/xxgDatas.csv"}


#  读取模型数据
def readModelDatas(diseaseType):
    filePath = modelDataPaths[diseaseType]
    #  读取文件头
    with open(filePath, 'r') as f:
        label = f.readline().strip('\n').strip(',').split(',')
        labelCount = f.readline().strip('\n').strip(',').split(',')

        labels1 = []
        for i in range(0, len(label)):
            tempLabel = {'label': label[i], 'labelCount': labelCount[i]}
            labels1.append(tempLabel)

        #  提取模型数据的索引
        datasLabel = []
        for i in range(0, len(labels1)):
            for j in range(0, int(labels1[i]['labelCount'])):
                temp = labels1[i]['label']
                datasLabel.append(temp)

        #  将病患信息依次取出来，存放在datas中
        str = f.readlines()
        datas = []
        for i in range(0, len(str)):
            if str != '':
                str[i] = str[i].strip('\n')
                strlist = str[i].split(',')
                datas.append(transToFloat(strlist))
    return 1, datas, datasLabel


#  将str转化为float
def transToFloat(strlist):
    tmplist = []
    for i in range(len(strlist)):
        tmplist.append(float(strlist[i]))
    return tmplist


def getCaseData(diseaseType):
    casePath = casesPath + "{}.csv".format(diseaseType)
    with open(casePath, 'r', encoding='UTF-8') as f:
        caseData = f.readline().split(',')
    return caseData


def getModel(diseaseType, modelName):
    diseaseName = {'xzb': '心脏病', 'xxg': '心血管疾病', 'gk': '骨科疾病', 'tnb': '糖尿病'}
    model = 0
    modelPath = dir + 'model/' + '{}/SavedModels/{}.pkl'.format(diseaseName[diseaseType], modelName)

    #  获取模型及其准确率
    if os.path.exists(modelPath):
        model = joblib.load(modelPath)

    return model


def getAccuracy(diseaseType, modelName):
    diseaseName = {'xzb': '心脏病', 'xxg': '心血管疾病', 'gk': '骨科疾病', 'tnb': '糖尿病'}
    accuracy = 0
    accuracyPath = dir + 'model/' + '{}/SavedModels/{}Accuracy.csv'.format(diseaseName[diseaseType], modelName)

    if os.path.exists(accuracyPath):
        with open(accuracyPath, 'r') as f:
            accuracy = float(f.readline())

    return accuracy


#  保存模型
def saveModel(diseaseType, modelName, model):
    #  保存训练好的模型
    diseaseName = {'xzb': '心脏病', 'xxg': '心血管疾病', 'gk': '骨科疾病', 'tnb': '糖尿病'}
    modelPath = dir + 'model/' + '{}/SavedModels/{}.pkl'.format(diseaseName[diseaseType], modelName)
    joblib.dump(model, modelPath)


def saveAccuracy(diseaseType, modelName, accuracy):
    diseaseName = {'xzb': '心脏病', 'xxg': '心血管疾病', 'gk': '骨科疾病', 'tnb': '糖尿病'}

    accuracyPath = dir + 'model/' + '{}/SavedModels/{}Accuracy.csv'.format(diseaseName[diseaseType], modelName)
    with open(accuracyPath, 'w') as f:
        f.write(str(accuracy))


def refineCaseData(caseData, diseaseType):
    for i in range(0, len(caseData)):
        if caseData[i] == 'zero':
            caseData[i] = 0
        elif caseData[i] == 'one':
            caseData[i] = 1
        elif caseData[i] == 'two':
            caseData[i] = 2
        elif caseData[i] == 'three':
            caseData[i] = 3
        elif caseData[i] == 'Male':
            caseData[i] = 1
        elif caseData[i] == 'Female':
            caseData[i] = 0

    """
    1、提取病例关键信息
    """
    refinedData = []  # 存储病例的关键数据
    modelPath = ""  # 保存diseaseType的模型数据路径
    if diseaseType == 'xzb':
        refinedData.append(int(caseData[1]))
        refinedData.append(caseData[5])
        refinedData.append(caseData[4])
        refinedData.append(float(caseData[6]))
        refinedData.append(float(caseData[7]))
        refinedData.append(int(caseData[8]))
        refinedData.append(caseData[9])
        refinedData.append(float(caseData[10]))
        refinedData.append(caseData[11])
        refinedData.append(float(caseData[12]))
        refinedData.append(caseData[13])
        refinedData.append(caseData[14])
        refinedData.append(int(caseData[15]))
    elif diseaseType == 'tnb':
        refinedData.append(int(caseData[5]))
        refinedData.append(float(caseData[6]))
        refinedData.append(float(caseData[7]))
        refinedData.append(float(caseData[8]))
        refinedData.append(float(caseData[9]))
        refinedData.append(float(caseData[10]))
        refinedData.append(float(caseData[11]))
        refinedData.append(int(caseData[1]))
    elif diseaseType == 'gk':
        refinedData.append(float(caseData[5]))
        refinedData.append(float(caseData[6]))
        refinedData.append(float(caseData[7]))
        refinedData.append(float(caseData[8]))
        refinedData.append(float(caseData[9]))
        refinedData.append(float(caseData[10]))
    elif diseaseType == 'xxg':
        refinedData.append(int(caseData[1]))
        refinedData.append(int(caseData[5]))
        refinedData.append(float(caseData[6]))
        refinedData.append(int(caseData[8]))
        refinedData.append(float(caseData[7]))
        refinedData.append(int(caseData[9]))
        refinedData.append(float(caseData[10]))
        refinedData.append(float(caseData[12]))
        refinedData.append(float(caseData[13]))
        refinedData.append(caseData[4])
        refinedData.append(int(caseData[11]))
        refinedData.append(int(caseData[14]))

    #  将refinedData以.csv文件形式存储
    refinedDataPath = casesPath + diseaseType + '/{}.csv'.format(diseaseType)
    with open(refinedDataPath, 'w', encoding='utf-8') as f:
        for i in range(0, len(refinedData) - 1):
            f.write(str(refinedData[i]) + ',')
        f.write(str(refinedData[len(refinedData) - 1]) + '\n')

    return refinedData


if __name__ == '__main__':
    print(dir)
    print(casesPath)
