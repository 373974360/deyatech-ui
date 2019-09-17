<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="请输入标题或作者" v-model="listQuery.titleOrAuthor"></el-input>
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
                    <!--<el-button type="success" icon="el-icon-check" :size="btnSize" @click="btnCompleteTask" :disabled="selectedRows.length < 1">批量通过</el-button>
                    <el-button type="warning" icon="el-icon-back" :size="btnSize" @click="btnRollBackTask" :disabled="selectedRows.length < 1">批量回退</el-button>
                    <el-button type="danger" icon="el-icon-close" :size="btnSize" @click="btnRejectTask" :disabled="selectedRows.length < 1">批量拒绝</el-button>-->
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="reviewProcessList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <!--元数据相关 TODO-->
                <!--<el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-form label-position="right" inline class="form-model">
                            &lt;!&ndash;<el-form-item v-for="item in scope.row.metaDataCollection.metaDataCollectionMetaDataDtoList"  TODO
                                          v-if="item.tableHand === 1" :key="item.id" :label="item.metaData.name + '：'">
                                <span>{{scope.row.content[item.fieldName]}}</span>
                            </el-form-item>&ndash;&gt;
                        </el-form>
                    </template>
                </el-table-column>-->
                <!--<el-table-column type="selection" width="50" align="center"/>-->
                <el-table-column align="center" label="标题" prop="variables.title"/>
                <el-table-column align="center" label="作者" prop="variables.author"/>
                <el-table-column align="center" label="审核状态" prop="name"/>
                <el-table-column align="center" label="创建时间" prop="startTime"/>
                <!--<el-table-column align="center" label="内容id" prop="contentId"/>
                <el-table-column align="center" label="工作流id" prop="workflowId"/>-->

                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button title="通过" type="success" icon="el-icon-check" :size="btnSize" circle
                                   @click.stop.safe="completeTask(scope.row)"></el-button>
                        <el-button title="回退" type="warning" icon="el-icon-back" :size="btnSize" circle
                                   @click.stop.safe="rollBackTask(scope.row)"></el-button>
                        <el-button title="拒绝" type="danger" icon="el-icon-close" :size="btnSize" circle
                                   @click.stop.safe="rejectTask(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeReviewProcessDialog">
                <el-form ref="reviewProcessDialogForm" class="deyatech-form" :model="reviewProcess" label-position="right"
                         label-width="80px" :rules="reviewProcessRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="内容id" prop="contentId">
                                <el-input v-model="reviewProcess.contentId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="工作流id" prop="workflowId">
                                <el-input v-model="reviewProcess.workflowId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="审核生命周期状态：0.启动 1.审核 2.完成" prop="status">
                                <el-input v-model="reviewProcess.status"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="reviewProcess.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeReviewProcessDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getCurrentTaskList,
        completeTask,
        rollBackTask,
        rejectTask,
        createOrUpdateReviewProcess,
        delReviewProcesss
    } from '@/api/content/reviewProcess';
    import {
        updateContentStatus
    } from '@/api/station/template';

    export default {
        name: 'reviewProcess',
        data() {
            return {
                reviewProcessList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    titleOrAuthor: undefined
                },
                reviewProcess: {
                    id: undefined,
                    contentId: undefined,
                    workflowId: undefined,
                    status: undefined
                },
                reviewProcessRules: {
                    contentId: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容id'}
                    ],
                    workflowId: [
                        {required: true, message: this.$t("table.pleaseInput") + '工作流id'}
                    ],
                    status: [
                        {required: true, message: this.$t("table.pleaseInput") + '审核生命周期状态：0.启动 1.审核 2.完成'}
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
                    create: this.permission.reviewProcess_create,
                    update: this.permission.reviewProcess_update,
                    delete: this.permission.reviewProcess_delete
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.titleOrAuthor = undefined;
            },
            searchReloadList(){
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.reviewProcessList = undefined;
                // this.total = undefined;
                getCurrentTaskList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.reviewProcessList = response.data.records;
                    this.total = response.data.total;
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
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
                this.resetReviewProcess();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetReviewProcess();
                if (row.id) {
                    this.reviewProcess = deepClone(row);
                } else {
                    this.reviewProcess = deepClone(this.selectedRows[0]);
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
                this.$refs['reviewProcessDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateReviewProcess(this.reviewProcess).then(() => {
                            this.resetReviewProcessDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['reviewProcessDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateReviewProcess(this.reviewProcess).then(() => {
                            this.resetReviewProcessDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delReviewProcesss(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetReviewProcess(){
                this.reviewProcess = {
                    id: undefined,
                    contentId: undefined,
                    workflowId: undefined,
                    status: undefined
                }
            },
            resetReviewProcessDialogAndList(){
                this.closeReviewProcessDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeReviewProcessDialog() {
                this.dialogVisible = false;
                this.resetReviewProcess();
                this.$refs['reviewProcessDialogForm'].resetFields();
            },
            completeTask(row) {
                completeTask(row.actTaskId).then(response => {
                    if (response.status == 200) {
                        if (response.data === 'FINISH') {
                            updateContentStatus(row.variables.templateId).then(response => {
                            })
                        }
                        this.reloadList();
                        this.$message.success(row.name + '已通过')
                    } else {
                        this.$message.error(response.message)
                    }
                })
            },
            rollBackTask(row) {
                rollBackTask(row.actTaskId).then(response => {
                    if (response.status == 200) {
                        this.reloadList();
                        this.$message.success(row.name + '已回退')
                    } else {
                        this.$message.error(response.message)
                    }
                })
            },
            rejectTask(row) {
                rejectTask(row.actTaskId).then(response => {
                    if (response.status == 200) {
                        this.reloadList();
                        this.$message.success(row.name + '已拒绝')
                    } else {
                        this.$message.error(response.message)
                    }
                })
            }
        }
    }
</script>


