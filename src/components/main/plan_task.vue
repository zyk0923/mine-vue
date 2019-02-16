<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>今日任务</span>
				<el-button style="float: right; padding: 3px 0" type="text">关闭</el-button>
			</div>
			<div v-for="o in taskList" :key="o" class="text item">
				{{ o.task_name }}
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				taskList:[]
			}
		},
		methods: {
			searchTask:function(){
				this.searchData(this.GLOBAL.sPath.task.getTodayTask, null).then(res=>{
					this.taskList = res;
				});
			}
		},
		mounted(){
			this.searchTask();
		}
	}
</script>

<style>
</style>
