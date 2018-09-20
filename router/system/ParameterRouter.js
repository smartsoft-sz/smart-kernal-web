export default {
	path: 'Parameter',
	name: 'system-Parameter',
	meta: {
		icon: 'ios-stats',
		title: 'PARAMETER'
	},
	component: () => import(/* webpackChunkName: 'system' */ '@/view/system/Parameter.vue')
}
