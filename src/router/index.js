import Vue from 'vue'
import Router from 'vue-router'
import Job from '@/components/Job'
import JobInfo from '@/components/JobInfo'
import Sou from '@/components/Sou'
import City from '@/components/JobSearchChildren/CitySelector'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '职位搜索',
      component: Sou
    }
    ,
    {
      path: '/job',
      name: '职位列表',
      component: Job
    },
    {
      path: '/jobinfo',
      name: '职位详情',
      component: JobInfo
    },
    {
      path:'/city',
      component:City
    }
  ]
})
