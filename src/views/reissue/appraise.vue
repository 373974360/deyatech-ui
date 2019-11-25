<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-select :size="searchSize" v-model.trim="listQuery.groupId" :placeholder="$t('table.pleaseSelect') + '工作小组'">
                            <el-option
                                v-for="item in allWorkingGroupUser"
                                :key="item.id"
                                :label="item.groupName"
                                :value="item.groupId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.category" :placeholder="$t('table.pleaseSelect') + '评优类型'" style="width: 100%">
                            <el-option
                                v-for="item in category"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '姓名或辅导员姓名'" v-model.trim="listQuery.name"></el-input>
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
            <el-table :data="appraiseList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="工作小组" prop="groupName"/>
                <el-table-column align="center" label="评优类型" prop="category">
                    <template slot-scope="scope">
                        {{scope.row.category | categoryFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名" prop="name"/>
                <!--<el-table-column align="center" label="性别" prop="gender">
                    <template slot-scope="scope">
                        {{scope.row.gender | enums('GenderEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="出生年月" prop="birthday"/>
                <el-table-column align="center" label="本人照片" prop="selfPhoto">
                    <template slot-scope="scope">
                        <img v-if="scope.row.selfPhoto" :src="$store.state.common.showPicImgUrl + scope.row.selfPhoto"
                             width="30" height="30px">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="文明班级" prop="civilizedClasses"/>-->
                <el-table-column align="center" label="辅导员姓名" prop="instructorName"/>
                <el-table-column align="center" label="资料" prop="fileUrl">
                    <template slot-scope="scope">
                        <el-button :size="btnSize" @click="downloadFile(scope.row)">点击下载</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="审核状态" prop="status">
                    <template slot-scope="scope">
                        {{scope.row.status | examineStatusFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="驳回原因" prop="reason"/>
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.examine && scope.row.status == 0" title="审核" type="success" icon="el-icon-check" :size="btnSize" circle
                                   @click.stop.safe="btnExamine(scope.row)"></el-button>
                        <el-button v-if="btnEnable.revokeExamine && scope.row.status == 1" title="撤销审核" type="danger" icon="el-icon-back" :size="btnSize" circle
                                   @click.stop.safe="btnRevokeExamine(scope.row)"></el-button>
                        <el-button v-if="btnEnable.update && scope.row.status != 1" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
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
                       :close-on-click-modal="closeOnClickModal" @close="closeAppraiseDialog">
                <el-form ref="appraiseDialogForm" class="deyatech-form" :model="appraise" label-position="right"
                         label-width="130px" :rules="appraiseRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="工作小组" prop="groupId">
                                <el-select v-model="appraise.groupId" :placeholder="$t('table.pleaseSelect') + '工作小组'" style="width: 100%"
                                    :disabled="dialogTitle == 'examine'">
                                    <el-option
                                        v-for="item in allWorkingGroupUser"
                                        :key="item.id"
                                        :label="item.groupName"
                                        :value="item.groupId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评优类型" prop="category">
                                <el-select v-model="appraise.category" :placeholder="$t('table.pleaseSelect') + '评优类型'" style="width: 100%"
                                    :disabled="dialogTitle == 'examine'">
                                    <el-option
                                        v-for="item in category"
                                        :key="item.code"
                                        :label="item.value"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model.trim="appraise.name" :disabled="dialogTitle == 'examine'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="gender">
                                <el-radio-group v-model="appraise.gender" :disabled="dialogTitle == 'examine'">
                                    <el-radio v-for="item in enums['GenderEnum']" :label="item.code">{{item.value}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="出生年月" prop="birthday">
                                <el-date-picker
                                    :disabled="dialogTitle == 'examine'"
                                    v-model="appraise.birthday"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="请选择出生年月"
                                    style="width: 100%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="本人照片" prop="selfPhoto">
                                <el-upload :disabled="dialogTitle == 'examine'"
                                            class="avatar-uploader" name="file"
                                           :action="$store.state.common.uploadUrl"
                                           :accept="$store.state.common.imageAccepts"
                                           :show-file-list="false"
                                           :on-success="handleSelfPhotoSuccess"
                                           :on-error="handlerError"
                                           :before-upload="beforeSelfPhotoUpload">
                                    <img v-if="appraise.selfPhoto" class="avatar"
                                         :src="$store.state.common.showPicImgUrl + appraise.selfPhoto">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="文明班级（全称）" prop="civilizedClasses">
                                <el-input v-model.trim="appraise.civilizedClasses" :disabled="dialogTitle == 'examine'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="辅导员姓名" prop="instructorName">
                                <el-input v-model.trim="appraise.instructorName" :disabled="dialogTitle == 'examine'"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="资料上传" prop="fileUrl">
                                <el-upload name="file"
                                    :disabled="dialogTitle == 'examine'"
                                    :action="$store.state.common.uploadUrl"
                                    :accept="$store.state.common.fileAccepts"
                                    :file-list="uploadFileReader"
                                    :on-success="handleFileSuccess"
                                    :on-error="handlerError"
                                    :before-upload="beforeFileUpload"
                                    :on-preview="handleFilePreview"
                                    :on-remove="handleFileRemove">
                                    <el-button type="primary">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div v-if="dialogTitle=='examine'">
                        <el-row :gutter="20" :span="24">
                            <el-col :span="12">
                                <el-form-item label="审核" prop="status">
                                    <el-select v-model.trim="appraise.status" style="width: 100%">
                                        <el-option
                                            v-for="item in examineStatus"
                                            :key="item.code"
                                            :label="item.value"
                                            :value="item.code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" :span="24" v-if="appraise.status == -1">
                            <el-col :span="24">
                                <el-form-item label="驳回原因" prop="reason">
                                    <el-input type="textarea" v-model.trim="appraise.reason" :rows="3"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-if="dialogTitle=='update'" type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-if="dialogTitle=='examine'" type="primary" :size="btnSize" @click="doExamine" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeAppraiseDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getAppraiseList,
        createOrUpdateAppraise,
        delAppraises,
        doExamine,
    } from '@/api/reissue/appraise';
    import {
        getAllWorkingGroupUserByUserId
    } from '@/api/reissue/workingGroupUser';
    import {validatename} from '@/util/validate';

    export default {
        name: 'appraise',
        data() {
            const validateName = (rule, value, callback) => {
                if (!value) {
                    callback()
                }
                let result = validatename(value)
                if (result) {
                    callback()
                } else {
                    callback(new Error(this.$t("table.pleaseInput") + '正确的姓名'))
                }
            };
            return {
                appraiseList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    groupId: undefined,
                    category: undefined,
                    name: undefined,
                    type: undefined,
                },
                appraise: {
                    id: undefined,
                    groupId: undefined,
                    category: undefined,
                    name: undefined,
                    gender: undefined,
                    birthday: undefined,
                    selfPhoto: undefined,
                    civilizedClasses: undefined,
                    instructorName: undefined,
                    fileUrl: undefined,
                    status: undefined,
                    reason: undefined,
                },
                appraiseRules: {
                    groupId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '工作小组'}
                    ],
                    category: [
                        {required: true, message: this.$t("table.pleaseSelect") + '评优类型'}
                    ],
                    name: [
                        // {required: true, message: this.$t("table.pleaseInput") + '姓名'}
                        {validator: validateName, trigger: 'blur'}
                    ],
                    gender: [
                        // {required: true, message: this.$t("table.pleaseInput") + '性别（2：位置；1：男；0：女）'}
                    ],
                    birthday: [
                        // {required: true, message: this.$t("table.pleaseInput") + '出生年月'}
                    ],
                    selfPhoto: [
                        // {required: true, message: this.$t("table.pleaseInput") + '本人照片'}
                    ],
                    civilizedClasses: [
                        // {required: true, message: this.$t("table.pleaseInput") + '文明班级（全称）'}
                        {max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur'},
                    ],
                    instructorName: [
                        // {required: true, message: this.$t("table.pleaseInput") + '辅导员姓名'}
                        {validator: validateName, trigger: 'blur'}
                    ],
                    fileUrl: [
                        {required: true, message: '请上传附件'}
                    ],
                    status: [
                        {required: true, message: this.$t("table.pleaseSelect") + '审核状态'}
                    ],
                    reason: [
                        {required: true, message: this.$t("table.pleaseInput") + '驳回原因'},
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'},
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                allWorkingGroupUser: [],
                category: [
                    {
                        code: 1,
                        value: '奖学金'
                    },
                    {
                        code: 2,
                        value: '优秀班主任'
                    },
                    {
                        code: 3,
                        value: '优秀毕业生'
                    },
                    {
                        code: 4,
                        value: '优秀干部'
                    },
                    {
                        code: 5,
                        value: '优秀学生'
                    },
                    {
                        code: 6,
                        value: '文明班级'
                    },
                ],
                uploadFileReader: [],
                examineStatus: [
                    {
                        code: 1,
                        value: '通过'
                    },
                    {
                        code: -1,
                        value: '驳回'
                    },
                ],
            }
        },
        filters: {
            categoryFilter: function (code) {
                let value = '';
                switch (code) {
                    case code = 1:
                        value = '奖学金';
                        break;
                    case code = 2:
                        value = '优秀班主任';
                        break;
                    case code = 3:
                        value = '优秀毕业生';
                        break;
                    case code = 4:
                        value = '优秀干部';
                        break;
                    case code = 5:
                        value = '优秀学生';
                        break;
                    case code = 6:
                        value = '文明班级';
                        break;
                }
                return value;
            },
            examineStatusFilter: function (status) {
                let value = '';
                switch (status) {
                    case status = -1:
                        value = '驳回';
                        break;
                    case status = 0:
                        value = '待审';
                        break;
                    case status = 1:
                        value = '通过';
                        break;
                }
                return value;
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
                    create: this.permission.appraise_create,
                    update: this.permission.appraise_update,
                    delete: this.permission.appraise_delete,
                    examine: this.permission.appraise_examine,
                    revokeExamine: this.permission.appraise_revoke_examine,
                };
            }
        },
        created(){
            this.reloadList();
            this.getAllWorkingGroupUserByUserId();
        },
        methods: {
            resetSearch(){
                this.listQuery.groupId = undefined;
                this.listQuery.category = undefined;
                this.listQuery.name = undefined;
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.appraiseList = undefined;
                this.total = undefined;
                // 如果有审核权限可以查询所有， 0 - 所有， 1 - 按userId查询
                this.listQuery.type = this.btnEnable.examine ? 0 : 1;
                getAppraiseList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.appraiseList = response.data.records;
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
                this.resetAppraise();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetAppraise();
                if (row.id) {
                    this.appraise = deepClone(row);
                } else {
                    this.appraise = deepClone(this.selectedRows[0]);
                }
                let uploadFile = {
                    id: row.id,
                    name: '点击下载文件',
                    url: row.fileUrl
                }
                this.uploadFileReader.push(uploadFile);
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
                this.$refs['appraiseDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateAppraise(this.appraise).then(() => {
                            this.resetAppraiseDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['appraiseDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateAppraise(this.appraise).then(() => {
                            this.resetAppraiseDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delAppraises(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetAppraise(){
                this.appraise = {
                    id: undefined,
                    groupId: undefined,
                    category: undefined,
                    name: undefined,
                    gender: undefined,
                    birthday: undefined,
                    selfPhoto: undefined,
                    civilizedClasses: undefined,
                    instructorName: undefined,
                    fileUrl: undefined,
                    status: undefined,
                    reason: undefined,
                }
            },
            resetAppraiseDialogAndList(){
                this.closeAppraiseDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeAppraiseDialog() {
                this.dialogVisible = false;
                this.resetAppraise();
                this.$refs['appraiseDialogForm'].resetFields();
                this.uploadFileReader = [];
            },
            getAllWorkingGroupUserByUserId(){
                // 如果有审核权限可以查询所有， 0 - 所有， 1 - 按userId查询
                const type = this.btnEnable.examine ? 0 : 1;
                getAllWorkingGroupUserByUserId({type: type}).then(response => {
                    this.allWorkingGroupUser = response.data;
                })
            },
            handleSelfPhotoSuccess(res, file, fileList) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.appraise.selfPhoto = res.data.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handlerError(err, file, fileList) {
                this.$message.error("网络不稳定，上传失败");
            },
            beforeSelfPhotoUpload(file) {
                const isIMG = this.$store.state.common.imageAccepts.includes(file.type);
                if (!isIMG) {
                    this.$message.error('上传图片格式不正确!');
                }
                const isLt10M = this.beforeFileUpload(file);
                return isIMG && isLt10M;
            },
            handleFileSuccess(res, file, fileList) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.appraise.fileUrl = res.data.url;
                    this.uploadFileReader.splice(0, 1);
                    let uploadFile = {
                        name: res.data.title,
                        url: res.data.url
                    }
                    this.uploadFileReader.push(uploadFile);
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            beforeFileUpload(file) {
                const isLt10M = file.size < 1024 * 1024 * 10;
                if (!isLt10M) {
                    this.$message.error('上传文件大小不能超过 2MB!');
                }
                return isLt10M;
            },
            handleFilePreview(file) {
                // 下载文件
                if (this.dialogTitle == 'create') {
                    window.location.href = this.$store.state.common.downloadUrl + file.response.data.url
                } else {
                    window.location.href = this.$store.state.common.downloadUrl + file.url
                }
            },
            handleFileRemove() {
                this.appraise.fileUrl = undefined;
            },
            downloadFile(row) {
                window.location.href = this.$store.state.common.downloadUrl + row.fileUrl;
            },
            btnExamine(row) {
                this.resetAppraise();
                this.appraise = deepClone(row);
                let uploadFile = {
                    id: row.id,
                    name: '点击下载文件',
                    url: row.fileUrl
                }
                this.uploadFileReader.push(uploadFile);
                this.appraise.status = undefined;
                this.dialogTitle = 'examine';
                this.dialogVisible = true;
            },
            doExamine(){
                this.$refs['appraiseDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        const data = {
                            id: this.appraise.id,
                            status: this.appraise.status,
                            reason: this.appraise.reason,
                        }
                        doExamine(data).then(() => {
                            this.resetAppraiseDialogAndList();
                            this.$message.success('审核成功');
                        })
                    } else {
                        return false;
                    }
                });
            },
            btnRevokeExamine(row) {
                this.$confirm('此操作将撤销审核, 是否继续？', this.$t("table.tip"), {type: 'error'}).then(() => {
                    this.doRevokeExamine(row);
                })
            },
            doRevokeExamine(row) {
                createOrUpdateAppraise(row).then(() => {
                    this.reloadList();
                    this.$message.success('撤销成功');
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
</style>
