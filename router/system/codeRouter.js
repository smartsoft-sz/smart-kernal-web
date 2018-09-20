export default {
	path: 'code',
	name: 'system-code',
	meta: {
		icon: 'ios-stats',
		title: 'CODE'
	},
	component: () => import(/* webpackChunkName: 'system' */ '@/view/system/code.vue')
}
