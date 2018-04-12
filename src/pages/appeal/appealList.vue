/*
 * @Author: Alex chenzeyongjsj@163.com 
 * @Date: 2018-03-12 10:06:43 
 * @Last Modified by: Alex chenzeyongjsj@163.com
 * @Last Modified time: 2018-03-23 16:01:52
 */

<template>
  <div class="appealList">
    <mt-spinner type="triple-bounce" class="loading" :class="{'loading-show':!page_loading}"></mt-spinner>
    <!-- title -->
    <div class="title">
      <span class="float-left width-1">时间</span>
      <span class="float-left width-2">类型</span>
      <span class="float-left width-3">状态</span>
      <span class="float-left width-4">操作</span>
    </div>
    <!-- content -->
    <div>
      <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-immediate-check="true" infinite-scroll-disabled="loading" infinite-scroll-distance="0">
        <li v-for="(item,index) in appealList" :key="index">
          <div class="width-1 float-left list-item">{{item.time}}</div>
          <div class="width-2 float-left list-item">{{item.type}}</div>
          <div class="width-3 float-left list-item" :class="item.statusClass">{{item.status_text}}</div>
          <div class="width-4 float-left list-item">
            <span class="info" @click="lookInfo(item.id)">查看</span>
          </div>
        </li>
      </ul>
      <p class="to-bottom" :class="{'bottom-show':bottom}">已经到底啦</p>
    </div>
  </div>
</template>
<script>
//引入loading组件
import { Indicator, Toast } from "mint-ui";
export default {
  name: "appealList",
  data() {
    return {
      appealList: [],
      loading: false,
      page_loading: true,
      bottom: false, //已加载所有数据
      currentPage: 1 //分页页码
    };
  },
  mounted: function() {
    let that = this;
    //默认关闭下拉加载 覆盖Indicator插件bug
    that.loading = true;
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
                url: "/Home/Index/appeal",
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
                if (response.data) {
                  for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].status == 1) {
                      response.data[i].statusClass = "shenghe";
                      response.data[i].status_text = "审核中";
                    } else if (response.data[i].status == 2) {
                      response.data[i].statusClass = "tongguo";
                      response.data[i].status_text = "同意";
                    } else if (response.data[i].status == 3) {
                      response.data[i].statusClass = "bohui";
                      response.data[i].status_text = "驳回";
                    }
                    if (response.data[i].appeal_type == 1) {
                      response.data[i].type = "忘打卡";
                    } else if (response.data[i].appeal_type == 2) {
                      response.data[i].type = "数据有误";
                    } else if (response.data[i].appeal_type == 3) {
                      response.data[i].type = "其他";
                    }
                  }
                  this.page_loading = false;
                  //打开下拉加载
                  that.loading = false;
                  this.appealList = response.data;
                } else {
                  let instance = Toast("暂无数据");
                  this.page_loading = false;
                }
              })
              .catch(error => {
                alert("网络错误");
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
          console.log(error);
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
                url: "/Home/Index/appeal",
                data: {
                  student_num: localStorage.getItem("student_num"),
                  currentPage: this.currentPage + 1,
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
                    if (response.data[i].status == 1) {
                      response.data[i].statusClass = "shenghe";
                      response.data[i].status_text = "审核中";
                    } else if (response.data[i].status == 2) {
                      response.data[i].statusClass = "tongguo";
                      response.data[i].status_text = "同意";
                    } else if (response.data[i].status == 3) {
                      response.data[i].statusClass = "bohui";
                      response.data[i].status_text = "驳回";
                    }
                    if (response.data[i].appeal_type == 1) {
                      response.data[i].type = "忘打卡";
                    } else if (response.data[i].appeal_type == 2) {
                      response.data[i].type = "数据有误";
                    } else if (response.data[i].appeal_type == 3) {
                      response.data[i].type = "其他";
                    }
                    //添加新的内容
                    this.appealList.push(response.data[i]);
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
                alert("网络错误");
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
          alert("网络错误！");
          console.log(error);
        });
    },
    lookInfo(uid) {
      //存储内页id
      sessionStorage.setItem("appeal_id", uid);
      this.$router.push({ path: "/pages/appeal/appealInfo" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.appealList {
  width: 100%;
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
      border-right: 1px solid #e8e8e8;
      &:last-of-type {
        border: none;
      }
    }
  }
  .list {
    border-bottom: 1px solid #e8e8e8;
    > li {
      height: 2.5rem;
      background: #f2f2f2;
      position: relative;
      color: #808080;
      &:nth-child(2n) {
        background: #fff;
      }
      .list-item {
        height: 100%;
        color: #808080;
        font-size: 0.6rem;
        line-height: 2.5rem;
        text-align: center;
        white-space: nowrap;
        border-right: 1px solid #e8e8e8;
        &:last-of-type {
          border: none;
        }
        .info {
          color: #808080;
        }
      }
      .shenghe {
        color: #808080;
      }
      .tongguo {
        color: #86c03f;
      }
      .bohui {
        color: #cb121b;
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
    width: 4.5rem;
  }
  .width-3 {
    width: 3.5rem;
  }
  .width-4 {
    width: 2.95rem;
  }
}
</style>
