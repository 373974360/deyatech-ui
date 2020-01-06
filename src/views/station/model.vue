<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1 || catalogNum > 0">{{$t('table.delete')}}</el-button>
                    <el-button v-if="btnEnable.index" :size="btnSize" @click="btnIndex">索引</el-button>

                    <el-input :size="searchSize" placeholder="请输入内容模型或英文名称" v-model.trim="listQuery.name" style="width: 300px;margin-left: 10px;margin-right:10px;"></el-input>
                    <el-select filterable v-model.trim="listQuery.metaDataCollectionId" placeholder="请选择元数据集" :size="searchSize" style="margin-right: 10px;">
                        <el-option
                            v-for="m in metadataCollectionList"
                            :key="m.id"
                            :label="m.name"
                            :value="m.id">
                        </el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchReloadList">{{$t('table.search')}}</el-button>
                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="modelList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="内容模型" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="英文名称" prop="englishName"/>
                <el-table-column align="center" label="关联元数据集" prop="metaDataCollectionName"/>
                <el-table-column align="center" label="描述" prop="description"/>
                <el-table-column align="center" label="备注" prop="remark"/>
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button title="内容模型模板设置" type="success" icon="el-icon-setting" :size="btnSize" circle
                                   @click.stop.safe="btnModelTemplate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop.safe="btnDelete(scope.row)" :disabled="scope.row.catalogNum > 0"></el-button>
                        <el-button v-if="btnEnable.index" title="索引" icon="el-icon-document" :size="btnSize" circle
                                   @click.stop.safe="btnIndex(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeModelDialog">
                <el-form ref="modelDialogForm" class="deyatech-form" :model="model" label-position="right"
                         label-width="80px" :rules="modelRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="内容模型" prop="name" label-width="110px">
                                <el-input v-model.trim="model.name" maxlength="200"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="englishName" label-width="110px">
                                <el-input v-model.trim="model.englishName" maxlength="200"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="关联元数据集" prop="metaDataCollectionId" label-width="110px">
                                <el-select filterable v-model.trim="model.metaDataCollectionId" placeholder="请选择元数据集">
                                    <el-option
                                        v-for="m in metadataCollectionList"
                                        :key="m.id"
                                        :label="m.name + ' ' + m.mdcVersion"
                                        :value="m.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="描述" prop="description" label-width="110px">
                                <el-input type="textarea" v-model.trim="model.description" :rows="3" maxlength="500"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark" label-width="110px">
                                <el-input type="textarea" v-model.trim="model.remark" :rows="3" maxlength="500"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeModelDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>


            <!-- 内容模型设置弹窗 -->
            <el-dialog title="内容模型设置" :visible.sync="modelTemplateDialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeModelTemplateDialog">
                <!-- 增加删除按钮 -->
                <div class="deyatech-menu">
                    <div class="deyatech-menu_left">
                        <el-button type="primary" :size="btnSize" @click="modelTemplateBtnCreate">{{$t('table.create')}}</el-button>
                        <el-button type="danger" :size="btnSize" @click="modelTemplateBtnDelete" :disabled="selectedModelTemplateRows.length < 1">{{$t('table.delete')}}</el-button>
                    </div>
                    <div class="deyatech-menu_right">
                        <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadModelTemplateList"></el-button>
                    </div>
                </div>

                <!-- 内容模型表格 -->
                <el-table :data="modelTemplateList" v-loading.body="listLoading" stripe border highlight-current-row
                          @selection-change="handleModelTemplateSelectionChange">
                    <el-table-column type="selection" width="50" align="center"/>
                    <el-table-column align="center" label="站点" prop="siteName"/>
                    <el-table-column align="center" label="模版路径" prop="templatePath"/>
                    <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                        <template slot-scope="scope">
                            <el-button :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                       @click.stop.safe="modelTemplateBtnUpdate(scope.row)"></el-button>
                            <el-button :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                       @click.stop.safe="modelTemplateBtnDelete(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="deyatech-pagination pull-right" background
                               :current-page.sync="modelTemplateListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                               :page-size="modelTemplateListQuery.size" :layout="this.$store.state.common.pageLayout" :total="modelTemplateTotal"
                               @size-change="handleModelTemplateSizeChange" @current-change="handleModelTemplateCurrentChange">
                </el-pagination>

                <!-- 内层弹窗 -->
                <el-dialog :title="titleMap[modelTemplateSaveOrUpdateDialogTitle] + '内容模型'" :visible.sync="modelTemplateSaveOrUpdateDialogVisible"
                           :close-on-click-modal="closeOnClickModal" @close="closeModelTemplateSaveOrUpdateDialog" :append-to-body="true">
                    <el-form ref="modelTemplateDialogForm" class="deyatech-form" :model="modelTemplate" label-position="right"
                             label-width="80px" :rules="modelTemplateRules">
                        <el-row :gutter="20" :span="24">
                            <el-col :span="12">
                                <el-form-item label="站点" prop="siteId">
                                    <el-select filterable v-model.trim="modelTemplate.siteId" placeholder="请选择站点" @change="getInfoBySiteId"
                                               :disabled="modelTemplateSaveOrUpdateDialogTitle == 'update'" style="width: 100%">
                                        <el-option
                                            v-for="s in stationGroup"
                                            :key="s.id"
                                            :label="s.name"
                                            :value="s.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" :span="24">
                            <el-col :span="12">
                                <el-form-item label="默认模版" prop="templatePath" v-if="modelTemplateSaveOrUpdateDialogVisible">
                                    <el-cascader filterable
                                        style="width: 100%"
                                        placeholder="请选择模板地址"
                                        clearable
                                        ref="templatePath"
                                        :options="templateTreeData"
                                        v-model.trim="selectTemplatePath"
                                        :props="cascaderProps"
                                        @change="handleChange">
                                    </el-cascader>
                                </el-form-item>
                            </el-col>
                            <span style="color: #f56c6c; line-height: 40px; height: 40px">* 未设置的栏目使用默认模版</span>
                        </el-row>
                        <el-row :gutter="20" :span="24">
                            <el-col :span="24">
                                <el-form-item label="栏目">
                                    <el-input placeholder="输入关键字进行过滤" v-model.trim="filterText"></el-input>
                                    <div class="content-template-catalog">
                                        <el-tree ref="catalogTree" :data="catalogList" :props="defaultTreeProps" node-key="id" highlight-current
                                                 :default-expand-all="false" :expand-on-click-node="false" :filter-node-method="filterNode">
                                            <div class="custom-tree-node" slot-scope="{ node, data }">
                                                <span>{{ node.label }}</span>
                                                <el-cascader filterable
                                                    :options="templateTreeData"
                                                    v-model.trim="catalogTemplate[data.id].templatePath"
                                                    :props="cascaderProps"
                                                    @change="handleCatalogTemplateChange(node, data)"
                                                    clearable
                                                    size="mini">
                                                </el-cascader>
                                            </div>
                                        </el-tree>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                    <el-button v-if="modelTemplateSaveOrUpdateDialogTitle=='create'" type="primary" :size="btnSize" @click="modelTemplateDoCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="modelTemplateDoUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeModelTemplateSaveOrUpdateDialog">{{$t('table.cancel')}}</el-button>
                </span>
                </el-dialog>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getModelList,
        createOrUpdateModel,
        delModels,
        checkNameExist,
        checkEnglishNameExist,
        index
    } from '@/api/station/model';
    import {
        createOrUpdateModelTemplateBatch,
        pageByModelTemplateGroupBySite,
        getAllModelTemplate,
        checkSiteContentModelExist,
        removeByModelTemplateVo
    } from '@/api/station/modelTemplate';
    import {getAllStationGroup} from '@/api/resource/stationGroup';
    import {
        getCatalogTree,
    } from '@/api/station/catalog';
    import {isChinese, isEnglishName} from '@/util/validate';
    import {listTemplateAllFiles} from '@/api/template/template';
    import {getAllMetadataCollection} from '@/api/metadata/collection';

    export default {
        name: 'model',
        data() {
            const validateName = (rule, value, callback) => {
                if (!isChinese(value)) {
                    callback(new Error('只能输入中文'))
                } else {
                    const query = {
                        id: this.model.id,
                        name: value
                    }
                    checkNameExist(query).then(response => {
                        if (response.status == 200) {
                            if (response.data) {
                                callback(new Error('名称已存在'))
                            } else {
                                callback()
                            }
                        } else {
                            callback(new Error('检查名称重复失败'))
                        }
                    })
                }
            }
            const validateEnglishName = (rule, value, callback) => {
                if (!isEnglishName(value)) {
                    callback(new Error('只能是小写字母开头、数字和下划线组成'))
                } else {
                    const query = {
                        id: this.model.id,
                        englishName: value
                    }
                    checkEnglishNameExist(query).then(response => {
                        if (response.status == 200) {
                            if (response.data) {
                                callback(new Error('英文名称已存在'))
                            } else {
                                callback()
                            }
                        } else {
                            callback(new Error('检查英文名称重复失败'))
                        }
                    })
                }
            }
            const validateSiteId = (rule, value, callback) => {
                if (this.modelTemplateSaveOrUpdateDialogTitle == 'update') {
                    return callback()
                }
                const query = {
                    siteId: value,
                    contentModelId: this.model.id
                }
                checkSiteContentModelExist(query).then(response => {
                    if (response.status == 200) {
                        if (response.data) {
                            callback(new Error('该站点已设置，请选择其他站点'))
                        } else {
                            callback()
                        }
                    } else {
                        callback(new Error('检查站点是否设置失败'))
                    }
                })
            }
            const validateTemplatePath = (rule, value, callback) => {
                // console.log("this.selectTemplatePath: " + this.selectTemplatePath.length)
                if (this.selectTemplatePath && this.selectTemplatePath.length != 0) {
                    this.modelTemplate.templatePath = '/' + this.selectTemplatePath.join('/');
                    if (this.modelTemplate.templatePath.length > 255) {
                        callback(new Error('长度在 1 到 255 个字符'))
                        this.modelTemplate.templatePath = undefined;
                    } else {
                        callback()
                    }
                } else {
                    callback(new Error(this.$t("table.pleaseSelect") + '模板地址'))
                }
            }
            return {
                modelList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined,
                    metaDataCollectionId: undefined
                },
                model: {
                    id: undefined,
                    description: undefined,
                    englishName: undefined,
                    metaDataCollectionId: undefined,
                    name: undefined
                },
                modelRules: {
                    englishName: [
                        {required: true, message: this.$t("table.pleaseInput") + '英文名称'},
                        {validator: validateEnglishName, trigger: 'blur'}
                    ],
                    metaDataCollectionId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '元数据集'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容对象名称'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    remark: [
                        {max: 500, message: '长度最多 500 个字符', trigger: 'blur'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                metadataCollectionList: [],
                modelTemplateDialogVisible: false,
                modelTemplate: {
                    id: undefined,
                    cmsCatalogId: undefined,
                    siteId: undefined,
                    templatePath: undefined,
                    contentModelId: undefined,
                    defaultFlag: undefined
                },
                modelTemplateSaveOrUpdateDialogVisible: false,
                modelTemplateSaveOrUpdateDialogTitle: undefined,
                modelTemplateRules: {
                    cmsCatalogId: [
                        {required: true, message: this.$t("table.pleaseInput") + '栏目id'}
                    ],
                    siteId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '站点'},
                        {validator: validateSiteId, trigger: 'change'}
                    ],
                    templatePath: [
                        {required: true, validator: validateTemplatePath, trigger: 'change'}
                    ],
                    contentModelId: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容模型id'}
                    ],
                    defaultFlag: [
                        {required: true, message: this.$t("table.pleaseInput") + '默认标记'}
                    ]
                },
                modelTemplateList: undefined,
                modelTemplateTotal: undefined,
                selectedModelTemplateRows: [],
                stationGroup: [],
                templateTreeData: [],
                cascaderProps: {
                    value: 'fileName',
                    label: 'fileName',
                    children: 'children'
                },
                selectTemplatePath: undefined,
                catalogList: [],
                defaultTreeProps: {
                    children: 'children',
                    label: 'name'
                },
                catalogTemplate: {
                    // 默认模版
                    /*'-1': {
                        id: undefined,
                        templatePath: []
                    }*/
                },
                filterText: '',
                modelTemplateListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    contentModelId: undefined
                },
                catalogNum: 0
            }
        },
        watch: {
            filterText(val) {
                this.$refs.catalogTree.filter(val)
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
                    create: this.permission.model_create,
                    update: this.permission.model_update,
                    delete: this.permission.model_delete,
                    index:  this.permission.model_index
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
            this.getAllMetaDataCollection();
        },
        methods: {
            // 获取元数据集
            getAllMetaDataCollection() {
                getAllMetadataCollection().then(response => {
                    if (response.status == 200 && response.data.length > 0) {
                        this.metadataCollectionList = response.data;
                    }
                })
            },
            resetSearch(){
                this.listQuery.name = undefined;
                this.listQuery.metaDataCollectionId = undefined;
            },
            searchReloadList(){
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.modelList = undefined;
                // this.total = undefined;
                getModelList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.modelList = response.data.records;
                    this.total = response.data.total;
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
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
                this.catalogNum = 0;
                if (rows) {
                    for (let r of rows) {
                        this.catalogNum += r.catalogNum;
                    }
                }
            },
            btnCreate(){
                this.resetModel();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetModel();
                if (row.id) {
                    this.model = deepClone(row);
                } else {
                    this.model = deepClone(this.selectedRows[0]);
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
                this.$refs['modelDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateModel(this.model).then(() => {
                            this.resetModelDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['modelDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateModel(this.model).then(() => {
                            this.resetModelDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delModels(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetModel(){
                this.model = {
                    id: undefined,
                    description: undefined,
                    englishName: undefined,
                    metaDataCollectionId: undefined,
                    name: undefined
                }
            },
            resetModelDialogAndList(){
                this.closeModelDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeModelDialog() {
                this.dialogVisible = false;
                this.resetModel();
                this.$refs['modelDialogForm'].resetFields();
            },

            /* 内容模型设置 */
            btnModelTemplate(row) {
                this.resetModel();
                this.model = deepClone(row);
                this.modelTemplateDialogVisible = true;
                this.reloadModelTemplateList();
                this.getAllStationGroup();
            },
            reloadModelTemplateList() {
                this.listLoading = true;
                this.modelTemplateList = undefined;
                this.modelTemplateTotal = undefined;
                this.modelTemplateListQuery.contentModelId = this.model.id
                pageByModelTemplateGroupBySite(this.modelTemplateListQuery).then(response => {
                    this.listLoading = false;
                    this.modelTemplateList = response.data.records;
                    this.modelTemplateTotal = response.data.total;
                })
            },
            handleModelTemplateSizeChange(val){
                this.modelTemplateListQuery.size = val;
                this.reloadModelTemplateList();
            },
            handleModelTemplateCurrentChange(val){
                this.modelTemplateListQuery.page = val;
                this.reloadModelTemplateList();
            },
            closeModelTemplateDialog() {
                this.modelTemplateDialogVisible = false;
                this.resetModel();
                this.resetModelTemplate();
                this.modelTemplateList = undefined;
                this.modelTemplateTotal = undefined;
                this.modelTemplateListQuery.contentModelId = undefined
            },
            modelTemplateBtnCreate() {
                this.modelTemplateSaveOrUpdateDialogTitle = 'create';
                this.modelTemplateSaveOrUpdateDialogVisible = true;
            },
            getAllStationGroup() {
                getAllStationGroup().then(response => {
                    if (response.status == 200 && response.data.length > 0) {
                        this.stationGroup = response.data;
                    }
                })
            },
            getInfoBySiteId(siteId) {
                this.listTemplateAllFiles(siteId);
                this.getCatalogTree(siteId);
            },
            listTemplateAllFiles(siteId){
                return new Promise((resolve, reject) => {
                    this.templateTreeData = [];
                    listTemplateAllFiles(siteId,"详情页").then(response => {
                        if (response.status == 200) {
                            let result = JSON.parse(response.data);
                            this.templateTreeData = result.files;
                            resolve()
                        }
                    })
                })
            },
            getCatalogTree(siteId){
                return new Promise((resolve, reject) => {
                    const query = {siteId: siteId}
                    getCatalogTree(query).then(response => {
                        if (response.status == 200) {
                            this.catalogList = response.data;
                            this.initCatalogTemplate(this.catalogList);
                            resolve()
                        }
                    })
                })
            },
            initCatalogTemplate(catalogList) {
                if (catalogList && catalogList.length > 0) {
                    for (let catalog of catalogList) {
                        // 必须这么设置，否则不是响应式
                        this.$set(this.catalogTemplate, catalog.id, {
                            id: undefined,
                            templatePath: []
                        })
                        /*this.catalogTemplate[catalog.id] = {
                            id: undefined,
                            templatePath: []
                        }*/
                        if (catalog.children && catalog.children.length > 0) {
                            this.initCatalogTemplate(catalog.children)
                        }
                    }
                }
            },
            handleChange(value) {
                console.log(value);
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            // 将子栏目的路径改为父栏目路径
            handleCatalogTemplateChange(node, data) {
                // data: 栏目对象
                // templatePath: 选择的值
                const templatePath = this.catalogTemplate[data.id].templatePath;
                // console.log("templatePath: " + templatePath)
                if (templatePath && templatePath.length > 0) {
                    this.checkChildrenTemplate(data.children, templatePath);
                }
            },
            checkChildrenTemplate(children, templatePath) {
                // 如果有子栏目
                if (children && children.length > 0) {
                    // 遍历子栏目
                    for (let node of children) {
                        this.catalogTemplate[node.id].templatePath = templatePath;
                        // this.$refs['catalogTemplate' + node.id].value = this.catalogTemplate[node.id].templatePath;
                        this.checkChildrenTemplate(node.children, templatePath);
                    }
                }
            },
            closeModelTemplateSaveOrUpdateDialog() {
                this.modelTemplateSaveOrUpdateDialogVisible = false;
                this.resetModelTemplate();
                this.templateTreeData = [];
                this.selectTemplatePath = undefined;
                this.catalogList = [];
                this.filterText = '';
                this.catalogTemplate = {
                    /*'-1': {
                        id: undefined,
                        templatePath: []
                    }*/
                };
                this.$refs['modelTemplateDialogForm'].resetFields();
            },
            resetModelTemplate() {
                this.modelTemplate = {
                    id: undefined,
                    cmsCatalogId: undefined,
                    siteId: undefined,
                    templatePath: undefined,
                    contentModelId: undefined,
                    defaultFlag: undefined
                }
            },
            modelTemplateDoCreate() {
                this.$refs['modelTemplateDialogForm'].validate(valid => {
                    if(valid) {
                        const catalogTemplateList = []
                        for (let item in this.catalogTemplate) {
                            // console.log("this.catalogTemplate[item].templatePath: " + this.catalogTemplate[item].templatePath.length)
                            // 特殊设置
                            if (this.catalogTemplate[item].templatePath.length !== 0) {
                                catalogTemplateList.push({
                                    cmsCatalogId: item,
                                    siteId: this.modelTemplate.siteId,
                                    contentModelId: this.model.id,
                                    templatePath: '/' + this.catalogTemplate[item].templatePath.join('/'),
                                    defaultFlag: false
                                })
                            }
                        }
                        // 默认设置
                        catalogTemplateList.push({
                            cmsCatalogId: null,
                            siteId: this.modelTemplate.siteId,
                            contentModelId: this.model.id,
                            templatePath: this.modelTemplate.templatePath,
                            defaultFlag: true
                        })
                        console.log(JSON.stringify(catalogTemplateList).toString())
                        this.submitLoading = true;
                        createOrUpdateModelTemplateBatch(JSON.stringify(catalogTemplateList).toString()).then(() => {
                            this.resetModelTemplateDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        }).catch(error => {
                            this.submitLoading = false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            resetModelTemplateDialogAndList(){
                this.closeModelTemplateSaveOrUpdateDialog();
                this.submitLoading = false;
                this.reloadModelTemplateList();
            },
            modelTemplateBtnUpdate(row) {
                this.modelTemplateSaveOrUpdateDialogTitle = 'update';
                this.modelTemplateSaveOrUpdateDialogVisible = true;

                this.modelTemplate.id = row.id;
                this.modelTemplate.siteId = row.siteId;
                // 默认模板
                this.selectTemplatePath = row.templatePath.split('/').slice(1);

                Promise.all([this.listTemplateAllFiles(row.siteId), this.getCatalogTree(row.siteId)]).then(() => {
                    const query = {
                        siteId: row.siteId,
                        contentModelId: this.model.id,
                        defaultFlag: false
                    };
                    getAllModelTemplate(query).then(response => {
                        if (response.status == 200) {
                            // 特殊配置
                            for (let modelTemplate of response.data) {
                                if (this.catalogTemplate[modelTemplate.cmsCatalogId]) {
                                    this.catalogTemplate[modelTemplate.cmsCatalogId] = {
                                        id: modelTemplate.id,
                                        templatePath: modelTemplate.templatePath.split('/').slice(1)
                                    }
                                } else {
                                    // 当某个栏目已删除，删除原有相关栏目配置
                                    if (modelTemplate.cmsCatalogId) {
                                        this.catalogTemplate[modelTemplate.cmsCatalogId] = {
                                            id: modelTemplate.id,
                                            templatePath: []
                                        }
                                    }
                                }
                            }
                            // console.log('catalogTemplate: ', JSON.stringify(this.catalogTemplate))
                        }
                    })
                })
            },
            modelTemplateDoUpdate() {
                this.$refs['modelTemplateDialogForm'].validate(valid => {
                    if(valid) {
                        const catalogTemplateList = []
                        // 特殊设置
                        for (let item in this.catalogTemplate) {
                            // console.log("this.catalogTemplate[item].templatePath: " + this.catalogTemplate[item].templatePath.length)
                            if (this.catalogTemplate[item].templatePath.length !== 0) {
                                catalogTemplateList.push({
                                    id: this.catalogTemplate[item].id,
                                    cmsCatalogId: item,
                                    siteId: this.modelTemplate.siteId,
                                    contentModelId: this.model.id,
                                    templatePath: '/' + this.catalogTemplate[item].templatePath.join('/'),
                                    defaultFlag: false
                                })
                            }
                            // 删除原有特殊设置
                            if (this.catalogTemplate[item].templatePath.length == 0 && this.catalogTemplate[item].id) {
                                catalogTemplateList.push({
                                    id: this.catalogTemplate[item].id,
                                    enable: -1
                                })
                            }
                        }
                        // 默认设置
                        catalogTemplateList.push({
                            id: this.modelTemplate.id,
                            cmsCatalogId: null,
                            siteId: this.modelTemplate.siteId,
                            contentModelId: this.model.id,
                            templatePath: this.modelTemplate.templatePath,
                            defaultFlag: true
                        })
                        // console.log(JSON.stringify(catalogTemplateList).toString())
                        this.submitLoading = true;
                        createOrUpdateModelTemplateBatch(JSON.stringify(catalogTemplateList).toString()).then(() => {
                            this.resetModelTemplateDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        }).catch(error => {
                            this.submitLoading = false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            handleModelTemplateSelectionChange(rows){
                this.selectedModelTemplateRows = rows;
            },
            modelTemplateBtnDelete(row) {
                const siteIds = []
                if (row.siteId) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        siteIds.push(row.siteId)
                        const modelTemplateVo = {
                            siteIds: siteIds,
                            contentModelId: this.model.id
                        }
                        this.modelTemplateDoDelete(modelTemplateVo);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedModelTemplateRows){
                            siteIds.push(deleteRow.siteId)
                        }
                        const modelTemplateVo = {
                            siteIds: siteIds,
                            contentModelId: this.model.id
                        }
                        this.modelTemplateDoDelete(modelTemplateVo);
                    })
                }
            },
            modelTemplateDoDelete(modelTemplateVo) {
                // console.log(modelTemplateVo)
                this.listLoading = true;
                removeByModelTemplateVo(JSON.stringify(modelTemplateVo).toString()).then(() => {
                    this.reloadModelTemplateList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            btnIndex(row) {
                let ids = [];
                if (row.id) {
                    ids.push(row.id);
                } else {
                    for(const deleteRow of this.selectedRows){
                        ids.push(deleteRow.id);
                    }
                }
                let msg = '';
                if (ids.length == 0) {
                    msg = '重建全部索引, 是否继续？';
                } else {
                    msg = '重建选中项索引, 是否继续？';
                }
                this.$confirm(msg, this.$t("table.tip"), {type: 'error'}).then(() => {
                    index(ids).then(() => {
                        this.$message.success("索引表创建完成");
                    })
                })
            }
        }
    }
</script>

<style>
    .content-template-catalog {
        margin-top: 12px;
        padding: 8px;
        border: 1px solid rgba(215, 215, 215, 1);

    }
    /deep/ .content-template-catalog .el-tree-node__content {
        height: 36px;
    }
    .content-template-catalog .custom-tree-node {
        width: 100%;
    }
    .custom-tree-node {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        height: 38px;
    }
    .content-template-catalog .el-cascader {
        float: right;
        line-height: 38px;
    }
    /*表格样式根据elementUIIndex样式文件来设置*/
    /*树节点选中状态高亮色的设置*/
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #a6d1ff;
    }
    /deep/ .el-tree-node > .el-tree-node__children {
        overflow: visible !important;
    }
</style>
