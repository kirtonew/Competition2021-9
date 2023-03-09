from train import *

dir = sys.path[0].split('medical')[0]
classes = 6
disease = 'xdt'
path = dir + 'medical_data\\test_data\\' + disease
diseaseName = {'fy':'肺炎', 'nj':'疟疾', 'rxa':'乳腺癌', 'eye':'糖尿病视网膜病变',
               'xgfy':'新冠肺炎', 'qx':'气胸', 'qlxjb':'前列腺疾病', 'xdt':'心电图'}
log_dir = dir + 'ct\\model\\' + '{}\\saveData\\'.format(diseaseName[disease])

#遍历测试集的文件
def turn2array(path):
    x_test = []
    y_test = []
    for (root, dirnames, filenames) in os.walk(path):
        for filename in filenames:
            if filename.endswith('.jpeg') or filename.endswith('.png') or filename.endswith('.jpg'):
                img_path = root + '\\' +filename
                img = cv2.imread(img_path)
                img = np.array(img)
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                img = img / 255
                img = cv2.resize(img, (160,160))
                x_test.append(img)

                label = root.split('\\')[-1]
                label = int(label)
                y_test.append(label)
    x_test = np.array(x_test)
    x_test = x_test.reshape(-1,160,160,3)
    y_test = np_utils.to_categorical(np.array(y_test), num_classes=classes)
    return x_test, y_test

def evaluate_model():

    model = DenseNet121(classes=classes)
    model.load_weights(log_dir + 'mymodel.h5')
    x_test, y_test = turn2array(path)

    model.compile(loss='categorical_crossentropy',  #衡量模型好坏的方法
                  optimizer=adam_v2.Adam(),  #优化器
                  metrics=['accuracy'])

    loss, accuracy = model.evaluate(x_test, y_test)
    print('the loss is', loss)
    print('the accuracy is', accuracy*100, '%')

if __name__ == '__main__':
    evaluate_model()