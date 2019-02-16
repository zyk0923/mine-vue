<template>
	<el-row class="warp">
		<el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中" style="padding-top: 10px;">
			<!--工具条-->
			<el-card shadow="hover" style="padding-bottom: 0px;">
				<el-col :span="24" class="toolbar" style="padding-top: 0px;">
					<el-form :inline="true" :model="filters" size="mini" style="float: left;">
						<el-form-item>
							<el-input v-model="filters.task_name" placeholder="任务名称" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="filters.task_info" placeholder="任务内容" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleSearch">查询</el-button>
							<el-button type="error" @click="handleClear">清空</el-button>
						</el-form-item>
						<el-form-item>
							<el-checkbox v-model="filters.task_state">显示已关闭计划</el-checkbox>
						</el-form-item>
					</el-form>
				</el-col>
			</el-card>

			<!--列表-->
			<el-card shadow="hover" class="card2">
				<el-table :data="task" highlight-current-row stripe max-height="500" size="mini" v-loading="loading"
				 @selection-change="selsChange" style="width: 100%;">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column type="index" span="3">
					</el-table-column>
					<el-table-column prop="task_name" label="任务名称" span="3">
					</el-table-column>
					<el-table-column prop="task_info" label="任务详情" span="3">
					</el-table-column>
					<el-table-column prop="time_type" label="任务间隔" span="3">
					</el-table-column>
					<el-table-column prop="complete_count" label="完成次数" span="3">
					</el-table-column>
					<el-table-column prop="forget_count" label="失约次数" span="3">
					</el-table-column>
					<el-table-column prop="record_time" label="本次任务期限" span="3">
					</el-table-column>
					<el-table-column prop="task_state" label="启动状态" span="3">
					</el-table-column>

					<el-table-column fixed="right" label="操作" width="150px">
						<template slot-scope="scope">
							<el-button size="mini" @click="showUpdateDialog(scope.$index, scope.row)">编辑</el-button>
							<el-button size="mini" type="danger" @click="deleteObj(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<!-- 分页标签-->

				<div class="block" style="float:initial;">
					<el-button-group style="float:left;">
						<el-button type="primary" @click="showAddDialog" size="mini">新增</el-button>
						<el-button type="danger" @click="batchdeleteObj" size="mini" :disabled="this.task.length===0">批量删除</el-button>
					</el-button-group>
					<el-pagination :page-sizes="[10, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
					 :current-page="pageNo" :total="total" style="float:right;" @current-change="handleCurrentChange" @size-change="handleSizeChange">
					</el-pagination>
				</div>
			</el-card>

			<!--新增/修改界面-->
			<el-dialog :title="formtitle" :visible.sync="formVisible" :close-on-click-modal="false">
				<el-form :model="diaForm" label-width="80px" :rules="diaFormRules" ref="diaForm">
					<el-form-item label="任务名称" prop="task_name">
						<el-input v-model="diaForm.task_name" placeholder="必填" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="任务详情" prop="task_info">
						<el-input v-model="diaForm.task_info" placeholder="必填" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="任务间隔" prop="time_type">
						<el-select v-model="diaForm.time_type" placeholder="请选择">
							<el-option v-for="item in timeTypes" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="formVisible = false">取消</el-button>
					<el-button type="primary" @click.native="addorUpdateSubmit" :loading="addLoading">提交</el-button>
				</div>
			</el-dialog>

		</el-col>
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
				filters: {
					task_name: '',
					task_info: '',
					task_state: true
				},
				timeTypes: [{
					value: 1,
					label: '一日一次'
				}, {
					value: 2,
					label: '一周一次'
				}, {
					value: 3,
					label: '一月一次'
				}],
				loading: false, //列表是否显示加载
				task: [],
				total: 0,
				pageNo: 1,
				pageSize: 10,
				loading: false,
				isAdd: true, //ture:添加 false:修改
				formtitle: "",
				sels: [], //列表选中列

				//新增相关数据
				formVisible: false, //新增界面是否显示
				addLoading: false,
				diaFormRules: {
					task_name: [{
						required: true,
						message: '请输入任务名称',
						trigger: 'blur'
					}],
					task_info: [{
						required: true,
						message: '请输入任务详情',
						trigger: 'blur'
					}]
					
				},
				diaForm: {
					id: null,
					task_name: '',
					task_info: ''
				}
			}
		},
		methods: {
			handleClear() {
				this.filters.post_name = '';
				this.filters.post_remark = '';

			},
			handleCurrentChange(val) {
				this.pageNo = val;
				this.search();
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.search();
			},
			handleSearch() {
				this.total = 0;
				this.pageNo = 1;
				this.search();
			},
			//获取用户列表
			search: function() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					entity: {
						task_name: this.filters.task_name,
						task_info: this.filters.task_info,
					}
				};
				this.loading = true;
				this.searchData(this.GLOBAL.sPath.task.listPage, params).then(res => {
					this.loading = false;
					this.total = res.obj.length;
					this.task = res.obj;
				});
			},
			showAddDialog() {
				this.isAdd = true;
				this.formtitle = "添加";
				this.formVisible = true;
				this.diaForm = {
					id: null,
					task_name: '',
					task_info: '',
					task_state: 1
				};
			},
			showUpdateDialog: function(index, row) {
				this.isAdd = false;
				this.formtitle = "修改";
				this.formVisible = true;
				this.diaForm = {
					id:row.id,
					task_name:row.task_name,
					task_info:row.task_info,
					time_type:row.time_type
					
				}
			},
			//新增及修改
			addorUpdateSubmit: function() {
				this.$refs['diaForm'].validate((valid) => {
					if (valid) {
						let path = this.GLOBAL.sPath.task;
						let adressStr = this.isAdd ? path.insert : path.update;
						this.addLoading = true;
						this.insertOrUpdate(adressStr, this.diaForm).then(res => {
							this.$refs['diaForm'].resetFields();
							this.formVisible = false;
							this.addLoading = false;
							this.search();
						});
					}
				});
			},
			deleteObj: function(index, row) {
				this.deleteData(this.GLOBAL.sPath.task.delete, {
						id: row.id
					})
					.then(() => {
						this.search();
					});
			},
			batchdeleteObj: function() {
				if (this.sels.length == 0) {
					this.$message({
						type: 'warning',
						message: '未选中数据!'
					});
					return;
				}
				this.deleteData(this.GLOBAL.sPath.task.deleteAll, this.sels.map(item => item.id))
					.then(() => {
						this.search();
					});
			},
			selsChange: function(sels) {
				this.sels = sels;
			}
		},
		mounted() {
			this.handleSearch();
		}
	}
</script>

<style scoped>
	.card2 {
		width: 100%;
		position: absolute;
	}
</style>
