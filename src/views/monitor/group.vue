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
            <el-table :data="groupList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="任务名称" prop="groupName"/>
                <el-table-column align="center" label="触发模式" prop="triggerType">
                    <template slot-scope="scope">
                        <span v-if="scope.row.triggerType == 1">
                            固定时刻
                        </span>
                        <span v-if="scope.row.triggerType == 2">
                            日历周期
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="任务状态" prop="runType">
                    <template slot-scope="scope">
                        <span v-if="scope.row.runType == 1">
                            <el-tag type="danger">运行中</el-tag>
                        </span>
                        <span v-if="scope.row.runType == 2">
                           <el-tag type="success">空闲</el-tag>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="运行时间" prop="lastDtime"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeGroupDialog">
                <el-form ref="groupDialogForm" class="deyatech-form" :model="group" label-position="right"
                         label-width="80px" :rules="groupRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="任务名称" prop="groupName">
                                <el-input v-model="group.groupName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="触发模式" prop="triggerType">
                                <el-radio-group v-model="group.triggerType">
                                    <el-radio :label="1" border>固定时刻</el-radio>
                                    <el-radio :label="2" border>日历周期</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="触发类型" prop="calendarType">
                                <el-radio-group v-model="group.calendarType" disabled>
                                    <el-radio :label="1" border>每日</el-radio>
                                    <el-radio :label="2" border>每周</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="间隔时间" prop="incrementSeconds">
                                <el-input v-model="group.incrementSeconds"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="触发时间" prop="calendarTime">
                                <el-input v-model="group.calendarTime" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="每周" prop="calendarWorkday">
                                <el-checkbox-group v-model="group.calendarWorkday" disabled>
                                    <el-checkbox :label="1">周一</el-checkbox>
                                    <el-checkbox :label="2">周二</el-checkbox>
                                    <el-checkbox :label="3">周三</el-checkbox>
                                    <el-checkbox :label="4">周四</el-checkbox>
                                    <el-checkbox :label="5">周五</el-checkbox>
                                    <el-checkbox :label="6">周六</el-checkbox>
                                    <el-checkbox :label="7">周日</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="group.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeGroupDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getGroupList,
        createOrUpdateGroup,
        delGroups
    } from '@/api/monitor/group';

    export default {
        name: 'group',
        data() {
            return {
                groupList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                group: {
                    id: undefined,
                    groupName: undefined,
                    triggerType: 1,
                    incrementSeconds: undefined,
                    calendarTime: '00:00:00',
                    calendarType: 1,
                    calendarWorkday: [],
                    runType: 2
                },
                groupRules: {
                    groupName: [
                        {required: true, message: this.$t("table.pleaseInput") + '任务组名称'}
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
                'btnSize',
                'dicts'
            ]),
            btnEnable() {
                return {
                    create: this.permission.group_create,
                    update: this.permission.group_update,
                    delete: this.permission.group_delete
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
                this.groupList = undefined;
                this.total = undefined;
                getGroupList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.groupList = response.data.records;
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
                this.resetGroup();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetGroup();
                if (row.id) {
                    this.group = deepClone(row);
                } else {
                    this.group = deepClone(this.selectedRows[0]);
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
                this.$refs['groupDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateGroup(this.group).then(() => {
                            this.resetGroupDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['groupDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateGroup(this.group).then(() => {
                            this.resetGroupDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delGroups(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetGroup(){
                this.group = {
                    id: undefined,
                    groupName: undefined,
                    triggerType: 1,
                    incrementSeconds: undefined,
                    calendarTime: '00:00:00',
                    calendarType: 1,
                    calendarWorkday: [],
                    runType: 2
                }
            },
            resetGroupDialogAndList(){
                this.closeGroupDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeGroupDialog() {
                this.dialogVisible = false;
                this.resetGroup();
                this.$refs['groupDialogForm'].resetFields();
            }
        }
    }
</script>


