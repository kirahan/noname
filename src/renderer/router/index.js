import Vue from 'vue'
import Router from 'vue-router'

import danmu from '../pages/danmu'
import onvif from  '../pages/onvif'
import gamepad from  '../components/gamepad'
import control from  '../components/control'
import backend from  '../components/backend'

Vue.use(Router)


var router = new Router({
     routes: [
         {
             path: '/',
             name: 'danmu',
             component: danmu,
             meta:{
                 title: '弹幕'
             }
         },
         {
             path: '/onvif',
             name: 'onvif',
             component: onvif
         },
         {
             path: '/gamepad',
             name: 'gamepad',
             component: gamepad
         },
         {
             path: '/control',
             name: 'control',
             component: control,
             meta : {
                 title : '舞台'
             }
         },
         {
             path: '/backend',
             name: 'backend',
             component: backend,
             meta:{
                 title : '控制板'
             }
         },
         {
             path: '/config',
             name: 'landing-page',
             component: require('@/components/LandingPage').default
         },
         {
             path: '*',
             redirect: '/'
         }
     ]
 })

export default router
