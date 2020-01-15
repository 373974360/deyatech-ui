<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.catalog" type="primary" :size="btnSize"
                               @click="btnBatchCatalog" :disabled="selectedUserIds.length < 1">批量关联栏目</el-button>
                    <el-button v-if="btnEnable.role" type="primary" :size="btnSize"
                               @click="btnBatchRole" :disabled="selectedUserIds.length < 1">批量关联角色</el-button>
                    <el-button v-if="btnEnable.content" type="primary" :size="btnSize"
                               @click="btnBatchContent" :disabled="selectedUserIds.length < 1">批量数据权限</el-button>
                    <el-button type="primary" :size="btnSize"
                               @click="btnBatchClear" :disabled="selectedUserIds.length < 1">清除选中用户</el-button>

                    <el-input :size="searchSize" placeholder="姓名、账号" v-model.trim="listQuery.name" maxlength="50"
                              style="width: 200px; margin-left: 10px; margin-right: 10px;"></el-input>
                    <el-cascader filterable :options="departmentCascader"
                                 v-model.trim="selectedDepartmentArray"
                                 @change="selectedDepartmentChange" clearable
                                 placeholder="部门" :size="btnSize" style="width: 400px; margin-right: 10px;"></el-cascader>
                    <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <span v-if="selectedUserIds.length > 0" style="color: #fab6b6; margin-right: 20px">批量选中{{selectedUserIds.length}}个用户</span>
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table ref="stationUserTable" :data="stationUserList" v-loading.body="listLoading" border highlight-current-row
                      @selection-change="handleSelectionChange" @select="handleSelect" @select-all="handleSelectAll">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="left" label="UserId" prop="userId" width="200"/>
                <el-table-column align="left" label="姓名" prop="name" width="200"/>
                <el-table-column align="left" label="账号" prop="account" width="200"/>
                <el-table-column aligin="left" label="部门层级" prop="userTreePositionName"/>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="220">
                    <template slot-scope="scope">
                        <div style="padding-top: 8px;">
                            <el-badge :hidden="scope.row.catalogCount <= 0 || !btnEnable.catalog" :value="scope.row.catalogCount"
                                      :max="99" style="margin-right:20px">
                                <el-button v-if="btnEnable.catalog" title="关联栏目" type="primary" icon="el-icon-menu" :size="btnSize" circle
                                           @click.stop.safe="btnCatalog(scope.row)"></el-button>
                            </el-badge>

                            <el-badge :hidden="scope.row.roleCount <= 0 || !btnEnable.role" :value="scope.row.roleCount"
                                      :max="99" style="margin-right:20px">
                                <el-button v-if="btnEnable.role" title="关联角色" type="primary" icon="el-icon-s-grid" :size="btnSize" circle
                                           @click.stop.safe="btnRole(scope.row)"></el-button>
                            </el-badge>

                            <el-badge :hidden="!scope.row.authority || !btnEnable.content" :value="scope.row.authority | enums('TemplateAuthorityEnum')"
                                      :max="99" style="margin-right:20px">
                                <el-button v-if="btnEnable.content" title="数据权限" type="primary" icon="el-icon-tickets" :size="btnSize" circle
                                           @click.stop.safe="btnContent(scope.row)"></el-button>
                            </el-badge>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <!--关联栏目-->
            <el-dialog title="关联栏目" :visible.sync="dialogCatalogVisible" :close-on-click-modal="closeOnClickModal" @close="closeCatalogDialog">
                <div style="width: 80%; margin-left: 120px; margin-bottom: 10px; color: #fab6b6;" v-if="optionFlag === MULTIPLE">批量关联用户时选中的是所有用户的交集栏目</div>
                <div style="width: 80%; margin-left: 100px; height: 500px; overflow-y: scroll;">
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
                    <el-button type="primary" :size="btnSize" @click="doSaveUserCatalog" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeCatalogDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>


            <!--关联角色-->
            <el-dialog title="关联角色" :visible.sync="dialogRoleVisible" :close-on-click-modal="closeOnClickModal" @close="closeRoleDialog">
                <div style="width: 80%; margin-left:10%;">
                    <div class="deyatech-container pull-auto">
                        <el-table ref="userRoleTable" :data="roleList" border highlight-current-row height="500" style="margin: 10px;"
                                  @selection-change="handleRoleSelectionChange">
                            <el-table-column type="selection" width="50" align="center"/>
                            <el-table-column align="left" label="角色" prop="name"/>
                            <el-table-column align="center" label="角色类型" prop="type">
                                <template slot-scope="scope">
                                    <span>{{scope.row.type | enums('RoleTypeEnum')}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveUserRole" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeRoleDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>


            <!--数据权限-->
            <el-dialog title="数据权限" :visible.sync="dialogContentVisible" :close-on-click-modal="closeOnClickModal" @close="closeContentDialog">
                <el-form style="width: 80%; margin-left:10%;">
                    <el-radio v-model="templateAuthority"
                              v-for="item in enums['TemplateAuthorityEnum']"
                              :label="item.code"
                              :key="item.code"
                              border>{{item.value}}</el-radio>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button :size="btnSize" @click="clearAuthority">清除</el-button>
                    <el-button type="primary" :size="btnSize" @click="doSaveContentUser" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
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
    import {getDepartmentCascader} from '@/api/admin/department';
    import {pageStationGroupUser} from "@/api/resource/stationGroupUser";
    import {getCatalogTreeBySiteIds} from '@/api/station/catalog';
    import {setUsersCatalogs, getUsersCatalogs} from '@/api/station/catalogUser'
    import {getUsersRoles, setUsersRoles} from "@/api/admin/roleUser";
    import {getAllRole} from "@/api/admin/role";
    import {getUsersAuthority, setUsersAuthority} from '@/api/station/templateUserAuthority'

    export default {
        name: 'authorization',
        data() {
            return {
                selectedDepartmentArray: [],
                departmentCascader: [],
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    stationGroupId: undefined,
                    departmentId: undefined,
                    name: undefined
                },
                stationUserList: [],
                selectedRows: [],
                selectedUserIds: [],
                selectedUserId: undefined,

                // 关联栏目
                catalogTree: [],
                dialogCatalogVisible: false,
                stationGroupList: [],
                defaultTreeProps: {
                    children: 'children',
                    label: 'name',
                    isLeaf: 'leaf'
                },
                userCatalogIdList: [],

                // 关联角色
                roleList: [],
                dialogRoleVisible: undefined,
                userRoleIdList: [],
                selectedRoleRows: [],

                // 数据权限
                dialogContentVisible: undefined,
                templateAuthority: undefined,

                optionFlag: undefined,
                SINGLE: 'single',
                MULTIPLE: 'multiple',
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
                    catalog: this.permission.authorization_catalog,
                    role: this.permission.authorization_role,
                    content: this.permission.authorization_content
                };
            }
        },
        created() {
            this.$store.state.common.selectSiteDisplay = true;
            if (this.$store.state.common.siteId != undefined) {
                this.listQuery.stationGroupId = this.$store.state.common.siteId;
                this.getDepartmentCascader();
                this.reloadList();
                this.getSiteCatalogTree();
                this.getRoleList();
            }
        },
        methods: {
            getRoleList() {
                getAllRole().then(response => {
                    this.roleList = response.data;
                })
            },
            getSiteCatalogTree() {
                let siteIds = [];
                siteIds.push(this.$store.state.common.siteId);
                getCatalogTreeBySiteIds(siteIds).then(response => {
                    this.catalogTree = response.data;
                });
            },
            getDepartmentCascader() {
                getDepartmentCascader().then(response => {
                    this.departmentCascader = response.data;
                })
            },
            selectedDepartmentChange(v) {
                if (v.length > 0) {
                    this.listQuery.departmentId = v[v.length - 1];
                } else {
                    this.listQuery.departmentId = undefined;
                }
            },
            resetSearch() {
                this.listQuery.name = undefined;
                this.listQuery.departmentId = undefined;
                this.selectedDepartmentArray = [];
            },
            btnBatchClear() {
                this.$refs['stationUserTable'].clearSelection();
                this.selectedUserIds = [];
            },
            reloadList(){
                this.listLoading = true;
                this.stationUserList = undefined;
                pageStationGroupUser(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.stationUserList = response.data.records;
                    this.total = response.data.total;
                    this.checkSelectedUser();
                })
            },
            checkSelectedUser() {
                this.$nextTick(()=>{
                    if (this.stationUserList && this.stationUserList.length > 0 && this.selectedUserIds.length > 0) {
                        for (let item of this.stationUserList) {
                            if (this.selectedUserIds.includes(item.userId)) {
                                this.$refs['stationUserTable'].toggleRowSelection(item, true);
                            }
                        }
                    }
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
            handleSelectionChange(selection) {
                this.selectedRows = selection;
            },
            handleSelect(selection, row) {
                let i = this.selectedUserIds.indexOf(row.userId);
                if (i < 0) {
                    this.selectedUserIds.push(row.userId);
                } else {
                    this.selectedUserIds.splice(i, 1);
                }
            },
            handleSelectAll(selection) {
                if (selection.length > 0) {
                    for (let row of this.stationUserList) {
                        if (this.selectedUserIds.indexOf(row.userId) < 0) {
                            this.selectedUserIds.push(row.userId);
                        }
                    }
                } else {
                    for (let row of this.stationUserList) {
                        let i = this.selectedUserIds.indexOf(row.userId);
                        if (i >= 0) {
                            this.selectedUserIds.splice(i, 1)
                        }
                    }
                }
            },



            // 关联栏目
            btnCatalog(row) {
                this.optionFlag = this.SINGLE;
                let userIds = [];
                userIds.push(row.userId);
                this.selectedUserId = row.userId;
                this.getUsersCatalogsByUserIds(userIds);
                this.dialogCatalogVisible = true;
            },
            // 批量关联栏目
            btnBatchCatalog() {
                this.optionFlag = this.MULTIPLE;
                this.getUsersCatalogsByUserIds(this.selectedUserIds);
                this.dialogCatalogVisible = true;
            },
            getUsersCatalogsByUserIds(userIds) {
                if (!userIds || userIds.length == 0) {
                    this.$message.error("没有选择用户");
                    return;
                }
                this.userCatalogIdList = [];
                getUsersCatalogs(userIds).then(response => {
                    this.userCatalogIdList = response.data;
                    this.checkUserCatalog();
                }).catch((err)=>{
                    this.$message.error(err);
                });
            },
            checkUserCatalog() {
                this.$nextTick(()=>{
                    // 选中已分配的栏目
                    if (this.userCatalogIdList && this.userCatalogIdList.length > 0) {
                        for (let catalogId of this.userCatalogIdList) {
                            this.$refs['catalogTree'].setChecked(catalogId, true, false);
                        }
                    }
                });
            },
            closeCatalogDialog() {
                this.submitLoading = false;
                this.optionFlag = undefined;
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
            doSaveUserCatalog() {
                let userIds = [];
                if (this.optionFlag === this.SINGLE) {
                    userIds.push(this.selectedUserId);
                } else if (this.optionFlag === this.MULTIPLE) {
                    userIds = this.selectedUserIds;
                } else {
                    this.$message.error("请选择操作");
                    return;
                }
                if (!userIds || userIds.length == 0) {
                    this.$message.error("请选择用户");
                    return;
                }
                let catalogIds = this.$refs['catalogTree'].getCheckedKeys(false);
                this.submitLoading = true;
                setUsersCatalogs(userIds, catalogIds, this.listQuery.stationGroupId).then(() => {
                    this.closeCatalogDialog();
                    this.reloadList();
                    this.$message.success("栏目关联成功");
                }).catch(() => {
                    this.$message.error("栏目关联失败")
                    this.submitLoading = false;
                })
            },


            // 关联角色
            btnRole(row) {
                this.optionFlag = this.SINGLE;
                let userIds = [];
                userIds.push(row.userId);
                this.selectedUserId = row.userId;
                this.getUsersRolesByUserIds(userIds);
                this.dialogRoleVisible = true;
            },
            btnBatchRole() {
                this.optionFlag = this.MULTIPLE;
                this.getUsersRolesByUserIds(this.selectedUserIds);
                this.dialogRoleVisible = true;
            },
            getUsersRolesByUserIds(userIds) {
                if (!userIds || userIds.length == 0) {
                    this.$message.error("没有选择用户");
                    return;
                }
                this.userRoleIdList = [];
                getUsersRoles(userIds).then(response => {
                    this.userRoleIdList = response.data;
                    this.checkUserRole();
                });
            },
            checkUserRole() {
                this.$nextTick(()=>{
                    // 选中已分配的角色
                    if (this.roleList && this.roleList.length > 0 && this.userRoleIdList.length > 0) {
                        for (let item of this.roleList) {
                            if (this.userRoleIdList.includes(item.id)) {
                                this.$refs['userRoleTable'].toggleRowSelection(item, true);
                            }

                        }
                    }
                });
            },
            closeRoleDialog() {
                this.dialogRoleVisible = false;
                this.submitLoading = false;
                this.selectedRoleRows = [];
                this.userRoleIdList = [];
                this.$refs['userRoleTable'].clearSelection();
            },
            handleRoleSelectionChange(rows) {
                this.selectedRoleRows = rows;
            },
            doSaveUserRole() {
                let userIds = [];
                if (this.optionFlag === this.SINGLE) {
                    userIds.push(this.selectedUserId);
                } else if (this.optionFlag === this.MULTIPLE) {
                    userIds = this.selectedUserIds;
                } else {
                    this.$message.error("请选择操作");
                    return;
                }
                if (!userIds || userIds.length == 0) {
                    this.$message.error("请选择用户");
                    return;
                }
                let roleIds = [];
                if (this.selectedRoleRows.length > 0) {
                    for (let item of this.selectedRoleRows) {
                        roleIds.push(item.id);
                    }
                }
                this.submitLoading = true;
                setUsersRoles(userIds, roleIds).then(() => {
                    this.closeRoleDialog();
                    this.reloadList();
                    this.$message.success("角色关联成功");
                }).catch(() => {
                    this.$message.error("角色关联失败");
                    this.submitLoading = false;
                })
            },


            // 数据权限
            btnContent(row) {
                this.optionFlag = this.SINGLE;
                let userIds = [];
                userIds.push(row.userId);
                this.selectedUserId = row.userId;
                this.getUsersAuthorityByUserIds(userIds);
                this.dialogContentVisible = true;
            },
            btnBatchContent() {
                this.optionFlag = this.MULTIPLE;
                this.getUsersAuthorityByUserIds(this.selectedUserIds);
                this.dialogContentVisible = true;
            },
            getUsersAuthorityByUserIds(userIds) {
                if (!userIds || userIds.length == 0) {
                    this.$message.error("没有选择用户");
                    return;
                }
                this.templateAuthority = undefined;
                getUsersAuthority(userIds).then((response)=>{
                    this.templateAuthority = response.data;
                }).catch((err)=>{
                    this.$message.error(err);
                });
            },
            closeContentDialog() {
                this.dialogContentVisible = false;
                this.submitLoading = false;
                this.templateAuthority = undefined;
            },
            clearAuthority(){
                this.templateAuthority = undefined;
            },
            doSaveContentUser() {
                let userIds = [];
                if (this.optionFlag === this.SINGLE) {
                    userIds.push(this.selectedUserId);
                } else if (this.optionFlag === this.MULTIPLE) {
                    userIds = this.selectedUserIds;
                } else {
                    this.$message.error("请选择操作");
                    return;
                }
                if (!userIds || userIds.length == 0) {
                    this.$message.error("请选择用户");
                    return;
                }
                setUsersAuthority(userIds, this.templateAuthority).then((response)=>{
                    if (response.data) {
                        this.closeContentDialog();
                        this.reloadList();
                        this.$message.success("权限设置成功")
                    } else {
                        this.$message.error("权限设置失败")
                    }
                });
            }


        }
    }
</script>



