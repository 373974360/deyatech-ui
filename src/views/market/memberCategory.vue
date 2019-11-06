<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <!--<div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>-->
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
            <el-table :data="memberCategoryList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="描述" prop="description"/>
                <el-table-column align="center" label="排序" prop="sortNo"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeMemberCategoryDialog">
                <el-form ref="memberCategoryDialogForm" class="deyatech-form" :model="memberCategory" label-position="right"
                         label-width="80px" :rules="memberCategoryRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="名称" prop="name">
                                <el-input v-model.trim="memberCategory.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序" prop="sortNo">
                                <el-input-number v-model="memberCategory.sortNo" :min="1" :max="100" style="width: 100%"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="描述" prop="description">
                                <el-input type="textarea" v-model.trim="memberCategory.description" :rows="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model.trim="memberCategory.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeMemberCategoryDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>


            <el-dialog :title="titleMap['associateUser']" :visible.sync="dialogUsersVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeMemberCategoryUserDialog">
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
                        <el-table ref="memberCategoryUserTable" :data="userList" border @select="selectRowUser"
                                  @select-all="selectAllUser" @selection-change="handleSelectionChangeMemberCategoryUser">
                            <el-table-column type="selection" width="50" align="center"></el-table-column>
                            <el-table-column prop="departmentName" label="部门"></el-table-column>
                            <el-table-column prop="userName" label="姓名"></el-table-column>
                            <el-table-column prop="userAccount" label="登录帐户"></el-table-column>
                        </el-table>
                        <el-pagination class="deyatech-pagination pull-right" background
                                       :current-page.sync="userListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                       :page-size="userListQuery.size" :layout="this.$store.state.common.pageLayout" :total="userTotal"
                                       @size-change="handleSizeChangeMemberCategoryUser" @current-change="handleCurrentChangeMemberCategoryUser">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveMemberCategoryUser"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeMemberCategoryUserDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getMemberCategoryList,
        createOrUpdateMemberCategory,
        delMemberCategorys,
        isExistName,
    } from '@/api/market/memberCategory';
    import {
        getAllMemberCategoryUser,
        getMemberCategoryUserList,
        saveMemberCategoryUsers
    } from '@/api/market/memberCategoryUser';
    import {getDepartmentCascader} from "@/api/admin/department";

    export default {
        name: 'memberCategory',
        data() {
            const validateName = (rule, value, callback) => {
                const query = {
                    id: this.memberCategory.id,
                    name : value
                }
                isExistName(query).then(response => {
                    if (response.status == 200) {
                        if (response.data) {
                            callback(new Error("名称已存在"));
                        } else {
                            callback()
                        }
                    } else {
                        callback(new Error('检查名称重复失败'))
                    }
                })

            };
            return {
                memberCategoryList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                memberCategory: {
                    id: undefined,
                    name: undefined,
                    description: undefined,
                    sortNo: undefined
                },
                memberCategoryRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    description: [
                        {max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur'}
                    ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '排序'}
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
                    categoryId: undefined
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
                    create: this.permission.memberCategory_create,
                    update: this.permission.memberCategory_update,
                    delete: this.permission.memberCategory_delete,
                    users: this.permission.memberCategory_users,
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
            reloadList(){
                this.listLoading = true;
                this.memberCategoryList = undefined;
                this.total = undefined;
                getMemberCategoryList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.memberCategoryList = response.data.records;
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
                this.resetMemberCategory();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetMemberCategory();
                if (row.id) {
                    this.memberCategory = deepClone(row);
                } else {
                    this.memberCategory = deepClone(this.selectedRows[0]);
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
                this.$refs['memberCategoryDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateMemberCategory(this.memberCategory).then(() => {
                            this.resetMemberCategoryDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['memberCategoryDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateMemberCategory(this.memberCategory).then(() => {
                            this.resetMemberCategoryDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delMemberCategorys(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetMemberCategory(){
                this.memberCategory = {
                    id: undefined,
                    name: undefined,
                    description: undefined,
                    sortNo: undefined
                }
            },
            resetMemberCategoryDialogAndList(){
                this.closeMemberCategoryDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeMemberCategoryDialog() {
                this.dialogVisible = false;
                this.resetMemberCategory();
                this.$refs['memberCategoryDialogForm'].resetFields();
            },


            btnUsers(row) {
                this.currentRow = row;
                this.dialogUsersVisible = true;
                this.dialogUsersFormLoading = true;
                this.selectAllUserId = [];
                this.loadMemberCategoryUser(row.id).then(res => {
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
            loadMemberCategoryUser(categoryId) {
                let query = {categoryId}
                return new Promise((resolve, reject) => {
                    getAllMemberCategoryUser(query).then(response => {
                        resolve(response.data)
                    }).catch(err => {
                        reject(err)
                    })
                });
            },
            handleShowRelated(checked) {
                if (checked) {
                    this.userListQuery.categoryId = this.currentRow.id;
                } else {
                    this.userListQuery.categoryId = undefined;
                }
                this.reloadUserList();
            },
            reloadUserList() {
                this.handleCurrentChangeMemberCategoryUser(1)
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
            handleSelectionChangeMemberCategoryUser(rows) {
                this.selectedRowsUser = rows;
            },
            handleSizeChangeMemberCategoryUser(val) {
                this.userListQuery.size = val;
                this.loadUserList().then(() => {
                    this.checkRelatedUserRows();
                });
            },
            handleCurrentChangeMemberCategoryUser(val) {
                this.userListQuery.page = val;
                this.loadUserList().then(() => {
                    this.checkRelatedUserRows();
                });
            },
            loadUserList() {
                return new Promise((resolve, reject) => {
                    this.dialogUsersFormLoading = true;
                    getMemberCategoryUserList(this.userListQuery).then(response => {
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
                                this.$refs['memberCategoryUserTable'].toggleRowSelection(row, true)
                            }
                        }
                    }
                });
            },
            closeMemberCategoryUserDialog() {
                this.dialogUsersVisible = false;
                this.submitLoading = false;
                let obj = {};
                obj.stopPropagation = () =>{};
                this.$refs.mycascader.clearValue(obj);
                this.userListQuery.departmentId = undefined;
                this.userListQuery.userName = undefined;
                this.userListQuery.categoryId = undefined;
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
            doSaveMemberCategoryUser() {
                this.submitLoading = true;
                saveMemberCategoryUsers(this.currentRow.id, this.selectAllUserId).then(() => {
                    this.closeMemberCategoryUserDialog();
                    this.$message.success(this.$t("table.associateSuccess"));
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
        }
    }
</script>


