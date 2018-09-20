export default {
  path:'jobRun',
  name:'job_jobRun',
  meta: {
    icon: 'ios-stats',
    title: 'JOBRUN'
  },
  component: () => import(/* webpackChunkName: 'system' */ '@/view/job/jobRun.vue')
}