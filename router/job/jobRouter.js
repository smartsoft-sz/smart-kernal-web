export default {
  path:'job',
  name:'job_job',
  meta: {
    icon: 'ios-stats',
    title: 'JOB'
  },
  component: () => import(/* webpackChunkName: 'system' */ '@/view/job/job.vue')
}