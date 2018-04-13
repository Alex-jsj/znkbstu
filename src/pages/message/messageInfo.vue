/*
 * @Author: Alex chenzeyongjsj@163.com 
 * @Date: 2018-03-08 13:51:13 
 * @Last Modified by: Alex chenzeyongjsj@163.com
 * @Last Modified time: 2018-03-14 17:04:16
 */


<template>
  <div class="messageInfo">
    <!-- 消息列表 -->
    <div class="container">
      <!-- date -->
      <p class="date">
        <span class="float-left">{{messageInfo.time}}</span>
        <span class="float-left">{{messageInfo.week}}</span>
      </p>
      <!-- title -->
      <div class="title">
        <!-- <i class="iconfont icon-message float-left" :class="messageInfo.statusClass"></i> -->
        <i class="iconfont icon-message float-left tongzhi" :class="messageInfo.statusClass"></i>
        <span class="float-left">{{messageInfo.title}}</span>
      </div>
      <!-- content -->
      <div class="content">
        <div v-html="messageInfo.content"></div>
      </div>
    </div>
    <!-- 底部菜单 -->
    <Menu :linkActive="linkActive"></Menu>
  </div>
</template>
<script>
/* 引入组件 */
import Menu from "@/components/Menu";
export default {
  name: "messageInfo",
  data() {
    return {
      linkActive: 5, //菜单定位
      messageInfo: {}
    };
  },
  components: {
    Menu
  },
  mounted: function() {
    //修改页面title
    document.title = "消息通知";
    let that = this;
    that
      .$http({
        method: "get",
        url: "/Home/Verify/index?token=" + localStorage.getItem("userToken")
      })
      .then(response => {
        //登录成功之后获取用户数据
        if (response.data.verify) {
          that
            .$http({
              method: "post",
              url: "/Home/Index/message_particulars",
              data: {
                student_num: localStorage.getItem("student_num"),
                id: sessionStorage.getItem("message_id"),
                read_status: sessionStorage.getItem("read_status")
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
              this.messageInfo = response.data;
              //格式化日期
              let year = new Date().getFullYear();
              let month = new Date().getMonth() + 1;
              let day = new Date().getDate();
              month < 10 ? (month = "0" + month) : month;
              day < 10 ? (day = "0" + day) : day;
              this.messageInfo.time_now = year + "-" + month + "-" + day;
              //换算星期
              this.messageInfo.week = new Date(this.messageInfo.time).getDay();
              if (this.messageInfo.week == 0) {
                this.messageInfo.week = "周日";
              } else if (this.messageInfo.week == 1) {
                this.messageInfo.week = "周一";
              } else if (this.messageInfo.week == 2) {
                this.messageInfo.week = "周二";
              } else if (this.messageInfo.week == 3) {
                this.messageInfo.week = "周三";
              } else if (this.messageInfo.week == 4) {
                this.messageInfo.week = "周四";
              } else if (this.messageInfo.week == 5) {
                this.messageInfo.week = "周五";
              } else if (this.messageInfo.week == 6) {
                this.messageInfo.week = "周六";
              }
            })
            .catch(error => {
              alert("网络错误");
            });
        } else {
          //登录过期 => 清除前台存储的登录信息并返回登录页
          let instance = Toast("登录已失效，请重新登录！");
          setTimeout(() => {
            instance.close();
            localStorage.removeItem("userToken");
            localStorage.removeItem("student_num");
            this.$router.push({ path: "/pages/Login" });
          }, 1000);
        }
      })
      .catch(error => {
        alert("网络错误");
      });
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.messageInfo {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 2rem;
  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .date {
      width: 100%;
      height: 3.05rem;
      border-bottom: 1px solid #e5e5e5;
      padding: 0 1rem;
      padding-top: 1.5rem;
      > span {
        display: block;
        font-size: 0.7rem;
        color: #999;
        margin-right: 0.3rem;
      }
    }
    .title {
      width: 100%;
      height: 1.75rem;
      padding: 0 1rem;
      border-bottom: 1px solid #e5e5e5;
      .icon-message {
        font-size: 1rem;
        line-height: 1.75rem;
        color: #666;
        margin-right: 0.45rem;
      }
      .tongzhi {
        color: #86c03f;
      }
      .qingjia {
        color: #f18d1d;
      }
      .shenshu {
        color: #cb121b;
      }
      > span {
        display: block;
        font-size: 0.7rem;
        line-height: 1.75rem;
        color: #666;
      }
    }
    .content {
      width: 100%;
      padding: 0 1rem;
      font-size: 0.65rem;
      color: #999999;
      padding-top: 1.1rem;
      line-height: 1.1rem;
      margin-bottom: 3.1rem;
    }
  }
}
</style>
