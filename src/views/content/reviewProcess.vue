<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <!--<el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>-->
                    <!--<el-button type="success" icon="el-icon-check" :size="btnSize" @click="btnCompleteTask" :disabled="selectedRows.length < 1">批量通过</el-button>
                    <el-button type="warning" icon="el-icon-back" :size="btnSize" @click="btnRollBackTask" :disabled="selectedRows.length < 1">批量回退</el-button>
                    <el-button type="danger" icon="el-icon-close" :size="btnSize" @click="btnRejectTask" :disabled="selectedRows.length < 1">批量拒绝</el-button>-->

                    <el-input :size="searchSize" placeholder="请输入标题或作者" v-model.trim="listQuery.titleOrAuthor" style="width: 300px;margin-right:10px;"></el-input>
                    <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchReloadList">{{$t('table.search')}}</el-button>
                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="reviewProcessList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <!--<el-table-column type="selection" width="50" align="center"/>-->
                <el-table-column align="center" label="任务ID" prop="taskId"/>
                <el-table-column align="center" label="ID" prop="id"/>
                <el-table-column align="center" label="标题" prop="title"/>
                <el-table-column align="center" label="作者" prop="author"/>
                <!--<el-table-column align="center" label="来源" prop="source"/>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.complete" title="通过" type="success" icon="el-icon-check" :size="btnSize" circle
                                   @click.stop.safe="completeTask(scope.row)"></el-button>
                        <!--<el-button v-if="btnEnable.rollBack" title="回退" type="warning" icon="el-icon-back" :size="btnSize" circle
                                   @click.stop.safe="rollBackTask(scope.row)"></el-button>-->
                        <el-button v-if="btnEnable.reject" title="驳回" type="danger" icon="el-icon-close" :size="btnSize" circle
                                   @click.stop.safe="rejectTask(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog title="驳回理由" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeReviewProcessDialog">
                <el-form ref="reviewProcessDialogForm" class="deyatech-form" :model="reviewProcess" label-position="right"
                         label-width="80px" :rules="reviewProcessRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="驳回理由" prop="reason">
                                <el-input type="textarea" v-model.trim="reviewProcess.reason" :rows="5"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doReject" :loading="submitLoading">驳回</el-button>
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
        completeTask,
        rollBackTask,
        rejectTask,
        createOrUpdateReviewProcess,
        delReviewProcesss
    } from '@/api/content/reviewProcess';
    import {
        getLoginUserTaskList
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
                    taskId: undefined,
                    reason: undefined
                },
                reviewProcessRules: {
                    reason: [
                        {required: true, message: this.$t("table.pleaseInput") + '驳回理由'}
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
                    complete: this.permission.process_task_complete,
                    rollBack: this.permission.process_task_rollBack,
                    reject: this.permission.process_task_reject
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
                getLoginUserTaskList(this.listQuery).then(response => {
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
            resetReviewProcess(){
                this.reviewProcess = {
                    reason: undefined
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
                completeTask(row.taskId).then(response => {
                    if (response.status == 200) {
                        this.reloadList();
                        this.$message.success('通过成功');
                    } else {
                        this.$message.error(response.message)
                    }
                })
            },
            /*rollBackTask(row) {
                rollBackTask(row.taskId).then(response => {
                    if (response.status == 200) {
                        this.reloadList();
                        this.$message.success(row.name + '已回退')
                    } else {
                        this.$message.error(response.message)
                    }
                })
            },*/
            rejectTask(row) {
                this.reviewProcess.taskId = row.taskId;
                this.reviewProcess.reason = '';
                this.dialogVisible = true;
            },
            doReject(){
                this.$refs['reviewProcessDialogForm'].validate(valid => {
                    if(valid) {
                        if (this.reviewProcess.taskId && this.reviewProcess.reason) {
                            this.submitLoading = true;
                            rejectTask(this.reviewProcess.taskId, this.reviewProcess.reason).then(response => {
                                if (response.status == 200) {
                                    this.resetReviewProcessDialogAndList();
                                    this.$message.success('驳回成功');
                                } else {
                                    this.$message.error(response.message);
                                }
                            })
                        } else {
                            this.$message.error("任务ID或者驳回理由不存在");
                        }
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>


