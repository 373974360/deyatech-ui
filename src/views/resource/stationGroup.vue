<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item >
                        <el-cascader ref="queryStationGroupClassificationCascader" :options="stationGroupClassificationCascader"
                                     v-model.trim="listQuery.stationGroupClassificationArray"
                                     clearable placeholder="请选择分类" style="width: 300px;" :size="searchSize"></el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name" clearable></el-input>
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
                    <el-button v-if="btnEnable.setting" type="primary" :size="btnSize" @click="btnSetting">全局设置</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>

            <el-table :data="stationGroupList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="所属分类" prop="stationGroupClassificationName"/>
                <el-table-column align="center" label="名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="英文名称" prop="englishName"/>
                <el-table-column align="center" label="简称" prop="abbreviation"/>
                <el-table-column align="center" label="排序号" prop="sortNo"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="100">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable == 1 ? "启用" : (scope.row.enable == 0 ? "停用" : "") }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle :disabled="scope.row.enable == 10"
                                   @click.stop="btnDelete(scope.row)"></el-button>
                        <el-button v-if="scope.row.enable == 1" title="停用" type="warning" icon="el-icon-close" :size="btnSize" circle
                                   @click.stop="btnCtrl(scope.row, 'stop')"></el-button>
                        <el-button v-else-if="scope.row.enable == 0" title="启用" type="warning" icon="el-icon-caret-right" :size="btnSize" circle
                                   @click.stop="btnCtrl(scope.row, 'run')"></el-button>
                        <el-button v-if="btnEnable.setting" title="设置" type="primary" icon="el-icon-setting" :size="btnSize" circle
                                   @click.stop="btnSetting(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>

            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeStationGroupDialog">
                <el-form ref="stationGroupDialogForm" class="deyatech-form" :model="stationGroup" label-position="right"
                         label-width="80px" :rules="stationGroupRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="所属分类" prop="stationGroupClassificationId">
                                <el-cascader ref="addOrEditStationGroupClassificationCascader" :options="stationGroupClassificationCascader"
                                             v-model.trim="stationGroupClassificationTreePosition"
                                             clearable placeholder="请选择分类" style="width: 100%;" ></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="名称" prop="name">
                                <el-input v-model.trim="stationGroup.name" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="englishName">
                                <el-input v-model.trim="stationGroup.englishName" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="简称" prop="abbreviation">
                                <el-input v-model.trim="stationGroup.abbreviation" maxlength="10"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序号" prop="sortNo">
                                <el-input v-model.trim="stationGroup.sortNo" maxlength="3"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="描述" prop="description">
                                <el-input type="textarea" v-model.trim="stationGroup.description" :rows="3" maxlength="500"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="stationGroup.remark" :rows="3" maxlength="400"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeStationGroupDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogSettingVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeSettingDialog">
                <el-form ref="settingDialogForm" class="deyatech-form" :model="setting" label-position="right" label-width="160px" :rules="settingRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="站群" prop="stationGroupId" :rules="setting.stationGroupId ? settingRules.stationGroupId : []">
                                <span v-if="setting.stationGroupId" v-text="setting.stationGroupName"></span>
                                <span v-else>全局设置所有站群</span>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="允许上传的附件类型" prop="uploadFileType">
                                <el-select v-model="uploadFileTypeArray" @change="uploadFileTypeChange" clearable multiple style="width: 100%">
                                    <el-option v-for="item in enums['UploadFileTypeEnum']"
                                               :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="允许上传文件大小(M)" prop="uploadFileSize">
                                <el-input v-model="setting.uploadFileSize" maxlength="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否生成缩略图" prop="thumbnailEnable">
                                <el-select v-model="setting.thumbnailEnable" style="width: 100%" @change="thumbnailEnableChange">
                                    <el-option v-for="item in enums['YesNoEnum']"
                                               :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="缩略图宽度(px)" prop="thumbnailWidth" :rules="setting.thumbnailEnable == 0 ? [] : settingRules.thumbnailWidth">
                                <el-input v-model="setting.thumbnailWidth" maxlength="4"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="缩略图高度(px)" prop="thumbnailHeight" :rules="setting.thumbnailEnable == 0 ? [] : settingRules.thumbnailHeight">
                                <el-input v-model="setting.thumbnailHeight" maxlength="4"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否生成水印" prop="watermarkEnable">
                                <el-select v-model="setting.watermarkEnable" style="width:100%">
                                    <el-option v-for="item in enums['YesNoEnum']"
                                               :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="水印类型" prop="watermarkType">
                                <el-select v-model="setting.watermarkType" style="width:100%">
                                    <el-option v-for="item in enums['WaterMarkTypeEnum']"
                                               :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="水印宽度(px)" prop="watermarkWidth">
                                <el-input v-model="setting.watermarkWidth" maxlength="4"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="水印高度(px)" prop="watermarkHeight">
                                <el-input v-model="setting.watermarkHeight" maxlength="4"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="水印透明度(px)" prop="watermarkTransparency">
                                <el-slider v-model="setting.watermarkTransparency" :min="1" :max="100" :step="1"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="水印图片" prop="watermarkUrl">
                                <el-input v-model="setting.watermarkUrl" maxlength="1000"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="水印文字" prop="watermarkWord">
                                <el-input v-model="setting.watermarkWord" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="水印位置" prop="watermarkPosition">
                                <div>
                                    <el-radio v-model="setting.watermarkPosition" :label="1" border>左上</el-radio>
                                    <el-radio v-model="setting.watermarkPosition" :label="2" border>上边</el-radio>
                                    <el-radio v-model="setting.watermarkPosition" :label="3" border>右上</el-radio>
                                </div>
                                <div style="margin-top: 10px">
                                    <el-radio v-model="setting.watermarkPosition" :label="4" border>左边</el-radio>
                                    <el-radio v-model="setting.watermarkPosition" :label="5" border>中间</el-radio>
                                    <el-radio v-model="setting.watermarkPosition" :label="6" border>右边</el-radio>
                                </div>
                                <div style="margin-top: 10px">
                                    <el-radio v-model="setting.watermarkPosition" :label="7" border>左下</el-radio>
                                    <el-radio v-model="setting.watermarkPosition" :label="8" border>下边</el-radio>
                                    <el-radio v-model="setting.watermarkPosition" :label="9" border>右下</el-radio>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="ICO图片" prop="icoUrl">
                                <el-input v-model="setting.icoUrl" maxlength="1000"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="setting.remark" :rows="3" maxlength="400"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doSettingCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doSettingUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
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
        getStationGroupList,
        createOrUpdateStationGroup,
        delStationGroups,
        isNameExist,
        isEnglishNameExist,
        isAbbreviationExist,
        runOrStopStationById
    } from '@/api/resource/stationGroup';
    import {getStationGroupClassificationCascader} from '@/api/resource/stationGroupClassification';
    import {isEnglish} from '@/util/validate';
    import {
        getSettingByStationGroupId,
        createOrUpdateSetting
    } from '@/api/resource/setting';

    export default {
        name: 'stationGroup',
        data() {
            const checkName = (rule, value, callback) => {
                isNameExist({
                    id: this.stationGroup.id,
                    classificationId: this.stationGroup.stationGroupClassificationId,
                    name: this.stationGroup.name}).then(response => {
                    if (response.status == 200 && response.data) {
                        callback(new Error(response.message));
                    } else {
                        callback();
                    }
                }).catch(() => {});
                // this.$refs['stationGroupDialogForm'].validateField('stationGroupClassificationId', errorMsg => {
                //     if (!errorMsg) {
                //     } else {
                //         callback(new Error("没有选择分类，名称无法校验"));
                //     }
                // });
            };
            const checkEnglishName = (rule, value, callback) => {
                if (!isEnglish(value)) {
                    callback(new Error('只能输入英文字母'));
                    return;
                }
                isEnglishNameExist({
                    id: this.stationGroup.id,
                    classificationId: this.stationGroup.stationGroupClassificationId,
                    englishName: this.stationGroup.englishName}).then(response => {
                    if (response.status == 200 && response.data) {
                        callback(new Error(response.message));
                    } else {
                        callback();
                    }
                }).catch(() => {});
                // this.$refs['stationGroupDialogForm'].validateField('stationGroupClassificationId', errorMsg => {
                //     if (!errorMsg) {
                //     } else {
                //         callback(new Error("没有选择分类，英文名称无法校验"));
                //     }
                // });
            };
            const checkAbbreviation = (rule, value, callback) => {
                isAbbreviationExist({
                    id: this.stationGroup.id,
                    classificationId: this.stationGroup.stationGroupClassificationId,
                    abbreviation: this.stationGroup.abbreviation}).then(response => {
                    if (response.status == 200 && response.data) {
                        callback(new Error(response.message));
                    } else {
                        callback();
                    }
                }).catch(() => {});
                // this.$refs['stationGroupDialogForm'].validateField('stationGroupClassificationId', errorMsg => {
                //     if (!errorMsg) {
                //     } else {
                //         callback(new Error("没有选择分类，简称无法校验"));
                //     }
                // });
            };
            const checkNumber = (rule, value, callback) => {
                if (/[^\d]/g.test(value)) {
                    callback(new Error('请输入整数'));
                } else {
                    callback();
                }
            };
            return {
                stationGroupList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined,
                    stationGroupClassificationId: undefined,
                    stationGroupClassificationArray: []
                },
                stationGroup: {
                    id: undefined,
                    name: undefined,
                    englishName: undefined,
                    abbreviation: undefined,
                    description: undefined,
                    sortNo: undefined,
                    stationGroupClassificationId: undefined,
                    stationGroupClassificationTreePosition: undefined
                },
                stationGroupRules: {
                    stationGroupClassificationId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '分类'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '名称'},
                        {validator: checkName, trigger: 'blur'}
                    ],
                    englishName: [
                        {required: true, message: this.$t("table.pleaseInput") + '英文名称'},
                        {validator: checkEnglishName, trigger: 'blur'}
                    ],
                    abbreviation: [
                        {required: true, message: this.$t("table.pleaseInput") + '简称'},
                        {validator: checkAbbreviation, trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: this.$t("table.pleaseInput") + '描述'}
                    ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '排序号'},
                        {validator: checkNumber, trigger: ['blur','change']}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                stationGroupClassificationCascader: [],
                setting: {
                    id: undefined,
                    stationGroupName: undefined,
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
                        {required: true, message: this.$t("table.pleaseInput") + '站群'}
                    ],
                    uploadFileType: [
                        {required: true, message: this.$t("table.pleaseInput") + '允许上传的附件类型'}
                    ],
                    uploadFileSize: [
                        {required: true, message: this.$t("table.pleaseInput") + '允许上传文件大小'},
                        {validator: checkNumber, trigger: ['blur','change']}
                    ],
                    thumbnailEnable: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否生成缩略图'}
                    ],
                    thumbnailWidth: [
                        {required: true, message: this.$t("table.pleaseInput") + '缩略图宽度'},
                        {validator: checkNumber, trigger: ['blur','change']}
                    ],
                    thumbnailHeight: [
                        {required: true, message: this.$t("table.pleaseInput") + '缩略图高度'},
                        {validator: checkNumber, trigger: ['blur','change']}
                    ],
                    watermarkEnable: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否生成水印'}
                    ],
                    watermarkType: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印类型'}
                    ],
                    watermarkWidth: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印高度'},
                        {validator: checkNumber, trigger: ['blur','change']}
                    ],
                    watermarkHeight: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印宽度'},
                        {validator: checkNumber, trigger: ['blur','change']}
                    ],
                    watermarkTransparency: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印透明度'}
                    ],
                    watermarkUrl: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印图片'}
                    ],
                    watermarkWord: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印文字'}
                    ],
                    watermarkPosition: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印位置'}
                    ],
                    icoUrl: [
                        {required: true, message: this.$t("table.pleaseInput") + 'ICO图片'}
                    ]
                },
                dialogSettingVisible: false,
                uploadFileTypeArray: []
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
            stationGroupClassificationTreePosition: {
                get() {
                    if (this.stationGroup.stationGroupClassificationTreePosition) {
                        return this.stationGroup.stationGroupClassificationTreePosition.substr(1).split('&')
                    }
                },
                set(v) {
                    if (v.length > 0) {
                        this.stationGroup.stationGroupClassificationId = v[v.length - 1];
                        this.stationGroup.stationGroupClassificationTreePosition = '&' + v.join('&');
                    } else {
                        this.stationGroup.stationGroupClassificationId = undefined;
                        this.stationGroup.stationGroupClassificationTreePosition = undefined;
                    }
                }
            },
            btnEnable() {
                return {
                    create: this.permission.stationGroup_create,
                    update: this.permission.stationGroup_update,
                    delete: this.permission.stationGroup_delete,
                    ctrl: this.permission.stationGroup_ctrl,
                    setting: this.permission.stationGroup_setting
                };
            }
        },
        created(){
            this.reloadList();
            this.getStationGroupClassificationCascader(null);
        },
        methods: {
            loadSetting(stationGroupId) {
                return new Promise((resolve, reject) => {
                    getSettingByStationGroupId(stationGroupId).then(response=>{
                        resolve(response);
                    }).catch(error=>{
                        reject(error);
                    });
                });
            },
            getStationGroupClassificationCascader(id){
                this.submitLoading = true;
                getStationGroupClassificationCascader(id).then(response => {
                    this.submitLoading = false;
                    this.stationGroupClassificationCascader = response.data;
                })
            },
            resetSearch(){
                let obj = {};
                obj.stopPropagation = () =>{};
                this.$refs.queryStationGroupClassificationCascader.clearValue(obj);
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.stationGroupList = undefined;
                this.total = undefined;
                if (this.listQuery.stationGroupClassificationArray && this.listQuery.stationGroupClassificationArray.length > 0) {
                    this.listQuery.stationGroupClassificationId = this.listQuery.stationGroupClassificationArray[this.listQuery.stationGroupClassificationArray.length - 1];
                } else {
                    this.listQuery.stationGroupClassificationId = undefined;
                }
                getStationGroupList({
                    page: this.listQuery.page,
                    size: this.listQuery.size,
                    stationGroupClassificationId: this.listQuery.stationGroupClassificationId,
                    name: this.listQuery.name
                }).then(response => {
                    this.listLoading = false;
                    this.stationGroupList = response.data.records;
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
                this.resetStationGroup();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetStationGroup();
                if (row.id) {
                    this.stationGroup = deepClone(row);
                } else {
                    this.stationGroup = deepClone(this.selectedRows[0]);
                }
                this.stationGroup.stationGroupClassificationTreePosition += '&' + this.stationGroup.stationGroupClassificationId;
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnCtrl(row, flag){
                let msg = flag === 'run' ? "启用" : "停用";
                runOrStopStationById({
                    id: row.id,
                    flag: flag
                }).then(() => {
                    this.reloadList();
                    this.$message.success(msg + "操作成功");
                })
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
                this.$refs['stationGroupDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateStationGroup(this.stationGroup).then((response) => {
                            if (response.status == 200) {
                                this.resetStationGroupDialogAndList();
                                this.$message.success(this.$t("table.createSuccess"));
                            } else {
                                this.submitLoading = false;
                                this.$message.error(response.message);
                            }
                        }).catch(error => {
                            this.submitLoading = false;
                            this.$message.error(error);
                        });
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['stationGroupDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateStationGroup(this.stationGroup).then(() => {
                            this.resetStationGroupDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delStationGroups(ids).then((response) => {
                    if (response.status == 200 && response.data) {
                        this.reloadList();
                        this.$message.success(this.$t("table.deleteSuccess"));
                    } else {
                        this.listLoading = false;
                        this.$message.error(response.message)
                    }
                }).catch(error => {
                    this.listLoading = false;
                    this.$message.error(error);
                });
            },
            resetStationGroup(){
                this.stationGroup = {
                    id: undefined,
                    name: undefined,
                    englishName: undefined,
                    abbreviation: undefined,
                    description: undefined,
                    sortNo: undefined,
                    stationGroupClassificationId: undefined
                }
            },
            resetStationGroupDialogAndList(){
                this.closeStationGroupDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeStationGroupDialog() {
                this.dialogVisible = false;
                this.resetStationGroup();
                this.$refs['stationGroupDialogForm'].resetFields();
                let obj = {};
                obj.stopPropagation = () =>{};
                this.$refs.addOrEditStationGroupClassificationCascader.clearValue(obj);
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
                };
                this.uploadFileTypeArray = [];
            },
            btnSetting(row) {
                let stationGroupId = undefined;
                if (row.id) {
                    stationGroupId = row.id;
                }
                this.resetSetting();
                this.loadSetting(stationGroupId).then(response=>{
                    if (response.status == 200 && response.data) {
                        this.setting = response.data;
                        if (this.setting.uploadFileType) {
                            this.uploadFileTypeArray = this.setting.uploadFileType.split(',');
                        }
                    }
                    this.dialogSettingVisible = true;
                }).catch(error=>{
                    this.$message.error(error);
                });
            },
            doSettingCreate(){
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
            doSettingUpdate(){
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
            resetSettingDialogAndList(){
                this.closeSettingDialog();
                this.submitLoading = false;
            },
            closeSettingDialog() {
                this.dialogSettingVisible = false;
                this.resetSetting();
                this.$refs['settingDialogForm'].resetFields();
            },
            uploadFileTypeChange(selectedType) {
                console.dir(selectedType);
                if (selectedType.length > 0) {
                    this.setting.uploadFileType = selectedType.join(',');
                } else {
                    this.setting.uploadFileType = selectedType.join(',');
                }
                console.dir(this.setting.uploadFileType);
            },
            thumbnailEnableChange() {
                //if (this.setting.thumbnailEnable == 0) {
                    this.$refs['settingDialogForm'].clearValidate('thumbnailWidth');
                    this.$refs['settingDialogForm'].clearValidate('thumbnailHeight');
                //}
            }
        }
    }
</script>


