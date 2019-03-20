<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')"
                                  v-model="listQuery.name"></el-input>
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
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">
                        {{$t('table.create')}}
                    </el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate"
                               :disabled="selectedRows.length != 1">{{$t('table.update')}}
                    </el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete"
                               :disabled="selectedRows.length < 1">{{$t('table.delete')}}
                    </el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="roleList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="角色名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="角色类型(1:业务角色;2:管理角色 ;3:系统内置角色)" prop="type"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center"
                                 width="200">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary"
                                   icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.role_user" title="关联用户" type="primary" icon="iconadd-account"
                                   :size="btnSize" circle @click.stop.safe="btnRoleUser(scope.row)"></el-button>
                        <el-button v-if="btnEnable.role_menu" title="关联菜单" type="primary" icon="iconcaidan1"
                                   :size="btnSize" circle @click.stop.safe="btnRoleMenu(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger"
                                   icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop.safe="btnDelete(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" backgroundyarn
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeRoleDialog">
                <el-form ref="roleDialogForm" class="deyatech-form" :model="role" label-position="right"
                         label-width="80px" :rules="roleRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="角色名称" prop="name">
                                <el-input v-model="role.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="角色类型(1:业务角色;2:管理角色 ;3:系统内置角色)" prop="type">
                                <el-input v-model="role.type"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="role.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeRoleDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <el-dialog :title="titleMap['associateUser']" :visible.sync="dialogRoleUserVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeRoleUserDialog">
                <div v-loading="dialogFormLoading">
                    <div class="search">
                        <el-cascader :options="departmentCascader" @change="handleDepartmentChange"
                                     class="search-item dialog-keywords"
                                     :show-all-levels="false" expand-trigger="hover" clearable change-on-select
                                     size="mini" placeholder="根据部门筛选"></el-cascader>
                        <el-input v-model="userListQuery.name" class="search-item dialog-keywords"
                                  clearable size="mini" placeholder="根据姓名或帐户查询"></el-input>
                        <el-button type="primary" size="mini" icon="el-icon-search" @click="reloadUserList">{{$t('table.search')}}</el-button>
                    </div>
                    <div class="search">
                        <el-checkbox v-model="showRelatedFlag" @change="handleShowRelated">只显示已关联用户</el-checkbox>
                    </div>
                    <div>
                        <el-table ref="roleUserTable" :data="userList" border @select="selectRowUser"
                                  @select-all="selectAllUser" @selection-change="handleSelectionChangeRoleUser">
                            <el-table-column type="selection" width="50" align="center"></el-table-column>
                            <el-table-column prop="departmentName" label="部门"></el-table-column>
                            <el-table-column prop="name" label="姓名"></el-table-column>
                            <el-table-column prop="account" label="登录帐户"></el-table-column>
                        </el-table>
                        <el-pagination class="deyatech-pagination pull-right" backgroundyarn
                                       :current-page.sync="userListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                       :page-size="userListQuery.size" :layout="this.$store.state.common.pageLayout" :total="userTotal"
                                       @size-change="handleSizeChangeRoleUser" @current-change="handleCurrentChangeRoleUser">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button icon="circle-cross" type="danger" @click="closeRoleUserDialog">取 消</el-button>
                    <el-button type="primary" @click="doSaveRoleUser" :loading="submitLoading">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog :title="titleMap['associateMenu']" :visible.sync="dialogRoleMenuVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeRoleMenuDialog">
                <el-form style="width: 80%; margin-left:10%;" v-loading="dialogFormLoading">
                    <el-tree ref="roleMenuTree" :data="menuTree" show-checkbox node-key="id" :default-expand-all="true"
                             @check="menuTreeChecked" :check-strictly="true"></el-tree>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button icon="circle-cross" type="danger" @click="closeRoleMenuDialog">取 消</el-button>
                    <el-button type="primary" @click="doSaveRoleMenu" :loading="submitLoading">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '../../util/util';
    import {getParentKeys, getChildrenKeys} from "../../util/treeUtils";
    import {
        getRoleList,
        createOrUpdateRole,
        delRoles
    } from '@/api/admin/role';
    import {getUserList} from "../../api/admin/user";
    import {getDepartmentCascader} from "../../api/admin/department";
    import {getAllUserRole, setRoleUsers} from "../../api/admin/userRole";
    import {getMenuTree} from "../../api/admin/menu";
    import {getAllRoleMenu, setRoleMenus} from "../../api/admin/roleMenu";

    export default {
        name: 'role',
        data() {
            return {
                roleList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                role: {
                    id: undefined,
                    name: undefined,
                    type: undefined
                },
                roleRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '角色名称'}
                    ],
                    type: [
                        {required: true, message: this.$t("table.pleaseInput") + '角色类型(1:业务角色;2:管理角色 ;3:系统内置角色)'}
                    ]
                },
                userList: [],
                departmentCascader: [],
                menuTree: [],
                userTotal: 0,
                userListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    departmentId: undefined,
                    name: undefined,
                    roleId: undefined
                },
                selectAllUserId: [],
                currentRow: undefined,
                selectedRows: [],
                selectedRowsUser: [],
                dialogVisible: false,
                dialogRoleUserVisible: false,
                dialogRoleMenuVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                dialogFormLoading: false,
                showRelatedFlag: false
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
                    create: this.permission.role_create,
                    update: this.permission.role_update,
                    delete: this.permission.role_delete,
                    role_user: this.permission.role_user,
                    role_menu: this.permission.role_menu
                };
            }
        },
        created() {
            this.reloadList();
            this.loadDepartment();
            this.loadMenuTree();
        },
        methods: {
            resetSearch() {
                this.listQuery.name = undefined;
            },
            reloadList() {
                this.listLoading = true;
                this.roleList = undefined;
                this.total = undefined;
                getRoleList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.roleList = response.data.records;
                    this.total = response.data.total;
                })
            },
            loadUserList() {
                return new Promise((resolve, reject) => {
                    this.dialogFormLoading = true;
                    getUserList(this.userListQuery).then(response => {
                        this.dialogFormLoading = false;
                        this.userList = response.data.records;
                        this.userTotal = response.data.total;
                        resolve();
                    }).catch(err => {
                        reject(err);
                    })
                });
            },
            loadDepartment() {
                getDepartmentCascader().then(response => {
                    this.departmentCascader = response.data
                })
            },
            loadRoleUser(roleId) {
                let query = {roleId}
                return new Promise((resolve, reject) => {
                    getAllUserRole(query).then(response => {
                        resolve(response.data)
                    }).catch(err => {
                        reject(err)
                    })
                });
            },
            loadMenuTree() {
                getMenuTree().then(response => {
                    this.menuTree = response.data
                })
            },
            loadRoleMenu(roleId) {
                let query = {roleId}
                return new Promise((resolve, reject) => {
                    getAllRoleMenu(query).then(response => {
                        resolve(response.data)
                    }).catch(err => {
                        reject(err)
                    })
                });
            },
            handleSizeChange(val) {
                this.listQuery.size = val;
                this.reloadList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.reloadList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            handleSizeChangeRoleUser(val) {
                this.userListQuery.size = val;
                this.loadUserList().then(() => {
                    this.checkRelatedUserRows();
                });
            },
            handleCurrentChangeRoleUser(val) {
                this.userListQuery.page = val;
                this.loadUserList().then(() => {
                    this.checkRelatedUserRows();
                });
            },
            checkRelatedUserRows() {
                if (this.selectAllUserId && this.selectAllUserId.length > 0) {
                    for (let row of this.userList) {
                        if (this.selectAllUserId.includes(row.id)) {
                            this.$refs['roleUserTable'].toggleRowSelection(row, true)
                        }
                    }
                }
            },
            handleSelectionChangeRoleUser(rows) {
                this.selectedRowsUser = rows;
            },
            selectRowUser(selection, row) {
                let i = this.selectAllUserId.indexOf(row.id)
                if (i < 0) {
                    this.selectAllUserId.push(row.id)
                } else {
                    this.selectAllUserId.splice(i, 1)
                }
            },
            selectAllUser(selection) {
                if (selection.length > 0) {
                    for (let user of this.userList) {
                        if (this.selectAllUserId.indexOf(user.id) < 0) {
                            this.selectAllUserId.push(user.id)
                        }
                    }
                } else {
                    for (let user of this.userList) {
                        let i = this.selectAllUserId.indexOf(user.id)
                        if (i >= 0) {
                            this.selectAllUserId.splice(i, 1)
                        }
                    }
                }
            },
            reloadUserList() {
                this.handleCurrentChangeRoleUser(1)
            },
            handleDepartmentChange(val) {
                if (val.length > 0) {
                    this.userListQuery.departmentId = val[val.length - 1]
                } else {
                    this.userListQuery.departmentId = undefined
                }
            },
            handleShowRelated(checked) {
                if (checked) {
                    this.userListQuery.roleId = this.currentRow.id;
                } else {
                    this.userListQuery.roleId = undefined;
                }
                this.reloadUserList();
            },
            btnCreate() {
                this.resetRole();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row) {
                this.resetRole();
                if (row.id) {
                    this.role = deepClone(row);
                } else {
                    this.role = deepClone(this.selectedRows[0]);
                }
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row) {
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            btnRoleUser(row) {
                this.currentRow = row;
                this.dialogRoleUserVisible = true;
                this.dialogFormLoading = true;
                this.selectAllUserId = [];
                this.loadRoleUser(row.id).then(res => {
                    if (res && res.length > 0) {
                        for (let roleUser of res) {
                            this.selectAllUserId.push(roleUser.userId)
                        }
                        this.showRelatedFlag = true;
                        this.handleShowRelated(true);
                    } else {
                        this.showRelatedFlag = false;
                        this.handleShowRelated(false);
                    }
                })
            },
            btnRoleMenu(row) {
                this.currentRow = row;
                this.dialogRoleMenuVisible = true;
                this.dialogFormLoading = true;
                this.loadRoleMenu(row.id).then(res => {
                    for (let roleMenu of res) {
                        this.$refs['roleMenuTree'].setChecked(roleMenu.menuId, true, false)
                    }
                    this.dialogFormLoading = false
                })
            },
            doCreate() {
                this.$refs['roleDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateRole(this.role).then(() => {
                            this.resetRoleDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate() {
                this.$refs['roleDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateRole(this.role).then(() => {
                            this.resetRoleDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids) {
                this.listLoading = true;
                delRoles(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            doSaveRoleUser() {
                this.submitLoading = true;
                setRoleUsers(this.currentRow.id, this.selectAllUserId).then(() => {
                    this.closeRoleUserDialog();
                    this.$message.success(this.$t("table.updateSuccess"));
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
            doSaveRoleMenu() {
                this.submitLoading = true;
                let checkedKeys = this.$refs['roleMenuTree'].getCheckedKeys(false);
                setRoleMenus(this.currentRow.id, checkedKeys).then(() => {
                    this.closeRoleMenuDialog();
                    this.$message.success(this.$t("table.updateSuccess"));
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
            resetRole() {
                this.role = {
                    id: undefined,
                    name: undefined,
                    type: undefined
                }
            },
            resetRoleDialogAndList() {
                this.closeRoleDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeRoleDialog() {
                this.dialogVisible = false;
                this.resetRole();
                this.$refs['roleDialogForm'].resetFields();
            },
            closeRoleUserDialog() {
                this.dialogRoleUserVisible = false;
                this.submitLoading = false;
            },
            closeRoleMenuDialog() {
                this.dialogRoleMenuVisible = false;
                this.submitLoading = false;
                this.$refs['roleMenuTree'].setCheckedKeys([])
            },
            menuTreeChecked(node, tree) {
                let checkedKeys = tree.checkedKeys
                if (checkedKeys.includes(node.id)) {
                    checkedKeys.push.apply(checkedKeys, getParentKeys(node, this.menuTree))
                    checkedKeys.push.apply(checkedKeys, getChildrenKeys(node))
                } else {
                    for (let key of getChildrenKeys(node)) {
                        if (checkedKeys.includes(key)) {
                            checkedKeys.splice(checkedKeys.indexOf(key), 1)
                        }
                    }
                }
                this.$refs['roleMenuTree'].setCheckedKeys(checkedKeys)
            }
        }
    }
</script>

<style>
    .search{
        margin-bottom: 20px;
    }
    .search-item {
        margin-right: 8px;
    }
    .dialog-keywords {
        width: 180px;
        height: 30px;
        line-height: 30px;
    }
</style>
