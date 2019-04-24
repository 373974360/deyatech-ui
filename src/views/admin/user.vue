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
            <el-table :data="userList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="部门" prop="departmentName"/>
                <el-table-column align="center" label="姓名" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="性别" prop="gender">
                    <template slot-scope="scope">
                        <span>{{scope.row.gender | enums('GenderEnum')}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号码" prop="phone"/>
                <el-table-column align="center" label="头像" prop="avatar">
                    <template slot-scope="scope">
                        <img v-if="scope.row.avatar" :src="$store.state.common.showPicImgUrl + scope.row.avatar"
                             width="30" height="30px">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="工号" prop="empNo"/>
                <el-table-column align="center" label="登录帐户" prop="account"/>
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
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeUserDialog">
                <el-form ref="userDialogForm" class="deyatech-form" :model="user" label-position="right"
                         label-width="80px" :rules="userRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="部门" prop="departmentId">
                                <el-cascader ref="mycascader" :options="departmentCascader" v-model="departmentTreePosition"
                                             :show-all-levels="false" expand-trigger="hover" clearable
                                             change-on-select></el-cascader>
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
                            <el-form-item label="性别" prop="gender">
                                <el-radio-group v-model="user.gender">
                                    <el-radio v-for="item in enums['GenderEnum']" :label="item.code">{{item.value}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号码" prop="phone">
                                <el-input v-model.trim="user.phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="头像" prop="avatar">
                                <el-upload class="avatar-uploader" name="file"
                                           :action="this.$store.state.common.uploadUrl"
                                           :accept="this.$store.state.common.imageAccepts"
                                           :show-file-list="false"
                                           :on-success="handleAvatarSuccess"
                                           :on-error="handlerAvatarError"
                                           :before-upload="beforeAvatarUpload">
                                    <img v-if="user.avatar" :src="this.$store.state.common.showPicImgUrl + user.avatar" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="工号" prop="empNo">
                                <el-input v-model="user.empNo"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="登录帐户" prop="account">
                                <el-input v-model="user.account"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="密码" prop="password">
                                <el-input type="password" v-model="user.password" placeholder="修改密码时填入新密码，否则无需输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="确认密码" prop="passwordConfirm">
                                <el-input type="password" v-model="user.passwordConfirm" placeholder="修改密码时填入新密码，否则无需输入"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model="user.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeUserDialog">{{$t('table.cancel')}}</el-button>
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
        delUsers,
        checkAccountExist
    } from '@/api/admin/user';
    import {getDepartmentCascader} from '@/api/admin/department';
    import {isvalidatemobile, validatename, isStartOrEndWithWhiteSpace} from '@/util/validate';

    export default {
        name: 'user',
        data() {
            const validateMobile = (rule, value, callback) => {
                let result = isvalidatemobile(value)
                if (result[0]) {
                    callback(new Error(result[1]))
                } else {
                    callback()
                }
            };
            const validateAccount = (rule, value, callback) => {
                checkAccountExist(this.user.id, value).then(res => {
                    if (res.data) {
                        callback(new Error('登录账户名已存在'))
                    } else {
                        callback()
                    }
                }).catch(() => {
                    callback(new Error('检查登录账户名时出错'))
                })
            };
            const validatePwd = (rule, value, callback) => {
                if (this.user.passwordConfirm) {
                    this.$refs['userDialogForm'].validateField('passwordConfirm')
                }
                callback()
            };
            const validatePwdConfirm = (rule, value, callback) => {
                if (this.user.password && this.user.password !== this.user.passwordConfirm) {
                    if (!this.user.passwordConfirm) {
                        callback(new Error('请再次输入密码'))
                    } else {
                        callback(new Error('两次输入密码不一致！'))
                    }
                }
                callback()
            };
            const validateName = (rule, value, callback) => {
                if (isStartOrEndWithWhiteSpace(value)) {
                    callback(new Error(this.$t("errorMsg.blankSpace")));
                    return;
                }
                callback();
            };
            const validateEmpNo = (rule, value, callback) => {
                if (isStartOrEndWithWhiteSpace(value)) {
                    callback(new Error(this.$t("errorMsg.blankSpace")));
                    return;
                }
                callback();
            };
            return {
                userList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                user: {
                    id: undefined,
                    departmentId: undefined,
                    name: undefined,
                    gender: undefined,
                    phone: undefined,
                    avatar: undefined,
                    empNo: undefined,
                    account: undefined,
                    password: undefined,
                    passwordConfirm: undefined
                },
                userRules: {
                    departmentId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '部门'}
                    ],
                    name: [
                        {required: true, whitespace: true, message: this.$t("table.pleaseInput") + '姓名'},
                        {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    gender: [
                        {required: true, message: this.$t("table.pleaseSelect") + '性别'}
                    ],
                    phone: [
                        {required: true, whitespace: true, message: this.$t("table.pleaseInput") + '手机号码'},
                        {min: 11, max: 11, message: '长度11个数字', trigger: 'blur'},
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    avatar: [
                        {required: true, message: this.$t("table.pleaseInput") + '头像'}
                    ],
                    empNo: [
                        {required: true, whitespace: true, message: this.$t("table.pleaseInput") + '工号'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'},
                        {validator: validateEmpNo, trigger: 'blur'}
                    ],
                    account: [
                        {required: true, whitespace: true, message: this.$t("table.pleaseInput") + '登录帐户'},
                        {min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur'},
                        {validator: validateAccount, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: this.$t("table.pleaseInput") + '密码'},
                        {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'},
                        {validator: validatePwd, trigger: 'blur'}
                    ],
                    passwordConfirm: [
                        {required: true, message: this.$t("table.pleaseInput") + '确认密码'},
                        {validator: validatePwdConfirm, trigger: 'blur'}
                    ],
                    remark: [
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                uploadAction: this.$store.state.common.uploadUrl,
                acceptTypes: this.$store.state.common.imageAccepts,
                departmentCascader: []
            }
        },
        computed: {
            ...mapGetters([
                'permission',
                'titleMap',
                'enums',
                'dicts',
                'closeOnClickModal',
                'searchSize',
                'btnSize'
            ]),
            departmentTreePosition: {
                get() {
                    if (this.user.departmentTreePosition) {
                        return this.user.departmentTreePosition.substr(1).split('&')
                    }
                },
                set(v) {
                    if (v.length > 0) {
                        this.user.departmentId = v[v.length - 1];
                        this.user.departmentTreePosition = '&' + v.join('&');
                    } else {
                        this.user.departmentId = undefined;
                        this.user.departmentTreePosition = undefined;
                    }
                }
            },
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
            this.getDepartmentCascader();
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
                this.userList = undefined;
                this.total = undefined;
                getUserList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.userList = response.data.records;
                    this.total = response.data.total;
                })
            },
            getDepartmentCascader() {
                this.submitLoading = true;
                getDepartmentCascader().then(response => {
                    this.submitLoading = false;
                    this.departmentCascader = response.data;
                })
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
                this.resetUser();
                this.dialogTitle = 'create';
                this.userRules.password[0].required = true;
                this.userRules.passwordConfirm[0].required = true;
                this.dialogVisible = true;
            },
            btnUpdate(row) {
                this.resetUser();
                if (row.id) {
                    this.user = deepClone(row);
                } else {
                    this.user = deepClone(this.selectedRows[0]);
                }
                this.user.departmentTreePosition += '&' + this.user.departmentId
                this.user.password = undefined;
                this.userRules.password[0].required = false;
                this.userRules.passwordConfirm[0].required = false;
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
                        }).catch(() => {
                            this.submitLoading = false
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
                        }).catch(() => {
                            this.submitLoading = false
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
            handleAvatarSuccess(res, file, fileList) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.user.avatar = res.data.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handlerAvatarError(err, file, fileList) {
                this.$message.error("网络不稳定，上传失败");
            },
            beforeAvatarUpload(file) {
                const isJPG = this.acceptTypes.includes(file.type);
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片格式不正确!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            resetUser() {
                this.user = {
                    id: undefined,
                    departmentId: undefined,
                    name: undefined,
                    gender: undefined,
                    phone: undefined,
                    avatar: undefined,
                    empNo: undefined,
                    account: undefined,
                    password: undefined,
                    passwordConfirm: undefined
                }
            },
            resetUserDialog() {
                this.closeUserDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeUserDialog() {
                let obj = {};
                obj.stopPropagation = () =>{};
                this.$refs.mycascader.clearValue(obj);
                this.dialogVisible = false;
                this.resetUser();
                this.$refs['userDialogForm'].resetFields();
            }
        }
    }
</script>
<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>

