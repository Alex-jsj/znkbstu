/*
 * @Author: Alex chenzeyongjsj@163.com 
 * @Date: 2018-03-08 13:51:13 
 * @Last Modified by: Alex chenzeyongjsj@163.com
 * @Last Modified time: 2018-03-09 15:38:58
 */


<template>
  <div class="messageNotification">
    <mt-spinner type="triple-bounce" class="loading" :class="{'loading-show':!page_loading}"></mt-spinner>
    <!-- 消息列表 -->
    <div class="message">
      <div class="title">
        <span class="float-left width-1">时间</span>
        <span class="float-left width-2">通知概览</span>
        <span class="float-left width-3">操作</span>
      </div>
      <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-immediate-check="true" infinite-scroll-disabled="loading" infinite-scroll-distance="0">
        <li v-for="(item,index) in message_list" :key="index" :class="item.status?'read':'unread'">
          <div class="width-1 float-left list-item item-1">{{item.time}}</div>
          <div class="width-2 float-left list-item item-2">
            <!-- <p class="status" :class="item.statusClass">{{item.status}}</p> -->
            <p class="list-title">{{item.title}}</p>
          </div>
          <div class="width-3 float-left list-item">
            <span class="info" @click="lookInfo(item.id,item.status)">查看</span>
          </div>
        </li>
      </ul>
      <p class="to-bottom" :class="{'bottom-show':bottom}">已经到底啦</p>
    </div>
    <!-- 底部菜单 -->
    <Menu :linkActive="linkActive"></Menu>
  </div>
</template>
<script>
//引入loading组件
import { Indicator } from "mint-ui";
/* 引入组件 */
import Menu from "@/components/Menu";
export default {
  name: "messageNotification",
  data() {
    return {
      linkActive: 5,
      message_list: [],
      page_loading: true,
      loading: false,
      bottom: false, //已加载所有数据
      currentPage: 1 //分页页码
    };
  },
  components: {
    Menu
  },
  mounted: function() {
    let that = this;
    //默认关闭下拉加载 覆盖Indicator插件bug
    that.loading = true;
    //修改页面title
    document.title = "消息通知";
    //判断登录状态
    if (!localStorage.getItem("userToken")) {
      //跳转到登录页
      this.$router.push({ path: "/pages/Login" });
    } else {
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
                url: "/Home/Index/message",
                data: {
                  student_num: localStorage.getItem("student_num"),
                  currentPage: this.currentPage,
                  pageSize: 10
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
                this.page_loading = false;
                //打开下拉加载
                that.loading = false;
                this.message_list = response.data;
              })
              .catch(error => {
                alert("网络错误");
              });
          } else {
            alert("登录已失效，请重新登录！");
            localStorage.removeItem("userToken");
            localStorage.removeItem("student_num");
            this.$router.push({ path: "/pages/Login" });
          }
        })
        .catch(error => {
          alert("网络错误！");
        });
    }
  },
  methods: {
    loadMore() {
      // 防止多次加载
      if (this.loading) {
        return false;
      }
      this.loading = true;
      Indicator.open({
        text: "加载中...",
        spinnerType: "fading-circle"
      });
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
                url: "/Home/Index/message",
                data: {
                  student_num: localStorage.getItem("student_num"),
                  currentPage: that.currentPage + 1,
                  pageSize: 10
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
                if (response.data) {
                  for (let i = 0; i < response.data.length; i++) {
                    //添加新的内容
                    this.message_list.push(response.data[i]);
                  }
                  that.currentPage++;
                  this.loading = false;
                  Indicator.close();
                } else {
                  this.loading = true;
                  Indicator.close();
                  that.bottom = true;
                }
              })
              .catch(error => {
                alert("网络错误！");
                console.log(error);
              });
          } else {
            alert("登录已失效，请重新登录！");
            localStorage.removeItem("userToken");
            localStorage.removeItem("student_num");
            this.$router.push({ path: "/pages/Login" });
          }
        })
        .catch(error => {
          alert("网络错误！");
        });
    },
    lookInfo(uid,status) {
      //存储内页id
      sessionStorage.setItem("message_id", uid);
      //存储已读未读状态
      console.log(status)
      sessionStorage.setItem("read_status", status);
      this.$router.push({ path: "/pages/message/messageInfo" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.messageNotification {
  width: 100%;
  min-height: 85vh;
  padding-bottom: 2rem;
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
  }
  .loading-show {
    display: none;
  }
  .message {
    width: 100%;
    .title {
      width: 100%;
      height: 1.75rem;
      background: #808080;
      > span {
        text-align: center;
        line-height: 1.75rem;
        font-size: 0.6rem;
        color: #fff;
        letter-spacing: 0.1rem;
        border-right: 1px solid rgb(180, 180, 180);
        &:last-of-type {
          border: none;
        }
      }
    }
    .list {
      border-bottom: 1px solid rgb(180, 180, 180);
      > li {
        height: 3.5rem;
        background: rgb(242, 242, 242);
        position: relative;
        color: #808080;
        &:nth-child(2n) {
          background: #fff;
        }
        .list-item {
          height: 100%;
          border-right: 1px solid rgb(180, 180, 180);
          &:last-of-type {
            border: none;
          }
          .status {
            display: inline-block;
            border-radius: 0.15rem;
            color: #fff;
            font-size: 0.45rem;
            padding: 0.06rem 0.25rem;
            background: #86c03f;
            letter-spacing: 0.05rem;
            position: absolute;
            top: 0.8rem;
          }
          .tongzhi {
            background: #86c03f;
          }
          .qingjia {
            background: #f18d1d;
          }
          .shenshu {
            background: #cb121b;
          }
          .list-title {
            white-space: nowrap;
            width: 6.3rem;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 0.6rem;
            color: #808080;
            // position: absolute;
            // top: 2rem;
            line-height: 3.5rem;
          }
          .info {
            display: block;
            width: 100%;
            height: 100%;
            font-size: 0.6rem;
            text-align: right;
            line-height: 3.5rem;
            color: #808080;
            padding-right: 1rem;
          }
        }
        .item-1 {
          color: #808080;
          text-align: left;
          font-size: 0.6rem;
          line-height: 3.5rem;
          padding-left: 1rem;
        }
        .item-2 {
          padding-left: 0.75rem;
          position: relative;
        }
      }
      /* 已读 */
      .read {
        .list-item {
          .list-title {
            color: #c5c4c4;
          }
          .info {
            color: #c5c4c4;
          }
        }
        .item-1 {
          color: #c5c4c4;
        }
      }
      /* 未读 */
      .unread {
        .list-item {
          .list-title {
            color: #696969;
          }
          .info {
            color: #696969;
          }
        }
        .item-1 {
          color: #696969;
        }
      }
    }
    .to-bottom {
      width: 100%;
      height: 1rem;
      line-height: 1rem;
      color: #bbb;
      font-size: 0.5rem;
      text-align: center;
      display: none;
    }
    .bottom-show {
      display: block;
    }
    .width-1 {
      width: 5rem;
    }
    .width-2 {
      width: 7.88rem;
    }
    .width-3 {
      width: 3.12rem;
    }
  }
}
</style>
