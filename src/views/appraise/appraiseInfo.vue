<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-cascader :size="searchSize" :placeholder="$t('table.pleaseSelect') + '进驻部门'"
                                     :options="garrisonDepartmentCascader" @change="handleGarrisonDepartmentChange"
                                     :show-all-levels="false" expand-trigger="hover" clearable ref="deptCascader"
                                     change-on-select></el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" :placeholder="$t('table.pleaseSelect') + '评价等级'" v-model.trim="listQuery.level" clearable>
                            <el-option
                                v-for="item in loadEnum('EvaluationLevelEnum')"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchReloadList">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="appraiseInfoList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
<!--                <el-table-column type="selection" width="50" align="center"/>-->
                <el-table-column align="center" label="进驻部门" prop="garrisonDepartmentName"/>
                <el-table-column align="center" label="评价等级" prop="level">
                    <template slot-scope="scope">
                        {{scope.row.level | enums('EvaluationLevelEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="文字评价" prop="words"/>
                <el-table-column align="center" label="评价时间" prop="submitTime"/>
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <!--<el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop.safe="btnDelete(scope.row)"></el-button>
                    </template>
                </el-table-column>-->
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeAppraiseInfoDialog">
                <el-form ref="appraiseInfoDialogForm" class="deyatech-form" :model="appraiseInfo" label-position="right"
                         label-width="80px" :rules="appraiseInfoRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="进驻部门id" prop="garrisonDepartmentId">
                                <el-input v-model.trim="appraiseInfo.garrisonDepartmentId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评价等级" prop="level">
                                <el-input v-model.trim="appraiseInfo.level"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="文字评价" prop="words">
                                <el-input v-model.trim="appraiseInfo.words"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评价时间" prop="submitTime">
                                <el-input v-model.trim="appraiseInfo.submitTime"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="appraiseInfo.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeAppraiseInfoDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getAppraiseInfoList,
        createOrUpdateAppraiseInfo,
        delAppraiseInfos
    } from '@/api/appraise/appraiseInfo';
    import {getGarrisonDepartmentCascader} from '@/api/appraise/garrisonDepartment';
    import {getStore} from '@/util/store';

    export default {
        name: 'appraiseInfo',
        data() {
            return {
                appraiseInfoList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    garrisonDepartmentId: undefined,
                    level: undefined,
                },
                appraiseInfo: {
                    id: undefined,
                    garrisonDepartmentId: undefined,
                    level: undefined,
                    words: undefined,
                    submitTime: undefined
                },
                appraiseInfoRules: {
                    garrisonDepartmentId: [
                        {required: true, message: this.$t("table.pleaseInput") + '进驻部门id'}
                    ],
                    level: [
                        {required: true, message: this.$t("table.pleaseInput") + '评价等级'}
                    ],
                    words: [
                        {required: true, message: this.$t("table.pleaseInput") + '文字评价'}
                    ],
                    submitTime: [
                        {required: true, message: this.$t("table.pleaseInput") + '评价时间'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                garrisonDepartmentCascader: [],
            }
        },
        computed: {
            ...mapGetters([
                'permission',
                'titleMap',
                'enums',
                'closeOnClickModal',
                'searchSize',
                'btnSize'
            ]),
            btnEnable() {
                return {
                    create: this.permission.appraiseInfo_create,
                    update: this.permission.appraiseInfo_update,
                    delete: this.permission.appraiseInfo_delete
                };
            }
        },
        created(){
            this.getGarrisonDepartmentCascader();
            this.reloadList();
        },
        methods: {
            getGarrisonDepartmentCascader(){
                getGarrisonDepartmentCascader().then(response => {
                    this.garrisonDepartmentCascader = response.data;
                })
            },
            handleGarrisonDepartmentChange(val) {
                if (val.length > 0) {
                    this.listQuery.garrisonDepartmentId = val[val.length - 1]
                } else {
                    this.listQuery.garrisonDepartmentId = undefined
                }
            },
            loadEnum(name) {
                return getStore({name: 'enums'})[name]
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            resetSearch(){
                let obj = {};
                obj.stopPropagation = () =>{};
                this.$refs['deptCascader'].clearValue(obj);
                this.listQuery.garrisonDepartmentId = undefined;
                this.listQuery.level = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.appraiseInfoList = undefined;
                this.total = undefined;
                getAppraiseInfoList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.appraiseInfoList = response.data.records;
                    this.total = response.data.total;
                })
            },
            handleSizeChange(val){
                this.listQuery.size = val;
                this.reloadList();
            },
            handleCurrentChange(val){
                this.listQuery.page = val;
                this.reloadList();
            },
            handleSelectionChange(rows){
                this.selectedRows = rows;
            },
            btnCreate(){
                this.resetAppraiseInfo();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetAppraiseInfo();
                if (row.id) {
                    this.appraiseInfo = deepClone(row);
                } else {
                    this.appraiseInfo = deepClone(this.selectedRows[0]);
                }
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row){
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows){
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate(){
                this.$refs['appraiseInfoDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateAppraiseInfo(this.appraiseInfo).then(() => {
                            this.resetAppraiseInfoDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['appraiseInfoDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateAppraiseInfo(this.appraiseInfo).then(() => {
                            this.resetAppraiseInfoDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delAppraiseInfos(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetAppraiseInfo(){
                this.appraiseInfo = {
                    id: undefined,
                    garrisonDepartmentId: undefined,
                    level: undefined,
                    words: undefined,
                    submitTime: undefined
                }
            },
            resetAppraiseInfoDialogAndList(){
                this.closeAppraiseInfoDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeAppraiseInfoDialog() {
                this.dialogVisible = false;
                this.resetAppraiseInfo();
                this.$refs['appraiseInfoDialogForm'].resetFields();
            }
        }
    }
</script>


