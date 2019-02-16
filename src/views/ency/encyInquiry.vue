<template>
	<div>
		<el-row class="warp">
			<el-col :span="24" class="toolbar" style="padding-top: 0px;">
				<el-form :inline="true" style="float: left;">
					<el-form-item>
						<el-input  v-model="input" placeholder="请输入内容"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="search">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				input: ''
			}
		},
		methods: {
			search() {
				this.searchData(this.GLOBAL.encyInfo.list,this.input).then(res =>{
					if(res.obj.length == 1){
						
					}
				});
			}
		}
	}
</script>

<style>
</style>
