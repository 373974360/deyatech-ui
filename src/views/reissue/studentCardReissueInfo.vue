<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '姓名'" v-model.trim="listQuery.name" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '身份证号'" v-model.trim="listQuery.idNumber" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '学生证号'" v-model.trim="listQuery.studentId" clearable></el-input>
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
            <el-table :data="studentCardReissueInfoList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="姓名" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="性别" prop="gender">
                    <template slot-scope="scope">
                        {{scope.row.gender | enums('GenderEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="出生年月" prop="birthday"/>
                <el-table-column align="center" label="身份证号" prop="idNumber"/>
                <el-table-column align="center" label="学生证号" prop="studentId"/>
                <el-table-column align="center" label="教育类型" prop="educationType">
                    <template slot-scope="scope">
                        {{scope.row.educationType | educationTypeFilter}}
                    </template>
                </el-table-column>
<!--                <el-table-column align="center" label="本人申请" prop="apply"/>-->
<!--                <el-table-column align="center" label="2寸照片" prop="twoInchPhoto"/>-->
<!--                <el-table-column align="center" label="身份证正面" prop="idCardFront"/>-->
<!--                <el-table-column align="center" label="身份证反面" prop="idCardReverse"/>-->
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                    <template slot-scope="scope">
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
                       :close-on-click-modal="closeOnClickModal" @close="closeStudentCardReissueInfoDialog">
                <el-form ref="studentCardReissueInfoDialogForm" class="deyatech-form" :model="studentCardReissueInfo" label-position="right"
                         label-width="100px" :rules="studentCardReissueInfoRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model.trim="studentCardReissueInfo.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="gender">
                                <el-radio-group v-model="studentCardReissueInfo.gender">
                                    <el-radio v-for="item in enums['GenderEnum']" :label="item.code">{{item.value}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="出生年月" prop="birthday">
                                <el-date-picker
                                    v-model="studentCardReissueInfo.birthday"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="请选择出生年月"
                                    style="width: 100%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证号" prop="idNumber">
                                <el-input v-model.trim="studentCardReissueInfo.idNumber"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="学生证号" prop="studentId">
                                <el-input v-model.trim="studentCardReissueInfo.studentId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="教育类型" prop="educationType">
                                <el-select v-model="studentCardReissueInfo.educationType" style="width: 100%">
                                    <el-option
                                        v-for="item in educationTypeOptions"
                                        :key="item.code"
                                        :label="item.value"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="本人申请" prop="apply">
                                <el-input type="textarea" v-model.trim="studentCardReissueInfo.apply" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="2寸照片" prop="twoInchPhoto">
                                <el-upload class="avatar-uploader" name="file"
                                           :action="$store.state.common.uploadUrl"
                                           :accept="$store.state.common.imageAccepts"
                                           :show-file-list="false"
                                           :on-success="handleTwoInchPhotoSuccess"
                                           :on-error="handlerError"
                                           :before-upload="beforeUpload">
                                    <img v-if="studentCardReissueInfo.twoInchPhoto" class="avatar"
                                         :src="$store.state.common.showPicImgUrl + studentCardReissueInfo.twoInchPhoto">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="身份证正面" prop="idCardFront">
                                <el-upload class="idCard-uploader" name="file"
                                           :class="{hide: studentCardReissueInfo.idCardFront}"
                                           :action="$store.state.common.uploadUrl"
                                           :accept="$store.state.common.imageAccepts"
                                           :file-list="idCardFrontList"
                                           list-type="picture-card"
                                           :on-success="handleIdCardFrontSuccess"
                                           :on-error="handlerError"
                                           :before-upload="beforeUpload"
                                           :on-preview="handleIdCardFrontPreview"
                                           :on-remove="handleIdCardFrontRemove">
                                    <i class="el-icon-plus idCard-uploader-icon"></i>
                                </el-upload>
                                <el-dialog :visible.sync="idCardFrontDialogVisible" append-to-body>
                                    <img width="100%" :src="$store.state.common.showPicImgUrl + studentCardReissueInfo.idCardFront" alt="">
                                </el-dialog>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证反面" prop="idCardReverse">
                                <el-upload class="idCard-uploader" name="file"
                                           :class="{hide: studentCardReissueInfo.idCardReverse}"
                                           :action="$store.state.common.uploadUrl"
                                           :accept="$store.state.common.imageAccepts"
                                           :file-list="idCardReverseList"
                                           list-type="picture-card"
                                           :on-success="handleIdCardReverseSuccess"
                                           :on-error="handlerError"
                                           :before-upload="beforeUpload"
                                           :on-preview="handleIdCardReversePreview"
                                           :on-remove="handleIdCardReverseRemove">
                                    <i class="el-icon-plus idCard-uploader-icon"></i>
                                </el-upload>
                                <el-dialog :visible.sync="idCardReverseDialogVisible" append-to-body>
                                    <img width="100%" :src="$store.state.common.showPicImgUrl + studentCardReissueInfo.idCardReverse" alt="">
                                </el-dialog>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="studentCardReissueInfo.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeStudentCardReissueInfoDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getStudentCardReissueInfoList,
        createOrUpdateStudentCardReissueInfo,
        delStudentCardReissueInfos
    } from '@/api/reissue/studentCardReissueInfo';
    import {cardid, validatename} from '@/util/validate';

    export default {
        name: 'studentCardReissueInfo',
        data() {
            const validateName = (rule, value, callback) => {
                let result = validatename(value)
                if (result) {
                    callback()
                } else {
                    callback(new Error(this.$t("table.pleaseInput") + '正确的姓名'))
                }
            };
            const validateIdNumber = (rule, value, callback) => {
                let result = cardid(value)
                if (result[0]) {
                    callback(new Error(result[1]))
                } else {
                    callback()
                }
            };
            return {
                educationTypeOptions: [{
                    code: 1,
                    value: '开放本科'
                }, {
                    code: 2,
                    value: '开放专科'
                }, {
                    code: 3,
                    value: '普专'
                }, {
                    code: 4,
                    value: '成人大专'
                }, {
                    code: 5,
                    value: '视听'
                }],
                studentCardReissueInfoList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined,
                    idNumber: undefined,
                    studentId: undefined,
                },
                studentCardReissueInfo: {
                    id: undefined,
                    name: undefined,
                    gender: undefined,
                    birthday: undefined,
                    idNumber: undefined,
                    studentId: undefined,
                    educationType: undefined,
                    apply: undefined,
                    twoInchPhoto: undefined,
                    idCardFront: undefined,
                    idCardReverse: undefined
                },
                studentCardReissueInfoRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '姓名'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    gender: [
                        {required: true, message: this.$t("table.pleaseSelect") + '性别'}
                    ],
                    birthday: [
                        {required: true, message: this.$t("table.pleaseSelect") + '出生年月'}
                    ],
                    idNumber: [
                        {required: true, message: this.$t("table.pleaseInput") + '身份证号'},
                        {validator: validateIdNumber, trigger: 'blur'}
                    ],
                    studentId: [
                        {required: true, message: this.$t("table.pleaseInput") + '学生证号'},
                        {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'},
                    ],
                    educationType: [
                        {required: true, message: this.$t("table.pleaseSelect") + '教育类型'}
                    ],
                    apply: [
                        {max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'},
                    ],
                    twoInchPhoto: [
                        {required: true, message: '请上传2寸照片'}
                    ],
                    idCardFront: [
                        {required: true, message: '请上传身份证正面'}
                    ],
                    idCardReverse: [
                        {required: true, message: '请上传身份证反面'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                idCardFrontDialogVisible: false,
                idCardReverseDialogVisible: false,
                idCardFrontList: [],
                idCardReverseList: [],
            }
        },
        filters:{
            educationTypeFilter: function(code){
                let value = '';
                switch (code) {
                    case code = 1:
                        value = '开放本科';
                        break;
                    case code = 2:
                        value = '开放专科';
                        break;
                    case code = 3:
                        value = '普专';
                        break;
                    case code = 4:
                        value = '成人大专';
                        break;
                    case code = 5:
                        value = '视听';
                        break;
                }
                return value;
            },

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
                    create: this.permission.studentCardReissueInfo_create,
                    update: this.permission.studentCardReissueInfo_update,
                    delete: this.permission.studentCardReissueInfo_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
                this.listQuery.idNumber = undefined;
                this.listQuery.studentId = undefined;
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.studentCardReissueInfoList = undefined;
                this.total = undefined;
                getStudentCardReissueInfoList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.studentCardReissueInfoList = response.data.records;
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
                this.resetStudentCardReissueInfo();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetStudentCardReissueInfo();
                if (row.id) {
                    this.studentCardReissueInfo = deepClone(row);
                } else {
                    this.studentCardReissueInfo = deepClone(this.selectedRows[0]);
                }
                if (this.studentCardReissueInfo.idCardFront) {
                    this.idCardFrontList.push({
                        id: this.studentCardReissueInfo.id,
                        url: this.$store.state.common.showPicImgUrl + this.studentCardReissueInfo.idCardFront
                    })
                }
                if (this.studentCardReissueInfo.idCardReverse) {
                    this.idCardReverseList.push({
                        id: this.studentCardReissueInfo.id,
                        url: this.$store.state.common.showPicImgUrl + this.studentCardReissueInfo.idCardReverse
                    })
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
                this.$refs['studentCardReissueInfoDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateStudentCardReissueInfo(this.studentCardReissueInfo).then(() => {
                            this.resetStudentCardReissueInfoDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['studentCardReissueInfoDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateStudentCardReissueInfo(this.studentCardReissueInfo).then(() => {
                            this.resetStudentCardReissueInfoDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delStudentCardReissueInfos(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetStudentCardReissueInfo(){
                this.studentCardReissueInfo = {
                    id: undefined,
                    name: undefined,
                    gender: undefined,
                    birthday: undefined,
                    idNumber: undefined,
                    studentId: undefined,
                    educationType: undefined,
                    apply: undefined,
                    twoInchPhoto: undefined,
                    idCardFront: undefined,
                    idCardReverse: undefined
                }
            },
            resetStudentCardReissueInfoDialogAndList(){
                this.closeStudentCardReissueInfoDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeStudentCardReissueInfoDialog() {
                this.dialogVisible = false;
                this.idCardFrontList = [];
                this.idCardReverseList = [];
                this.resetStudentCardReissueInfo();
                this.$refs['studentCardReissueInfoDialogForm'].resetFields();
            },
            handleTwoInchPhotoSuccess(res, file, fileList) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.studentCardReissueInfo.twoInchPhoto = res.data.url;
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
                const isLt10M = file.size < 1024 * 1024 * 10;

                if (!isIMG) {
                    this.$message.error('上传图片格式不正确!');
                }
                if (!isLt10M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isIMG && isLt10M;
            },
            handleIdCardFrontSuccess(res, file, fileList) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.studentCardReissueInfo.idCardFront = res.data.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handleIdCardFrontPreview() {
                this.idCardFrontDialogVisible = true;
            },
            handleIdCardFrontRemove() {
                this.studentCardReissueInfo.idCardFront = undefined;
            },
            handleIdCardReverseSuccess(res, file, fileList) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.studentCardReissueInfo.idCardReverse = res.data.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handleIdCardReversePreview() {
                this.idCardReverseDialogVisible = true;
            },
            handleIdCardReverseRemove() {
                this.studentCardReissueInfo.idCardReverse = undefined;
            },
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
        width: 98px;
        height: 138px;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 98px;
        height: 138px;
        line-height: 138px;
        text-align: center;
    }
    .avatar {
        width: 98px;
        height: 138px;
        display: block;
    }


    .idCard-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 240px;
        height: 151px;
    }
    .idCard-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .idCard-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 240px;
        height: 151px;
        line-height: 151px;
        text-align: center;
    }
    .idCard-uploader .el-upload-list__item {
        width: 240px;
        height: 151px;
    }
    .idCard-uploader .el-upload-list__item .el-upload-list__item-status-label {
        display: none;
    }
    .hide .el-upload--picture-card {
        display: none;
    }
</style>
