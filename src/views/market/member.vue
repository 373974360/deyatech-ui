<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-select :size="searchSize" v-model.trim="listQuery.categoryId" :placeholder="$t('table.pleaseSelect') + '分类'" style="width: 100%">
                            <el-option
                                v-for="item in allMemberCategoryUser"
                                :key="item.id"
                                :label="item.categoryName"
                                :value="item.categoryId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="姓名" v-model.trim="listQuery.name"></el-input>
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
            <el-table :data="memberList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="分类名称" prop="categoryName"/>
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
                <el-table-column align="center" label="身份证号" prop="idNumber"/>
<!--                <el-table-column align="center" label="所属乡镇" prop="townshipAddress"/>-->
<!--                <el-table-column align="center" label="所属社区" prop="communityAddress"/>-->
<!--                <el-table-column align="center" label="信息站位置" prop="infoStationAddress"/>-->
                <el-table-column align="center" label="电话" prop="phone"/>
                <el-table-column align="center" label="本人照片" prop="selfPhoto">
                    <template slot-scope="scope">
                        <img v-if="scope.row.selfPhoto" :src="$store.state.common.showPicImgUrl + scope.row.selfPhoto"
                             width="30" height="30px">
                    </template>
                </el-table-column>
<!--                <el-table-column align="center" label="信息站照片" prop="infoStationPhoto"/>-->
<!--                <el-table-column align="center" label="电子邮件" prop="email"/>-->
                <el-table-column align="center" label="会员状态" prop="status">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | enums('EnableEnum') | statusFilter">
                            {{scope.row.status | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="账号" prop="account"/>
<!--                <el-table-column align="center" label="密码" prop="password"/>-->
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status" title="停用" type="danger" icon="el-icon-close" :size="btnSize" circle
                                   @click.stop.safe="changeStatus(scope.row.id, 0)"></el-button>
                        <el-button v-else title="启用" type="success" icon="el-icon-check" :size="btnSize" circle
                                   @click.stop.safe="changeStatus(scope.row.id, 1)"></el-button>
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeMemberDialog">
                <el-form ref="memberDialogForm" class="deyatech-form" :model="member" label-position="right"
                         label-width="100px" :rules="memberRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="分类" prop="categoryId">
                                <el-select v-model.trim="member.categoryId" :placeholder="$t('table.pleaseSelect') + '分类'" style="width: 100%">
                                    <el-option
                                        v-for="item in allMemberCategoryUser"
                                        :key="item.id"
                                        :label="item.categoryName"
                                        :value="item.categoryId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model.trim="member.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="性别" prop="gender">
                                <el-radio-group v-model="member.gender">
                                    <el-radio v-for="item in enums['GenderEnum']" :label="item.code">{{item.value}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证号" prop="idNumber">
                                <el-input v-model.trim="member.idNumber"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="电话" prop="phone">
                                <el-input v-model.trim="member.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="电子邮件" prop="email">
                                <el-input v-model.trim="member.email"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="本人照片" prop="selfPhoto">
                                <el-upload class="avatar-uploader" name="file"
                                           :action="this.$store.state.common.uploadUrl"
                                           :accept="this.$store.state.common.imageAccepts"
                                           :show-file-list="false"
                                           :on-success="handleSelfPhotoSuccess"
                                           :on-error="handlerError"
                                           :before-upload="beforeUpload">
                                    <img v-if="member.selfPhoto" :src="$store.state.common.showPicImgUrl + member.selfPhoto" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="信息站照片" prop="infoStationPhoto">
                                <el-upload class="avatar-uploader" name="file"
                                           :action="this.$store.state.common.uploadUrl"
                                           :accept="this.$store.state.common.imageAccepts"
                                           :show-file-list="false"
                                           :on-success="handleInfoStationPhotoSuccess"
                                           :on-error="handlerError"
                                           :before-upload="beforeUpload">
                                    <img v-if="member.infoStationPhoto" :src="$store.state.common.showPicImgUrl + member.infoStationPhoto" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="所属乡镇" prop="townshipAddress">
                                <el-input v-model.trim="member.townshipAddress"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属社区" prop="communityAddress">
                                <el-input v-model.trim="member.communityAddress"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="信息站位置" prop="infoStationAddress">
                                <el-input v-model.trim="member.infoStationAddress"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="账号" prop="account">
                                <el-input v-model.trim="member.account"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="密码" prop="password">
                                <el-input type="password" v-model.trim="member.password" placeholder="修改密码时填入新密码，否则无需输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="确认密码" prop="passwordConfirm">
                                <el-input type="password" v-model.trim="member.passwordConfirm" placeholder="修改密码时填入新密码，否则无需输入"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model.trim="member.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeMemberDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getMemberList,
        createOrUpdateMember,
        delMembers,
        isExistAccount
    } from '@/api/market/member';
    import {
        getAllMemberCategoryUserByUserId
    } from '@/api/market/memberCategoryUser';
    import {isvalidatemobile, validatename, cardid, isStartOrEndWithWhiteSpace, isEmail} from '@/util/validate';

    export default {
        name: 'member',
        data() {
            const validateName = (rule, value, callback) => {
                if (isStartOrEndWithWhiteSpace(value)) {
                    callback(new Error(this.$t("errorMsg.blankSpace")));
                    return;
                }
                if (!validatename(value)) {
                    callback(new Error('姓名不正确'));
                    return;
                }
                callback();
            };
            const validateIdNumber = (rule, value, callback) => {
                let result = cardid(value)
                if (result[0]) {
                    callback(new Error(result[1]))
                } else {
                    callback()
                }
            };
            const validateMobile = (rule, value, callback) => {
                let result = isvalidatemobile(value)
                if (result[0]) {
                    callback(new Error(result[1]))
                } else {
                    callback()
                }
            };
            const validateEmail = (rule, value, callback) => {
                if (!isEmail(value)) {
                    callback(new Error('邮箱不正确'));
                    return;
                }
                callback();
            };
            const validateAccount = (rule, value, callback) => {
                const query = {
                    id: this.member.id,
                    account : value
                }
                isExistAccount(query).then(res => {
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
                if (this.member.passwordConfirm) {
                    this.$refs['memberDialogForm'].validateField('passwordConfirm')
                }
                callback()
            };
            const validatePwdConfirm = (rule, value, callback) => {
                if (this.member.password && this.member.password !== this.member.passwordConfirm) {
                    if (!this.member.passwordConfirm) {
                        callback(new Error('请再次输入密码'))
                    } else {
                        callback(new Error('两次输入密码不一致！'))
                    }
                }
                callback()
            };
            return {
                memberList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    categoryId: undefined,
                    name: undefined
                },
                member: {
                    id: undefined,
                    categoryId: undefined,
                    name: undefined,
                    gender: undefined,
                    idNumber: undefined,
                    townshipAddress: undefined,
                    communityAddress: undefined,
                    infoStationAddress: undefined,
                    phone: undefined,
                    selfPhoto: undefined,
                    infoStationPhoto: undefined,
                    email: undefined,
                    status: undefined,
                    account: undefined,
                    password: undefined,
                    passwordConfirm: undefined,
                },
                memberRules: {
                    categoryId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '分类'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '姓名'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    gender: [
                        {required: true, message: this.$t("table.pleaseSelect") + '性别'}
                    ],
                    idNumber: [
                        {required: true, message: this.$t("table.pleaseInput") + '身份证号'},
                        {validator: validateIdNumber, trigger: 'blur'}
                    ],
                    townshipAddress: [
                        {required: true, message: this.$t("table.pleaseInput") + '所属乡镇'},
                        {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'},
                    ],
                    communityAddress: [
                        {required: true, message: this.$t("table.pleaseInput") + '所属社区'},
                        {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'},
                    ],
                    infoStationAddress: [
                        {required: true, message: this.$t("table.pleaseInput") + '信息站位置'},
                        {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: this.$t("table.pleaseInput") + '电话'},
                        {min: 11, max: 11, message: '长度11个数字', trigger: 'blur'},
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    selfPhoto: [
                        {required: true, message: '请上传本人照片'}
                    ],
                    infoStationPhoto: [
                        {required: true, message: '请上传信息站照片'}
                    ],
                    email: [
                        {required: true, message: this.$t("table.pleaseInput") + '电子邮件'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateEmail, trigger: 'blur'}
                    ],
                    account: [
                        {required: true, message: this.$t("table.pleaseInput") + '账号'},
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
                        {max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur'}
                    ],
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                allMemberCategoryUser: [],
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
                    create: this.permission.member_create,
                    update: this.permission.member_update,
                    delete: this.permission.member_delete
                };
            }
        },
        created(){
            this.getAllMemberCategoryUserByUserId();
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.categoryId = undefined;
                this.listQuery.name = undefined;
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.memberList = undefined;
                this.total = undefined;
                getMemberList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.memberList = response.data.records;
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
                this.resetMember();
                this.memberRules.password[0].required = true;
                this.memberRules.passwordConfirm[0].required = true;
                this.dialogTitle = 'create';
                this.dialogVisible = true;

            },
            btnUpdate(row){
                this.resetMember();
                if (row.id) {
                    this.member = deepClone(row);
                } else {
                    this.member = deepClone(this.selectedRows[0]);
                }
                this.member.password = undefined;
                this.memberRules.password[0].required = false;
                this.memberRules.passwordConfirm[0].required = false;
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
                this.$refs['memberDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateMember(this.member).then(() => {
                            this.resetMemberDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['memberDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateMember(this.member).then(() => {
                            this.resetMemberDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delMembers(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetMember(){
                this.member = {
                    id: undefined,
                    categoryId: undefined,
                    name: undefined,
                    gender: undefined,
                    idNumber: undefined,
                    townshipAddress: undefined,
                    communityAddress: undefined,
                    infoStationAddress: undefined,
                    phone: undefined,
                    selfPhoto: undefined,
                    infoStationPhoto: undefined,
                    email: undefined,
                    status: undefined,
                    account: undefined,
                    password: undefined,
                    passwordConfirm: undefined,
                }
            },
            resetMemberDialogAndList(){
                this.closeMemberDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeMemberDialog() {
                this.dialogVisible = false;
                this.resetMember();
                this.$refs['memberDialogForm'].resetFields();
            },
            getAllMemberCategoryUserByUserId(){
                getAllMemberCategoryUserByUserId().then(response => {
                    this.allMemberCategoryUser = response.data;
                })
            },
            handleSelfPhotoSuccess(res, file, fileList) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.member.selfPhoto = res.data.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handlerError(err, file, fileList) {
                this.$message.error("网络不稳定，上传失败");
            },
            beforeUpload(file) {
                const isIMG = this.$store.state.common.imageAccepts.includes(file.type);
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isIMG) {
                    this.$message.error('上传图片格式不正确!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isIMG && isLt2M;
            },
            handleInfoStationPhotoSuccess(res, file, fileList) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.member.infoStationPhoto = res.data.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            changeStatus(id, status) {
                if (status) {
                    var message = '此操作将启用会员, 是否继续？';
                    var type = 'success';
                    var changeMessage = '启用成功';
                } else {
                    var message = '此操作将停用会员, 是否继续？';
                    var type = 'error';
                    var changeMessage = '停用成功';
                }
                this.$confirm(message, this.$t("table.tip"), {type: type}).then(() => {
                    createOrUpdateMember({id: id, status: status}).then(() => {
                        this.reloadList();
                        this.$message.success(changeMessage);
                    })
                })
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

