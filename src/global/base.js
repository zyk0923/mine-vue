import Vue from 'vue'
import axios from 'axios'
axios.defaults.withCredentials = true

function getShowValue(array, data, val) {
	for (let i = 0; i < data.length; i++) {
		if (val == data[i].id) {
			array.push(val);
			return true;
		} else if (data[i].children != null &&
			data[i].children.length > 0 &&
			getShowValue(array, data[i].children, val)) {
			array.push(data[i].id);
			return true;
		}
	}
	return false;
}

export default {
	install: function(Vue, options) {
		Vue.prototype.insertOrUpdate = function(sendUrl, param) {
				return axios.post(sendUrl, param).then(res => {
					if (res.data.status) {
						this.$message({
							message: '成功',
							type: 'success'
						});
					} else {
						this.$message({
							message: res.data.errMsg,
							type: 'error'
						});
					}
				}).catch((err) => {
					this.$router.push('/');
					this.$message({
						message: '传输出现异常，请刷新后再次尝试，如再有问题请联系管理员',
						type: 'error'
					});
				});
			},
			Vue.prototype.searchData = function(sendUrl, param) {
				return axios.post(sendUrl, param).then(res => {
					if (res.data.status) {
						return res.data.obj;
					} else {
						this.$message({
							message: res.data.errMsg,
							type: 'error'
						});
					}
				}).catch((err) => {
					this.$router.push('/');
					this.$message({
						message: '传输出现异常，请刷新后再次尝试，如再有问题请联系管理员',
						type: 'error'
					});
				});
			},
			Vue.prototype.deleteData = function(sendUrl, param) {
				return this.$confirm('是否删除所选数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					return axios.post(sendUrl, param).then(res => {
						if (res.data.status) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
						} else {
							this.$message({
								message: res.data.errMsg,
								type: 'error'
							});
						}
					}).catch((err) => {
						this.$router.push('/');
						this.$message({
							message: '传输出现异常，请刷新后再次尝试，如再有问题请联系管理员',
							type: 'error'
						});
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			Vue.prototype.userlogin = function(sendUrl, param) {
				return axios.post(sendUrl, param).catch((err) => {
					this.$router.push('/');
					this.$message({
						message: '传输出现异常，请刷新后再次尝试，如再有问题请联系管理员',
						type: 'error'
					});
				});
			},
			//将存储值转换为显示值
			Vue.prototype.valueToShow = function(val, tree) {
				let show = [];
				getShowValue(show, tree, val);
				show.reverse();
				return show;
			},
			//将父级菜单显示的值转为存储值
			Vue.prototype.showToValue = function(val) {
				return val[val.length - 1];
			},
			//递归去除树的最后children，目的是下拉不出现空白页
			Vue.prototype.deleteLastChildren = function(list) {
				for (let val = 0; val < list.length; val++) {
					if (list[val].children.length == 0) {
						list[val].children = null;
					} else {
						this.deleteLastChildren(list[val].children);
					}
				}
			}
	}


}
