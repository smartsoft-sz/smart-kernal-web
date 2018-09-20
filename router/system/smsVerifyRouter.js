export default {
	path: 'smsVerify',
	name: 'system-smsVerify',
	meta: {
		icon: 'ios-stats',
		title: 'SMSVERIFY'
	},
	component: () => import(/* webpackChunkName: 'system' */ '@/view/system/smsVerify.vue')
}
