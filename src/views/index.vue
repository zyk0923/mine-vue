<template>
	<div>
		<el-menu class="el-menu-demo" mode="horizontal" router>
			<el-menu-item index="1" disabled>账本</el-menu-item>
			<el-submenu index="2">
				<template slot="title">备忘录</template>
				<el-menu-item index="/plan">普通日记</el-menu-item>
				<el-menu-item index="/task">日常任务</el-menu-item>
			</el-submenu>
			<el-menu-item index="editor" >私人百科</el-menu-item>
			<el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
		</el-menu>
		<router-view></router-view>
	</div>

</template>

<script>
</script>

<style>
</style>
