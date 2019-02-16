<template>
	<div>
		<el-menu class="el-menu-demo" router style="width: 20%;">
			<template v-for="(item,index) in labelList">
				<span slot="title">{{item.label_name}}</span>
			</template>
		</el-menu>
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				labelList: []
			}
		},
		methods: {
			getMenuTree: function() {
				this.searchData(this.GLOBAL.sPath.encyLabel.list, {id:''}).then(res => {
					this.labelList = res.obj;
				});
			}
		},
		mounted() {
			this.getMenuTree();
		}
	}
</script>

<style>
</style>
