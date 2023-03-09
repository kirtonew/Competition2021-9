<template>
  <div>
    <div class="Login" v-if="isShow">
      <div class="login-left">
        <div>
          <p class="small">欢迎使用</p>
          <p class="big"> 在线医生复诊</p>
        </div>
      </div>
      <div class="login-center">
        <div class="content">
          <div>
            <label for="username" class="iconfont icon-ziyuanxhdpi"> 用户名</label>
            <input type="text" class="user" id="username" ref="inputUsername" />
          </div>
          <div class="chooseAvatar">
            <label for="avatar" class="iconfont icon-icon26"> 请选择诊断科室</label>
            <ul class="avatarWrap">
              <li v-for="(item,index) in imgUrl" :key="item">
                  <img
                    :src="require('../assets/avatar/' + item)"
                    alt
                    @click="clickImg(index)"
                    :class="{active:currentIndex===index?true:false}"
                  />
              </li>
            </ul>
          </div>
          <button class="button" @click="loginRoom_user">病人入口</button>
          <button class="button" @click="loginRoom_doctor">医生入口</button>
        </div>
      </div>
      <div class="login-right">
        <div class="chooseDoctor" v-show="currentIndex === 0">
          <label class="doctorLabel">请选择科室医生</label>
          <ul class="doctorInfo">
            <li v-for="(item,index) in doctorImg_eye" :key="item"
             @click="clickDoctor(index, item)" :class="{active:currentDoctorIndex==index?true:false}">
              <img
                :src="require('../assets/avatar/' + item)"
                alt
                class="doctorImage"
              />
              <span class="doctorName">黄医生</span>
              <div class="doctorProfile">广西壮族自治区钦州市第一人民医院眼科副主任医师</div>
            </li>
          </ul>
        </div>
        <div class="chooseDoctor" v-show="currentIndex === 1">
          <label class="doctorLabel">请选择科室医生</label>
          <ul class="doctorInfo">
            <li v-for="(item,index) in doctorImg_blood" :key="item"
             @click="clickDoctor(index, item)" :class="{active:currentDoctorIndex==index?true:false}">
              <img
                :src="require('../assets/avatar/' + item)"
                alt
                class="doctorImage"
              />
              <span class="doctorName">张医生</span>
              <div class="doctorProfile">湖北省武汉市协和医院心脑血管科医师</div>
            </li>
          </ul>
        </div>
        <div class="chooseDoctor" v-show="currentIndex === 2">
          <label class="doctorLabel">请选择科室医生</label>
          <ul class="doctorInfo">
            <li v-for="(item,index) in doctorImg_endocrine" :key="item"
             @click="clickDoctor(index, item)" :class="{active:currentDoctorIndex==index?true:false}">
              <img
                :src="require('../assets/avatar/' + item)"
                alt
                class="doctorImage"
              />
              <span class="doctorName">陈医生</span>
              <div class="doctorProfile">湖北省武汉市金银潭医院内分泌科医师</div>
            </li>
          </ul>
        </div>
        <div class="chooseDoctor" v-show="currentIndex === 3">
          <label class="doctorLabel">请选择科室医生</label>
          <ul class="doctorInfo">
            <li v-for="(item,index) in doctorImg_bone" :key="item"
             @click="clickDoctor(index, item)" :class="{active:currentDoctorIndex==index?true:false}">
              <img
                :src="require('../assets/avatar/' + item)"
                alt
                class="doctorImage"
              />
              <span class="doctorName">王医生</span>
              <div class="doctorProfile">湖北省武汉市武汉大学中南医院骨科医师</div>
            </li>
          </ul>
        </div>
        <div class="chooseDoctor" v-show="currentIndex === 4">
          <label class="doctorLabel">请选择科室医生</label>
          <ul class="doctorInfo">
            <li v-for="(item,index) in doctorImg_lung" :key="item"
             @click="clickDoctor(index, item)" :class="{active:currentDoctorIndex==index?true:false}">
              <img
                :src="require('../assets/avatar/' + item)"
                alt
                class="doctorImage"
              />
              <span class="doctorName">刘医生</span>
              <div class="doctorProfile">湖北省武汉市华中科技大学同济医学院附属同济医院呼吸内科医师</div>
            </li>
          </ul>
        </div>
        <div class="chooseDoctor" v-show="currentIndex === 5">
          <label class="doctorLabel">请选择科室医生</label>
          <ul class="doctorInfo">
            <li v-for="(item,index) in doctorImg_breast" :key="item"
             @click="clickDoctor(index, item)" :class="{active:currentDoctorIndex==index?true:false}">
                <img
                  :src="require('../assets/avatar/' + item)"
                  alt
                  class="doctorImage"
                />
                <span class="doctorName">邓医生</span>
                <div class="doctorProfile">湖北省武汉市华中科技大学同济医学院附属同济医院乳腺外科副主任医师</div>
            </li>
          </ul>
        </div>
        <div class="chooseDoctor" v-show="currentIndex === 6">
          <label class="doctorLabel">请选择科室医生</label>
          <ul class="doctorInfo">
            <li v-for="(item,index) in doctorImg_skin" :key="item"
             @click="clickDoctor(index, item)" :class="{active:currentDoctorIndex==index?true:false}">
              <img
                :src="require('../assets/avatar/' + item)"
                alt
                class="doctorImage"
              />
              <span class="doctorName">周医生</span>
              <div class="doctorProfile">湖北省武汉市第一医院乳腺外科副主任医师</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <room
      v-else
      :user="user"
      :userList="userList"
      ref="chatroom"
      @sendServer="sendServer"
      :message="message"
      @handleFile="handleFile"
    />
  </div>
