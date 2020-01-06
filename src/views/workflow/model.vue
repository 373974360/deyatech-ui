<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                    <!--<el-button type="primary" :size="btnSize" @click="btnPublish" :disabled="selectedRows.length < 1">发布</el-button>-->
                    <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name" style="width: 300px;margin-left: 10px;margin-right:10px;"></el-input>
                    <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="processModelList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <!--<el-table-column align="center" label="模型编号" prop="id"/>-->
                <!--<el-table-column align="center" label="模型编号" prop="actModelId"/>-->
                <el-table-column align="center" label="模型名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column align="center" label="" prop="processDefinitionId"/>-->
                <!--<el-table-column prop="ver" label="版本" align="center"/>-->
                <el-table-column label="发布状态" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.processDefinitionId">已发布</span>
                        <span v-else>未发布</span>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.deploy && scope.row.actModelId && !scope.row.processDefinitionId" type="primary" title="发布"
                                   icon="el-icon-check" :size="btnSize" circle @click="btnPublish(scope.row)"></el-button>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeProcessModelDialog">
                <el-form ref="processModelDialogForm" class="deyatech-form" :model="processModel" label-position="right"
                         label-width="80px" :rules="processModelRules">
                    <el-row :gutter="20" :span="24">
                        <!--<el-col :span="12">
                            <el-form-item label="" prop="actModelId">
                                <el-input v-model.trim="processModel.actModelId"></el-input>
                            </el-form-item>
                        </el-col>-->
                        <el-col :span="12">
                            <el-form-item label="模型名称" prop="name">
                                <el-input v-model.trim="processModel.name" maxlength="200"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="" prop="processDefinitionId">
                                <el-input v-model.trim="processModel.processDefinitionId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="processModel.remark" :rows="3" maxlength="500"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeProcessModelDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getProcessModelList,
        createOrUpdateProcessModel,
        delProcessModels,
        modelDeploy,
        checkModelName
    } from '../../api/workflow/model';
    import {
        updateWorkFlow
    } from "../../api/station/catalog";
    export default {
        name: 'processModel',
        data() {
            const checkName = (rule, value, callback) => {
                checkModelName({id: this.processModel.id, name: this.processModel.name}).then(response => {
                    if (response.status == 200 && response.data > 0) {
                        callback(new Error(response.message));
                    } else {
                        callback();
                    }
                }).catch(() => {});
            };
            return {
                processModelList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                processModel: {
                    id: undefined,
                    actModelId: undefined,
                    name: undefined,
                    processDefinitionId: undefined
                },
                processModelRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '模型名称'},
                        {validator: checkName, trigger: 'blur'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                windowObject: undefined,
                loopObject: undefined
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
                    create: this.permission.processModel_create,
                    update: this.permission.processModel_update,
                    delete: this.permission.processModel_delete,
                    deploy: this.permission.processModel_deploy
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.processModelList = undefined;
                this.total = undefined;
                getProcessModelList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.processModelList = response.data.records;
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
                this.resetProcessModel();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                if (!row || !row.id) {
                    row = this.selectedRows[0].id
                }
                this.windowObject = window.open(`${this.$store.state.common.activitiModelEditUrl}?modelId=${row.actModelId}`);
                this.loopObject = setInterval(this.waitWindowClose, 1000);
            },
            waitWindowClose() {
                if(this.windowObject.closed) {
                    clearInterval(this.loopObject);
                    this.windowObject = undefined;
                    this.loopObject = undefined;
                    this.reloadList();
                }
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
            btnPublish(row) {
                let ids = [];
                if (row.id) {
                    ids.push(row.actModelId);
                    this.doPublish(ids);
                } else {
                    for (const row of this.selectedRows) {
                        ids.push(row.actModelId);
                        this.doPublish(ids);
                    }
                }
            },
            doCreate(){
                this.$refs['processModelDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateProcessModel(this.processModel).then(response => {
                            this.resetProcessModelDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                            this.btnUpdate(response.data);
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['processModelDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateProcessModel(this.processModel).then(() => {
                            this.resetProcessModelDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delProcessModels(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            doPublish(ids) {
                modelDeploy(ids).then(() => {
                    // 模型发布后更新栏目工作流ID
                    updateWorkFlow().then(()=>{});
                    this.$message.success('发布成功！');
                    this.reloadList();
                })
            },
            resetProcessModel(){
                this.processModel = {
                    id: undefined,
                    actModelId: undefined,
                    name: undefined,
                    processDefinitionId: undefined
                }
            },
            resetProcessModelDialogAndList(){
                this.closeProcessModelDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeProcessModelDialog() {
                this.dialogVisible = false;
                this.resetProcessModel();
                this.$refs['processModelDialogForm'].resetFields();
            }
        }
    }
</script>


