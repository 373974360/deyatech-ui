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
            <el-table :data="userList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="部门编号" prop="departmentId"/>
                <el-table-column align="center" label="姓名" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="性别(2:未知;1:男;0:女)" prop="gender"/>
                <el-table-column align="center" label="电话" prop="phone"/>
                <el-table-column align="center" label="头像" prop="avatar"/>
                <el-table-column align="center" label="登陆帐户" prop="account"/>
                <el-table-column align="center" label="密码" prop="password"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center"
                                 width="100">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary"
                                   icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger"
                                   icon="el-icon-delete" :size="btnSize" circle
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
                <el-form ref="userDialogForm" class="deyatech-form" :model="user" label-position="right"
                         label-width="80px" :rules="userRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="部门编号" prop="departmentId">
                                <el-input v-model="user.departmentId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="user.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="性别(2:未知;1:男;0:女)" prop="gender">
                                <el-input v-model="user.gender"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="电话" prop="phone">
                                <el-input v-model="user.phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="头像" prop="avatar">
                                <el-input v-model="user.avatar"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="登陆帐户" prop="account">
                                <el-input v-model="user.account"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="user.password"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="user.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="dialogVisible = false">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getUserList,
        createOrUpdateUser,
        delUsers
    } from '@/api/admin/user';

    export default {
        name: 'user',
        data() {
            return {
                userList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    rows: this.$store.state.common.rows,
                    name: undefined
                },
                user: {
                    id: undefined,
                    departmentId: undefined,
                    name: undefined,
                    gender: undefined,
                    phone: undefined,
                    avatar: undefined,
                    account: undefined,
                    password: undefined
                },
                userRules: {
                    departmentId: [
                        {required: true, message: this.$t("table.pleaseInput") + '部门编号'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '姓名'}
                    ],
                    gender: [
                        {required: true, message: this.$t("table.pleaseInput") + '性别(2:未知;1:男;0:女)'}
                    ],
                    phone: [
                        {required: true, message: this.$t("table.pleaseInput") + '电话'}
                    ],
                    avatar: [
                        {required: true, message: this.$t("table.pleaseInput") + '头像'}
                    ],
                    account: [
                        {required: true, message: this.$t("table.pleaseInput") + '登陆帐户'}
                    ],
                    password: [
                        {required: true, message: this.$t("table.pleaseInput") + '密码'}
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
                'btnSize'
            ]),
            btnEnable() {
                return {
                    create: this.permission.user_create,
                    update: this.permission.user_update,
                    delete: this.permission.user_delete
                };
            }
        },
        created() {
            this.reloadList();
        },
        methods: {
            resetSearch() {
                this.listQuery.name = undefined;
            },
            reloadList() {
                this.listLoading = true;
                this.userList = undefined;
                this.total = undefined;
                getUserList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.userList = response.data.records;
                    this.total = response.data.total;
                })
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
            btnCreate() {
                this.resetUser();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row) {
                this.resetUser();
                if (row.id) {
                    this.user = deepClone(row);
                } else {
                    this.user = deepClone(this.selectedRows[0]);
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
            doCreate() {
                this.$refs['userDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateUser(this.user).then(() => {
                            this.resetUserDialog();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate() {
                this.$refs['userDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateUser(this.user).then(() => {
                            this.resetUserDialog();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids) {
                this.listLoading = true;
                delUsers(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetUser() {
                this.user = {
                    id: undefined,
                    departmentId: undefined,
                    name: undefined,
                    gender: undefined,
                    phone: undefined,
                    avatar: undefined,
                    account: undefined,
                    password: undefined
                }
            },
            resetUserDialog() {
                this.dialogVisible = false;
                this.submitLoading = false;
                this.resetUser();
                this.reloadList();
            }
        }
    }
</script>


