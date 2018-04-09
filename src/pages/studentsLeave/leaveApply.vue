/*
 * @Author: Alex chenzeyongjsj@163.com 
 * @Date: 2018-03-22 16:47:22 
 * @Last Modified by: Alex chenzeyongjsj@163.com
 * @Last Modified time: 2018-03-26 18:49:40
 */



<template>
  <div class="leaveApply">
    <!-- form -->
    <div class="form">
      <div class="form-item">
        <span class="item-title float-left">请假类型：</span>
        <mt-radio v-model="leaveType" :options="['事假', '病假']">
        </mt-radio>
      </div>
      <div class="form-item">
        <span class="item-title float-left">开始时间：</span>
        <!-- datepicker -->
        <div class="item-container float-right" @click="open('startPicker')">
          <span>{{myDate}}</span>
          <i class="iconfont icon-down"></i>
        </div>
        <mt-datetime-picker ref="startPicker" type="date" :startDate="nowDate" @confirm="handleChange">
        </mt-datetime-picker>
      </div>
      <div class="form-item">
        <span class="item-title float-left">结束时间：</span>
        <div class="item-container float-right" @click="open('toPicker')">
          <span>{{toDate}}</span>
          <i class="iconfont icon-down"></i>
        </div>
        <mt-datetime-picker ref="toPicker" type="date" :startDate="nowDate2" @confirm="handleChange2">
        </mt-datetime-picker>
      </div>
      <div class="form-item form-add-container">
        <span class="item-title float-left">课程/教师：</span>
        <div class="item-container item-container2 float-right">
          <input type="text" class="tec-2 float-left">
          <span class="line">/</span>
          <input type="text" class="tec-2 float-right">
        </div>
      </div>
      <div class="form-item form-add-item">
        <span class="item-title float-left"></span>
        <div class="addTec-Class float-right" @click="add_tec_class()">
          <span>+</span>
        </div>
      </div>
      <div class="form-item">
        <span class="item-title float-left">请假事由：</span>
        <div class="item-container3 float-right">
          <textarea class="textarea" rows="5" v-model="remarks"></textarea>
        </div>
      </div>
      <div class="form-item">
        <span class="item-title float-left">上传附件：</span>
        <div class="item-container3 float-right">
          <el-upload name="accessory" class="avatar-uploader" action="/Home/Index/image_upload" :limit="1" :show-file-list="true" :on-remove="handleRemove" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <div class="avatar">
              <img v-if="imageUrl" :src="imageUrl">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
            <span v-if="imageUrl" class="remove">点击文件名移除已上传文件</span>
          </el-upload>
        </div>
      </div>
    </div>
    <!-- 提交按钮 -->
    <div class="submit">
      <p class="submit-btn" @click="submit()">提&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;交</p>
    </div>
  </div>
