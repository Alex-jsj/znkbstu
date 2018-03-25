/*
 * @Author: Alex chenzeyongjsj@163.com 
 * @Date: 2018-03-22 16:47:22 
 * @Last Modified by: Alex chenzeyongjsj@163.com
 * @Last Modified time: 2018-03-23 16:00:43
 */



<template>
  <div class="appealApply">
    <!-- form -->
    <div class="form">
      <div class="form-item">
        <span class="item-title float-left">申诉课程：</span>
        <div class="item-container float-right">
          <!-- picker -->
          <div class="picker float-right">
            <select class="picker-select" v-model="classs">
              <option v-for="item in classList" :key="item.id" :value="item">{{item.title}}</option>
            </select>
            <span>{{classs.title}}</span>
            <i class="iconfont icon-down"></i>
          </div>
        </div>
      </div>
      <div class="form-item">
        <span class="item-title float-left">申诉时间：</span>
        <!-- datepicker -->
        <div class="item-container float-right" @click="open('startPicker')">
          <span>{{myDate}}</span>
          <i class="iconfont icon-down"></i>
        </div>
        <mt-datetime-picker ref="startPicker" type="date" :startDate="nowDate" @confirm="handleChange">
        </mt-datetime-picker>
      </div>
      <div class="form-item">
        <span class="item-title float-left">申诉类型：</span>
        <div class="item-container float-right">
          <!-- picker -->
          <div class="picker float-right">
            <select class="picker-select" v-model="appealType">
              <option v-for="item in appealTypeList" :key="item.id" :value="item">{{item.title}}</option>
            </select>
            <span>{{appealType.title}}</span>
            <i class="iconfont icon-down"></i>
          </div>
        </div>
      </div>
      <div class="form-item">
        <span class="item-title float-left">申诉理由：</span>
        <div class="item-container3 float-right">
          <textarea class="textarea" rows="5" v-model="remarks"></textarea>
        </div>
      </div>
      <div class="form-item">
        <span class="item-title float-left">上传附件：</span>
        <div class="item-container3 float-right">
          <el-upload class="avatar-uploader" action="/Home/Index/upload" :limit="1" :show-file-list="true" :on-remove="handleRemove" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
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
  name: "appealApply",
  data() {
    return {
      fileList2: [],
      // 登录信息
      userToken: "",
      student_num: "",
      imageUrl: "",
      //
      myDate: "", //己方时间
      classs: {
        title: "马克思主义哲学",
        value: 0
      },
      classList: [
        {
          title: "马克思主义哲学",
          value: 0
        },
        {
          title: "图形设计",
          value: 1
        },
        {
          title: "CAD",
          value: 2
        }
      ],
      appealType: {
        title: "事假",
        value: 0
      },
      appealTypeList: [
        {
          title: "事假",
          value: 0
        },
        {
          title: "病假",
          value: 1
        }
      ],
      remarks: "", //备注
      nowDate: new Date(), //最小时间
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
      var that = this;
      if (that.teacher && that.remarks && that.imageUrl) {
        //验证通过
        that
          .$http({
            method: "get",
            url: "./static/mock/login.json",
            data: {},
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
            let instance = Toast("提交成功");
            //提交成功之后关闭提交按钮并跳转到预约列表页
            that.submit_btn = false;
            setTimeout(() => {
              instance.close();
              that.$router.push({
                path: "/pages/studentsLeave/leave/leaveList"
              });
            }, 500);
          })
          .catch(error => {
            let instance = Toast("提交失败");
            setTimeout(() => {
              instance.close();
            }, 1000);
            //提交失败则重新开放登录按钮
            that.submit_btn = true;
            console.log(error);
          });
      } else {
        MessageBox("提示", "请完善信息！");
      }
    },
    //上传成功的钩子
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      //console.log(file.name)
      //console.log(file.url)
      //console.log(file.raw.type);
      console.log(file);
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
<style scoped lang="less">
.appealApply {
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
        width: 10.4rem;
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
        .picker {
          width: 100%;
          height: 1.25rem;
          background: #fff;
          font-size: 0.6rem;
          color: #808080;
          line-height: 1.25rem;
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
      .item-container3 {
        width: 10.4rem;
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
