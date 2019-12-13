<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="'名称、编码或LED编码'" v-model.trim="listQuery.name"></el-input>
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
            <el-table :data="windowList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="窗口名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="窗口编码" prop="code"/>
                <el-table-column align="center" label="窗口LED编码" prop="ledCode"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-badge class="badge" :value="scope.row.windowUserCount == 0 ? undefined : scope.row.windowUserCount" type="primary">
                            <el-button v-if="btnEnable.windowUsers" title="关联用户" type="primary" icon="iconadd-account"
                                       :size="btnSize" circle @click.stop.safe="btnWindowUsers(scope.row)"></el-button>
                        </el-badge>
                        <el-badge class="badge" :value="scope.row.windowItemCount == 0 ? undefined : scope.row.windowItemCount" type="primary">
                            <el-button v-if="btnEnable.windowItems" title="关联事项" type="primary" icon="iconcaidan1"
                                       :size="btnSize" circle @click.stop.safe="btnWindowItems(scope.row)"></el-button>
                        </el-badge>
                        <el-button class="badge" v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
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
                       :close-on-click-modal="closeOnClickModal" @close="closeWindowDialog">
                <el-form ref="windowDialogForm" class="deyatech-form" :model="window" label-position="right"
                         label-width="110px" :rules="windowRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="窗口名称" prop="name">
                                <el-input v-model.trim="window.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="窗口编码" prop="code">
                                <el-input v-model.trim="window.code"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="窗口LED编码" prop="ledCode">
                                <el-input v-model.trim="window.ledCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model="window.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeWindowDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
            <!-- 关联用户 -->
            <el-dialog :title="titleMap['associateUser']" :visible.sync="dialogWindowUserVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeWindowUserDialog">
                <div v-loading="dialogFormLoading">
                    <div class="dialog-search">
                        <el-cascader :options="departmentCascader" @change="handleDepartmentChange"
                                     class="dialog-search-item dialog-keywords"
                                     :show-all-levels="false" expand-trigger="hover" clearable change-on-select
                                     :size="searchSize" placeholder="根据部门筛选"></el-cascader>
                        <el-input v-model.trim="userListQuery.userName" class="dialog-search-item dialog-keywords"
                                  clearable :size="searchSize" placeholder="根据姓名或帐户查询"></el-input>
                        <el-button type="primary" :size="searchSize" icon="el-icon-search" @click="reloadUserList">{{$t('table.search')}}</el-button>
                    </div>
                    <div class="dialog-search">
                        <el-checkbox v-model="showRelatedFlag" @change="handleUserShowRelated">只显示已关联用户</el-checkbox>
                    </div>
                    <div>
                        <el-table ref="windowUserTable" :data="userList" border @select="selectRowUser"
                                  @select-all="selectAllUser" @selection-change="handleSelectionChangeWindowUser">
                            <el-table-column type="selection" width="50" align="center"></el-table-column>
                            <el-table-column prop="departmentName" label="部门"></el-table-column>
                            <el-table-column prop="userName" label="姓名"></el-table-column>
                            <el-table-column prop="userAccount" label="登录帐户"></el-table-column>
                        </el-table>
                        <el-pagination class="deyatech-pagination pull-right" background
                                       :current-page.sync="userListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                       :page-size="userListQuery.size" :layout="this.$store.state.common.pageLayout" :total="userTotal"
                                       @size-change="handleSizeChangeWindowUser" @current-change="handleCurrentChangeWindowUser">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveWindowUser"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeWindowUserDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>
            <!-- 关联事项 -->
            <el-dialog :title="titleMap['associateItem']" :visible.sync="dialogWindowItemVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeWindowItemDialog">
                <div v-loading="dialogFormLoading">
                    <div class="dialog-search">
                        <el-cascader :options="itemCategoryCascader" @change="handleItemCategoryChange"
                                     class="dialog-search-item dialog-keywords"
                                     :show-all-levels="false" expand-trigger="hover" clearable change-on-select
                                     :size="searchSize" placeholder="根据事项分类筛选"></el-cascader>
                        <el-input v-model.trim="itemListQuery.itemName" class="dialog-search-item dialog-keywords"
                                  clearable :size="searchSize" placeholder="根据名称或编码查询"></el-input>
                        <el-button type="primary" :size="searchSize" icon="el-icon-search" @click="reloadItemList">{{$t('table.search')}}</el-button>
                    </div>
                    <div class="dialog-search">
                        <el-checkbox v-model="showRelatedFlag" @change="handleItemShowRelated">只显示已关联事项</el-checkbox>
                    </div>
                    <div>
                        <el-table ref="windowItemTable" :data="itemList" border @select="selectRowItem"
                                  @select-all="selectAllItem" @selection-change="handleSelectionChangeWindowItem">
                            <el-table-column type="selection" width="50" align="center"/>
                            <el-table-column align="center" label="事项名称" prop="itemName"/>
                            <el-table-column align="center" label="事项简称" prop="itemShortName"/>
                            <el-table-column align="center" label="事项编码" prop="itemCode"/>
                        </el-table>
                        <el-pagination class="deyatech-pagination pull-right" background
                                       :current-page.sync="itemListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                       :page-size="itemListQuery.size" :layout="this.$store.state.common.pageLayout" :total="itemTotal"
                                       @size-change="handleSizeChangeWindowItem" @current-change="handleCurrentChangeWindowItem">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveWindowItem"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeWindowItemDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getWindowList,
        createOrUpdateWindow,
        delWindows
    } from '@/api/number/window';

    import {getDepartmentCascader} from "@/api/admin/department";
    import {getCategoryCascader} from "@/api/item/category";
    import {getUserList, getAllWindowUser, setWindowUsers} from "@/api/number/windowUser";
    import {getItemList, getAllWindowItem, setWindowItems} from "@/api/number/windowItem";
    import {isStartOrEndWithWhiteSpace} from "@/util/validate";

    export default {
        name: 'window',
        data() {
            const isWhiteSpace = (rule, value, callback) => {
                //console.log('value', value)
                if (isStartOrEndWithWhiteSpace(value)) {
                    callback(new Error('输入空白字符无效'));
                } else {
                    callback();
                }
            };
            return {
                windowList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                window: {
                    id: undefined,
                    name: undefined,
                    code: undefined,
                    ledCode: undefined
                },
                windowRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '窗口名称'},
                        {max: 50, message: '最多 50 个字符', trigger: 'blur'},
                        {validator: isWhiteSpace, trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: this.$t("table.pleaseInput") + '窗口编码'},
                        {max: 50, message: '最多 50 个字符', trigger: 'blur'},
                        {validator: isWhiteSpace, trigger: 'blur'}
                    ],
                    ledCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '窗口LED编码'},
                        {max: 50, message: '最多 50 个字符', trigger: 'blur'},
                        {validator: isWhiteSpace, trigger: 'blur'}
                    ],
                    remark: [
                        {max: 500, message: '最多 500 个字符', trigger: 'blur'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogWindowUserVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                dialogFormLoading: false,
                selectAllUserId: [],
                selectAllItemId: [],
                selectedRowsUser: [],
                departmentCascader: [],
                itemCategoryCascader: [],
                userList: [],
                userTotal: 0,
                itemList: [],
                itemTotal: 0,
                userListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    departmentId: undefined,
                    userName: undefined,
                    windowId: undefined
                },
                itemListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    categoryId: undefined,
                    itemName: undefined,
                    windowId: undefined
                },
                currentRow: undefined,
                showRelatedFlag: false,
                dialogWindowItemVisible: false
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
                    create: this.permission.window_create,
                    update: this.permission.window_update,
                    delete: this.permission.window_delete,
                    windowUsers: this.permission.window_users,
                    windowItems: this.permission.window_items
                };
            }
        },
        created(){
            this.reloadList();
            this.loadDepartment();
            this.loadItemCategory();
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
            },
            searchReloadList(){
                this.listQuery.page = 1;
                this.reloadList();
            },
            reloadList(){
                this.listLoading = true;
                this.windowList = undefined;
                this.total = undefined;
                getWindowList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.windowList = response.data.records;
                    this.total = response.data.total;
                })
            },
            loadDepartment() {
                getDepartmentCascader().then(response => {
                    this.departmentCascader = response.data
                })
            },
            loadItemCategory() {
                getCategoryCascader().then(response => {
                    this.itemCategoryCascader = response.data
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
                this.resetWindow();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetWindow();
                if (row.id) {
                    this.window = deepClone(row);
                } else {
                    this.window = deepClone(this.selectedRows[0]);
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
            btnWindowUsers(row) {
                this.currentRow = row;
                this.dialogWindowUserVisible = true;
                this.dialogFormLoading = true;
                this.selectAllUserId = [];
                this.loadWindowUser(row.id).then(res => {
                    if (res && res.length > 0) {
                        for (let windowUser of res) {
                            this.selectAllUserId.push(windowUser.userId)
                        }
                        this.showRelatedFlag = true;
                        this.handleUserShowRelated(true);
                    } else {
                        this.showRelatedFlag = false;
                        this.handleUserShowRelated(false);
                    }
                })
            },
            loadWindowUser(windowId) {
                let query = {windowId}
                return new Promise((resolve, reject) => {
                    getAllWindowUser(query).then(response => {
                        resolve(response.data)
                    }).catch(err => {
                        reject(err)
                    })
                });
            },
            handleUserShowRelated(checked) {
                if (checked) {
                    this.userListQuery.windowId = this.currentRow.id;
                } else {
                    this.userListQuery.windowId = undefined;
                }
                this.reloadUserList();
            },
            reloadUserList() {
                this.handleCurrentChangeWindowUser(1)
            },
            handleCurrentChangeWindowUser(val) {
                this.userListQuery.page = val;
                this.loadUserList().then(() => {
                    this.checkRelatedUserRows();
                });
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
            handleSelectionChangeWindowUser(rows) {
                this.selectedRowsUser = rows;
            },
            handleSizeChangeWindowUser(val) {
                this.userListQuery.size = val;
                this.loadUserList().then(() => {
                    this.checkRelatedUserRows();
                });
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
            checkRelatedUserRows() {
                this.$nextTick(() => {
                    if (this.selectAllUserId && this.selectAllUserId.length > 0) {
                        for (let row of this.userList) {
                            if (this.selectAllUserId.includes(row.userId)) {
                                this.$refs['windowUserTable'].toggleRowSelection(row, true)
                            }
                        }
                    }
                });
            },
            doSaveWindowUser() {
                this.submitLoading = true;
                setWindowUsers(this.currentRow.id, this.selectAllUserId).then(() => {
                    this.closeWindowUserDialog();
                    this.$message.success(this.$t("table.updateSuccess"));
                    this.reloadList();
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
            handleDepartmentChange(val) {
                if (val.length > 0) {
                    this.userListQuery.departmentId = val[val.length - 1]
                } else {
                    this.userListQuery.departmentId = undefined
                }
            },
            btnWindowItems(row) {
                this.currentRow = row;
                this.dialogWindowItemVisible = true;
                this.dialogFormLoading = true;
                this.selectAllItemId = [];
                this.loadWindowItem(row.id).then(res => {
                    if(res && res.length > 0) {
                        for (let windowItem of res) {
                            this.selectAllItemId.push(windowItem.itemId);
                        }
                        this.showRelatedFlag = true;
                        this.handleItemShowRelated(true);
                    } else {
                        this.showRelatedFlag = false;
                        this.handleItemShowRelated(false);
                    }
                });
            },
            loadWindowItem(windowId) {
                let query = {windowId}
                return new Promise((resolve, reject) => {
                    getAllWindowItem(query).then(response => {
                        resolve(response.data)
                    }).catch(err => {
                        reject(err)
                    })
                });
            },
            handleItemShowRelated(checked) {
                if (checked) {
                    this.itemListQuery.windowId = this.currentRow.id;
                } else {
                    this.itemListQuery.windowId = undefined;
                }
                this.reloadItemList();
            },
            reloadItemList() {
                this.handleCurrentChangeWindowItem(1)
            },
            handleCurrentChangeWindowItem(val) {
                this.itemListQuery.page = val;
                this.loadItemList().then(() => {
                    this.checkRelatedItemRows();
                });
            },
            loadItemList() {
                return new Promise((resolve, reject) => {
                    this.dialogFormLoading = true;
                    getItemList(this.itemListQuery).then(response => {
                        this.dialogFormLoading = false;
                        this.itemList = response.data.records;
                        this.itemTotal = response.data.total;
                        resolve();
                    }).catch(err => {
                        reject(err);
                    })
                });
            },
            checkRelatedItemRows() {
                this.$nextTick(() => {
                    if (this.selectAllItemId && this.selectAllItemId.length > 0) {
                        for (let row of this.itemList) {
                            if (this.selectAllItemId.includes(row.itemId)) {
                                this.$refs['windowItemTable'].toggleRowSelection(row, true)
                            }
                        }
                    }
                });
            },
            selectRowItem(selection, row) {
                let i = this.selectAllItemId.indexOf(row.itemId)
                if (i < 0) {
                    this.selectAllItemId.push(row.itemId)
                } else {
                    this.selectAllItemId.splice(i, 1)
                }
            },
            selectAllItem(selection) {
                if (selection.length > 0) {
                    for (let item of this.itemList) {
                        if (this.selectAllItemId.indexOf(item.itemId) < 0) {
                            this.selectAllItemId.push(item.itemId)
                        }
                    }
                } else {
                    for (let item of this.itemList) {
                        let i = this.selectAllItemId.indexOf(item.itemId)
                        if (i >= 0) {
                            this.selectAllItemId.splice(i, 1)
                        }
                    }
                }
            },
            handleSelectionChangeWindowItem(rows) {
                this.selectedRowsUser = rows;
            },
            handleSizeChangeWindowItem(val) {
                this.itemListQuery.size = val;
                this.loadItemList().then(() => {
                    this.checkRelatedItemRows();
                });
            },
            doSaveWindowItem() {
                this.submitLoading = true;
                setWindowItems(this.currentRow.id, this.selectAllItemId).then(() => {
                    this.closeWindowItemDialog();
                    this.$message.success(this.$t("table.updateSuccess"));
                    this.reloadList();
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
            handleItemCategoryChange(val) {
                if (val.length > 0) {
                    this.itemListQuery.categoryId = val[val.length - 1]
                } else {
                    this.itemListQuery.categoryId = undefined
                }
            },
            doCreate(){
                this.$refs['windowDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateWindow(this.window).then(() => {
                            this.resetWindowDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['windowDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateWindow(this.window).then(() => {
                            this.resetWindowDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delWindows(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetWindow(){
                this.window = {
                    id: undefined,
                    name: undefined,
                    code: undefined,
                    ledCode: undefined
                }
            },
            resetWindowDialogAndList(){
                this.closeWindowDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeWindowDialog() {
                this.dialogVisible = false;
                this.resetWindow();
                this.$refs['windowDialogForm'].resetFields();
            },
            closeWindowUserDialog() {
                this.dialogWindowUserVisible = false;
                this.submitLoading = false;
                this.userListQuery = {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    departmentId: undefined,
                    userName: undefined,
                    windowId: undefined
                }
            },
            closeWindowItemDialog() {
                this.dialogWindowItemVisible = false;
                this.submitLoading = false;
                this.itemListQuery = {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    categoryId: undefined,
                    itemName: undefined,
                    windowId: undefined
                }
            }
        }
    }
</script>

<style>
    .badge {
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: 15px;

    }
</style>
