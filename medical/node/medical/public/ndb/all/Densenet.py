from keras.models import Model
from keras import layers
from keras import backend
import math
from keras.layers import *
from keras.layers import Activation
from keras.layers import GlobalAveragePooling2D
import keras.backend as K

def eca_layer(inputs_tensor=None, num=None, gamma=2, b=1):
    """
    https://github.com/devenin/ECANet-keras
    ECA-NET
    :param inputs_tensor: input_tensor.shape=[batchsize,h,w,channels]
    :param num:
    :param gamma:
    :param b:
    :return:
    """
    channels = K.int_shape(inputs_tensor)[-1]
    t = int(abs((math.log(channels, 2) + b) / gamma))
    k = t if t % 2 else t + 1
    x_global_avg_pool = GlobalAveragePooling2D()(inputs_tensor)
    x = Reshape((channels, 1))(x_global_avg_pool)
    x = Conv1D(1, kernel_size=k, padding="same", name="eca_conv1_" + str(num))(x)
    x = Activation('sigmoid', name='eca_conv1_relu_' + str(num))(x)  # shape=[batch,chnnels,1]
    x = Reshape((1, 1, channels))(x)
    output = multiply([inputs_tensor, x])
    return output

BASE_WEIGTHS_PATH = (
    'https://github.com/keras-team/keras-applications/'
    'releases/download/densenet/')
DENSENET121_WEIGHT_PATH = (
        BASE_WEIGTHS_PATH +
        'densenet121_weights_tf_dim_ordering_tf_kernels.h5')
DENSENET169_WEIGHT_PATH = (
        BASE_WEIGTHS_PATH +
        'densenet169_weights_tf_dim_ordering_tf_kernels.h5')
DENSENET201_WEIGHT_PATH = (
        BASE_WEIGTHS_PATH +
        'densenet201_weights_tf_dim_ordering_tf_kernels.h5')


# 特征层高宽不变，通道数改变
# BN+Relu+Conv(1*1)(filternum:4K)+dropout+BN+Relu+Conv(3*3)+dropout
def dense_block(x, blocks, name):
    for i in range(blocks):
        x = conv_block(x, 32, name=name + '_block' + str(i + 1))
    return x

# 生长率为32表示每个稠密层输出的feature map维度是32，共两层稠密块
def conv_block(x, growth_rate, name):
    bn_axis = 3
    x1 = layers.BatchNormalization(axis=bn_axis,
                                   epsilon=1.001e-5,
                                   name=name + '_0_bn')(x)
    x1 = layers.Activation('relu', name=name + '_0_relu')(x1)
    x1 = layers.Conv2D(4 * growth_rate, 1,
                       use_bias=False,
                       name=name + '_1_conv')(x1)
    x1 = Dropout(0.2)(x1)
    x1 = layers.BatchNormalization(axis=bn_axis, epsilon=1.001e-5,
                                   name=name + '_1_bn')(x1)
    x1 = layers.Activation('relu', name=name + '_1_relu')(x1)
    x1 = layers.Conv2D(growth_rate, 3,
                       padding='same',
                       use_bias=False,
                       name=name + '_2_conv')(x1)
    x1 = Dropout(0.2)(x1)
    x = layers.Concatenate(axis=bn_axis, name=name + '_concat')([x, x1]) #将X与X1拼接
    return x

# DenseBlock之间进行连接的模块，1*1的卷积，主要是整合DenseBlock的特征并缩小宽高
# 使用步长为2的averagePooling缩小特征层的宽高，BN+Relu+Conv(1*1)+dropout+Pooling(2*2)
def transition_block(x, reduction, name):
    bn_axis = 3
    x = layers.BatchNormalization(axis=bn_axis, epsilon=1.001e-5,
                                  name=name + '_bn')(x)
    x = layers.Activation('relu', name=name + '_relu')(x)
    x = layers.Conv2D(int(backend.int_shape(x)[bn_axis] * reduction), 1,
                      use_bias=False,
                      name=name + '_conv')(x)
    x = layers.Dropout(0.2)(x)
    x = layers.AveragePooling2D(2, strides=2, name=name + '_pool')(x)
    return x


def DenseNet(blocks,
             input_shape=None,
             classes=2,
             **kwargs):
    img_input = layers.Input(shape=input_shape)
    bn_axis = 3

    # 224,224,3 -> 112,112,64
    x = layers.ZeroPadding2D(padding=((3, 3), (3, 3)))(img_input)#上面加三行下面加三行，230*230*3
    x = layers.Conv2D(64, 7, strides=2, use_bias=False, name='conv1/conv')(x)#经过卷积，步长是2,112*112*64
    x = layers.BatchNormalization(
        axis=bn_axis, epsilon=1.001e-5, name='conv1/bn')(x)
    x = layers.Activation('relu', name='conv1/relu')(x)

    # 112,112,64 -> 56,56,64
    x = layers.ZeroPadding2D(padding=((1, 1), (1, 1)))(x)
    x = layers.MaxPooling2D(3, strides=2, name='pool1')(x)

    # 56,56,64 -> 56,56,64+32*block[0]
    # Densenet121 56,56,64 -> 56,56,64+32*6 == 56,56,256
    x = dense_block(x, blocks[0], name='conv2')

    # 56,56,64+32*block[0] -> 28,28,32+16*block[0]
    # Densenet121 56,56,256 -> 28,28,32+16*6 == 28,28,128
    x = transition_block(x, 0.5, name='pool2')

    # 28,28,32+16*block[0] -> 28,28,32+16*block[0]+32*block[1]
    # Densenet121 28,28,128 -> 28,28,128+32*12 == 28,28,512
    x = dense_block(x, blocks[1], name='conv3')

    # Densenet121 28,28,512 -> 14,14,256
    x = transition_block(x, 0.5, name='pool3')

    # Densenet121 14,14,256 -> 14,14,256+32*block[2] == 14,14,1024
    x = dense_block(x, blocks[2], name='conv4')

    # Densenet121 14,14,1024 -> 7,7,512
    x = transition_block(x, 0.5, name='pool4')

    # Densenet121 7,7,512 -> 7,7,256+32*block[3] == 7,7,1024
    x = dense_block(x, blocks[3], name='conv5')

    x = layers.BatchNormalization(axis=bn_axis, epsilon=1.001e-5, name='bn')(x)
    x = layers.Activation('relu', name='relu')(x)
    x = Dropout(0.5)(x)

    x = layers.GlobalAveragePooling2D(name='avg_pool')(x)
    x = layers.Dense(512, activation='relu', name='fc512')(x)
    x = layers.Dense(classes, activation='softmax', name='fc2')(x)

    inputs = img_input

    if blocks == [6, 12, 24, 16]:
        model = Model(inputs, x, name='densenet121')
    elif blocks == [6, 12, 32, 32]:
        model = Model(inputs, x, name='densenet169')
    elif blocks == [6, 12, 48, 32]:
        model = Model(inputs, x, name='densenet201')
    else:
        model = Model(inputs, x, name='densenet')
    return model


def DenseNet121(input_shape=[160, 160, 3],
                classes=2,
                **kwargs):
    return DenseNet([6, 12, 24, 16],
                    input_shape, classes,
                    **kwargs)


def DenseNet169(input_shape=[192, 192, 3],
                classes=2,
                **kwargs):
    return DenseNet([6, 12, 32, 32],
                    input_shape, classes,
                    **kwargs)


def DenseNet201(input_shape=[192, 192, 3],
                classes=2,
                **kwargs):
    return DenseNet([6, 12, 48, 32],
                    input_shape, classes,
                    **kwargs)