<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
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
            <el-table :data="processTaskSettingList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="" prop="actDefinitionId"/>
                <el-table-column align="center" label="" prop="actTaskDefinitionId"/>
                <el-table-column align="center" label="" prop="source"/>
                <el-table-column align="center" label="" prop="assignee"/>
                <el-table-column align="center" label="" prop="candidateType"/>
                <el-table-column align="center" label="" prop="candidateUsers"/>
                <el-table-column align="center" label="" prop="candidateGroups"/>
                <el-table-column align="center" label="" prop="autoPass"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop.safe="btnDelete(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeProcessTaskSettingDialog">
                <el-form ref="processTaskSettingDialogForm" class="deyatech-form" :model="processTaskSetting" label-position="right"
                         label-width="80px" :rules="processTaskSettingRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="" prop="actDefinitionId">
                                <el-input v-model.trim="processTaskSetting.actDefinitionId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="" prop="actTaskDefinitionId">
                                <el-input v-model.trim="processTaskSetting.actTaskDefinitionId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="" prop="source">
                                <el-input v-model.trim="processTaskSetting.source"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="" prop="assignee">
                                <el-input v-model.trim="processTaskSetting.assignee"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="" prop="candidateType">
                                <el-input v-model.trim="processTaskSetting.candidateType"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="" prop="candidateUsers">
                                <el-input v-model.trim="processTaskSetting.candidateUsers"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="" prop="candidateGroups">
                                <el-input v-model.trim="processTaskSetting.candidateGroups"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="" prop="autoPass">
                                <el-input v-model.trim="processTaskSetting.autoPass"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="processTaskSetting.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeProcessTaskSettingDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getProcessTaskSettingList,
        createOrUpdateProcessTaskSetting,
        delProcessTaskSettings
    } from '../../api/workflow/taskSetting';

    export default {
        name: 'processTaskSetting',
        data() {
            return {
                processTaskSettingList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                processTaskSetting: {
                    id: undefined,
                    actDefinitionId: undefined,
                    actTaskDefinitionId: undefined,
                    source: undefined,
                    assignee: undefined,
                    candidateType: undefined,
                    candidateUsers: undefined,
                    candidateGroups: undefined,
                    autoPass: undefined
                },
                processTaskSettingRules: {
                    actDefinitionId: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ],
                    actTaskDefinitionId: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ],
                    source: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ],
                    assignee: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ],
                    candidateType: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ],
                    candidateUsers: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ],
                    candidateGroups: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ],
                    autoPass: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false
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
                    create: this.permission.processTaskSetting_create,
                    update: this.permission.processTaskSetting_update,
                    delete: this.permission.processTaskSetting_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.processTaskSettingList = undefined;
                this.total = undefined;
                getProcessTaskSettingList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.processTaskSettingList = response.data.records;
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
                this.resetProcessTaskSetting();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetProcessTaskSetting();
                if (row.id) {
                    this.processTaskSetting = deepClone(row);
                } else {
                    this.processTaskSetting = deepClone(this.selectedRows[0]);
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
                this.$refs['processTaskSettingDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateProcessTaskSetting(this.processTaskSetting).then(() => {
                            this.resetProcessTaskSettingDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['processTaskSettingDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateProcessTaskSetting(this.processTaskSetting).then(() => {
                            this.resetProcessTaskSettingDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delProcessTaskSettings(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetProcessTaskSetting(){
                this.processTaskSetting = {
                    id: undefined,
                    actDefinitionId: undefined,
                    actTaskDefinitionId: undefined,
                    source: undefined,
                    assignee: undefined,
                    candidateType: undefined,
                    candidateUsers: undefined,
                    candidateGroups: undefined,
                    autoPass: undefined
                }
            },
            resetProcessTaskSettingDialogAndList(){
                this.closeProcessTaskSettingDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeProcessTaskSettingDialog() {
                this.dialogVisible = false;
                this.resetProcessTaskSetting();
                this.$refs['processTaskSettingDialogForm'].resetFields();
            }
        }
    }
</script>