</template>

<script>
import Room from './Room'
import io from 'socket.io-client' //引入socket.io-client
export default {
  name: 'Login',
  components: { Room },
  data() {
    return {
      imgUrl: [
        'eye.png',
        'blood.png',
        'diabetes.png',
        'bone.png',
        'lung.png',
        'woman.png',
        'skin.png',
      ],
      doctorImg_eye: [
        'doctorHuang.png'
      ],
      doctorImg_blood: [
        'doctorZhang.png'
      ],
      doctorImg_endocrine: [
        'doctorChen.png'
      ],
      doctorImg_bone: [
        'doctorWang.png'
      ],
      doctorImg_lung: [
        'doctorLiu.png'
      ],
      doctorImg_breast: [
        'doctorDeng.png'
      ],
      doctorImg_skin: [
        'doctorZhou.png'
      ],
      currentIndex: -1,
      currentImg: 'user.jpg',
      currentDoctorIndex: -1,
      currentDoctorImg: '',
      socket: null,
      isShow: true,
      user: {},
      userList: [],
      message: {},
    }
  },
  methods: {
    handleFile(file) {
      this.socket.emit('sendImage', { ...this.user, file })
    },
    clickImg(index) {
      this.currentIndex = index
      this.currentDoctorIndex = -1
    },
    clickDoctor(index, item) {
      this.currentDoctorIndex = index
      this.currentDoctorImg = item
    },
    loginRoom_user() {
      // 1.获取用户名
      const username = this.$refs.inputUsername.value
      if (!username.trim()) {
        alert('请输入用户名')
        return
      }
      if (this.currentDoctorIndex == -1){
        alert('请选择科室医生')
        return
      }

      // 2.需要告诉socket io服务，进行登录
      this.socket.emit('login_user', {
        username,
        avatar: this.currentImg,
        doctorIndex: this.currentIndex,
      })
    },
    loginRoom_doctor() {
      const username = this.$refs.inputUsername.value
      if (!username.trim()) {
        alert('请输入用户名')
        return
      }
      if (this.currentDoctorIndex == -1){
        alert('请选择科室医生')
        return
      }
      // 2.需要告诉socket io服务，进行登录
      this.socket.emit('login_doctor', {
        username,
        avatar: this.currentDoctorImg,
        doctorIndex: this.currentIndex,
      })
    },
    sendServer(content) {
      const { username, avatar, doctorIndex } = this.user
      this.socket.emit('sendMessage', { msg: content, username, avatar, doctorIndex })
    },
  },
  mounted() {
    /**
     * 聊天室的主要功能
     */
    // 1.连接服务器
    // baseURL:process.env.VUE_APP_URL || "/admin/api",
    this.socket = io(process.env.VUE_APP_URL || "http://39.106.209.229:3100/")
    //this.socket = io('ws://39.106.209.229:3100')
    // 2.监听登录失败的请求
    this.socket.on('userExit', (data) => alert(data.msg))
    // 3.监听登录成功的请求
    this.socket.on('loginsuccess', (data) => {
      alert(data.msg)
      this.user = data
      this.isShow = false
    })
    this.socket.on('addUser', (data) => {
      this.$store.commit('setJoinRoom', data)
    })
    this.socket.on('leaveroom', (data) => {
      this.$store.commit('setLeaveRoom', data)
      this.$refs.chatroom ? this.$refs.chatroom.haveOneleaveRoom() : null
    })
    // 监听用户列表的信息
    this.socket.on('userList', (data) => {
      this.userList = data
    })
    // 监听聊天的消息
    this.socket.on('receiveMessage', (data) => {
      // 把接收到的消息显示到聊天窗口中
      this.message = data
    })
    // 监听图片的消息
    this.socket.on('receiveImage', (data) => {
      // 把接收到的图片显示到聊天窗口中
      this.$refs.chatroom.handleImage(data)
    })
  }
}
</script>

