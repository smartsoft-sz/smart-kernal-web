export default {
	path: 'menu',
	name: 'system-menu',
	meta: {
		icon: 'ios-stats',
		title: 'MENU'
	},
	component: () => import(/* webpackChunkName: 'system' */ '@/view/system/menu.vue')
}