</template>
<script>
import { MessageBox, Toast } from "mint-ui";
export default {
  name: "leaveApply",
  data() {
    return {
      fileList2: [],
      // 登录信息
      userToken: "",
      student_num: "",
      imageUrl: "",
      leaveType: "事假",
      //
      myDate: "", //己方时间
      toDate: "", //对方时间
      tec_class_can: false, //课程/教师是否为空
      tec_class: [],
      remarks: "", //备注
      fileUrl: "", //备注
      nowDate: new Date(), //最小时间
      nowDate2: new Date(), //最小时间
      submit_btn: true //提交成功之后关闭提交按钮
    };
  },
  mounted: function() {
    let that = this;
    //设置初始时间
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    month < 10 ? (month = "0" + month) : month;
    day < 10 ? (day = "0" + day) : day;
    this.myDate = year + "-" + month + "-" + day;
    this.toDate = year + "-" + month + "-" + day;
  },
  methods: {
    //打开日期选择器
    open(picker) {
      this.$refs[picker].open();
    },
    //start datepicker change 事件
    handleChange(value) {
      //格式化时间
      let data = new Date(value);
      let year = data.getFullYear();
      let month = data.getMonth() + 1;
      let day = data.getDate();
      month < 10 ? (month = "0" + month) : month;
      day < 10 ? (day = "0" + day) : day;
      this.myDate = year + "-" + month + "-" + day;
      //设置结束时间的最小时间
      if (this.myDate > this.toDate) {
        this.toDate = this.myDate;
      }
      this.nowDate2 = new Date(this.myDate);
    },
    //end datepicker change 事件
    handleChange2(value) {
      //格式化时间
      let data = new Date(value);
      let year = data.getFullYear();
      let month = data.getMonth() + 1;
      let day = data.getDate();
      month < 10 ? (month = "0" + month) : month;
      day < 10 ? (day = "0" + day) : day;
      this.toDate = year + "-" + month + "-" + day;
    },
    //表单提交
    submit: function() {
      let that = this;
      //重置数组
      that.tec_class = [];
      //课程/教师数组结构
      let inputList = document.getElementsByClassName("item-container2");
      that.tec_class_can = true;
      for (let i = 0; i < inputList.length; i++) {
        if (inputList[i].children[0].value && inputList[i].children[2].value) {
          let item =
            inputList[i].children[0].value +
            "/" +
            inputList[i].children[2].value;
          that.tec_class.push(item);
        } else {
          that.tec_class_can = false;
        }
      }
      //单选框value设置
      let l_type;
      if (that.leaveType == "事假") {
        l_type = 1;
      } else if (that.leaveType == "病假") {
        l_type = 2;
      } else if (that.leaveType == "补假") {
        l_type = 3;
      }
      if (that.submit_btn) {
        //验证通过
        if (that.tec_class_can && that.remarks && that.imageUrl) {
          //点击提交之后关闭提交按钮
          that.submit_btn = false;
          //先判断token是否过期
          that
            .$http({
              method: "get",
              url:
                "/Home/Verify/index?token=" + localStorage.getItem("userToken")
            })
            .then(response => {
              //登录成功之后获取用户数据
              if (response.data.verify) {
                that
                  .$http({
                    method: "post",
                    url: "/Home/Index/request_submit",
                    data: {
                      student_num: localStorage.getItem("student_num"),
                      accessory: that.fileUrl,
                      request_type: l_type,
                      start_time: that.myDate,
                      end_time: that.toDate,
                      reason: that.remarks,
                      curriculum: that.tec_class
                    },
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    //格式化
                    transformRequest: [
                      function(data) {
                        let ret = "";
                        for (let it in data) {
                          ret +=
                            encodeURIComponent(it) +
                            "=" +
                            encodeURIComponent(data[it]) +
                            "&";
                        }
                        return ret;
                      }
                    ]
                  })
                  .then(response => {
                    if (response.data.code == 1) {
                      let instance = Toast("提交成功");
                      setTimeout(() => {
                        instance.close();
                        that.$router.push({
                          path: "/pages/studentsLeave/leave/leaveList"
                        });
                      }, 500);
                    } else {
                      //提交失败则重新开放登录按钮
                      that.submit_btn = true;
                      let instance = Toast("提交失败");
                      setTimeout(() => {
                        instance.close();
                      }, 1000);
                    }
                  })
                  .catch(error => {
                    let instance = Toast("网络错误");
                    setTimeout(() => {
                      instance.close();
                    }, 1000);
                    //提交失败则重新开放登录按钮
                    that.submit_btn = true;
                  });
              } else {
                alert("登录已失效，请重新登录！");
                localStorage.removeItem("userToken");
                localStorage.removeItem("student_num");
                this.$router.push({ path: "/pages/Login" });
              }
            })
            .catch(error => {
              let instance = Toast("网络错误！");
              console.log(error);
            });
        } else {
          MessageBox("提示", "请完善信息！");
        }
      }
    },
    //新增教师/课程输入框
    add_tec_class: function() {
      let that = this;
      let div = document.createElement("div");
      div.className = "add float-right";
      let div_1 = document.createElement("div");
      div_1.className =
        "item-container item-container2 item-container2-2 float-left";
      let input_1 = document.createElement("input");
      input_1.className = "tec-2 float-left";
      let input_2 = document.createElement("input");
      input_2.className = "tec-2 float-right";
      let span = document.createElement("span");
      span.className = "line";
      span.innerText = "/";
      let i = document.createElement("i");
      i.className = "iconfont icon-bohui float-right";
      div_1.appendChild(input_1);
      div_1.appendChild(span);
      div_1.appendChild(input_2);
      div.appendChild(div_1);
      div.appendChild(i);
      let container = document.getElementsByClassName("form-add-container")[0];
      container.appendChild(div);
      //删除当前元素
      i.onclick = function() {
        this.parentElement.parentElement.removeChild(this.parentElement);
      };
    },
    //上传成功的钩子
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.fileUrl = res.accessory[0];
    },
    //上传之前的钩子
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        MessageBox("提示", "上传图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        MessageBox("提示", "上传图片大小不能超过 5MB!");
      }
      return isJPG && isLt2M;
    },
    //文件移除的钩子
    handleRemove(file, fileList) {
      this.imageUrl = "";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.leaveApply {
  width: 100%;
  position: relative;
  padding-top: 1.75rem;
  padding-bottom: 2rem;
  .form {
    width: 100%;
    padding: 0 1.25rem;
    margin: 0 auto;
    margin-top: -0.55rem;
    .form-item {
      width: 100%;
      margin-top: 0.55rem;
      position: relative;
      &::after {
        content: "";
        visibility: hidden;
        clear: both;
        display: block;
      }
      .item-title {
        width: 2.8rem;
        white-space: nowrap;
        font-size: 0.6rem;
        color: #808080;
        line-height: 1.75rem;
      }
      .item-container {
        width: 10rem;
        height: 1.25rem;
        border: 1px solid #787878;
        border-radius: 0.2rem;
        margin-top: 0.26rem;
        background: #fff;
        font-size: 0.6rem;
        color: #808080;
        line-height: 1.25rem;
        padding-left: 0.4rem;
        padding-right: 0.8rem;
        position: relative;
        overflow: hidden;
        .icon-down {
          position: absolute;
          top: 50%;
          right: 0.4rem;
          transform: translateY(-50%);
          font-size: 0.6rem;
        }
        .picker-select {
          width: 100%;
          height: 1.25rem;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
        .tec {
          width: 100%;
          height: 100%;
        }
      }
      .item-container2 {
        padding-right: 0.4rem;
        .tec-2 {
          width: 4.1rem;
          height: 100%;
        }
        .line {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .add {
        width: 10rem;
        height: 1.25rem;
        position: relative;
        margin-top: 0.26rem;
        .item-container2-2 {
          width: 9rem;
          margin-top: 0;
          .tec-2 {
            width: 3.8rem;
          }
        }
        .icon-bohui {
          font-size: 0.8rem;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          color: #aaa;
        }
      }
      .item-container3 {
        width: 10rem;
      }
      .addTec-Class {
        width: 10rem;
        height: 1.25rem;
        border: 1px dashed #ccc;
        margin-top: 0.2rem;
        border-radius: 0.2rem;
        position: relative;
        > span {
          color: #aaa;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .textarea {
        width: 100%;
        border: 1px solid #787878;
        border-radius: 0.2rem;
        background: #fff;
        font-size: 0.6rem;
        color: #808080;
        font-size: 0.6rem;
        //去除移动版的内阴影
        -webkit-appearance: none;
      }
    }
    .form-add-item {
      margin-top: 0;
    }
    .toItem {
      margin-top: 2rem;
    }
    .item-2 {
      margin-top: 0;
    }
    //文件上传
    .avatar-uploader {
      width: 4.5rem;
      height: 4.5rem;
      border: 1px solid #787878;
      border-radius: 0.15rem;
      position: relative;
      padding: 0.1rem;
      .avatar {
        width: 4.2rem;
        height: 4.2rem;
        overflow: hidden;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        > img {
          width: 100%;
          height: 100%;
        }
      }
      .el-icon-plus {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .remove {
        font-size: 0.5rem;
        color: #808080;
        white-space: nowrap;
        margin-left: 4.8rem;
      }
    }
  }
  .submit {
    width: 11.25rem;
    height: 1.5rem;
    margin: 0 auto;
    margin-top: 1.5rem;
    .submit-btn {
      width: 11.25rem;
      height: 1.5rem;
      text-align: center;
      line-height: 1.5rem;
      background: #808080;
      color: #fff;
      font-size: 0.65rem;
      border-radius: 0.2rem;
    }
  }
}
.el-upload__input {
  display: none;
}
</style>