<style lang="less" scoped>
.Login {
  width: 1000px;
  height: 500px;
  margin: 130px auto;
  display: flex;
  .login-left {
    width: 150px;
    height: 100%;
    background-color: rgba(66, 69, 120, 0.76);
    display: flex;
    justify-content: center;
    align-items: center;
    .small {
      color: #f1e9e9;
      font-size: 14px;
      font-family: sans-serif;
    }
    .big {
      font-size: 20px;
      font-weight: 600;
      margin-top: 5px;
      color: #f1e9e9;
      font-family: sans-serif;
    }

  }
  .login-center {
    width: 650px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    .icon-ziyuanxhdpi,
    .icon-icon26 {
      color:#353c73;
    }
    label {
      color: #000;
      font-size: 14px;
    }
    .content {
      margin: 20px auto;
      width: 90%;
      .user {
        width: 95%;
        border: 1px solid #ccc;
        font-size: 14px;
        line-height: 30px;
        padding-left: 10px;
        display: block;
      }
      .chooseAvatar {
        margin-top: 15px;
      }
      .avatarWrap {
        display: -webkit-inline-box;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        border: 0px solid #ccc;
        width: 600px;
        li {
          cursor: pointer;
          width: 100px;
          height: 100px;
          padding: 20px;
          img {
            width: 100px;
            height: 100px;
          }
          .active {
            border: 3px solid #2980b9;
          }
        }
      }
    }
    .button {
      width: 100px;
      line-height: 30px;
      background-color: #705a76;
      color: #fff;
      border-radius: 10px;
      margin-left: 20%;
      margin-top: 30px;
    }
  }
  
  .login-right {
    width: 200px;
    display: block;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border: 1px solid #ccc;
    .icon-icon26 {
      color:#353c73;
    }
    label {
      color: #000;
      font-size: 17px;
      font-weight: 700;
    }
    .chooseDoctor {
      margin: 20px auto;
      width: 90%;
      .doctorInfo {
        display: -webkit-inline-box;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        border: 0px solid #ccc;
        padding: 10px 0px 0px 0px;
        li {
          cursor: pointer;
          width: 170px;
          height: 170px;
          padding: 5px;
          img {
            width: 100px;
            height: 100px;
          }
          .doctorName {
            font-size: 20px;
            font-weight: 600;
            margin-top: 5px;
            padding: 0px 0px 0px 5px;
            color: #353c73;
            font-family: sans-serif;
          }
          .doctorProfile {
            font-size: 15px;
            font-weight: 600;
            padding: 5px 0px 0px 0px;
            color: #000;
          }
        }
        .active {
            border: 3px solid #2980b9;
        }
      }
    }
  }
  
}
</style>
