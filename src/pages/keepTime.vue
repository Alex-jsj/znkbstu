/*
 * @Author: Alex chenzeyongjsj@163.com 
 * @Date: 2018-03-05 16:43:42 
 * @Last Modified by: Alex chenzeyongjsj@163.com
 * @Last Modified time: 2018-03-22 16:14:02
 */

<template>
  <div class="keepTime">
    <!-- 筛选 -->
    <div class="filter">
      <!-- 年度学期 -->
      <div class="float-left width-1">
        <span>{{filterList.semester}}</span>
      </div>
      <div class="float-left width-2">
        <select class="week-picker" v-model="week" @change="weekChange()">
          <option v-for="item in filterList.weekList" :key="item.id" :value="item">{{item.title}}</option>
        </select>
        <span class="float-left week-simulation">{{week.title}}</span>
        <i class="float-left iconfont icon-down"></i>
      </div>
    </div>
    <!-- 课表 -->
    <div class="timetable">
      <div class="header"></div>
      <div class="container">
        <div class="overflow-container">
          <ul class="list-item float-left" v-for="(list,index) in myTimeTableList" :key="list.id">
            <li class="item item-header">
              <p class="week">{{list.date[0]}}</p>
              <p class="week-date">{{list.date[1]}}</p>
            </li>
            <li class="item" :class="{'bg':list.first[0]}">
              <p class="first">{{list.first[0]}}</p>
              <p class="second">{{list.first[1]}}</p>
              <p class="keepInfo" :class="list.first[3]">
                <span>{{list.first[2]}}</span>
              </p>
            </li>
            <li class="item" :class="{'bg':list.second[0]}">
              <p class="first">{{list.second[0]}}</p>
              <p class="second">{{list.second[1]}}</p>
              <p class="keepInfo" :class="list.second[3]">
                <span>{{list.second[2]}}</span>
              </p>
            </li>
            <li class="item" :class="{'bg':list.thirdly[0]}">
              <p class="first">{{list.thirdly[0]}}</p>
              <p class="second">{{list.thirdly[1]}}</p>
              <p class="keepInfo" :class="list.thirdly[3]">
                <span>{{list.thirdly[2]}}</span>
              </p>
            </li>
            <li class="item" :class="{'bg':list.fourthly[0]}">
              <p class="first">{{list.fourthly[0]}}</p>
              <p class="second">{{list.fourthly[1]}}</p>
              <p class="keepInfo" :class="list.fourthly[3]">
                <span>{{list.fourthly[2]}}</span>
              </p>
            </li>
            <li class="item" :class="{'bg':list.fifth[0]}">
              <p class="first">{{list.fifth[0]}}</p>
              <p class="second">{{list.fifth[1]}}</p>
              <p class="keepInfo" :class="list.fifth[3]">
                <span>{{list.fifth[2]}}</span>
              </p>
            </li>
            <li class="item" :class="{'bg':list.sixth[0]}">
              <p class="first">{{list.sixth[0]}}</p>
              <p class="second">{{list.sixth[1]}}</p>
              <p class="keepInfo" :class="list.sixth[3]">
                <span>{{list.sixth[2]}}</span>
              </p>
            </li>
            <li class="item" :class="{'bg':list.seventh[0]}">
              <p class="first">{{list.seventh[0]}}</p>
              <p class="second">{{list.seventh[1]}}</p>
              <p class="keepInfo" :class="list.seventh[3]">
                <span>{{list.seventh[2]}}</span>
              </p>
            </li>
            <li class="item" :class="{'bg':list.eighth[0]}">
              <p class="first">{{list.eighth[0]}}</p>
              <p class="second">{{list.eighth[1]}}</p>
              <p class="keepInfo" :class="list.eighth[3]">
                <span>{{list.eighth[2]}}</span>
              </p>
            </li>
            <li class="item" :class="{'bg':list.ninth[0]}">
              <p class="first">{{list.ninth[0]}}</p>
              <p class="second">{{list.ninth[1]}}</p>
              <p class="keepInfo" :class="list.ninth[3]">
                <span>{{list.ninth[2]}}</span>
              </p>
            </li>
            <li class="item" :class="{'bg':list.tenth[0]}">
              <p class="first">{{list.tenth[0]}}</p>
              <p class="second">{{list.tenth[1]}}</p>
              <p class="keepInfo" :class="list.tenth[3]">
                <span>{{list.tenth[2]}}</span>
              </p>
            </li>
          </ul>
        </div>
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
  name: "keepTime",
  data() {
    return {
      linkActive: 2,
      myTimeTableList: [],
      filterList: [],
      //周次
      week: "",
      //课程
      class_filter: ""
    };
  },
  components: {
    Menu
  },
  mounted: function() {
    //修改页面title
    document.title = "考勤查询";
    //判断登录状态
    if (!localStorage.getItem("userToken")) {
      //跳转到登录页
      this.$router.push({ path: "/pages/Login" });
    } else {
      let that = this;
      //获取课表信息
      function myTimeTableList() {
        return that.$http.get("./static/mock/keepTime.json");
      }
      //获取筛选数据
      function filterList() {
        return that.$http.get("./static/mock/filterList.json");
      }

      that.$http.all([myTimeTableList(), filterList()]).then(
        that.$http.spread(function(my_timeTable, filter_list) {
          // 两个请求现在都执行完成
          that.myTimeTableList = my_timeTable.data;
          for (let i = 0; i < my_timeTable.data.length; i++) {
            for (let key in my_timeTable.data[i]) {
              if (
                my_timeTable.data[i][key][2] &&
                my_timeTable.data[i][key][2] == "请假"
              ) {
                that.myTimeTableList[i][key].push("keepInfo-leave");
              } else if (
                my_timeTable.data[i][key][2] &&
                my_timeTable.data[i][key][2] == "旷课"
              ) {
                that.myTimeTableList[i][key].push("keepInfo-kuangke");
              } else if (
                my_timeTable.data[i][key][2] &&
                my_timeTable.data[i][key][2] == "正常"
              ) {
                that.myTimeTableList[i][key].push("keepInfo-normal");
              }
            }
            //
          }
          that.filterList = filter_list.data;
          that.week = that.filterList.week;
          that.class_filter = that.filterList.class;
        })
      );
    }
  },
  methods: {
    weekChange() {},
    classChange() {},
    //筛选课表ajax
    timetable_filter() {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.keepTime {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 2rem;
  .filter {
    width: 100%;
    height: 1.75rem;
    background: #808080;
    overflow: hidden;
    position: relative;
    z-index: 999;
    .width-1 {
      width: 7.25rem;
      height: 100%;
      text-align: center;
      margin-left: 2.5rem;
      span {
        color: #fff;
        font-size: 0.6rem;
        line-height: 1.75rem;
      }
    }
    .width-2 {
      width: 3.75rem;
      height: 100%;
      position: relative;
      .week-picker {
        width: 100%;
        height: 100%;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }
      .week-simulation {
        color: #fff;
        font-size: 0.6rem;
        white-space: nowrap;
        line-height: 1.75rem;
        margin-left: 0.5rem;
      }
      .icon-down {
        color: #fff;
        line-height: 1.75rem;
        margin-left: 0.2rem;
      }
    }
  }
  .timetable {
    width: 100%;
    background: #fff;
    .header {
      width: 100%;
      height: 2.25rem;
      box-shadow: 0 0.05rem 0.3rem rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 998;
    }
    .container {
      width: 100%;
      background: #5d5d5d;
      margin-top: -2.25rem;
      overflow: hidden;
      .overflow-container {
        width: 21.6rem;
        overflow-x: scroll;
        &::after {
          content: "";
          display: block;
          visibility: hidden;
          clear: both;
        }
        .list-item {
          width: 2.8rem;
          &:first-child {
            width: 2rem;
            background: #f2f2f2;
            .item {
              text-align: center;
              padding: 0;
              font-size: 0.6rem;
              .first {
                color: #b3b3b3;
                font-size: 0.55rem;
                margin-top: 1.1rem;
              }
              .second {
                margin-top: 0.2rem;
              }
            }
            .bg {
              color: #b3b3b3;
              background: #f2f2f2;
            }
          }
          &:nth-child(3) {
            .bg {
              background: #808080;
            }
          }
          &:nth-child(5) {
            .bg {
              background: #808080;
            }
          }
          .item {
            width: 100%;
            height: 3.75rem;
            border-bottom: 1px solid #9f9fa0;
            border-right: 1px solid #9f9fa0;
            font-size: 0.47rem;
            padding: 0.2rem;
            overflow: hidden;
            color: #808080;
            position: relative;
            &:first-child {
              height: 2.25rem;
              border-bottom: 0 solid #9f9fa0;
              border-right: 0 solid #9f9fa0;
              background: #fff;
              padding: 0;
              font-size: 0.6rem;
            }
            &:last-child {
              border-bottom: 0 solid #9f9fa0;
            }
            .week {
              margin-top: 0.4rem;
            }
            .week-date {
              font-size: 0.45rem;
              margin-top: 0.1rem;
              color: #bebebe;
            }
          }
          .keepInfo {
            width: 100%;
            height: 0.8rem;
            text-align: center;
            position: absolute;
            left: 0;
            bottom: 0;
            span {
              line-height: 0.8rem;
            }
          }
          .keepInfo-normal {
            background: #cce198;
            color: #36ae4a;
          }
          .keepInfo-leave {
            background: #facc88;
            color: #eb5a28;
          }
          .keepInfo-kuangke {
            background: #e71b23;
          }
          .item-header {
            text-align: center;
          }
          .bg {
            color: #fff;
            background: #b3b3b3;
          }
        }
      }
    }
  }
}
</style>
