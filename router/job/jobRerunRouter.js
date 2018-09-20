export default {
  path:'jobRerun',
  name:'job_jobRerun',
  meta: {
    icon: 'ios-stats',
    title: 'JOBRERUN'
  },
  component: () => import(/* webpackChunkName: 'system' */ '@/view/job/jobRerun.vue')
}