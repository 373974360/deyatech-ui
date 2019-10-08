<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-select :size="searchSize" v-model.trim="listQuery.modelId" clearable placeholder="请选择模型">
                            <el-option v-for="i in models" :key="i.id" :label="i.name" :value="i.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="请输入关键字" v-model.trim="listQuery.name" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model.trim="listQuery.type" clearable placeholder="请选择类型">
                            <el-option v-for="i in enums['InterviewGuestTypeEnum']" :key="i.code" :label="i.value" :value="i.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
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
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="guestList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="模型" prop="modelName"/>
                <el-table-column align="center" label="姓名" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="照片" prop="photo" width="120">
                    <template slot-scope="scope">
                        <img :src="showPicImgUrl + scope.row.photo" style="width: 100px; height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="职务" prop="job"/>
                <el-table-column align="center" label="类型" prop="type" width="100">
                    <template slot-scope="scope">
                        {{scope.row.type | enums('InterviewGuestTypeEnum')}}
                    </template>
                </el-table-column>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop="btnDelete(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeGuestDialog">
                <el-form ref="guestDialogForm" class="deyatech-form" :model="guest" label-position="right"
                         label-width="80px" :rules="guestRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="模型" prop="modelId">
                                <el-select v-model.trim="guest.modelId" placeholder="请选择模型" style="width: 100%;">
                                    <el-option v-for="i in models" :key="i.id" :label="i.name" :value="i.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model.trim="guest.name" maxlength="20" placeholder="请输入姓名"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="类型" prop="type">
                                <el-select v-model.trim="guest.type" clearable placeholder="请选择类型" style="width: 100%;">
                                    <el-option v-for="i in enums['InterviewGuestTypeEnum']" :key="i.code" :label="i.value" :value="i.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="职务" prop="job">
                                <el-input v-model.trim="guest.job" maxlength="50" placeholder="请输入职务"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="照片" prop="photo">
                                <el-input v-model.trim="guest.photo" v-if="false"></el-input>
                                <el-upload class="photo-uploader" name="file"
                                           :action="$store.state.common.uploadUrl"
                                           :accept="$store.state.common.imageAccepts"
                                           :show-file-list="false"
                                           :on-success="handlePhotoSuccess"
                                           :on-error="handlerPhotoError">
                                    <img v-if="guest.photo" :src="showPicImgUrl + guest.photo" class="photo-add">
                                    <i v-else class="el-icon-plus photo-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="guest.remark" :rows="3" maxlength="500" placeholder="请输入备注"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeGuestDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getGuestList,
        createOrUpdateGuest,
        delGuests
    } from '@/api/interview/guest';
    import {
        getAllModelList
    } from '@/api/interview/model';

    export default {
        name: 'guest',
        data() {
            return {
                showPicImgUrl: this.$store.state.common.showPicImgUrl,
                guestList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined,
                    modelId: undefined,
                    type: undefined
                },
                guest: {
                    id: undefined,
                    modelId: undefined,
                    name: undefined,
                    photo: undefined,
                    job: undefined,
                    type: undefined
                },
                guestRules: {
                    modelId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '模型'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '姓名'}
                    ],
                    photo: [
                        {required: true, message: '请上传照片'}
                    ],
                    job: [
                        {required: true, message: this.$t("table.pleaseInput") + '职务'}
                    ],
                    type: [
                        {required: true, message: this.$t("table.pleaseSelect") + '类型'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                models: []
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
                    create: this.permission.guest_create,
                    update: this.permission.guest_update,
                    delete: this.permission.guest_delete
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
            this.loadModel();
        },
        methods: {
            loadModel() {
                getAllModelList().then(response => {
                    this.models = response.data;
                }).catch(error=>{
                    this.$message.error(error);
                });
            },
            resetSearch(){
                this.listQuery.name = undefined;
                this.listQuery.modelId = undefined;
                this.listQuery.type = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.guestList = undefined;
                this.total = undefined;
                getGuestList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.guestList = response.data.records;
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
                this.resetGuest();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetGuest();
                if (row.id) {
                    this.guest = deepClone(row);
                } else {
                    this.guest = deepClone(this.selectedRows[0]);
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
                this.$refs['guestDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateGuest(this.guest).then(() => {
                            this.resetGuestDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['guestDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateGuest(this.guest).then(() => {
                            this.resetGuestDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delGuests(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetGuest(){
                this.guest = {
                    id: undefined,
                    modelId: undefined,
                    name: undefined,
                    photo: undefined,
                    job: undefined,
                    type: undefined
                }
            },
            resetGuestDialogAndList(){
                this.closeGuestDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeGuestDialog() {
                this.dialogVisible = false;
                this.resetGuest();
                this.$refs['guestDialogForm'].resetFields();
            },
            handlePhotoSuccess(res) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.guest.photo = res.data.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handlerPhotoError() {
                this.$message.error("上传失败");
            }
        }
    }
</script>


<style>
    .photo-uploader {
        width: 160px;
        height: 160px;
    }

    .photo-uploader .el-upload {
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .photo-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .photo-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 160px;
        height: 160px;
        line-height: 160px;
        text-align: center;
    }

    .photo-add {
        width: 160px;
        height: 160px;
        display: block;
    }
</style>
