<template>
	<el-row class="warp">

		<el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中" style="padding-top: 10px;">
			<!--工具条-->
			<el-card shadow="hover" style="padding-bottom: 0px;">
				<el-col :span="24" class="toolbar" style="padding-top: 0px;">
					<el-form :inline="true" :model="filters" size="mini" style="float: left;">
						<el-form-item>
							<el-input v-model="filters.info_name" placeholder="名称" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleSearch">查询</el-button>
							<el-button type="error" @click="handleClear">清空</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-card>

			<!--列表-->
			<el-card shadow="hover" class="card2">
				<el-table :data="info" highlight-current-row max-height="500" size="mini" v-loading="loading" @selection-change="selsChange"
				 style="width: 100%;">>
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column type="index" span="3">
					</el-table-column>
					<el-table-column prop="info_name" label="名称" span="6">
					</el-table-column>
					<el-table-column prop="info_remark" label="简要说明" span="6">
					</el-table-column>

					<el-table-column fixed="right" label="操作" width="150px">
						<template slot-scope="scope">
							<el-button size="mini" @click="showUpdateDialog(scope.$index, scope.row)">进入词条</el-button>
							<el-button size="mini" @click="showUpdateDialog(scope.$index, scope.row)">编辑</el-button>
							<el-button size="mini" type="danger" @click="deleteObj(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<!-- 分页标签-->

				<div class="block" style="float:initial;">
					<el-button-group style="float:left;">
						<el-button type="primary" @click="showAddDialog" size="mini">新增</el-button>
						<el-button type="danger" @click="batchdeleteObj" size="mini" :disabled="this.info.length===0">批量删除</el-button>
					</el-button-group>
					<el-pagination :page-sizes="[10, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
					 :current-page="pageNo" :total="total" style="float:right;" @current-change="handleCurrentChange" @size-change="handleSizeChange">
					</el-pagination>
				</div>
			</el-card>

			<!--新增/修改界面-->
			<el-dialog :title="formtitle" :visible.sync="formVisible" :close-on-click-modal="false">
				<el-form :model="diaForm" label-width="80px" :rules="diaFormRules" ref="diaForm">
					<el-form-item label="名称" prop="info_name">
						<el-input v-model="diaForm.info_name" placeholder="必填" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="简要说明" prop="info_remark">
						<el-input v-model="diaForm.info_remark" placeholder="必填" auto-complete="off"></el-input>
					</el-form-item>
					<!-- <el-form-item label="计划期限" prop="plan_info">
						<el-date-picker v-model="diaForm.plan_date" type="date" placeholder="选择日期">
						</el-date-picker>
					</el-form-item> -->
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
					info_name: ''
				},
				loading: false, //列表是否显示加载
				info: [],
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
					info_name: [{
						required: true,
						message: '请输入计划名称',
						trigger: 'blur'
					}]
				},
				diaForm: {}
			}
		},
		methods: {
			handleClear() {
				this.filters.info_name = '';
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
						info_name: this.filters.info_name
					}
				};
				this.loading = true;
				this.searchData(this.GLOBAL.sPath.encyInfo.listPage, params).then(res => {
					this.loading = false;
					this.total = res.total;
					this.info = res.obj;
				});
			},
			showAddDialog() {
				this.isAdd = true;
				this.formtitle = "添加";
				this.formVisible = true;
				this.diaForm = {
					id: null,
					plan_name: '',
					plan_info: '',
					plan_state: 1
				};
			},
			showUpdateDialog: function(index, row) {
				this.isAdd = false;
				this.formtitle = "修改";
				this.formVisible = true;
				this.diaForm = {
					id: row.id,
					plan_name: row.plan_name,
					plan_info: row.plan_info,
					plan_date: row.plan_date
				};
			},
			//新增及修改
			addorUpdateSubmit: function() {
				this.$refs['diaForm'].validate((valid) => {
					if (valid) {
						let userPath = this.GLOBAL.sPath.plan;
						let adressStr = this.isAdd ? userPath.insert : userPath.update;
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
				this.deleteData(this.GLOBAL.sPath.plan.delete, {
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
				this.deleteData(this.GLOBAL.sPath.plan.deleteAll, this.sels.map(item => item.id))
					.then(() => {
						this.search();
					});
			},
			selsChange: function(sels) {
				this.sels = sels;
			},
			tableRowClassName({row, rowIndex}) {
					return 'success-row';
				if (row.plan_state === 2) {
					console.log(1);
					return 'success-row';
				} else if (row.plan_state != 1) {
					return 'warning-row';
					console.log(2);
				}
					console.log(3);
				return '';
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
