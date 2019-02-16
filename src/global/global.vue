<script>
	const serverSrc = 'http://localhost:8088/';
	const mapServerPath = 'http://localhost:8090/iserver/services/map-China100/rest/maps/China_4326';
	const token = '12345678';
	const hasEnter = false;
	const userSite = "111";

	const sPath = {
		//计划管理
		plan: {
			list: serverSrc + 'plan/list',
			listPage: serverSrc + 'plan/listPage',
			insert: serverSrc + 'plan/insert',
			update: serverSrc + 'plan/update',
			delete: serverSrc + 'plan/delete',
			deleteAll: serverSrc + 'plan/deleteAll',
			getUnfinishedPlan: serverSrc + 'plan/getUnfinishedPlan'
		},
		//任务管理
		task: {
			list: serverSrc + 'task/list',
			listPage: serverSrc + 'task/listPage',
			insert: serverSrc + 'task/insert',
			update: serverSrc + 'task/update',
			delete: serverSrc + 'task/delete',
			deleteAll: serverSrc + 'task/deleteAll',
			getUnfinishedTask: serverSrc + 'task/getUnfinishedTask',
			getTodayTask: serverSrc + 'task/getTodayTask'
		},
		//百科管理
		encyInfo: {
			list: serverSrc + 'encyInfo/list',
			listPage: serverSrc + 'encyInfo/listPage',
			insert: serverSrc + 'encyInfo/insert',
			update: serverSrc + 'encyInfo/update',
			delete: serverSrc + 'encyInfo/delete',
			deleteAll: serverSrc + 'encyInfo/deleteAll'
		},
		//支出管理
		expenditure: {
			list: serverSrc + 'expenditure/list',
			listPage: serverSrc + 'expenditure/listPage',
			insert: serverSrc + 'expenditure/insert',
			update: serverSrc + 'expenditure/update',
			delete: serverSrc + 'expenditure/delete',
			deleteAll: serverSrc + 'expenditure/deleteAll'
		},
		//百科标签管理
		encyLabel: {
			list: serverSrc + 'encyLabel/list',
			listPage: serverSrc + 'encyLabel/listPage',
			insert: serverSrc + 'encyLabel/insert',
			update: serverSrc + 'encyLabel/update',
			delete: serverSrc + 'encyLabel/delete',
			deleteAll: serverSrc + 'encyLabel/deleteAll'
		}
	}
	export default {
		userSite, //用户地址
		token, //用户token身份
		hasEnter, //用户登录状态
		sPath, //后台请求地址
		mapServerPath//地图地址
	}
</script>
