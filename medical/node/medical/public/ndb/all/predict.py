from train import *
def predict(path,category):
    diseaseNames = {'fy':'肺炎', 'nj':'疟疾', 'rxa':'乳腺癌', 'eye':'糖尿病视网膜病变',
               'xgfy':'新冠肺炎', 'qx':'气胸', 'qlxjb':'前列腺疾病', 'xdt':'心电图'}
    fy = {'0': '正常', '1': '患病'}
    rxa = {'0': '良性', '1': '恶性'}
    eye = {'0': '正常', '1': '轻微', '2': '中度', '3': '严重', '4': '增殖性'}
    xgfy = {'0': "阴性", '1': "阳性"}
    nj = {'0': "未感染", '1': "感染"}
    qlxjb = {'0': '正常', '1': '患病'}
    qx = {'0': "良好", '1': "患病"}
    xdt = {'0': '心房颤动等融合类', '1': '异常心脏传导', '2': '正常或支持倾向阻滞', '3': '心肌梗死或其他未知类',
           '4': '室上性异常', '5': '心室异常'}
    if category == 'fy':
        classes = 2
    elif category == 'nj':
        classes = 2
    elif category == 'rxa':
        classes = 2
    elif category == 'eye':
        classes = 5
    elif category == 'xgfy':
        classes = 2
    elif category == 'qx':
        classes = 2
    elif category == 'qlxjb':
        classes = 2
    elif category == 'xdt':
        classes = 6
    disease = diseaseNames[category]
    log_dir = dir + 'medical\\model\\' + '{}\\saveData\\'.format(disease)
    model = DenseNet121(classes=classes)
    model.load_weights(log_dir + 'mymodel.h5')  #加载训练好的权重

    filepath = sys.path[0].split('ndb')[0]
    img = cv2.imdecode(np.fromfile(filepath + path, dtype=np.uint8), -1)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  #图像转化
    img = np.array(img)
    img = img/255.0  # 将图片归一化
    img = cv2.resize(img, (160, 160))#重新设定图像大小
    img = img.reshape(-1, 160, 160, 3)
    result = model.predict(img)
    result = result[0] #因为只有一张图片所以它是一个只有一行的二维数组
    print(result)
    if category == 'xgfy':
        pro = result[np.argmax(result)]
        print(xgfy['{}'.format(np.argmax(result))] + ' probabilities ' + str(round(pro * 100, 3)) + '%')
    elif category == 'fy':
        pro = result[np.argmax(result)]
        print(fy['{}'.format(np.argmax(result))] + ' probabilities ' + str(round(pro * 100, 3)) + '%')
    elif category == 'rxa':
        pro = result[np.argmax(result)]
        print(rxa['{}'.format(np.argmax(result))] + ' 概率 ' + str(round(pro * 100, 3)) + '%')
    elif category == 'eye':
        pro = result[np.argmax(result)]
        print(eye['{}'.format(np.argmax(result))] + ' 概率 ' + str(round(pro * 100, 3)) + '%')
    elif category == 'nj':
        pro = result[np.argmax(result)]
        print(nj['{}'.format(np.argmax(result))] + ' 概率 ' + str(round(pro * 100, 3)) + '%')
    elif category == 'qx':
        pro = result[np.argmax(result)]
        print(qx['{}'.format(np.argmax(result))] + ' 概率 ' + str(round(pro * 100, 3)) + '%')
    elif category == 'xdt':
        pro = result[np.argmax(result)]
        print(xdt['{}'.format(np.argmax(result))] + ' 概率 ' + str(round(pro * 100, 3)) + '%')
    elif category == 'qlxjb':
        pro = result[np.argmax(result)]
        print(qlxjb['{}'.format(np.argmax(result))] + ' 概率 ' + str(round(pro * 100, 3)) + '%')
#具体怎么往predict里传文件还没确定
if __name__ == "__main__":

    predict(path='uploads\\test1.jpeg', category='eye')