export default {
	path: 'smsConfig',
	name: 'system-smsConfig',
	meta: {
		icon: 'ios-stats',
		title: 'SMSCONFIG'
	},
	component: () => import(/* webpackChunkName: 'system' */ '@/view/system/smsConfig.vue')
}
