export default {
	path: 'codegroup',
	name: 'system-codegroup',
	meta: {
		icon: 'ios-stats',
		title: 'CODEGROUP'
	},
	component: () => import(/* webpackChunkName: 'system' */ '@/view/system/codegroup.vue')
}
