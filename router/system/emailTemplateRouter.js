export default {
	path: 'emailTemplate',
	name: 'system-emailTemplate',
	meta: {
		icon: 'ios-stats',
		title: 'EMAILTEMPLATE'
	},
	component: () => import(/* webpackChunkName: 'system' */ '@/view/system/emailTemplate.vue')
}
