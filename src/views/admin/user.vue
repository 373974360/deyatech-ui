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
            <el-table :data="userList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="ID" prop="id"/>
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
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary"
                                   icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger"
                                   icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop.safe="btnDelete(scope.row)"></el-button>
                        <el-button v-if="btnEnable.catalog" title="关联栏目" type="primary" icon="iconviewgallery"
                                   :size="btnSize" circle @click.stop.safe="btnCatalog(scope.row)"></el-button>
                        <el-button v-if="btnEnable.content" title="栏目内容权限" type="primary" icon="iconviewlist"
                                   :size="btnSize" circle @click.stop.safe="btnContent(scope.row)"></el-button>
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
                                             change-on-select show-all-levels expand-trigger="click" clearable style="width: 100%;"></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model.trim="user.name"></el-input>
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
                                <el-input v-model.trim="user.empNo"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="登录帐户" prop="account">
                                <el-input v-model.trim="user.account"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="密码" prop="password">
                                <el-input type="password" v-model.trim="user.password" placeholder="修改密码时填入新密码，否则无需输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="确认密码" prop="passwordConfirm">
                                <el-input type="password" v-model.trim="user.passwordConfirm" placeholder="修改密码时填入新密码，否则无需输入"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model.trim="user.remark" :rows="3"/>
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

            <el-dialog title="关联栏目" :visible.sync="dialogCatalogVisible" :close-on-click-modal="closeOnClickModal" @close="closeCatalogDialog">
                <el-form style="width: 80%; margin-left:10%;" :inline="true">
                    <el-form-item>
                        <el-cascader ref="topSiteCascader" placeholder="请选择站点"
                                     :options="stationGroupList"
                                     v-model="stationGroupTreePosition"
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
                <el-form style="width: 80%; margin-left:10%;" v-loading="treeLoading">
                    <el-tree ref="catalogTree"
                             :data="catalogTree"
                             show-checkbox
                             node-key="id"
                             :default-expand-all="true"
                             :expand-on-click-node="false"
                             @check="catalogTreeChecked" :check-strictly="true"></el-tree>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveCatalogUser" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeCatalogDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>

            <el-dialog title="栏目内容权限" :visible.sync="dialogContentVisible" :close-on-click-modal="closeOnClickModal" @close="closeContentDialog">
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
    import {
        getUserList,
        createOrUpdateUser,
        delUsers,
        checkAccountExist
    } from '@/api/admin/user';
    import {getDepartmentCascader} from '@/api/admin/department';
    import {isvalidatemobile, validatename, isStartOrEndWithWhiteSpace} from '@/util/validate';
    import {getCatalogTree} from '@/api/station/catalog';
    import {getAllUserCatalogs, setUserCatalogs} from '@/api/station/catalogUser'
    import {getUserAuthority, setUserAuthority} from '@/api/station/templateUserAuthority'
    import {getNodeData, getParentKeys, getChildrenKeys} from "@/util/treeUtils";
    import {getClassificationStationCascader} from '@/api/resource/stationGroup';

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
                    departmentTreePosition: undefined,
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
                departmentCascader: [],
                catalogTree: [],
                dialogCatalogVisible: false,
                currentRow: undefined,
                dialogContentVisible: false,
                templateAuthority: undefined,
                stationGroupList: undefined,
                stationGroupTreePosition: undefined,
                siteId: undefined,
                userCatalogList: [],
                treeLoading: false
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
                    } else {
                        return [];
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
                    delete: this.permission.user_delete,
                    catalog: this.permission.user_catalog,
                    content: this.permission.user_content
                };
            }
        },
        created() {
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
            this.getDepartmentCascader();
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
                this.userList = undefined;
                getUserList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.userList = response.data.records;
                    this.total = response.data.total;
                }).catch(()=>{
                    this.listLoading = false;
                    this.total = 0;
                });
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
                if (this.user.departmentTreePosition) {
                    this.user.departmentTreePosition += '&' + this.user.departmentId;
                } else {
                    this.user.departmentTreePosition = '&' + this.user.departmentId;
                }
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
                this.dialogVisible = false;
                this.resetUser();
                this.$refs['userDialogForm'].resetFields();
            },

            // 用户栏目
            getCatalogTree(){
                this.treeLoading = true;
                // 站点的全部栏目
                getCatalogTree({siteId: this.siteId}).then(response => {
                    this.catalogTree = response.data;
                    if (this.catalogTree && this.catalogTree.length > 0) {
                        // 用户已分配的栏目
                        getAllUserCatalogs({userId: this.currentRow.id}).then((response)=>{
                            this.userCatalogList = response.data;
                            this.checkUserCatalog();
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
            btnCatalog(row) {
                this.currentRow = row;
                this.getCatalogTree();
                this.dialogCatalogVisible = true;
            },
            checkUserCatalog() {
                this.$nextTick(()=>{
                    // 选中用户已分配的栏目
                    if (this.userCatalogList && this.userCatalogList.length > 0) {
                        for (let uc of this.userCatalogList) {
                            this.$refs['catalogTree'].setChecked(uc.catalogId, true, false);
                        }
                    }
                });
            },
            closeCatalogDialog() {
                this.currentRow = undefined;
                this.userCatalogList = [];
                this.dialogCatalogVisible = false;
                this.stationGroupTreePosition = [];
                this.siteId = undefined;
                this.submitLoading = false;
                this.$refs['catalogTree'].setCheckedKeys([])
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
            doSaveCatalogUser() {
                this.submitLoading = true;
                let checkedKeys = this.$refs['catalogTree'].getCheckedKeys(false);
                setUserCatalogs(this.currentRow.id, checkedKeys).then(() => {
                    this.closeCatalogDialog();
                    this.$message.success(this.$t("table.associateSuccess"));
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
            resetCatalogSearch() {
                this.stationGroupTreePosition = [];
                this.siteId = undefined;
            },
            getAllStationGroup(){
                this.stationGroupList = [];
                getClassificationStationCascader().then(response => {
                    this.stationGroupList = response.data;
                    if(this.stationGroupList.length > 0){
                        let v = [];
                        this.stationGroupTreePosition = v;
                        if (v.length > 0) {
                            this.$store.state.common.siteId = v[v.length - 1];
                            this.$store.state.common.siteName = this.currentLabels(v);
                            this.reloadMainView();
                        }
                    }
                })
            },
            stationGroupChange(v) {
                this.siteId = undefined;
                if (v.length > 0) {
                    this.siteId = v[v.length - 1];
                }
            },
            btnCatalogSearch() {
                this.getCatalogTree();
            },

            // 栏目内容权限
            btnContent(row) {
                this.currentRow = row;
                getUserAuthority({userId: row.id}).then((response)=>{
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
            doSaveContentUser() {
                this.submitLoading = true;
                setUserAuthority({userId: this.currentRow.id, authority: this.templateAuthority}).then((response)=>{
                    if (response.data) {
                        this.closeContentDialog();
                        this.$message.success("设置成功")
                    } else {
                        this.$message.error("设置失败")
                    }
                });
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

