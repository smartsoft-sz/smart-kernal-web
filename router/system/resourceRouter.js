export default {
	path: 'resource',
	name: 'system-resource',
	meta: {
		icon: 'ios-stats',
		title: 'RESOURCE'
	},
	component: () => import(/* webpackChunkName: 'system' */ '@/view/system/resource.vue')
}
