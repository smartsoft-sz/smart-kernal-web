export default {
	path: 'user',
	name: 'system-user',
	meta: {
		icon: 'ios-stats',
		title: 'USER'
	},
	component: () => import(/* webpackChunkName: 'system' */ '@/view/system/user.vue')
}
