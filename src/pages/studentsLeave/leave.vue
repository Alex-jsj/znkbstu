/*
 * @Author: Alex chenzeyongjsj@163.com 
 * @Date: 2018-03-12 10:06:43 
 * @Last Modified by: Alex chenzeyongjsj@163.com
 * @Last Modified time: 2018-03-22 16:42:54
 */

<template>
  <div class="leave">
    <ul class="title-switch">
      <li v-for="(item,index) in switchList" :key="item.id" class="float-left">
        <router-link :to="item.url">
          <p class="float-left switch-text">{{item.title}}</p>
        </router-link>
      </li>
    </ul>
    <!-- view -->
    <router-view></router-view>
    <!-- 底部菜单 -->
    <Menu :linkActive="linkActive"></Menu>
  </div>
</template>
<script>
//引入loading组件
import Menu from "@/components/Menu";
export default {
  name: "leave",
  data() {
    return {
      linkActive: 3, //菜单定位
      switchList: [
        {
          title: "请假",
          url: "/pages/studentsLeave/leave/leaveApply"
        },
        {
          title: "补假",
          url: "/pages/studentsLeave/leave/leaveRepair"
        },
        {
          title: "记录",
          url: "/pages/studentsLeave/leave/leaveList"
        }
      ]
    };
  },
  components: {
    Menu
  },
  mounted: function() {
    //修改页面title
    document.title = "我要请假";
    //判断登录状态
    if (!localStorage.getItem("userToken")) {
      //跳转到登录页
      this.$router.push({ path: "/pages/Login" });
    }
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.leave {
  width: 100%;
  padding-bottom: 2rem;
  padding-top: 1.75rem;
}
.title-switch {
  width: 100%;
  height: 1.75rem;
  background: #fff;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  > li {
    width: 5.33rem;
    height: 100%;
  }
  .switch-text {
    display: block;
    width: 5.33rem;
    line-height: 1.75rem;
    text-align: center;
    font-size: 0.65rem;
    color: #808080;
    letter-spacing: 0.05rem;
    position: relative;
    &::after {
      content: "";
      display: none;
      width: 100%;
      height: 0.08rem;
      background: #cb121b;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
  .router-link-exact-active.router-link-active {
    .switch-text {
      color: #cb121b;
      &::after {
        display: block;
      }
    }
  }
}
</style>
