import Main from '@/view/main'
import jobRouter from './jobRouter'
import jobRunRouter from './jobRunRouter'
import jobRerunRouter from './jobRerunRouter'

// *** insert import here *** // // don't change this line

export default {
	path: '/job',
	name: 'job',
	component: Main,
	children: [
    jobRouter,
    jobRunRouter,
    jobRerunRouter,
		// *** insert router here *** // // don't change this line

	]
}
