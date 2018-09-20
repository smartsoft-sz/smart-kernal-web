export default {
	path: 'emailConfig',
	name: 'system-emailConfig',
	meta: {
		icon: 'ios-stats',
		title: 'EMAILCONFIG'
	},
	component: () => import(/* webpackChunkName: 'system' */ '@/view/system/emailConfig.vue')
}
