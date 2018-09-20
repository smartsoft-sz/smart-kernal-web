export default {
	path: 'role',
	name: 'system-role',
	meta: {
		icon: 'ios-stats',
		title: 'ROLE'
	},
	component: () => import(/* webpackChunkName: 'system' */ '@/view/system/role.vue')
}
