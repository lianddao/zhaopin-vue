import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Job from '@/components/Job'
import JobInfo from '@/components/JobInfo'
import Sou from '@/components/Sou'
import JobType from '@/components/JobType'
import HangYeSelector from '@/components/JobSearchChildren/HangYeSelector'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
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
      path: '/sou',
      component: Sou
    },
    {
      path: '/jobtype',
      component: JobType
    },
    {
      path: '/hangye',
      component: HangYeSelector
    }
  ]
})
