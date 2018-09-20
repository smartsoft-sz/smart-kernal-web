export default {
	path: 'permission',
	name: 'system-permission',
	meta: {
		icon: 'ios-stats',
		title: 'PERMISSION'
	},
	component: () => import(/* webpackChunkName: 'system' */ '@/view/system/permission.vue')
}
