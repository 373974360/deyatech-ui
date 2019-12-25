<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')"
                                  v-model.trim="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="btnSearch">
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
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="400">
                    <template slot-scope="scope">
                        <div style="padding-top: 8px;">
                            <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary"
                                       icon="el-icon-edit" :size="btnSize" circle
                                       @click.stop.safe="btnUpdate(scope.row)" style="margin-right:10px"></el-button>

                            <el-badge :hidden="scope.row.roleMenusCount <= 0 || !btnEnable.role_users" :value="scope.row.roleMenusCount"
                                      :max="99" style="margin-right:20px">
                                <el-button v-if="btnEnable.role_menus" title="关联菜单" type="primary" icon="iconcaidan1"
                                           :size="btnSize" circle @click.stop.safe="btnRoleMenu(scope.row)"></el-button>
                            </el-badge>

                            <el-badge :hidden="scope.row.roleUsersCount <= 0 || !btnEnable.role_menus" :value="scope.row.roleUsersCount"
                                      :max="99" style="margin-right:20px">
                                <el-button v-if="btnEnable.role_users" title="关联用户" type="primary" icon="iconadd-account"
                                           :size="btnSize" circle @click.stop.safe="btnRoleUser(scope.row)"></el-button>
                            </el-badge>

                            <el-badge :hidden="scope.row.stationCount <= 0 || !btnEnable.station" :value="scope.row.stationCount"
                                      :max="99" style="margin-right:20px">
                                <el-button v-if="btnEnable.station" title="关联站点" type="primary" icon="iconlogistic"
                                           :size="btnSize" circle @click.stop="btnStationGroup(scope.row)"></el-button>
                            </el-badge>

                            <el-badge :hidden="scope.row.catalogCount <= 0 || !btnEnable.catalog" :value="scope.row.catalogCount"
                                      :max="99" style="margin-right:20px">
                                <el-button v-if="btnEnable.catalog" title="关联栏目" type="primary" icon="iconviewgallery" :disabled="scope.row.stationCount <= 0"
                                           :size="btnSize" circle @click.stop.safe="btnCatalog(scope.row)"></el-button>
                            </el-badge>

                            <el-badge :hidden="scope.row.contentCount <= 0 || !btnEnable.content" :value="scope.row.contentCount"
                                      :max="99" style="margin-right:20px">
                                <el-button v-if="btnEnable.content" title="内容权限" type="primary" icon="iconviewlist"
                                           :size="btnSize" circle @click.stop.safe="btnContent(scope.row)"></el-button>
                            </el-badge>

                            <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger"
                                       icon="el-icon-delete" :size="btnSize" circle
                                       @click.stop.safe="btnDelete(scope.row)"></el-button>
                        </div>
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
                                <el-input v-model.trim="role.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="角色类型" prop="type">
                                <el-select filterable v-model.trim="role.type">
                                    <el-option v-for="item in enums['RoleTypeEnum']" :key="item.code" :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model.trim="role.remark" :rows="3"/>
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

            <!--关联用户-->
            <el-dialog :title="titleMap['associateUser']" :visible.sync="dialogRoleUserVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeRoleUserDialog">
                <div v-loading="dialogFormLoading">
                    <div class="dialog-search">
                        <el-cascader filterable :options="departmentCascader" @change="handleDepartmentChange"
                                     class="dialog-search-item dialog-keywords"
                                     :show-all-levels="false" expand-trigger="hover" clearable change-on-select
                                     :size="searchSize" placeholder="根据部门筛选"></el-cascader>
                        <el-input v-model.trim="userListQuery.name" class="dialog-search-item dialog-keywords"
                                  clearable :size="searchSize" placeholder="根据姓名或帐户查询"></el-input>
                        <el-button type="primary" :size="searchSize" icon="el-icon-search" @click="reloadUserList">{{$t('table.search')}}</el-button>
                    </div>
                    <div class="dialog-search">
                        <el-checkbox v-model.trim="showRelatedFlag" @change="handleShowRelated">只显示已关联用户</el-checkbox>
                    </div>
                    <div>
                        <el-table ref="roleUserTable" :data="userList" border @select="selectRowUser"
                                  @select-all="selectAllUser" @selection-change="handleSelectionChangeRoleUser">
                            <el-table-column type="selection" width="50" align="center"></el-table-column>
                            <el-table-column prop="departmentName" label="部门"></el-table-column>
                            <el-table-column prop="name" label="姓名"></el-table-column>
                            <el-table-column prop="account" label="登录帐户"></el-table-column>
                        </el-table>
                        <el-pagination class="deyatech-pagination pull-right" background
                                       :current-page.sync="userListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                       :page-size="userListQuery.size" :layout="this.$store.state.common.pageLayout" :total="userTotal"
                                       @size-change="handleSizeChangeRoleUser" @current-change="handleCurrentChangeRoleUser">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveRoleUser"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeRoleUserDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>

            <!--关联菜单-->
            <el-dialog :title="titleMap['associateMenu']" :visible.sync="dialogRoleMenuVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeRoleMenuDialog">
                <el-form style="width: 80%; margin-left:10%;" v-loading="dialogFormLoading">
                    <el-tree ref="roleMenuTree" :data="menuTree" show-checkbox node-key="id" :default-expand-all="true"
                             @check="menuTreeChecked" :check-strictly="true"></el-tree>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveRoleMenu"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeRoleMenuDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>


            <el-dialog title="关联站点" :visible.sync="dialogStationVisible" :close-on-click-modal="closeOnClickModal" @close="closeStationDialog">
                <el-form style="width: 80%; margin-left:10%;" v-loading="treeLoading">
                    <el-tree ref="stationTree"
                             :data="stationGroupList"
                             show-checkbox
                             node-key="value"
                             :default-expand-all="true"
                             :expand-on-click-node="false"></el-tree>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveRoleStations" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeStationDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>


            <el-dialog title="关联栏目" :visible.sync="dialogCatalogVisible" :close-on-click-modal="closeOnClickModal" @close="closeCatalogDialog">
                <el-form style="width: 80%; margin-left:10%;" :inline="true">
                    <el-form-item>
                        <el-cascader filterable placeholder="请选择站点"
                                     :options="roleStationCascader"
                                     v-model="selectedRoleStationCascaderArray"
                                     :show-all-levels="false"
                                     clearable :size="searchSize"
                                     @change="stationGroupChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="btnCatalogSearch">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetCatalogSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
                <div style="width: 80%; margin-left:10%;height: 500px; overflow-y: scroll;">
                    <el-tree ref="catalogTree"
                             :data="catalogTree"
                             show-checkbox
                             node-key="id"
                             :props="defaultTreeProps"
                             :default-expand-all="false"
                             :expand-on-click-node="false"
                             @check="catalogTreeChecked" :check-strictly="true"></el-tree>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveCatalogRole" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeCatalogDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>


            <el-dialog title="设置内容权限" :visible.sync="dialogContentVisible" :close-on-click-modal="closeOnClickModal" @close="closeContentDialog">
                <el-form style="width: 80%; margin-left:10%;">
                    <el-radio v-model="templateAuthority"
                              v-for="item in enums['TemplateAuthorityEnum']"
                              :label="item.code"
                              :key="item.code"
                              border>{{item.value}}</el-radio>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button :size="btnSize" @click="clearAuthority">清除</el-button>
                    <el-button type="primary" :size="btnSize" @click="doSaveContentRole" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeContentDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>

        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {getNodeData, getParentKeys, getChildrenKeys} from "@/util/treeUtils";
    import {
        getRoleList,
        createOrUpdateRole,
        delRoles,
        countRoleByName
    } from '@/api/admin/role';
    import {getDepartmentCascader} from "@/api/admin/department";
    import {getAllRoleUser,getRoleUserList, setRoleUsers} from "@/api/admin/roleUser";
    import {getMenuTree} from "@/api/admin/menu";
    import {getAllRoleMenu, setRoleMenus} from "@/api/admin/roleMenu";
    import {isStartOrEndWithWhiteSpace} from '@/util/validate';
    import {getRoleStationCascader, getAllStationCascader} from '@/api/resource/stationGroup';
    import {getAllRoleStationGroup, setRoleStationGroups, delStationGroupRoleByRoleIds} from "@/api/resource/stationGroupRole";
    import {getCatalogTreeBySiteIds} from '@/api/station/catalog';
    import {getAllRoleCatalogs, setRoleCatalogs, delCatalogRoleByRoleIds} from '@/api/station/catalogRole'
    import {getRoleAuthority, setRoleAuthority, getRoleViewCount, delTemplateRoleAuthorityByRoleIds} from '@/api/station/templateRoleAuthority'

    export default {
        name: 'role',
        data() {
            const validateName = (rule, value, callback) => {
                // 空格检查
                if (isStartOrEndWithWhiteSpace(value)) {
                    callback(new Error(this.$t("errorMsg.blankSpace")));
                    return;
                }
                // 角色名未修改不用检查
                if (this.roleName != value) {
                    countRoleByName(value).then(response => {
                        if (response.data > 0) {
                            callback(new Error('角色已经存在'))
                        } else {
                            callback();
                        }
                    }).catch(() => {
                        callback(new Error('检查角色名时出错'))
                    })
                } else {
                    callback();
                }
            };
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
                roleName: undefined,
                roleRules: {
                    name: [
                        {required: true, whitespace: true, message: this.$t("table.pleaseInput") + '角色名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: this.$t("table.pleaseInput") + '角色类型(1:业务角色;2:管理角色 ;3:系统内置角色)'}
                    ],
                    remark: [
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
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
                showRelatedFlag: false,
                dialogStationVisible: false, // 关联站点
                treeLoading: false,
                stationGroupList: [], // 所有的站点
                roleStationGroupList: [], // 角色已关联站点
                dialogCatalogVisible: false, // 关联栏目
                roleStationCascader: [], // 登陆用户关联角色的已关联站点
                selectedRoleStationCascaderArray: [],
                roleCatalogList: [],
                catalogTree: [],
                defaultTreeProps: {
                    children: 'children',
                    label: 'name',
                    isLeaf: 'leaf'
                },
                siteId: undefined,
                dialogContentVisible: false,
                templateAuthority: undefined,

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
                    role_menus: this.permission.role_menus,
                    station: this.permission.role_station_group,
                    catalog: this.permission.role_catalog,
                    content: this.permission.role_content
                };
            }
        },
        created() {
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
            this.loadDepartment();
            this.loadMenuTree();
            this.getAllStationGroup();
        },
        methods: {
            btnSearch() {
                this.listQuery.page = 1;
                this.reloadList();
            },
            resetSearch() {
                this.listQuery.name = undefined;
            },
            reloadList() {
                this.listLoading = true;
                this.roleList = undefined;
                getRoleList(this.listQuery).then(response => {
                    let _roleList = response.data.records;
                    let _total = response.data.total;
                    if (_roleList) {
                        let roleIds = [];
                        for (let r of _roleList) {
                            roleIds.push(r.id);
                        }
                        getRoleViewCount(roleIds).then(response=>{
                            this.listLoading = false;
                            let countList = response.data;
                            for (let r of _roleList) {
                                let count = countList[r.id].split('_');
                                this.$set(r, "stationCount", count[0]);
                                this.$set(r, "catalogCount", count[1]);
                                this.$set(r, "contentCount", count[2]);
                            }
                            this.roleList = _roleList;
                            this.total = _total;
                        });
                    }
                }).catch(()=>{
                    this.listLoading = false;
                    this.total = 0;
                });
            },
            loadUserList() {
                return new Promise((resolve, reject) => {
                    this.dialogFormLoading = true;
                    getRoleUserList(this.userListQuery).then(response => {
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
                    getAllRoleUser(query).then(response => {
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
                this.$nextTick(() => {
                    if (this.selectAllUserId && this.selectAllUserId.length > 0) {
                        for (let row of this.userList) {
                            if (this.selectAllUserId.includes(row.userId)) {
                                this.$refs['roleUserTable'].toggleRowSelection(row, true)
                            }
                        }
                    }
                });
            },
            handleSelectionChangeRoleUser(rows) {
                this.selectedRowsUser = rows;
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
                this.roleName = this.role.name;
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
                    delStationGroupRoleByRoleIds(ids).then(()=>{});
                    delCatalogRoleByRoleIds(ids).then(()=>{});
                    delTemplateRoleAuthorityByRoleIds(ids).then(()=>{});
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            doSaveRoleUser() {
                this.submitLoading = true;
                setRoleUsers(this.currentRow.id, this.selectAllUserId).then(() => {
                    this.closeRoleUserDialog();
                    this.reloadList();
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
                    this.reloadList();
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
                this.roleName = "";
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
            },


            // 关联站点
            btnStationGroup(row) {
                this.currentRow = row;
                this.dialogStationVisible = true;
                // 加载角色已关联站点
                this.loadRoleStationGroup(row.id);
            },
            closeStationDialog() {
                this.currentRow = undefined;
                this.submitLoading = false;
                this.dialogStationVisible = false;
                this.roleStationGroupList = [];
                this.$refs['stationTree'].setCheckedKeys([])
            },
            doSaveRoleStations() {
                this.submitLoading = true;
                // 仅返回被选中的叶子节点的 keys
                let checkedKeys = this.$refs['stationTree'].getCheckedKeys(true);
                setRoleStationGroups(this.currentRow.id, checkedKeys).then(() => {
                    this.closeStationDialog();
                    this.reloadList();
                    this.$message.success(this.$t("table.associateSuccess"));
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
            getAllStationGroup() {
                this.stationGroupList = [];
                // 所有的站点
                getAllStationCascader().then(response => {
                    this.stationGroupList = response.data;
                })
            },
            loadRoleStationGroup(roleId) {
                this.treeLoading = true;
                // 角色已关联站点
                getAllRoleStationGroup({roleId: roleId}).then(response => {
                    this.roleStationGroupList = response.data;
                    this.treeLoading = false;
                    this.checkRoleStationGroup();
                }).catch(() => {
                    this.treeLoading = false;
                })
            },
            checkRoleStationGroup() {
                this.$nextTick(()=>{
                    // 选中角色已关联站点
                    if (this.roleStationGroupList && this.roleStationGroupList.length > 0) {
                        for (let sg of this.roleStationGroupList) {
                            this.$refs['stationTree'].setChecked(sg.stationGroupId, true, false);
                        }
                    }
                });
            },


            // 关联栏目
            btnCatalog(row) {
                this.currentRow = row;
                // 检索登陆角色关联的站点
                getRoleStationCascader({roleId: row.id}).then(response => {
                    this.roleStationCascader = response.data;
                    this.getCatalogTree();
                }).catch(err => {
                });
                this.dialogCatalogVisible = true;
            },
            getCatalogTree(){
                this.treeLoading = true;
                let siteIds = [];
                if (this.siteId) {
                    siteIds.push(this.siteId);
                } else {
                    siteIds = this.getSiteIds();
                }
                // 角色已关联站点的全部栏目
                getCatalogTreeBySiteIds(siteIds).then(response => {
                    this.catalogTree = response.data;
                    if (this.catalogTree && this.catalogTree.length > 0) {
                        // 角色已分配的栏目
                        getAllRoleCatalogs({roleId: this.currentRow.id}).then((response)=>{
                            this.roleCatalogList = response.data;
                            this.checkRoleCatalog();
                            this.treeLoading = false;
                        }).catch(()=>{
                            this.treeLoading = false;
                        });
                    } else {
                        this.treeLoading = false;
                    }
                }).catch(()=>{
                    this.treeLoading = false;
                });
            },
            getSiteIds() {
                let siteIds = [];
                if (this.roleStationCascader && this.roleStationCascader.length > 0) {
                    for(let node of this.roleStationCascader) {
                        siteIds.push.apply(siteIds, this.getLeaf(node));
                    }
                }
                return siteIds;
            },
            getLeaf(node) {
                let siteIds = [];
                // 叶子
                if (!node.children) {
                    siteIds.push(node.value);
                    return siteIds;
                } else {
                    for(let node of node.children) {
                        siteIds.push.apply(siteIds, this.getLeaf(node));
                    }
                    return siteIds;
                }
            },
            checkRoleCatalog() {
                this.$nextTick(()=>{
                    // 选中角色已分配的栏目
                    if (this.roleCatalogList && this.roleCatalogList.length > 0) {
                        for (let uc of this.roleCatalogList) {
                            this.$refs['catalogTree'].setChecked(uc.catalogId, true, false);
                        }
                    }
                });
            },
            closeCatalogDialog() {
                this.currentRow = undefined;
                this.roleCatalogList = [];
                this.selectedRoleStationCascaderArray = [];
                this.roleStationCascader = [];
                this.siteId = undefined;
                this.submitLoading = false;
                this.$refs['catalogTree'].setCheckedKeys([])
                this.dialogCatalogVisible = false;
            },
            catalogTreeChecked(node, tree) {
                let checkedKeys = tree.checkedKeys;
                // 选中时
                if (checkedKeys.includes(node.id)) {
                    // 选中父结点
                    checkedKeys.push.apply(checkedKeys, getParentKeys(node, this.catalogTree));
                    // 选中子节点
                    checkedKeys.push.apply(checkedKeys, getChildrenKeys(node))

                    // 取消时
                } else {
                    // 取消子节点
                    for (let key of getChildrenKeys(node)) {
                        if (checkedKeys.includes(key)) {
                            // 删除选中
                            checkedKeys.splice(checkedKeys.indexOf(key), 1);
                        }
                    }
                    // 取消父结点(没有子节点选中时)
                    if (node.parentId !== '0') {
                        let parent = getNodeData(this.catalogTree, 'id', node.parentId);
                        checkedKeys = this.dealParentNode(parent, checkedKeys);
                    }
                }
                this.$refs['catalogTree'].setCheckedKeys(checkedKeys)
            },
            dealParentNode(node, checkedKeys) {
                if (checkedKeys.includes(node.id)) {
                    let childrenKeys = getChildrenKeys(node);
                    let isChecked = false;
                    for (let key of childrenKeys) {
                        if (checkedKeys.includes(key)) {
                            isChecked = true;
                            break;
                        }
                    }
                    if (!isChecked) {
                        checkedKeys.splice(checkedKeys.indexOf(node.id), 1);
                        if (node.parentId !== '0') {
                            let parent = getNodeData(this.catalogTree, 'id', node.parentId);
                            checkedKeys = this.dealParentNode(parent, checkedKeys);
                        }
                    }
                }
                return checkedKeys;
            },
            doSaveCatalogRole() {
                this.submitLoading = true;
                let checkedKeys = this.$refs['catalogTree'].getCheckedKeys(false);
                setRoleCatalogs(this.currentRow.id, checkedKeys, this.siteId).then(() => {
                    this.closeCatalogDialog();
                    this.reloadList();
                    this.$message.success(this.$t("table.associateSuccess"));
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
            resetCatalogSearch() {
                this.selectedRoleStationCascaderArray = [];
                this.siteId = undefined;
            },
            stationGroupChange(v) {
                this.siteId = undefined;
                if (v.length > 0) {
                    this.siteId = v[v.length - 1];
                }
                this.btnCatalogSearch();
            },
            btnCatalogSearch() {
                this.getCatalogTree();
            },


            // 内容权限
            btnContent(row) {
                this.currentRow = row;
                getRoleAuthority({roleId: row.id}).then((response)=>{
                    this.templateAuthority = response.data;
                }).catch((err)=>{
                    this.$message.error(err);
                });
                this.dialogContentVisible = true;
            },
            closeContentDialog() {
                this.currentRow = undefined;
                this.dialogContentVisible = false;
                this.submitLoading = false;
                this.templateAuthority = undefined;
            },
            clearAuthority(){
                this.templateAuthority = undefined;
            },
            doSaveContentRole() {
                this.submitLoading = true;
                setRoleAuthority({roleId: this.currentRow.id, authority: this.templateAuthority}).then((response)=>{
                    if (response.data) {
                        this.closeContentDialog();
                        this.reloadList();
                        this.$message.success("设置成功")
                    } else {
                        this.$message.error("设置失败")
                    }
                });
            }
        }
    }
</script>
