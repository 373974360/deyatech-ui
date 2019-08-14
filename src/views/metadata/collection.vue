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
            <el-table :data="metadataCollectionList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="英文名称" prop="enName"/>
                <el-table-column align="center" label="元数据集前缀" prop="mdcPrefix"/>
                <el-table-column align="center" label="元数据前缀" prop="mdPrefix"/>
                <el-table-column align="center" label="版本" prop="mdcVersion"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button title="新增版本" type="primary" icon="el-icon-plus" :size="btnSize" circle @click="btnAddVersion(scope.row)"></el-button>
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button title="设置主版本" type="primary" icon="iconwarehouse-delivery" :size="btnSize" circle @click="btnMainVersion(scope.row)"></el-button>
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


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible" width="80%"
                       :close-on-click-modal="closeOnClickModal" @close="closeMetadataCollectionDialog">
                <el-form ref="metadataCollectionDialogForm" class="deyatech-form" :model="metadataCollection" label-position="right"
                         label-width="120px" :rules="metadataCollectionRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="名称" prop="name">
                                <el-input v-model="metadataCollection.name" :disabled="dialogTitle === 'addVersion'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="enName">
                                <el-input v-model="metadataCollection.enName" :disabled="dialogTitle !== 'create'"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="元数据集前缀" prop="mdcPrefix">
                                <el-input v-model="metadataCollection.mdcPrefix" :disabled="dialogTitle !== 'create'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="元数据前缀" prop="mdPrefix">
                                <el-input v-model="metadataCollection.mdPrefix" :disabled="dialogTitle !== 'create'"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="版本" prop="mdcVersion">
                                <el-select v-if="dialogTitle === 'update'" v-model="metadataCollection.mdcVersion" @change="handleMdcVersionChange">
                                    <el-option v-for="item in collectionVersionList" :key="item.id" :label="item.mdcVersion" :value="item.mdcVersion">
                                    </el-option>
                                </el-select>
                                <el-input v-else v-model="metadataCollection.mdcVersion"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="metadataCollection.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <div class="deyatech-menu">
                            <el-button type="primary" :size="btnSize" @click="handleRelation">选择关联</el-button>
                            <el-button type="danger" :size="btnSize" :disabled="selectedRowsRelation.length < 1" @click="handleUnRelate">取消关联</el-button>
                        </div>
                        <el-table ref="relatedTable" :data="relationData" border @selection-change="handleSelectionChangeRelated">
                            <el-table-column type="selection" width="35" align="center"/>
                            <el-table-column label="中文名称" prop="name"/>
                            <el-table-column label="字段名" prop="fieldName"/>
                            <el-table-column label="数据类型" prop="dataType" :formatter="filterDataType"/>
                            <el-table-column label="控件类型">
                                <template slot-scope="scope">
                                    <el-select v-model="relationDataReal[scope.$index].controlType" placeholder="请选择" @change="handleControlTypeChange(scope.$index)">
                                        <el-option v-for="item in scope.row.controlTypeOptions" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="数据来源">
                                <template slot-scope="scope">
                                    <el-select v-model="relationDataReal[scope.$index].dataSource" placeholder="请选择">
                                        <el-option v-for="item in relationDataReal[scope.$index].dataSourceOptions" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="relationDataReal[scope.$index].dictionaryId" placeholder="请选择"
                                               v-if="relationDataReal[scope.$index].dataSource === 'dataItem'">
                                        <el-option v-for="item in dictOptions" :key="item.id" :label="item.name" :value="item.key">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="校验方式">
                                <template slot-scope="scope">
                                    <el-select v-model="relationDataReal[scope.$index].checkModel" placeholder="请选择">
                                        <el-option v-for="item in relationDataReal[scope.$index].checkModelOptions" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否为列头">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="relationDataReal[scope.$index].tableHead"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否高级查询">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="relationDataReal[scope.$index].advancedQuery"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否添加索引">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="relationDataReal[scope.$index].useIndex"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否全文检索">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="relationDataReal[scope.$index].useFullIndex"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button icon="el-icon-arrow-up" :size="btnSize" circle title="上移" @click="sortUp(scope.$index)">
                                    </el-button>
                                    <el-button icon="el-icon-arrow-down" :size="btnSize" circle title="下移" @click="sortDown(scope.$index)">
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeMetadataCollectionDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <el-dialog title="选择关联元数据" :visible.sync="dialogRelationVisible" :before-close="resetDialogRelation"
                       :close-on-click-modal="closeOnClickModal" @open="initCandidateTable">
                <el-table ref="candidateTable" :data="candidateList" border @selection-change="handleSelectionChangeCandidate">
                    <el-table-column type="selection" width="35" align="center"/>
                    <el-table-column prop="name" label="中文名称" align="center"/>
                    <el-table-column prop="briefName" label="字段名" align="center"/>
                    <!--<el-table-column prop="enName" label="英文名称" align="center"/>-->
                    <el-table-column label="注解">
                        <template slot-scope="scope">
                            <span v-if="scope.row.mandatory && scope.row.required">必选必填项<br/></span>
                            <span v-else-if="scope.row.mandatory">必选项<br/></span>
                            <span v-else-if="scope.row.required">必填项<br/></span>
                            <span>最大允许出现{{scope.row.annotationCount}}次</span>
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doRelation" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="resetDialogRelation">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <el-dialog title="设置主版本" :visible.sync="dialogVersionVisible" :before-close="resetDialogVersion"
                       :close-on-click-modal="closeOnClickModal">
                <div style="width: 90%; margin: 0 auto">
                    <el-radio-group v-model="mainVersionId">
                        <el-radio v-for="item in collectionVersionList" :label="item.id">{{item.mdcVersion}}</el-radio>
                    </el-radio-group>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doMainVersion" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="resetDialogVersion">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {validateversion} from "../../util/validate";
    import {
        getMetadataCollectionList,
        createOrUpdateMetadataCollection,
        delMetadataCollections,
        findMetadataCollectionAllData,
        setMainVersion,
        checkNameExist,
        checkEnNameExist,
        checkVersionExist
    } from '../../api/metadata/collection';
    import {
        findDataType,
        getAllMetadata
    } from "../../api/metadata/metadata";
    import {
        getAllDictionaryIndex
    } from "../../api/admin/dictionaryIndex";

    export default {
        name: 'metadataCollection',
        data() {
            const validateName = (rule, value, callback) => {
                const reg = /^[\u4e00-\u9fa5]+$/;
                if (!reg.test(value)) {
                    callback(new Error('只能输入中文'))
                } else {
                    let enName = this.metadataCollection.enName;
                    if (this.dialogTitle === 'create') {
                        enName = undefined;
                    }
                    checkNameExist(enName, value).then(response => {
                        if (response.data) {
                            callback(new Error('名称已存在'))
                        } else {
                            callback()
                        }
                    })
                }
            };
            const validateEnName = (rule, value, callback) => {
                const reg = /^[a-z]+(_[a-z]+)*$/;
                if (!reg.test(value)) {
                    callback(new Error('格式错误，只能输入小写字母或 _ 且必须以字母开头，例如：a_b, a_b_c 等'));
                } else {
                    let name = this.metadataCollection.name;
                    if (this.dialogTitle === 'create') {
                        name = undefined;
                    }
                    checkEnNameExist(this.metadataCollection.id, name, value).then(response => {
                        if (response.data) {
                            callback(new Error('英文名称已存在'))
                        } else {
                            callback()
                        }
                    })
                }
            };
            const validatePrefix = (rule, value, callback) => {
                const reg = /^[a-z]+(_)?$/;
                if (!reg.test(value)) {
                    callback(new Error('格式错误，只能输入小写字母或 _ 且必须以字母开头，例如：a, a_ 等'));
                } else {
                    callback();
                }
            };
            const validateVersion = (rule, value, callback) => {
                if (!validateversion(value)) {
                    callback(new Error('格式错误，请输入形如：1.0或1.0.0的版本号'));
                } else {
                    let enName = this.metadataCollection.enName;
                    if (this.dialogTitle === 'create') {
                        enName = undefined;
                    }
                    checkVersionExist(this.metadataCollection.id, enName, value).then(response => {
                        if (response.data) {
                            callback(new Error('版本号已存在'))
                        } else {
                            callback()
                        }
                    })
                }
            };
            return {
                metadataCollectionList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined,
                    mainVersion: true
                },
                metadataCollection: {
                    id: undefined,
                    name: undefined,
                    enName: undefined,
                    mdPrefix: undefined,
                    mdcPrefix: undefined,
                    source: undefined,
                    tenantFlag: undefined,
                    mdcVersion: '1.0.0',
                    mainVersion: true,
                    parentId: 0
                },
                metadataCollectionRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '名称'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    enName: [
                        {required: true, message: this.$t("table.pleaseInput") + '英文名称'},
                        {validator: validateEnName, trigger: 'blur'}
                    ],
                    mdcPrefix: [
                        {required: true, message: this.$t("table.pleaseInput") + '元数据集前缀'},
                        {min: 1, max: 10, message: '不能超过10个字符', trigger: 'blur'},
                        {validator: validatePrefix, trigger: 'blur'}
                    ],
                    mdPrefix: [
                        {required: true, message: this.$t("table.pleaseInput") + '元数据前缀'},
                        {min: 1, max: 6, message: '不能超过6个字符', trigger: 'blur'},
                        {validator: validatePrefix, trigger: 'blur'}
                    ],
                    mdcVersion: [
                        {required: true, message: this.$t("table.pleaseInput") + '版本'},
                        {validator: validateVersion, trigger: 'blur'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                dataTypeOptions: [],
                dictOptions: [],
                relationData: [],
                relationDataReal: [],
                candidateList: [],
                selectedRowsRelation: [],
                selectedRowsCandidate: [],
                dialogRelationVisible: false,
                collectionVersionList: [],
                mainVersionId: undefined,
                dialogVersionVisible: false
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
                    create: this.permission.metadataCollection_create,
                    update: this.permission.metadataCollection_update,
                    delete: this.permission.metadataCollection_delete
                };
            }
        },
        watch: {
            'metadataCollection.mdPrefix'(value) {
                for (let item of this.relationData) {
                    item.fieldName = value + item.briefName;
                }
            }
        },
        created(){
            this.reloadList();
            // 获取数据类型
            this.getDataType();
            // 获取数据字典
            this.getAllDicts();
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.metadataCollectionList = undefined;
                this.total = undefined;
                getMetadataCollectionList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.metadataCollectionList = response.data.records;
                    this.total = response.data.total;
                })
            },
            getDataType () {
                findDataType().then(response => {
                    this.dataTypeOptions = response.data;
                })
            },
            getAllDicts() {
                getAllDictionaryIndex().then(response => {
                    this.dictOptions = response.data;
                })
            },
            initCandidateTable() {
                Promise.all([this.getCandidateData(), this.$nextTick()]).then(() => {
                    this.checkRelatedRows();
                })
            },
            getCandidateData() {
                return new Promise((resolve, reject) => {
                    getAllMetadata().then(response => {
                        this.candidateList = response.data;
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                });
            },
            checkRelatedRows() {
                for (let item of this.relationData) {
                    for (let row of this.candidateList) {
                        if (item.metadataId === row.id) {
                            this.$refs['candidateTable'].toggleRowSelection(row, true);
                            break;
                        }
                    }
                }
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
            handleSelectionChangeRelated(rows) {
                this.selectedRowsRelation = rows;
            },
            handleSelectionChangeCandidate(rows) {
                this.selectedRowsCandidate = rows;
            },
            btnCreate(){
                this.resetMetadataCollection();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetMetadataCollection();
                if (!row || !row.id) {
                    row = this.selectedRows[0];
                }
                findMetadataCollectionAllData({enName: row.enName}).then(response => {
                    this.collectionVersionList = response.data;
                    for (const item of this.collectionVersionList) {
                        if (item.id === row.id) {
                            this.metadataCollection = deepClone(item);
                            this.relationData = this.mapRelatedList(item.metadataList);
                            this.relationDataReal = deepClone(this.relationData);
                        }
                    }
                });
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            handleMdcVersionChange(value) {
                for (const item of this.collectionVersionList) {
                    if (item.mdcVersion === value) {
                        this.metadataCollection = deepClone(item);
                        this.relationData = this.mapRelatedList(item.metadataList);
                        this.relationDataReal = deepClone(this.relationData);
                    }
                }
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
            btnAddVersion(row) {
                findMetadataCollectionAllData({id: row.id}).then(response => {
                    this.metadataCollection = deepClone(response.data[0]);
                    this.metadataCollection.id = undefined;
                    this.metadataCollection.mainVersion = false;
                    this.relationData = this.mapRelatedList(response.data[0].metadataList);
                    this.relationDataReal = deepClone(this.relationData);
                });
                this.dialogTitle = 'addVersion';
                this.dialogVisible = true;
            },
            btnMainVersion(row) {
                findMetadataCollectionAllData({enName: row.enName}).then(response => {
                    this.collectionVersionList = response.data;
                });
                this.mainVersionId = row.id;
                this.dialogVersionVisible = true;
            },
            handleRelation() {
                this.dialogRelationVisible = true;
            },
            handleUnRelate() {
                for (const row of this.selectedRowsRelation) {
                    for (const [index, item] of this.relationData.entries()) {
                        if (row.metadataId === item.metadataId) {
                            this.relationData.splice(index, 1);
                            this.relationDataReal.splice(index, 1);
                        }
                    }
                }
                this.selectedRowsRelation = [];
            },
            handleControlTypeChange(index) {
                this.relationDataReal[index].dataSource = undefined;
                this.relationDataReal[index].checkModel = undefined;
                this.relationDataReal[index].dictionaryId = undefined;
                for (let controlType of this.relationDataReal[index].controlTypeOptions) {
                    if (controlType.id === this.relationDataReal[index].controlType) {
                        this.relationDataReal[index].dataSourceOptions = controlType.dataSource;
                        this.relationDataReal[index].checkModelOptions = controlType.validate;
                    }
                }
            },
            doCreate(){
                this.$refs['metadataCollectionDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        for (let [index, row] of this.relationDataReal.entries()) {
                            row.sortNo = index + 1;
                        }
                        this.metadataCollection.metadataList = undefined;
                        this.metadataCollection.metadataCollectionMetadataJson = JSON.stringify(this.relationDataReal);
                        createOrUpdateMetadataCollection(this.metadataCollection).then(() => {
                            this.resetMetadataCollectionDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['metadataCollectionDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        for (let [index, row] of this.relationDataReal.entries()) {
                            row.sortNo = index + 1;
                        }
                        this.metadataCollection.metadataList = undefined;
                        this.metadataCollection.metadataCollectionMetadataJson = JSON.stringify(this.relationDataReal);
                        createOrUpdateMetadataCollection(this.metadataCollection).then(() => {
                            this.resetMetadataCollectionDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delMetadataCollections(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            doMainVersion() {
                setMainVersion(this.mainVersionId).then(() => {
                    this.resetDialogVersion();
                    this.$message.success('主版本设置成功');
                    this.reloadList();
                })
            },
            doRelation() {
                if (this.selectedRowsCandidate.length === 0) {
                    this.$message.warning('请选择需要关联的数据');
                    return;
                }
                for (const row of this.selectedRowsCandidate) {
                    let addFlag = true;
                    for (const related of this.relationData) {
                        if (related.metadataId === row.id) {
                            addFlag = false;
                            break;
                        }
                    }
                    if (addFlag) {
                        let objInfo = this.mapMetadata(row);
                        this.relationData.push(objInfo);
                        this.relationDataReal.push(deepClone(objInfo));
                    }
                }
                this.resetDialogRelation();
            },
            resetMetadataCollection(){
                this.metadataCollection = {
                    id: undefined,
                    name: undefined,
                    enName: undefined,
                    mdPrefix: undefined,
                    mdcPrefix: undefined,
                    source: undefined,
                    tenantFlag: undefined,
                    mdcVersion: '1.0.0',
                    mainVersion: true,
                    parentId: 0
                };
                this.relationData = [];
                this.relationDataReal = [];
            },
            resetMetadataCollectionDialogAndList(){
                this.closeMetadataCollectionDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeMetadataCollectionDialog() {
                this.dialogVisible = false;
                this.resetMetadataCollection();
                this.$refs['metadataCollectionDialogForm'].resetFields();
            },
            resetDialogRelation() {
                this.dialogRelationVisible = false;
                this.$refs['candidateTable'].clearSelection();
                this.selectedRowsCandidate = [];
            },
            resetDialogVersion() {
                this.dialogVersionVisible = false;
                this.mainVersionId = undefined;
                this.collectionVersionList = [];
            },
            sortUp(index) {
                if (index > 0) {
                    const row = this.relationData.splice(index, 1)[0];
                    const rowData = this.relationDataReal.splice(index, 1)[0];
                    this.relationData.splice(index - 1, 0, row);
                    this.relationDataReal.splice(index - 1, 0, rowData);
                }
            },
            sortDown(index) {
                if (index !== this.relationData.length - 1) {
                    const row = this.relationData.splice(index, 1)[0];
                    const rowData = this.relationDataReal.splice(index, 1)[0];
                    this.relationData.splice(index + 1, 0, row);
                    this.relationDataReal.splice(index + 1, 0, rowData);
                }
            },
            mapRelatedList(metadataList) {
                let objList = [];
                for (const metadata of metadataList) {
                    let obj = this.mapMetadata(metadata.metadata, metadata);
                    objList.push(obj)
                }
                return objList;
            },
            mapMetadata(metadata, relation) {
                let obj = deepClone(metadata);
                obj.id = undefined;
                obj.metadataId = metadata.id;
                if (relation) {
                    obj.tableHead = relation.tableHead;
                    obj.advancedQuery = relation.advancedQuery;
                    obj.useFullIndex = relation.useFullIndex;
                    obj.useIndex = relation.useIndex;
                } else {
                    obj.tableHead = false;
                    obj.advancedQuery = false;
                    obj.useFullIndex = false;
                    obj.useIndex = false;
                    obj.fieldName = obj.briefName;
                    if (this.metadataCollection.mdPrefix) {
                        obj.fieldName = this.metadataCollection.mdPrefix + obj.fieldName;
                    }
                }
                if (metadata.type === 1) {
                    for (const item of this.dataTypeOptions) {
                        if (item.id === metadata.dataType) {
                            obj.controlTypeOptions = item.dataShow;
                            break;
                        }
                    }
                    for (const item of obj.controlTypeOptions) {
                        if (item.id === metadata.controlType) {
                            obj.dataSourceOptions = item.dataSource;
                            obj.checkModelOptions = item.validate;
                            break;
                        }
                    }
                } else if (metadata.type === 2) {
                    // todo 复合类型元数据处理
                }
                return obj;
            },
            filterDataType(row, column, cellValue) {
                for (let item of this.dataTypeOptions) {
                    if (item.id === cellValue) {
                        return item.name
                    }
                }
            }
        }
    }
</script>


