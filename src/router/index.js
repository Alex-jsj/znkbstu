/*
 * @Author: Alex chenzeyongjsj@163.com 
 * @Date: 2018-02-28 16:43:09 
 * @Last Modified by: Alex chenzeyongjsj@163.com
 * @Last Modified time: 2018-03-23 16:02:55
 */
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login' //登录页
import Home from '@/pages/Home' //首页
import myTimetable from '@/pages/myTimetable' //学生课表
import keepTime from '@/pages/keepTime' //考勤查询
import messageNotification from '@/pages/message/messageNotification' //消息通知
import messageInfo from '@/pages/message/messageInfo' //消息通知
import leave from '@/pages/studentsLeave/leave' //请假
import leaveList from '@/pages/studentsLeave/leaveList' //请假记录
import leaveApply from '@/pages/studentsLeave/leaveApply' //请假
import leaveRepair from '@/pages/studentsLeave/leaveRepair' //补假
import leaveInfo from '@/pages/studentsLeave/leaveInfo' //请假详情页
import appeal from '@/pages/appeal/appeal' //申诉
import appealList from '@/pages/appeal/appealList' //申诉记录
import appealApply from '@/pages/appeal/appealApply' //申诉
import appealInfo from '@/pages/appeal/appealInfo' //申诉详情页

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            component: Home
        },
        {
            path: '/pages/Home',
            component: Home
        },
        {
            path: '/pages/Login',
            component: Login
        },
        {
            path: '/pages/myTimetable',
            component: myTimetable
        },
        {
            path: '/pages/keepTime',
            component: keepTime
        },
        {
            path: '/pages/message/messageNotification',
            component: messageNotification,
        },
        {
            path: '/pages/message/messageInfo',
            component: messageInfo,
        },
        {
            path: '/pages/studentsLeave/leave',
            component: leave,
            children: [{
                    path: '/',
                    redirect: 'leaveApply',
                    component: leaveApply
                },
                {
                    path: 'leaveList',
                    component: leaveList
                },
                {
                    path: 'leaveApply',
                    component: leaveApply
                },
                {
                    path: 'leaveRepair',
                    component: leaveRepair
                },
            ]
        },
        {
            path: '/pages/appeal/appeal',
            component: appeal,
            children: [{
                    path: '/',
                    redirect: 'appealApply',
                    component: appealApply
                },
                {
                    path: 'appealList',
                    component: appealList
                },
                {
                    path: 'appealApply',
                    component: appealApply
                }
            ]
        },
        {
            path: '/pages/studentsLeave/leaveInfo',
            component: leaveInfo,
        },
        {
            path: '/pages/appeal/appealInfo',
            component: appealInfo,
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
