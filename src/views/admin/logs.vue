<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                    <el-button type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="logsList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="执行方法说明" prop="notes"/>
                <el-table-column align="center" label="执行的类跟方法" prop="method"/>
                <el-table-column align="center" label="请求url" prop="requestUrl"/>
                <el-table-column align="center" label="用户id" prop="userId"/>
                <el-table-column align="center" label="请求参数" prop="params"/>
                <el-table-column align="center" label="消耗时间  毫秒" prop="time"/>
                <el-table-column align="center" label="请求者ip地址" prop="ip"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('Enable') | statusFilter">
                            {{scope.row.enable | enums('Enable')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop.safe="btnDelete(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.rows" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal">
                <el-form ref="logsDialogForm" class="deyatech-form" :model="logs" label-position="right"
                         label-width="80px" :rules="logsRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="执行方法说明" prop="notes">
                                <el-input v-model="logs.notes"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="执行的类跟方法" prop="method">
                                <el-input v-model="logs.method"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="请求url" prop="requestUrl">
                                <el-input v-model="logs.requestUrl"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户id" prop="userId">
                                <el-input v-model="logs.userId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="请求参数" prop="params">
                                <el-input v-model="logs.params"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="消耗时间  毫秒" prop="time">
                                <el-input v-model="logs.time"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="请求者ip地址" prop="ip">
                                <el-input v-model="logs.ip"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="logs.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="dialogVisible = false">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {copyProperties} from '@/util/util';
    import {
        getLogsList,
        createOrUpdateLogs,
        delLogss
    } from '@/api/admin/logs';

    export default {
        name: 'logs',
        data() {
            return {
                logsList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    rows: this.$store.state.common.rows,
                    name: undefined
                },
                logs: {
                    id: undefined,
                    notes: undefined,
                    method: undefined,
                    requestUrl: undefined,
                    userId: undefined,
                    params: undefined,
                    time: undefined,
                    ip: undefined
                },
                logsRules: {
                    notes: [
                        {required: true, message: this.$t("table.pleaseInput") + '执行方法说明'}
                    ],
                    method: [
                        {required: true, message: this.$t("table.pleaseInput") + '执行的类跟方法'}
                    ],
                    requestUrl: [
                        {required: true, message: this.$t("table.pleaseInput") + '请求url'}
                    ],
                    userId: [
                        {required: true, message: this.$t("table.pleaseInput") + '用户id'}
                    ],
                    params: [
                        {required: true, message: this.$t("table.pleaseInput") + '请求参数'}
                    ],
                    time: [
                        {required: true, message: this.$t("table.pleaseInput") + '消耗时间  毫秒'}
                    ],
                    ip: [
                        {required: true, message: this.$t("table.pleaseInput") + '请求者ip地址'}
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
                'titleMap',
                'enums',
                'closeOnClickModal',
                'searchSize',
                'btnSize'
            ]),
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
                this.logsList = undefined;
                this.total = undefined;
                getLogsList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.logsList = response.data.records;
                    this.total = response.data.total;
                })
            },
            handleSizeChange(val){
                this.listQuery.rows = val;
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
                this.resetLogs();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetLogs();
                if (row.id) {
                    this.logs = copyProperties(this.logs, row);
                } else {
                    this.logs = copyProperties(this.logs, this.selectedRows[0]);
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
                this.$refs['logsDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateLogs(this.logs).then(response => {
                            this.resetLogsDialog();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['logsDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateLogs(this.logs).then(response => {
                            this.resetLogsDialog();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delLogss(ids).then(response => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetLogs(){
                this.logs = {
                    id: undefined,
                    notes: undefined,
                    method: undefined,
                    requestUrl: undefined,
                    userId: undefined,
                    params: undefined,
                    time: undefined,
                    ip: undefined
                }
            },
            resetLogsDialog(){
                this.dialogVisible = false;
                this.submitLoading = false;
                this.resetLogs();
                this.reloadList();
            }
        }
    }
</script>


