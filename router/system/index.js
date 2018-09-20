import Main from '@/view/main'
import roleRouter from './roleRouter'
import codeRouter from './codeRouter'
import codegroupRouter from './codegroupRouter'
import menuRouter from './menuRouter'
import userRouter from './userRouter'
import resourceRouter from './resourceRouter'
import permissionRouter from './permissionRouter'
import smsConfigRouter from './smsConfigRouter'
import smsVerifyRouter from './smsVerifyRouter'
import ParameterRouter from './ParameterRouter'
import emailConfigRouter from './emailConfigRouter'
import emailTemplateRouter from './emailTemplateRouter'
// *** insert import here *** // // don't change this line

export default {
	path: '/system',
	name: 'system',
	component: Main,
	children: [
		roleRouter,
		codeRouter,
		codegroupRouter,
		menuRouter,
		userRouter,
		resourceRouter,
		permissionRouter,
		smsConfigRouter,
		smsVerifyRouter,
		ParameterRouter,
		emailConfigRouter,
		emailTemplateRouter,
		// *** insert router here *** // // don't change this line

	]
}
