/*
 * @Author: Alex chenzeyongjsj@163.com 
 * @Date: 2018-03-05 16:43:42 
 * @Last Modified by: Alex chenzeyongjsj@163.com
 * @Last Modified time: 2018-03-22 14:22:53
 */

<template>
  <div class="myTimetable">
    <mt-spinner type="triple-bounce" class="loading" :class="{'loading-show':!page_loading}"></mt-spinner>
    <!-- 筛选 -->
    <div class="filter">
      <!-- 年度学期 -->
      <div>
        <div class="float-left width-1">
          <span>{{semester}}</span>
        </div>
        <div class="float-left width-2" v-if="week_show">
          <select class="week-picker" v-model="week" @change="weekChange()">
            <option v-for="item in weekList" :key="item.id" :value="item">{{item.title}}</option>
          </select>
          <span class="float-left week-simulation">{{week.title}}</span>
          <i class="float-left iconfont icon-down"></i>
        </div>
      </div>
    </div>
    <!-- 课表 -->
    <div class="timetable">
      <div class="header"></div>
      <div class="container">
        <!-- 上课时间 -->
        <ol class="class-time">
          <li v-for="(item,index) in class_time" :key="item.id">
            <p class="time start">{{item.start}}</p>
            <span>{{index}}</span>
            <p class="time end">{{item.end}}</p>
          </li>
        </ol>
        <!-- 课表 -->
        <div class="overflow-container">
          <ul class="list-item float-left" v-for="(list,index) in myTimeTableList" :key="list.id">
            <li class="item item-header" :class="{'weeks-show':list.weeks_show}">
              <p class="week">{{list.weeks}}</p>
              <p class="week-date">{{list.date}}</p>
            </li>
            <li class="item" v-for="list in 10"></li>
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
import { MessageBox, Toast } from "mint-ui";
import Menu from "@/components/Menu";
import qs from "qs"; //序列化
export default {
  name: "myTimetable",
  data() {
    return {
      linkActive: 2,
      page_loading: true,
      myTimeTableList: [],
      class_time: [], //上课时间
      semester: "", //学期
      weekList: [], //总周次
      week_today: "", //当前周次
      week: "", //当前周次
      week_show: false //当前周次
    };
  },
  components: {
    Menu
  },
  mounted: function() {
    //修改页面title
    document.title = "考勤查询";
    let defaul = "";
    this.timeTableAjax(defaul);
  },
  methods: {
    weekChange() {
      let father_dom = document.getElementsByClassName("overflow-container")[0];
      let child_dom = document.getElementsByClassName("class-table");
      //切换周次的时候移除之前的课表
      for (let i = 0; i < child_dom.length; i++) {
        child_dom[i].parentNode.removeChild(child_dom[i]);
      }
      this.timeTableAjax(this.week.value + 1);
    },
    //课表ajax
    timeTableAjax(cycle_week) {
      let that = this;
      //重置数据
      that.myTimeTableList = [];
      that.class_time = [];
      that.semester = "";
      that.weekList = [];
      that.week_show = false;
      that.page_loading = true;
      //先判断登录是否过期
      that
        .$http({
          method: "get",
          url: "/Home/Verify/index?token=" + localStorage.getItem("userToken")
        })
        .then(response => {
          if (response.data.verify) {
            //登录未过期 => 获取用户数据
            that
              .$http({
                method: "post",
                url: "/Home/Index/schedule",
                data: qs.stringify({
                  student_num: localStorage.getItem("student_num"),
                  cycle: cycle_week
                })
              })
              .then(response => {
                let res = response.data.data;
                //如果有课
                if (res) {
                  //顶部学期/周次
                  that.semester = res[0].school_year;
                  //添加本学期所有周次
                  for (let k = 0; k < res[0].week; k++) {
                    that.weekList.push({
                      title: "第" + (k + 1) + "周",
                      value: k
                    });
                  }
                  //显示当前周次
                  that.week = that.weekList[parseInt(res[0].cycle) - 1];
                  that.week_show = true;
                  //处理上课时间
                  for (let b = 0; b < response.data.section.length; b++) {
                    that.class_time.push({
                      start: response.data.section[b].time.split("-")[0],
                      end: response.data.section[b].time.split("-")[1]
                    });
                  }
                  that.class_time.unshift({}); //向头部压入一个空元素占位
                  //处理课表
                  that.myTimeTableList = res;
                  //循环一周七天课程数据
                  for (let i = 0; i < res.length; i++) {
                    if (that.myTimeTableList[i].first_course) {
                      show_timetable("first", 0, i);
                    }
                    if (that.myTimeTableList[i].second_course) {
                      show_timetable("second", 1, i);
                    }
                    if (that.myTimeTableList[i].thirdly_course) {
                      show_timetable("thirdly", 2, i);
                    }
                    if (that.myTimeTableList[i].fourthly_course) {
                      show_timetable("fourthly", 3, i);
                    }
                    if (that.myTimeTableList[i].fifth_course) {
                      show_timetable("fifth", 4, i);
                    }
                    if (that.myTimeTableList[i].sixth_course) {
                      show_timetable("sixth", 5, i);
                    }
                    if (that.myTimeTableList[i].seventh_course) {
                      show_timetable("seventh", 6, i);
                    }
                    if (that.myTimeTableList[i].eighth_course) {
                      show_timetable("eighth", 7, i);
                    }
                    if (that.myTimeTableList[i].ninth_course) {
                      show_timetable("ninth", 8, i);
                    }
                    if (that.myTimeTableList[i].tenth_course) {
                      show_timetable("tenth", 9, i);
                    }
                  }
                  //渲染课程
                  function show_timetable(txt, start_time, day) {
                    let course = txt + "_course";
                    let classroom = txt + "_classroom";
                    let teacher = txt + "_teacher";
                    let key = that.myTimeTableList[day][course];
                    let div = document.createElement("div");
                    div.className = "class-table";
                    let p1 = document.createElement("p");
                    let p2 = document.createElement("p");
                    let p3 = document.createElement("p");
                    let bg1 = "#b3b3b3";
                    let bg2 = "#808080";
                    let bg;
                    parseInt(day) % 2 == 0 ? (bg = bg1) : (bg = bg2);
                    let style =
                      "width:2.8rem;height:" +
                      3.75 * that.myTimeTableList[day].count[key] +
                      "rem;position:absolute;top:" +
                      (3.75 * start_time + 2.25) +
                      "rem;left:" +
                      2.8 * day +
                      "rem;background:" +
                      bg +
                      ";padding:0.35rem;border-right:1px solid #9f9fa0;border-bottom:1px solid #9f9fa0;";
                    let style_p =
                      "font-size:0.47rem;color:#fff;margin-bottom:0.2rem;";
                    div.setAttribute("style", style);
                    p1.innerHTML = that.myTimeTableList[day][course];
                    p2.innerHTML = that.myTimeTableList[day][classroom];
                    p3.innerHTML = that.myTimeTableList[day][teacher];
                    p1.setAttribute("style", style_p);
                    p2.setAttribute("style", style_p);
                    p3.setAttribute("style", style_p);
                    let con = document.getElementsByClassName(
                      "overflow-container"
                    )[0];
                    div.appendChild(p1);
                    div.appendChild(p2);
                    div.appendChild(p3);
                    con.appendChild(div);
                  }
                  //比较时间，当前日高亮
                  let date_now = new Date();
                  let this_day = date_now.getDay(); //获取今日是周几
                  let this_year = date_now.getFullYear();
                  let this_month = date_now.getMonth() + 1;
                  let this_date = date_now.getDate();
                  let timer = new Date(that.myTimeTableList[this_day - 1].time);
                  let that_year = timer.getFullYear();
                  let that_month = timer.getMonth() + 1;
                  let that_date = timer.getDate();
                  //日期匹配上则高亮
                  if (
                    this_year == that_year &&
                    this_month == that_month &&
                    this_date == that_date
                  ) {
                    that.myTimeTableList[this_day - 1].weeks_show = true;
                  }
                } else {
                  let instance = Toast("无当前日期课表信息");
                  setTimeout(() => {
                    instance.close();
                    location.reload();
                  }, 1000);
                }
                that.page_loading = false;
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
          alert("网络错误");
          console.log(error);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.myTimetable {
  width: 100%;
  min-height: 100vh;
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
  .filter {
    width: 100%;
    height: 1.75rem;
    background: #808080;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    > div {
      width: 11rem;
      margin: 0 auto;
    }
    .width-1 {
      width: 7.25rem;
      height: 100%;
      text-align: center;
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
    padding-top: 1.75rem;
    .header {
      width: 21.6rem;
      height: 2.25rem;
      box-shadow: 0 0.05rem 0.3rem rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 998;
    }
    .container {
      width: 100%;
      margin-top: -2.25rem;
      // overflow: hidden;
      .class-time {
        width: 2rem;
        background: #f2f2f2;
        position: absolute;
        top: 1.75rem;
        left: 0;
        > li {
          width: 100%;
          height: 3.75rem;
          border-bottom: 1px solid #9f9fa0;
          text-align: center;
          overflow: hidden;
          position: relative;
          &:first-child {
            height: 2.25rem;
            background: #fff;
            border-bottom: 0 solid #9f9fa0;
            > span {
              display: none;
            }
          }
          &:last-child {
            border-bottom: 0 solid #9f9fa0;
          }
          > span {
            display: block;
            font-size: 0.55rem;
            position: absolute;
            left: 50%;
            top: 47%;
            transform: translate(-50%, -50%);
            color: #808080;
          }
          .time {
            font-size: 0.5rem;
            color: #b3b3b3;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }
          .start {
            top: 0.6rem;
          }
          .end {
            bottom: 0.7rem;
          }
        }
      }
      .overflow-container {
        width: 19.6rem;
        background: #5d5d5d;
        margin-left: 2rem;
        position: relative;
        overflow: hidden;
        &::after {
          content: "";
          display: block;
          visibility: hidden;
          clear: both;
        }
        .list-item {
          width: 2.8rem;
          &:nth-child(2) {
            .bg {
              background: #808080;
            }
          }
          &:nth-child(4) {
            .bg {
              background: #808080;
            }
          }
          &:nth-child(6) {
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
            &:first-child {
              height: 2.25rem;
              border-bottom: 0 solid #9f9fa0;
              border-right: 0 solid #9f9fa0;
              background: #fff;
              padding: 0;
              font-size: 0.55rem;
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
          .item-header {
            text-align: center;
          }
          .weeks-show p {
            color: #cb121b !important;
          }
          .bg {
            color: #fff;
            background: #b3b3b3;
            // border-bottom: 1px solid #b3b3b3;
          }
        }
      }
    }
  }
}
</style>
