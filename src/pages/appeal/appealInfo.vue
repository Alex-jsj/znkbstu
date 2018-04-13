/*
 * @Author: Alex chenzeyongjsj@163.com 
 * @Date: 2018-03-14 11:10:34 
 * @Last Modified by: Alex chenzeyongjsj@163.com
 * @Last Modified time: 2018-03-23 16:02:27
 */



<template>
  <div class="appealInfo">
    <!-- 消息列表 -->
    <div class="container">
      <!-- date -->
      <div class="date">
        <!-- <span class="float-left">{{leaveInfo.time_now}}</span>
        <span class="float-left week">{{leaveInfo.week}}</span> -->
      </div>
      <!-- list -->
      <div class="list">
        <div class="list-item">
          <span class="float-left">申诉人员：</span>
          <span class="float-left">{{leaveInfo.name}}</span>
        </div>
        <div class="list-item">
          <span class="float-left">班级：</span>
          <span class="float-left">{{leaveInfo.squad}}</span>
        </div>
        <div class="list-item">
          <span class="float-left">申诉类型：</span>
          <span class="float-left">{{leaveInfo.type}}</span>
        </div>
        <div class="list-item">
          <span class="float-left">提交申诉时间：</span>
          <span class="float-left">{{leaveInfo.time}}({{leaveInfo.week}})</span>
        </div>
        <div class="list-item">
          <span class="float-left">申诉时间：</span>
          <span class="float-left">{{leaveInfo.date}}</span>
        </div>
        <div class="list-item tec">
          <span class="float-left">申诉课程：</span>
          <span class="float-left">{{leaveInfo.course}}</span>
        </div>
        <div class="list-item item-excuse">
          <span class="float-left">申诉事由：</span>
          <div v-html="leaveInfo.reason" class="remarks"></div>
        </div>
      </div>
      <!-- type -->
      <i class="iconfont type" :class="leaveInfo.statusClass"></i>
    </div>
    <!-- 底部菜单 -->
    <Menu :linkActive="linkActive"></Menu>
  </div>
</template>
<script>
/* 引入组件 */
import Menu from "@/components/Menu";
export default {
  name: "appealInfo",
  data() {
    return {
      linkActive: 4, //菜单定位
      leaveInfo: {}
    };
  },
  components: {
    Menu
  },
  mounted: function() {
    //修改页面title
    document.title = "申诉详情";
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
              url: "/Home/Index/appeal_particulars",
              data: {
                student_num: localStorage.getItem("student_num"),
                id: sessionStorage.getItem("appeal_id")
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
              this.leaveInfo = response.data;
              //格式化日期
              let year = new Date().getFullYear();
              let month = new Date().getMonth() + 1;
              let day = new Date().getDate();
              month < 10 ? (month = "0" + month) : month;
              day < 10 ? (day = "0" + day) : day;
              this.leaveInfo.time_now = year + "-" + month + "-" + day;
              //换算星期
              this.leaveInfo.week = new Date(this.leaveInfo.time).getDay();
              if (this.leaveInfo.week == 0) {
                this.leaveInfo.week = "周日";
              } else if (this.leaveInfo.week == 1) {
                this.leaveInfo.week = "周一";
              } else if (this.leaveInfo.week == 2) {
                this.leaveInfo.week = "周二";
              } else if (this.leaveInfo.week == 3) {
                this.leaveInfo.week = "周三";
              } else if (this.leaveInfo.week == 4) {
                this.leaveInfo.week = "周四";
              } else if (this.leaveInfo.week == 5) {
                this.leaveInfo.week = "周五";
              } else if (this.leaveInfo.week == 6) {
                this.leaveInfo.week = "周六";
              }
              //请假类型
              if (this.leaveInfo.appeal_type == 1) {
                this.leaveInfo.type = "忘打卡";
              } else if (this.leaveInfo.appeal_type == 2) {
                this.leaveInfo.type = "数据有误";
              } else if (this.leaveInfo.appeal_type == 3) {
                this.leaveInfo.type = "其他";
              }
              //状态
              if (this.leaveInfo.status == 1) {
                this.leaveInfo.statusClass = "icon-shenhezhong";
              } else if (this.leaveInfo.status == 2) {
                this.leaveInfo.statusClass = "icon-shenhetongguo";
              } else if (this.leaveInfo.status == 3) {
                this.leaveInfo.statusClass = "icon-yibohui";
              }
            })
            .catch(error => {
              //alert("网络错误");
              console.log(error);
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
.appealInfo {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 2rem;
  .container {
    width: 100%;
    padding: 0 1.25rem;
    overflow: hidden;
    position: relative;
    .date {
      margin-top: 1.75rem;
      margin-bottom: 0.7rem;
      font-size: 0.7rem;
      color: #999;
      &::after {
        content: "";
        display: block;
        visibility: hidden;
        clear: both;
      }
      .week {
        margin-left: 0.5rem;
      }
    }
    .list {
      width: 100%;
      padding: 0 0.55rem;
      margin-bottom: 1.25rem;
      border-radius: 0.2rem;
      box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.3);
      .list-item {
        width: 100%;
        height: 1.9rem;
        overflow: hidden;
        font-size: 0.6rem;
        color: #666;
        padding-top: 0.51rem;
        padding-bottom: 0.51rem;
        // line-height: 1.9rem;
        border-bottom: 1px solid #e5e5e5;
        &:last-child {
          border-bottom: none;
        }
        .remarks {
          line-height: 1rem;
          margin-top: -0.05rem;
        }
        .tec-class {
          width: 9rem;
          margin-top: -0.3rem;
          > p {
            border-bottom: 1px dashed #ddd;
            padding: 0.3rem 0;
            &:last-child {
              border-bottom: none;
            }
          }
        }
      }
      .tec {
        height: auto;
      }
      .item-excuse {
        height: auto;
      }
    }
    .type {
      position: absolute;
      top: 0.2rem;
      right: 0.5rem;
      font-size: 5rem;
      color: #808080;
    }
    .icon-shenhezhong {
      color: #808080;
    }
    .icon-shenhetongguo {
      color: #86c03f;
    }
    .icon-yibohui {
      color: #cb121b;
      right: -1.2rem;
    }
  }
}
</style>
