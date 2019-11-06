<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + $t('table.searchName')" v-model.trim="listQuery.name"></el-input>
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
            <el-table :data="workingGroupList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="描述" prop="description"/>
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.users" title="关联用户" type="primary" icon="iconadd-account" :size="btnSize" circle
                                   @click.stop.safe="btnUsers(scope.row)"></el-button>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeWorkingGroupDialog">
                <el-form ref="workingGroupDialogForm" class="deyatech-form" :model="workingGroup" label-position="right"
                         label-width="80px" :rules="workingGroupRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="名称" prop="name">
                                <el-input v-model.trim="workingGroup.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="描述" prop="description">
                                <el-input type="textarea" v-model.trim="workingGroup.description" :rows="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model.trim="workingGroup.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeWorkingGroupDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>


            <el-dialog :title="titleMap['associateUser']" :visible.sync="dialogUsersVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeWorkingGroupUserDialog">
                <div v-loading="dialogUsersFormLoading">
                    <div class="dialog-search">
                        <el-cascader :options="departmentCascader" @change="handleDepartmentChange"
                                     class="dialog-search-item dialog-keywords" ref="mycascader"
                                     :show-all-levels="false" expand-trigger="hover" clearable change-on-select
                                     :size="searchSize" placeholder="根据部门筛选"></el-cascader>
                        <el-input v-model="userListQuery.userName" class="dialog-search-item dialog-keywords"
                                  clearable :size="searchSize" placeholder="根据姓名或帐户查询"></el-input>
                        <el-button type="primary" :size="searchSize" icon="el-icon-search" @click="reloadUserList">{{$t('table.search')}}</el-button>
                    </div>
                    <div class="dialog-search">
                        <el-checkbox v-model="showRelatedFlag" @change="handleShowRelated">只显示已关联用户</el-checkbox>
                    </div>
                    <div>
                        <el-table ref="workingGroupUserTable" :data="userList" border @select="selectRowUser"
                                  @select-all="selectAllUser" @selection-change="handleSelectionChangeWorkingGroupUser">
                            <el-table-column type="selection" width="50" align="center"></el-table-column>
                            <el-table-column prop="departmentName" label="部门"></el-table-column>
                            <el-table-column prop="userName" label="姓名"></el-table-column>
                            <el-table-column prop="userAccount" label="登录帐户"></el-table-column>
                        </el-table>
                        <el-pagination class="deyatech-pagination pull-right" background
                                       :current-page.sync="userListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                       :page-size="userListQuery.size" :layout="this.$store.state.common.pageLayout" :total="userTotal"
                                       @size-change="handleSizeChangeWorkingGroupUser" @current-change="handleCurrentChangeWorkingGroupUser">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveWorkingGroupUser"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeWorkingGroupUserDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>


        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getWorkingGroupList,
        createOrUpdateWorkingGroup,
        delWorkingGroups
    } from '@/api/reissue/workingGroup';
    import {
        getAllWorkingGroupUser,
        getWorkingGroupUserList,
        saveWorkingGroupUsers
    } from '@/api/reissue/workingGroupUser';
    import {getDepartmentCascader} from "@/api/admin/department";


    export default {
        name: 'workingGroup',
        data() {
            return {
                workingGroupList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                workingGroup: {
                    id: undefined,
                    name: undefined,
                    description: undefined
                },
                workingGroupRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                    ],
                    description: [
                        {required: true, message: this.$t("table.pleaseInput") + '描述'},
                        {max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur'}
                    ],
                    remark: [
                        {max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur'}
                    ],
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,

                currentRow: undefined,
                dialogUsersVisible: false,
                dialogUsersFormLoading: false,
                selectAllUserId: [],
                showRelatedFlag: false,
                userListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    departmentId: undefined,
                    userName: undefined,
                    groupId: undefined
                },
                userList: [],
                userTotal: 0,
                departmentCascader: [],
                selectedRowsUser: [],
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
                    create: this.permission.workingGroup_create,
                    update: this.permission.workingGroup_update,
                    delete: this.permission.workingGroup_delete,
                    users: this.permission.workingGroup_users,
                };
            }
        },
        created(){
            this.loadDepartment();
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.workingGroupList = undefined;
                this.total = undefined;
                getWorkingGroupList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.workingGroupList = response.data.records;
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
                this.resetWorkingGroup();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetWorkingGroup();
                if (row.id) {
                    this.workingGroup = deepClone(row);
                } else {
                    this.workingGroup = deepClone(this.selectedRows[0]);
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
                this.$refs['workingGroupDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateWorkingGroup(this.workingGroup).then(() => {
                            this.resetWorkingGroupDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['workingGroupDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateWorkingGroup(this.workingGroup).then(() => {
                            this.resetWorkingGroupDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delWorkingGroups(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetWorkingGroup(){
                this.workingGroup = {
                    id: undefined,
                    name: undefined,
                    description: undefined
                }
            },
            resetWorkingGroupDialogAndList(){
                this.closeWorkingGroupDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeWorkingGroupDialog() {
                this.dialogVisible = false;
                this.resetWorkingGroup();
                this.$refs['workingGroupDialogForm'].resetFields();
            },

            btnUsers(row) {
                this.currentRow = row;
                this.dialogUsersVisible = true;
                this.dialogUsersFormLoading = true;
                this.selectAllUserId = [];
                this.loadWorkingGroupUser(row.id).then(res => {
                    if (res && res.length > 0) {
                        for (let memberCategoryUser of res) {
                            this.selectAllUserId.push(memberCategoryUser.userId)
                        }
                        this.showRelatedFlag = true;
                        this.handleShowRelated(true);
                    } else {
                        this.showRelatedFlag = false;
                        this.handleShowRelated(false);
                    }
                })
            },
            loadWorkingGroupUser(groupId) {
                let query = {groupId}
                return new Promise((resolve, reject) => {
                    getAllWorkingGroupUser(query).then(response => {
                        resolve(response.data)
                    }).catch(err => {
                        reject(err)
                    })
                });
            },
            handleShowRelated(checked) {
                if (checked) {
                    this.userListQuery.groupId = this.currentRow.id;
                } else {
                    this.userListQuery.groupId = undefined;
                }
                this.reloadUserList();
            },
            reloadUserList() {
                this.handleCurrentChangeWorkingGroupUser(1)
            },
            selectRowUser(selection, row) {
                let i = this.selectAllUserId.indexOf(row.userId)
                if (i < 0) {
                    this.selectAllUserId.push(row.userId)
                } else {
                    this.selectAllUserId.splice(i, 1)
                }
            },
            selectAllUser(selection) {
                if (selection.length > 0) {
                    for (let user of this.userList) {
                        if (this.selectAllUserId.indexOf(user.userId) < 0) {
                            this.selectAllUserId.push(user.userId)
                        }
                    }
                } else {
                    for (let user of this.userList) {
                        let i = this.selectAllUserId.indexOf(user.userId)
                        if (i >= 0) {
                            this.selectAllUserId.splice(i, 1)
                        }
                    }
                }
            },
            handleSelectionChangeWorkingGroupUser(rows) {
                this.selectedRowsUser = rows;
            },
            handleSizeChangeWorkingGroupUser(val) {
                this.userListQuery.size = val;
                this.loadUserList().then(() => {
                    this.checkRelatedUserRows();
                });
            },
            handleCurrentChangeWorkingGroupUser(val) {
                this.userListQuery.page = val;
                this.loadUserList().then(() => {
                    this.checkRelatedUserRows();
                });
            },
            loadUserList() {
                return new Promise((resolve, reject) => {
                    this.dialogUsersFormLoading = true;
                    getWorkingGroupUserList(this.userListQuery).then(response => {
                        this.dialogUsersFormLoading = false;
                        this.userList = response.data.records;
                        this.userTotal = response.data.total;
                        resolve();
                    }).catch(err => {
                        reject(err);
                    })
                });
            },
            checkRelatedUserRows() {
                this.$nextTick(() => {
                    if (this.selectAllUserId && this.selectAllUserId.length > 0) {
                        for (let row of this.userList) {
                            if (this.selectAllUserId.includes(row.userId)) {
                                this.$refs['workingGroupUserTable'].toggleRowSelection(row, true)
                            }
                        }
                    }
                });
            },
            closeWorkingGroupUserDialog() {
                this.dialogUsersVisible = false;
                this.submitLoading = false;
                let obj = {};
                obj.stopPropagation = () =>{};
                this.$refs.mycascader.clearValue(obj);
                this.userListQuery.departmentId = undefined;
                this.userListQuery.userName = undefined;
                this.userListQuery.groupId = undefined;
            },
            loadDepartment() {
                getDepartmentCascader().then(response => {
                    this.departmentCascader = response.data
                })
            },
            handleDepartmentChange(val) {
                if (val.length > 0) {
                    this.userListQuery.departmentId = val[val.length - 1]
                } else {
                    this.userListQuery.departmentId = undefined
                }
            },
            doSaveWorkingGroupUser() {
                this.submitLoading = true;
                saveWorkingGroupUsers(this.currentRow.id, this.selectAllUserId).then(() => {
                    this.closeWorkingGroupUserDialog();
                    this.$message.success(this.$t("table.associateSuccess"));
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
        }
    }
</script>


