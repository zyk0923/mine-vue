<template>
	<el-row class="warp">

		<el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中" style="padding-top: 10px;">
			<!--工具条-->
			<el-card shadow="hover" style="padding-bottom: 0px;">
				<el-col :span="24" class="toolbar" style="padding-top: 0px;">
					<el-form :inline="true" :model="filters" size="mini" style="float: left;">
						<el-form-item>
							<el-input v-model="filters.expenditure_name" placeholder="名称" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
						</el-form-item>
						<el-form-item>
							<el-select v-model="filters.expenditure_type" placeholder="请选择">
								<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
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
				<el-table :data="expenditure" highlight-current-row max-height="500" size="mini" v-loading="loading"
				 @selection-change="selsChange" style="width: 100%;">>
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column type="index" span="3">
					</el-table-column>
					<el-table-column prop="expenditure_name" label="说明" span="6">
					</el-table-column>
					<el-table-column prop="expenditure_type" label="类型" span="6">
					</el-table-column>
					<el-table-column prop="expenditure_amount" label="金额" span="6">
					</el-table-column>
					<el-table-column prop="expenditure_time" label="记录时间" span="6">
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
						<el-button type="danger" @click="batchdeleteObj" size="mini" :disabled="this.expenditure.length===0">批量删除</el-button>
					</el-button-group>
					<el-pagination :page-sizes="[10, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
					 :current-page="pageNo" :total="total" style="float:right;" @current-change="handleCurrentChange" @size-change="handleSizeChange">
					</el-pagination>
				</div>
			</el-card>

			<!--新增/修改界面-->
			<el-dialog :title="formtitle" :visible.sync="formVisible" :close-on-click-modal="false">
				<el-form :model="diaForm" label-width="80px" :rules="diaFormRules" ref="diaForm">
					<el-form-item label="说明" prop="expenditure_name">
						<el-input v-model="diaForm.expenditure_name" placeholder="必填" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="类型" prop="expenditure_amount">
						<el-select v-model="diaForm.expenditure_type" placeholder="请选择">
							<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="金额" prop="expenditure_amount">
						<el-input v-model="diaForm.expenditure_amount" placeholder="必填" auto-complete="off"></el-input>
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
				typeList: [{
					value: 1,
					label: '饮食'
				}, {
					value: 2,
					label: '交通'
				}, {
					value: 3,
					label: '水电费'
				}, {
					value: 4,
					label: '人情'
				}, {
					value: 5,
					label: '其他'
				}],
				filters: {
					expenditure_name: '',
					expenditure_type:null
				},
				loading: false, //列表是否显示加载
				expenditure: [],
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
					expenditure_name: [{
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
						expenditure_name: this.filters.expenditure_name,
						expenditure_type:this.filters.expenditure_type
					}
				};
				this.loading = true;
				this.searchData(this.GLOBAL.sPath.expenditure.listPage, params).then(res => {
					this.loading = false;
					this.total = res.total;
					this.expenditure = res.obj;
				});
			},
			showAddDialog() {
				this.isAdd = true;
				this.formtitle = "添加";
				this.formVisible = true;
				this.diaForm = {
					id: null,
					expenditure_name: '',
					expenditure_type: null,
					expenditure_amount: ''
				};
			},
			showUpdateDialog: function(index, row) {
				this.isAdd = false;
				this.formtitle = "修改";
				this.formVisible = true;
				this.diaForm = {
					id: row.id,
					expenditure_name: row.expenditure_name,
					expenditure_type: row.expenditure_type,
					expenditure_amount: row.expenditure_amount
				};
			},
			//新增及修改
			addorUpdateSubmit: function() {
				this.$refs['diaForm'].validate((valid) => {
					if (valid) {
						let path = this.GLOBAL.sPath.expenditure;
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
				this.deleteData(this.GLOBAL.sPath.expenditure.delete, {
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
				this.deleteData(this.GLOBAL.sPath.expenditure.deleteAll, this.sels.map(item => item.id))
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
