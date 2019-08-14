<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model="listQuery.name"></el-input>
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
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="settingList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="站群ID(为空则全站群共享)" prop="stationGroupId"/>
                <el-table-column align="center" label="允许上传的附件类型" prop="uploadFileType"/>
                <el-table-column align="center" label="允许上传文件大小M" prop="uploadFileSize"/>
                <el-table-column align="center" label="是否生成缩略图" prop="thumbnailEnable"/>
                <el-table-column align="center" label="缩略图宽度" prop="thumbnailWidth"/>
                <el-table-column align="center" label="缩略图高度" prop="thumbnailHeight"/>
                <el-table-column align="center" label="是否生成水印" prop="watermarkEnable"/>
                <el-table-column align="center" label="水印类型：1图片、2文字" prop="watermarkType"/>
                <el-table-column align="center" label="水印图片高度" prop="watermarkWidth"/>
                <el-table-column align="center" label="水印图片宽度" prop="watermarkHeight"/>
                <el-table-column align="center" label="水印透明度%(0不透明~100透明)" prop="watermarkTransparency"/>
                <el-table-column align="center" label="水印图片url" prop="watermarkUrl"/>
                <el-table-column align="center" label="水印文字" prop="watermarkWord"/>
                <el-table-column align="center" label="水印位置：九宫格" prop="watermarkPosition"/>
                <el-table-column align="center" label="ico图片url" prop="icoUrl"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeSettingDialog">
                <el-form ref="settingDialogForm" class="deyatech-form" :model="setting" label-position="right"
                         label-width="80px" :rules="settingRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="站群ID(为空则全站群共享)" prop="stationGroupId">
                                <el-input v-model="setting.stationGroupId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="允许上传的附件类型" prop="uploadFileType">
                                <el-input v-model="setting.uploadFileType"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="允许上传文件大小M" prop="uploadFileSize">
                                <el-input v-model="setting.uploadFileSize"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否生成缩略图" prop="thumbnailEnable">
                                <el-input v-model="setting.thumbnailEnable"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="缩略图宽度" prop="thumbnailWidth">
                                <el-input v-model="setting.thumbnailWidth"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="缩略图高度" prop="thumbnailHeight">
                                <el-input v-model="setting.thumbnailHeight"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否生成水印" prop="watermarkEnable">
                                <el-input v-model="setting.watermarkEnable"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="水印类型：1图片、2文字" prop="watermarkType">
                                <el-input v-model="setting.watermarkType"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="水印图片高度" prop="watermarkWidth">
                                <el-input v-model="setting.watermarkWidth"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="水印图片宽度" prop="watermarkHeight">
                                <el-input v-model="setting.watermarkHeight"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="水印透明度%(0不透明~100透明)" prop="watermarkTransparency">
                                <el-input v-model="setting.watermarkTransparency"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="水印图片url" prop="watermarkUrl">
                                <el-input v-model="setting.watermarkUrl"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="水印文字" prop="watermarkWord">
                                <el-input v-model="setting.watermarkWord"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="水印位置：九宫格" prop="watermarkPosition">
                                <el-input v-model="setting.watermarkPosition"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="ico图片url" prop="icoUrl">
                                <el-input v-model="setting.icoUrl"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="setting.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeSettingDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getSettingList,
        createOrUpdateSetting,
        delSettings
    } from '@/api/resource/setting';

    export default {
        name: 'setting',
        data() {
            return {
                settingList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                setting: {
                    id: undefined,
                    stationGroupId: undefined,
                    uploadFileType: undefined,
                    uploadFileSize: undefined,
                    thumbnailEnable: undefined,
                    thumbnailWidth: undefined,
                    thumbnailHeight: undefined,
                    watermarkEnable: undefined,
                    watermarkType: undefined,
                    watermarkWidth: undefined,
                    watermarkHeight: undefined,
                    watermarkTransparency: undefined,
                    watermarkUrl: undefined,
                    watermarkWord: undefined,
                    watermarkPosition: undefined,
                    icoUrl: undefined
                },
                settingRules: {
                    stationGroupId: [
                        {required: true, message: this.$t("table.pleaseInput") + '站群ID(为空则全站群共享)'}
                    ],
                    uploadFileType: [
                        {required: true, message: this.$t("table.pleaseInput") + '允许上传的附件类型'}
                    ],
                    uploadFileSize: [
                        {required: true, message: this.$t("table.pleaseInput") + '允许上传文件大小M'}
                    ],
                    thumbnailEnable: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否生成缩略图'}
                    ],
                    thumbnailWidth: [
                        {required: true, message: this.$t("table.pleaseInput") + '缩略图宽度'}
                    ],
                    thumbnailHeight: [
                        {required: true, message: this.$t("table.pleaseInput") + '缩略图高度'}
                    ],
                    watermarkEnable: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否生成水印'}
                    ],
                    watermarkType: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印类型：1图片、2文字'}
                    ],
                    watermarkWidth: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印图片高度'}
                    ],
                    watermarkHeight: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印图片宽度'}
                    ],
                    watermarkTransparency: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印透明度%(0不透明~100透明)'}
                    ],
                    watermarkUrl: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印图片url'}
                    ],
                    watermarkWord: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印文字'}
                    ],
                    watermarkPosition: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印位置：九宫格'}
                    ],
                    icoUrl: [
                        {required: true, message: this.$t("table.pleaseInput") + 'ico图片url'}
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
                    create: this.permission.setting_create,
                    update: this.permission.setting_update,
                    delete: this.permission.setting_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.settingList = undefined;
                this.total = undefined;
                getSettingList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.settingList = response.data.records;
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
                this.resetSetting();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetSetting();
                if (row.id) {
                    this.setting = deepClone(row);
                } else {
                    this.setting = deepClone(this.selectedRows[0]);
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
                this.$refs['settingDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateSetting(this.setting).then(() => {
                            this.resetSettingDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['settingDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateSetting(this.setting).then(() => {
                            this.resetSettingDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delSettings(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetSetting(){
                this.setting = {
                    id: undefined,
                    stationGroupId: undefined,
                    uploadFileType: undefined,
                    uploadFileSize: undefined,
                    thumbnailEnable: undefined,
                    thumbnailWidth: undefined,
                    thumbnailHeight: undefined,
                    watermarkEnable: undefined,
                    watermarkType: undefined,
                    watermarkWidth: undefined,
                    watermarkHeight: undefined,
                    watermarkTransparency: undefined,
                    watermarkUrl: undefined,
                    watermarkWord: undefined,
                    watermarkPosition: undefined,
                    icoUrl: undefined
                }
            },
            resetSettingDialogAndList(){
                this.closeSettingDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeSettingDialog() {
                this.dialogVisible = false;
                this.resetSetting();
                this.$refs['settingDialogForm'].resetFields();
            }
        }
    }
</script>


