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
                <el-table-column align="center" label="角色类型" prop="type">
                    <template slot-scope="scope">
                        <span>{{scope.row.type | enums('RoleTypeEnum')}}</span>
                    </template>
                </el-table-column>
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
                        <el-button v-if="btnEnable.role_users" title="关联用户" type="primary" icon="iconadd-account"
                                   :size="btnSize" circle @click.stop.safe="btnRoleUser(scope.row)"></el-button>
                        <el-button v-if="btnEnable.role_menus" title="关联菜单" type="primary" icon="iconcaidan1"
                                   :size="btnSize" circle @click.stop.safe="btnRoleMenu(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger"
                                   icon="el-icon-delete" :size="btnSize" circle
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
                            <el-form-item label="角色类型" prop="type">
                                <el-select v-model="role.type">
                                    <el-option v-for="item in enums['RoleTypeEnum']" :key="item.code"
                                               :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
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

            <relation-user :visible="dialogRoleUserVisible" :selectedUserId="selectedUserId"
                           :submitLoading="submitLoading" :queryParams="roleUserQueryParams"
                           :showRelated="showRelatedUser" :submit="doSaveRoleUser" :cancel="closeRoleUserDialog"></relation-user>

            <el-dialog :title="titleMap['associateMenu']" :visible.sync="dialogRoleMenuVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeRoleMenuDialog">
                <el-form style="width: 80%; margin-left:10%;" v-loading="dialogFormLoading">
                    <el-tree ref="roleMenuTree" :data="menuTree" show-checkbox node-key="id" :default-expand-all="true"
                             @check="menuTreeChecked" :check-strictly="true"></el-tree>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveRoleMenu"
                               :loading="submitLoading">{{$t('table.confirm')}}
                    </el-button>
                    <el-button :size="btnSize" @click="closeRoleMenuDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {getChildrenKeys, getParentKeys} from "@/util/treeUtils";
    import {createOrUpdateRole, delRoles, getRoleList} from '@/api/admin/role';
    import {getAllUserRole, setRoleUsers} from "@/api/admin/userRole";
    import {getMenuTree} from "@/api/admin/menu";
    import {getAllRoleMenu, setRoleMenus} from "@/api/admin/roleMenu";
    import relationUser from '@/components/relationUser';

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
                roleUserQueryParams: {
                    roleId: undefined
                },
                selectedUserId: [],
                userList: [],
                menuTree: [],
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
                    role_users: this.permission.role_users,
                    role_menus: this.permission.role_menus
                };
            }
        },
        components: {relationUser},
        created() {
            this.reloadList();
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
                this.selectedUserId = [];
                this.roleUserQueryParams.roleId = row.id;
                this.loadRoleUser(row.id).then(res => {
                    if (res && res.length > 0) {
                        for (let roleUser of res) {
                            this.selectedUserId.push(roleUser.userId)
                        }
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
            showRelatedUser(checked){
                if(checked){
                    this.roleUserQueryParams.roleId = this.currentRow.id;
                }else{
                    this.roleUserQueryParams.roleId = undefined;
                }
            },
            doSaveRoleUser() {
                this.submitLoading = true;
                setRoleUsers(this.currentRow.id, this.selectedUserId).then(() => {
                    this.dialogRoleUserVisible = false;
                    this.submitLoading = false;
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
            closeRoleUserDialog(){
                this.submitLoading = false;
                this.dialogRoleUserVisible = false;
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


