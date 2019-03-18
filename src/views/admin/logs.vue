<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="方法说明"
                                  v-model="listQuery.notes"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.userId" placeholder="选择用户">
                            <el-option
                                v-for="item in userList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                            :size="searchSize"
                            v-model="selectTime"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions2">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">
                            {{$t('table.search')}}
                        </el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="logsList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="left" label="执行方法说明" prop="notes">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.notes}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="请求URL" prop="requestUrl" width="380"/>
                <el-table-column align="center" label="用户" prop="userName" width="130"/>
                <el-table-column align="center" label="IP地址" prop="ip" width="150"/>
                <el-table-column align="center" label="时间" prop="createTime" width="180"/>
                <el-table-column align="center" label="耗时" width="120">
                    <template slot-scope="scope">
                        {{scope.row.time}}毫秒
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.rows" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="dialogTitle" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal">
                <el-form ref="logsDialogForm" class="deyatech-form" :model="logs" label-position="right"
                         label-width="80px">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="执行说明" prop="notes">
                                <el-input v-model="logs.notes" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类和方法" prop="method">
                                <el-input v-model="logs.method" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="请求URL" prop="requestUrl">
                                <el-input v-model="logs.requestUrl" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户名称" prop="userName">
                                <el-input v-model="logs.userName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="请求时间" prop="createTime">
                                <el-input v-model="logs.createTime" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户ID" prop="userId">
                                <el-input v-model="logs.userId" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="消耗时间" prop="time">
                                <el-input v-model="logs.time" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户IP" prop="ip">
                                <el-input v-model="logs.ip" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="请求参数">
                                <el-input type="textarea" v-model="logs.params" :rows="5" disabled/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>
        </div>
    </basic-container>
</template>
<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getLogsList,
        createOrUpdateLogs,
        delLogss,
        getUserList
    } from '@/api/admin/logs';

    export default {
        name: 'logs',
        data() {
            return {pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                selectTime: undefined,
                userList: [],
                logsList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.rows,
                    notes: undefined,
                    userId: undefined,
                    startTime: undefined,
                    endTime: undefined
                },
                logs: {
                    id: undefined,
                    notes: undefined,
                    method: undefined,
                    requestUrl: undefined,
                    userName: undefined,
                    params: undefined,
                    time: undefined,
                    ip: undefined
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
            }
        },
        computed: {
            ...mapGetters([
                'closeOnClickModal',
                'searchSize',
                'btnSize'
            ])
        },
        created() {
            this.reloadList();
            this.rloadUserList();
        },
        methods: {
            resetSearch() {
                this.listQuery.notes = undefined;
            },
            rloadUserList() {
                getUserList().then(response => {
                    this.userList = response.data;
                })
            },
            reloadList() {
                this.listLoading = true;
                this.logsList = undefined;
                this.total = undefined;
                getLogsList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.logsList = response.data.records;
                    this.total = response.data.total;
                })
            },
            changeDate() {
                this.listQuery.startTime = this.selectTime[0];
                this.listQuery.endTime = this.selectTime[1];
            },
            handleSizeChange(val) {
                this.listQuery.rows = val;
                this.reloadList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.reloadList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            btnUpdate(row) {
                this.resetLogs();
                if (row.id) {
                    this.logs = deepClone(row);
                } else {
                    this.logs = deepClone(this.selectedRows[0]);
                }
                this.dialogTitle = '详情';
                this.dialogVisible = true;
            },
            resetLogs() {
                this.logs = {
                    id: undefined,
                    notes: undefined,
                    method: undefined,
                    requestUrl: undefined,
                    userName: undefined,
                    params: undefined,
                    time: undefined,
                    ip: undefined
                }
            }
        }
    }
</script>


