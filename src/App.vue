<template>
	<div id="app">
		<el-menu class="el-menu-demo" mode="horizontal" router>
			<el-menu-item index="/" style="float: right;">首页</el-menu-item>
			<el-menu-item index="expenditure">账本</el-menu-item>
			<el-submenu index="2">
				<template slot="title">备忘录</template>
				<el-menu-item index="plan">普通日记</el-menu-item>
				<el-menu-item index="task">日常任务</el-menu-item>
			</el-submenu>
			<el-submenu index="3">
				<template slot="title">知识库</template>
				<el-menu-item index="encyMenu">浏览</el-menu-item>
				<el-menu-item index="encyLabel">标签管理</el-menu-item>
				<el-menu-item index="ency">词条管理</el-menu-item>
			</el-submenu>
			<el-menu-item index="4"><a href="https://music.163.com/" target="_blank">音乐</a></el-menu-item>
		</el-menu>
		<router-view></router-view>
	</div>
</template>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}

	#nav {
		padding: 30px;
	}

	#nav a {
		font-weight: bold;
		color: #2c3e50;
	}

	#nav a.router-link-exact-active {
		color: #42b983;
	}
</style>
