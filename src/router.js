import Vue from 'vue'
import Router from 'vue-router'
import Plan from './views/program/plan.vue'
import Task from './views/program/task.vue'
import Index from './views/index.vue'
import PT from './components/main/plan_task.vue'
import Editor from './components/tool/editor.vue'
import Main from './views/main.vue'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/plan',
		name: 'plan',
		component: Plan
	}, {
		path: '/task',
		name: 'Task',
		component: Task
	}, {
		path: '/editor',
		name: 'home',
		component: Editor
	}, {
		path: '/',
		name: 'main',
		component: Main
	}, {
		path: '/encyMenu',
		name: 'encyMenu',
		component: () => import('./components/ency/encyMenu.vue')
	}, {
		path: '/ency',
		name: 'ency',
		component: () => import('./views/ency/encyInquiry.vue')
	}, {
		path: '/expenditure',
		name: 'expenditure',
		component: () => import('./views/account/expenditure.vue')
	}, {
		path: '/encyLabel',
		name: 'encyLabel',
		component: () => import('./views/ency/encyLabel.vue')
	}]
})
