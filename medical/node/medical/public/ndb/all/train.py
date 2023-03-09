import cv2
import numpy as np
import sys
import os
from keras.optimizers import adam_v2
from Densenet import DenseNet121
from keras.utils import np_utils
from keras.callbacks import ModelCheckpoint
from keras.callbacks import EarlyStopping
import tensorflow as tf
import matplotlib.pyplot as plt

#得到各个模型的保存路径
dir = sys.path[0].split('medical')[0] #源地址
train_data_dir = dir + 'medical_data\\' + 'train_data\\'
disease = 'eye' #每次不同的病例都要在此处修改
diseaseName = {'fy':'肺炎', 'nj':'疟疾', 'rxa':'乳腺癌', 'eye':'糖尿病视网膜病变',
               'xgfy':'新冠肺炎', 'qx':'气胸', 'qlxjb':'前列腺疾病', 'xdt':'心电图'}
log_dir = dir + 'medical\\model\\' + '{}\\saveData\\'.format(diseaseName[disease])
batch_size = 10
epochs = 24
classes = 5
size = 160 #调整图片的像素

#更改图像大小
def resize_image(image, size):
        images = []
        for i in image:
            i = cv2.resize(i, size)
            i = i/255
            images.append(i)
        images = np.array(images)
        return images

def generate_arrays_from_file(lines, batch_size):

        n = len(lines)
        i= 0
        while 1:
            x_train = []
            y_train = []
            #获取一个batch_size大小的数据
            for b in range(batch_size):
                if i == 0:
                    np.random.shuffle(lines)
                #处理图片
                img_name = lines[i].split(';')[0]
                img_path = train_data_dir + diseaseName[disease] + '\\image_data\\' + img_name
                img = cv2.imdecode(np.fromfile(img_path, dtype=np.uint8), -1)
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                x_train.append(img)

                #处理标签
                label = lines[i].split(';')[1]
                label = label.strip('\n')
                label = int(label)
                y_train.append(label)
                #第i个batch
                i = (i + 1) % n
            x_train= resize_image(x_train,(size,size))
            x_train = x_train.reshape(-1, 160, 160, 3)
            y_train = np_utils.to_categorical(np.array(y_train), num_classes=classes)
            yield (x_train, y_train)

#设置训练用的参数
def parameter_settings():

    filepath = train_data_dir + diseaseName[disease] + '\\labels_data' + '\\{}_labels.txt'.format(disease)
    with open(filepath) as f:
        lines = f.readlines()
        np.random.seed(10000)
        np.random.shuffle(lines)

    #80%用于训练，20%用于估计。
    num_val = int(len(lines) * 0.4)
    num_train = len(lines) - num_val

    #检查点
    checkpoint_period = ModelCheckpoint(
        filepath=log_dir + 'mymodel.h5',
        monitor='val_accuracy', #以验证集的准确率为监控标准
        save_weights_only=True,
        save_best_only=True, #只保留成绩最好的模型
        period=1 #每个checkpoint之间的间隔epoch数
    )

    # 是否需要早停，当val_loss一直不下降的时候意味着模型基本训练完毕，可以停止
    early_stopping = EarlyStopping(
        monitor='val_accuracy', #以验证集的准确率为监控标准
        min_delta=0, #最小的improement为0
        patience=3, #当early_stopping被激活（如发现loss相比上patience个epoch训练没有下降），则经过patience个epoch后停止训练
        verbose=1, #信息展示模式
        mode= 'max' #在min模式下，如果检测值停止下降则中止训练。在max模式下，当检测值不再上升则停止训练，auto为自动
    )
    return lines, num_train, num_val, checkpoint_period, early_stopping

#训练densenet网络
def DenseNet_train():

    #建立densenet模型
    model = DenseNet121(classes=classes)
    #加载预训练集，可以帮助更快地收敛
    if not os.path.exists(log_dir + 'mymodel.h5'):
        weights_path = dir + 'medical\\model\\' + 'densenet121_weights_tf_dim_ordering_tf_kernels.h5'
        model.load_weights(weights_path, by_name=True, skip_mismatch=True)
    else:
        weights_path = log_dir + 'mymodel.h5'
        model.load_weights(weights_path, by_name=True, skip_mismatch=True)

    #指定训练层
    for i in range(0, len(model.layers) - 2):
        model.layers[i].trainable = True

    #编译模型
    model.compile(
        loss = 'categorical_crossentropy', #衡量模型好坏的方法
        optimizer = adam_v2.Adam(), #优化器
        metrics = ['accuracy']
    )


    #传入设置好的参数
    lines, num_train, num_val, checkpoint_period, early_stopping = parameter_settings()

    #开始训练
    history = model.fit(
            generate_arrays_from_file(lines[:num_train], batch_size=batch_size),
            epochs=epochs, #一共经历epochs次训练
            steps_per_epoch=max(1, num_train // batch_size), #每次训练的batch数
            validation_data=generate_arrays_from_file(lines[num_train:], batch_size=batch_size),
            validation_steps=max(1, num_val // batch_size),
            shuffle=True, #每次epoch训练前打乱训练集
            verbose=1, #显示信息
            callbacks = [checkpoint_period, early_stopping])

    acc = history.history['accuracy']  # 获取训练集准确性数据
    val_acc = history.history['val_accuracy']  # 获取验证集准确性数据
    loss = history.history['loss']  # 获取训练集错误值数据
    val_loss = history.history['val_loss']  # 获取验证集错误值数据
    epoch = range(1, len(acc) + 1)

    plt.plot(epoch, acc, 'bo', label='Trainning acc')  # 以epochs为横坐标，以训练集准确性为纵坐标
    plt.plot(epoch, val_acc, 'b', label='Vaildation acc')  # 以epochs为横坐标，以验证集准确性为纵坐标
    plt.legend()  # 绘制图例，即标明图中的线段代表何种含义

    plt.figure()  # 创建一个新的图表
    plt.plot(epoch, loss, 'bo', label='Trainning loss')
    plt.plot(epoch, val_loss, 'b', label='Vaildation loss')
    plt.legend()  ##绘制图例，即标明图中的线段代表何种含义
    plt.show()  # 显示所有图表

    #打印模型信息（可去掉）
    #model.summary()

if __name__ == '__main__':
    os.environ["CUDA_VISIBLE_DEVICES"] = "0"
    config = tf.compat.v1.ConfigProto()
    config.gpu_options.per_process_gpu_memory_fraction = 0.95
    DenseNet_train()