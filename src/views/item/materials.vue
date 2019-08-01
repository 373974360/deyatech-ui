<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.materialsName"></el-input>
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
            <el-table :data="materialsList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="材料名称" prop="materialsName"/>
                <el-table-column align="center" label="材料来源" prop="materialsFrom"/>
                <el-table-column align="center" label="材料类型" prop="materialsType">
                    <template slot-scope="scope">
                        {{scope.row.materialsType | enums('MaterialsTypeEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="材料要求" prop="materialsMode">
                    <template slot-scope="scope">
                        {{scope.row.materialsMode | enums('MaterialsModeEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="下载样表" prop="materialsFileUrl">
                    <template slot-scope="scope">
                        <a class="el-button el-button--default show-file" :href="getUrl(scope.row.materialsFileUrl)" target="_blank" v-if="scope.row.materialsFileUrl">下载样表</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="下载空表" prop="materialsEmptyFileName">
                    <template slot-scope="scope">
                        <a class="el-button el-button--default show-file" :href="getUrl(scope.row.materialsEmptyUrl)" target="_blank" v-if="scope.row.materialsEmptyUrl">下载空表</a>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeMaterialsDialog">
                <el-form ref="materialsDialogForm" class="deyatech-form" :model="materials" label-position="right"
                         label-width="80px" :rules="materialsRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="材料名称" prop="materialsName" label-width="120px">
                                <el-input v-model.trim="materials.materialsName" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="材料来源" prop="materialsFrom" label-width="120px">
                                <el-input v-model.trim="materials.materialsFrom" maxlength="200"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="材料类型" prop="materialsType" label-width="120px">
                                <el-select v-model="materials.materialsType" @change="materialsTypeChange" clearable>
                                    <el-option
                                        v-for = "o in loadEnum('MaterialsTypeEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="材料子类型" prop="materialsSubType" label-width="120px">
                                <el-select v-model="materials.materialsSubType" @change="materialsSubTypeChange" clearable>
                                    <el-option
                                        v-for = "o in materialsSubTypeArray"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="材料要求" prop="materialsMode" label-width="120px">
                                <el-select v-model="materials.materialsMode" @change="materialsModeChange" clearable>
                                    <el-option
                                        v-for = "o in loadEnum('MaterialsModeEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="下载样表" prop="materialsFileUrl" label-width="120px">
                                <el-upload name="file" class="upload-file"
                                           :action="this.$store.state.common.uploadUrl"
                                           :accept="this.$store.state.common.fileAccepts"
                                           :show-file-list="false"
                                           :on-success="sampleFileUploadSuccess"
                                           :on-error="uploadError">
                                    <el-button >上传</el-button>
                                </el-upload>
                                <a class="el-button el-button--default show-file" :href="downloadMaterialsFileUrl" target="_blank" v-if="materials.materialsFileUrl">查看</a>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="下载空表名" prop="materialsEmptyFileName" label-width="120px">
                                <el-input v-model="materials.materialsEmptyFileName" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="下载空表" prop="materialsEmptyUrl" label-width="120px">
                                <el-upload name="file" class="upload-file"
                                           :action="this.$store.state.common.uploadUrl"
                                           :accept="this.$store.state.common.fileAccepts"
                                           :show-file-list="false"
                                           :on-success="emptyFileUploadSuccess"
                                           :on-error="uploadError">
                                    <el-button>上传</el-button>
                                </el-upload>
                                <a class="el-button el-button--default show-file" :href="downloadMaterialsEmptyUrl" target="_blank" v-if="materials.materialsEmptyUrl">查看</a>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="复印件特殊要求" prop="copySpecialRequirements" label-width="120px">
                                <el-input type="textarea" v-model.trim="materials.copySpecialRequirements" :rows="3" maxlength="500"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="填报须知" prop="materialsWarn" label-width="120px">
                                <el-input type="textarea" v-model.trim="materials.materialsWarn" :rows="3" maxlength="500"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark" label-width="120px">
                                <el-input type="textarea" v-model.trim="materials.remark" :rows="3" maxlength="500"/>
                            </el-form-item>
                        </el-col>
                    </el-row>


                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeMaterialsDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getMaterialsList,
        createOrUpdateMaterials,
        delMaterialss
    } from '@/api/item/materials';
    import {getStore} from '@/util/store';

    export default {
        name: 'materials',
        data() {
            return {
                materialsList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    materialsName: undefined
                },
                materials: {
                    id: undefined,
                    materialsName: undefined,
                    materialsType: undefined,
                    materialsTypeName: undefined,
                    materialsSubType: undefined,
                    materialsSubTypeName: undefined,
                    materialsFrom: undefined,
                    materialsMode: undefined,
                    materialsModeName: undefined,
                    materialsFileUrl: undefined,
                    materialsEmptyFileName: undefined,
                    materialsEmptyUrl: undefined,
                    materialsWarn: undefined,
                    copySpecialRequirements: undefined
                },
                materialsRules: {
                    materialsName: [
                        {required: true, message: this.$t("table.pleaseInput") + '材料名称'}
                    ],
                    materialsType: [
                        {required: true, message: this.$t("table.pleaseSelect") + '材料类型'}
                    ],
                    materialsMode: [
                        {required: true, message: this.$t("table.pleaseSelect") + '材料要求'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                materialsSubTypeArray: [],
                downloadMaterialsEmptyUrl: undefined,
                downloadMaterialsFileUrl: undefined
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
                    create: this.permission.materials_create,
                    update: this.permission.materials_update,
                    delete: this.permission.materials_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            getUrl(url) {
                return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + this.$store.state.common.downloadUrl + url;
            },
            emptyFileUploadSuccess(response) {
                if (response.status === 200 && response.data.state === 'SUCCESS') {
                    this.materials.materialsEmptyUrl = response.data.url;
                    this.downloadMaterialsEmptyUrl = this.getUrl(response.data.url);
                    this.$forceUpdate();
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error(response.message);
                }
            },
            sampleFileUploadSuccess(response) {
                if (response.status === 200 && response.data.state === 'SUCCESS') {
                    this.materials.materialsFileUrl = response.data.url;
                    this.downloadMaterialsFileUrl = this.getUrl(response.data.url);
                    this.$forceUpdate();
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error(response.message);
                }
            },
            uploadError() {
                this.$message.error("上传失败");
            },
            materialsModeChange() {
                this.materials.materialsModeName = this.getEnumName(this.materials.materialsMode, 'MaterialsModeEnum');
            },
            materialsSubTypeChange() {
                this.materials.materialsSubTypeName = this.getEnumName(this.materials.materialsSubType, 'MaterialsSubTypeEnum');
            },
            materialsTypeChange() {
                this.materials.materialsTypeName = this.getEnumName(this.materials.materialsType, 'MaterialsTypeEnum');
                this.materials.materialsSubType = undefined;
                this.materialsSubTypeArray = [];
                var enumArray = this.loadEnum('MaterialsSubTypeEnum');
                console.dir(enumArray);
                if (enumArray) {
                    for(var i = 0; i < enumArray.length; i++) {
                        if (enumArray[i].code.startsWith(this.materials.materialsType)) {
                            this.materialsSubTypeArray.push(enumArray[i]);
                        }
                    }
                } else {
                    this.materialsSubTypeArray = []
                }
                console.dir(this.materialsSubTypeArray);
            },
            getEnumName(code, name) {
                var enumArray = this.loadEnum(name);
                if (enumArray) {
                    for(var i = 0; i < enumArray.length; i++) {
                        if (code === enumArray[i].code) {
                            return enumArray[i].value;
                        }
                    }
                }
                return '';
            },
            loadEnum(name) {
                return getStore({name: 'enums'})[name]
            },
            resetSearch(){
                this.listQuery.materialsName = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.materialsList = undefined;
                this.total = undefined;
                getMaterialsList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.materialsList = response.data.records;
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
                this.resetMaterials();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
                this.materialsSubTypeArray = [];
            },
            btnUpdate(row){
                this.resetMaterials();
                if (row.id) {
                    this.materials = deepClone(row);
                } else {
                    this.materials = deepClone(this.selectedRows[0]);
                }
                this.dialogTitle = 'update';
                this.dialogVisible = true;
                this.materialsSubTypeArray = [];
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
                this.$refs['materialsDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateMaterials(this.materials).then(() => {
                            this.resetMaterialsDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['materialsDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateMaterials(this.materials).then(() => {
                            this.resetMaterialsDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delMaterialss(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetMaterials(){
                this.materials = {
                    id: undefined,
                    materialsName: undefined,
                    materialsType: undefined,
                    materialsTypeName: undefined,
                    materialsSubType: undefined,
                    materialsSubTypeName: undefined,
                    materialsFrom: undefined,
                    materialsMode: undefined,
                    materialsModeName: undefined,
                    materialsFileUrl: undefined,
                    materialsEmptyFileName: undefined,
                    materialsEmptyUrl: undefined,
                    materialsWarn: undefined,
                    copySpecialRequirements: undefined
                }
            },
            resetMaterialsDialogAndList(){
                this.closeMaterialsDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeMaterialsDialog() {
                this.dialogVisible = false;
                this.resetMaterials();
                this.$refs['materialsDialogForm'].resetFields();
            }
        }
    }
</script>


<style>
    .upload-file {
        display: inline-block;
    }
    .show-file {
        margin-left: 10px;
    }

</style>
