<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name" maxlength="100"></el-input>
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
            <el-row :span="24">
                <el-col :span="4">
                    <div class="left-tree">
                        <el-tree ref="metadataCategoryTree" :data="metadataCategoryTree" node-key="id" highlight-current
                                 default-expand-all :expand-on-click-node="false"
                                 @node-click="triggerTreeNode" v-loading="treeLoading">
                        </el-tree>
                    </div>
                </el-col>
                <el-col :span="20">
                    <el-table :data="metadataList" v-loading.body="listLoading" stripe border highlight-current-row
                              @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center"/>
                        <el-table-column align="center" label="中文名称" prop="name">
                            <template slot-scope="scope">
                                <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="字段名" prop="briefName"/>
                        <!--<el-table-column align="center" label="英文名称" prop="enName"/>-->
                        <!--<el-table-column align="center" label="是否复合类型" prop="type"/>-->
                        <!--<el-table-column align="center" label="数据类型" prop="dataType"/>-->
                        <!--<el-table-column align="center" label="控件类型" prop="controlType"/>-->
                        <!--<el-table-column align="center" label="数据长度" prop="dataLength"/>-->
                        <!--<el-table-column align="center" label="校验方式" prop="checkModel"/>-->
                        <!--<el-table-column align="center" label="数据来源" prop="dataSource"/>-->
                        <!--<el-table-column align="center" label="关联数据字典 id" prop="dictionaryId"/>-->
                        <el-table-column align="center" label="定义" prop="definition"/>
                        <el-table-column align="center" label="值域" prop="field"/>
                        <!--<el-table-column align="center" label="必填" prop="required"/>-->
                        <!--<el-table-column align="center" label="强制字段，必选" prop="mandatory"/>-->
                        <!--<el-table-column align="center" label="是否允许多次出现" prop="multiFlag"/>-->
                        <!--<el-table-column align="center" label="出现次数" prop="annotationCount"/>-->
                        <!--<el-table-column align="center" label="分类id" prop="categoryId"/>-->
                        <!--<el-table-column align="center" label="复合元数据id" prop="relationId"/>-->
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
                </el-col>
            </el-row>

            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeMetadataDialog">
                <el-form ref="metadataDialogForm" class="deyatech-form" :model="metadata" label-position="right"
                         label-width="80px" :rules="metadataRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="中文名称" prop="name">
                                <el-input v-model.trim="metadata.name" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="字段名" prop="briefName">
                                <el-input v-model.trim="metadata.briefName" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="enName">
                                <el-input v-model.trim="metadata.enName" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型" prop="type">
                                <el-radio-group v-model.trim="metadata.type">
                                    <el-radio :label="1">基本类型</el-radio>
                                    <el-radio :label="2">复合类型</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                    <el-row :gutter="20" :span="24" v-if="metadata.type === 1">
                        <el-col :span="12">
                            <el-form-item label="数据类型" prop="dataType">
                                <el-select v-model.trim="metadata.dataType" placeholder="请选择" style="width: 100%">
                                    <el-option v-for="item in dataTypeOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="控件类型" prop="controlType">
                                <el-select v-model.trim="metadata.controlType" placeholder="请选择" style="width: 100%">
                                    <el-option v-for="item in controlTypeOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="metadata.type === 1">
                        <el-col :span="12">
                            <el-form-item label="校验方式" prop="checkModel">
                                <el-select v-model.trim="metadata.checkModel" placeholder="请选择" style="width: 100%">
                                    <el-option v-for="item in checkModelOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="数据长度" prop="dataLength">
                                <el-input v-model.trim="metadata.dataLength" maxlength="10"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="metadata.type === 1">
                        <el-col :span="12">
                            <el-form-item label="数据来源" prop="dataSource">
                                <el-select v-model.trim="metadata.dataSource" placeholder="请选择" style="width: 100%">
                                    <el-option v-for="item in dataSourceOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="数据字典" prop="dictionaryId" v-if="metadata.dataSource === 'dataItem'">
                                <el-select v-model.trim="metadata.dictionaryId" placeholder="请选择" style="width: 100%">
                                    <el-option v-for="item of dictOptions" :key="item.id" :label="item.name" :value="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="metadata.type === 1">
                        <el-col :span="12">
                            <el-form-item label="定义" prop="definition">
                                <el-input v-model.trim="metadata.definition" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="值域" prop="field">
                                <el-input v-model.trim="metadata.field" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="metadata.type === 1">
                        <el-col :span="12">
                            <el-form-item label="控件长度" prop="controlLength">
                                <el-radio-group v-model.trim="metadata.controlLength">
                                    <el-radio :label="1" border>半行</el-radio>
                                    <el-radio :label="2" border>整行</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="出现次数" prop="annotationCount">
                                <el-input-number v-model.trim="metadata.annotationCount" :min="1" :max="99" :disabled="!metadata.multiFlag"></el-input-number>
                                <el-checkbox v-model.trim="metadata.multiFlag" style="margin-left: 20px">允许出现多次</el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">

                        <el-col :span="12">
                            <el-form-item label="选填控制" prop="mandatory">
                                <el-checkbox v-model.trim="metadata.mandatory" border>必选</el-checkbox>
                                <el-checkbox v-model.trim="metadata.required" border>必填</el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="metadata.remark" :rows="3" maxlength="500"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="metadata.type === 2">
                        <div class="deyatech-menu">
                            <el-button type="primary" :size="btnSize" @click="handleRelation">选择关联</el-button>
                            <el-button type="danger" :size="btnSize" :disabled="selectedRowsRelation.length < 1" @click="handleUnRelate">取消关联</el-button>
                        </div>
                        <el-table ref="relatedTable" :data="relationData" border @selection-change="handleSelectionChangeRelated">
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
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeMetadataDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <el-dialog title="选择关联基本类型元数据" :visible.sync="dialogRelationVisible" :before-close="resetDialogRelation"
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
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {getFirstFinalChild} from "../../util/treeUtils";
    import {
        getMetadataList,
        createOrUpdateMetadata,
        delMetadatas,
        findDataType,
        findCandidateRelation,
        checkNameExist,
        checkBriefNameExist,
        checkEnNameExist
    } from '../../api/metadata/metadata';
    import {
        getMetadataCategoryTree
    } from "../../api/metadata/category";
    import {
        getAllDictionaryIndex
    } from "../../api/admin/dictionaryIndex";

    export default {
        name: 'metadata',
        data() {
            const validateName = (rule, value, callback) => {
                const reg = /^[\u4e00-\u9fa5]+$/;
                if (!reg.test(value)) {
                    callback(new Error('只能输入中文'))
                } else {
                    checkNameExist(this.metadata.id, value).then(response => {
                        if (response.data) {
                            callback(new Error('中文名称已存在'));
                        } else {
                            callback();
                        }
                    })
                }
            };
            const validateBriefName = (rule, value, callback) => {
                const reg = /^[a-z]+(_[a-z]+)*$/;
                if (!reg.test(value)) {
                    callback(new Error('格式错误，只能输入小写字母或 _ 且必须以字母开头，例如：a_b, a_b_c 等'));
                } else {
                    checkBriefNameExist(this.metadata.id, value).then(response => {
                        if (response.data) {
                            callback(new Error('字段名已存在'));
                        } else {
                            callback();
                        }
                    })
                }
            };
            const validateEnName = (rule, value, callback) => {
                const reg = /^[a-zA-Z]+([_\s][a-zA-Z]+)*$/;
                if (!reg.test(value)) {
                    callback(new Error('只能输入英文字母，多个单词以空格或 _ 隔开'));
                } else {
                    checkEnNameExist(this.metadata.id, value).then(response => {
                        if (response.data) {
                            callback(new Error('英文名称已存在'));
                        } else {
                            callback();
                        }
                    })
                }
            };
            const checkDataLength = (rule, value, callback) => {
                if (/[^\d]/g.test(value)) {
                    callback(new Error('请输入正整数'));
                } else {
                    callback();
                }
            };
            return {
                metadataCategoryTree: undefined,
                metadataList: undefined,
                total: undefined,
                treeLoading: true,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    categoryId: undefined,
                    name: undefined
                },
                metadata: {
                    id: undefined,
                    name: undefined,
                    briefName: undefined,
                    enName: undefined,
                    type: 1,
                    dataType: undefined,
                    controlType: undefined,
                    dataLength: undefined,
                    checkModel: undefined,
                    dataSource: undefined,
                    dictionaryId: undefined,
                    definition: undefined,
                    field: undefined,
                    required: false,
                    mandatory: false,
                    multiFlag: false,
                    annotationCount: 1,
                    controlLength: undefined,
                    categoryId: undefined,
                    relationId: undefined
                },
                metadataRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '中文名称'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    briefName: [
                        {required: true, message: this.$t("table.pleaseInput") + '字段名'},
                        {validator: validateBriefName, trigger: 'blur'}
                    ],
                    enName: [
                        {required: true, message: this.$t("table.pleaseInput") + '英文名称'},
                        {validator: validateEnName, trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: this.$t("table.pleaseInput") + '类型'}
                    ],
                    dataType: [
                        {required: true, message: this.$t("table.pleaseInput") + '数据类型'}
                    ],
                    controlType: [
                        {required: true, message: this.$t("table.pleaseInput") + '控件类型'}
                    ],
                    dictionaryId: [
                        {required: true, message: this.$t("table.pleaseInput") + '数据字典'}
                    ],
                    /*definition: [
                        {required: true, message: this.$t("table.pleaseInput") + '定义'}
                    ],
                    field: [
                        {required: true, message: this.$t("table.pleaseInput") + '值域'}
                    ],*/
                    annotationCount: [
                        {required: true, message: this.$t("table.pleaseInput") + '出现次数'}
                    ],
                    dataLength: [
                        {required: true, message: this.$t("table.pleaseInput") + '数据长度'},
                        {validator: checkDataLength, trigger: ['blur','change']}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                dataTypeOptions: [],
                controlTypeOptions: [],
                dataSourceOptions: [],
                checkModelOptions: [],
                dictOptions: [],
                relationData: [],
                candidateList: [],
                selectedRowsRelation: [],
                selectedRowsCandidate: [],
                dialogRelationVisible: false
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
                    create: this.permission.metadata_create,
                    update: this.permission.metadata_update,
                    delete: this.permission.metadata_delete
                };
            }
        },
        watch: {
            'metadata.dataType'(value) {
                this.metadata.controlType = undefined;
                for (let item of this.dataTypeOptions) {
                    if (item.id === value) {
                        this.controlTypeOptions = item.dataShow
                    }
                }
            },
            'metadata.controlType'(value) {
                this.metadata.dataSource = undefined;
                this.metadata.checkModel = undefined;
                this.metadata.dataLength = undefined;
                for (let item of this.controlTypeOptions) {
                    if (item.id === value) {
                        this.dataSourceOptions = item.dataSource;
                        this.checkModelOptions = item.validate;
                        if (item.dataLengths && item.dataLengths.length > 0) {
                            this.metadata.dataLength = item.dataLengths[0].length
                        }
                        if (item.controlLengths && item.controlLengths.length > 0) {
                            this.metadata.controlLength = item.controlLengths[0].value;
                        }
                    }
                }
            },
            'metadata.multiFlag'(value) {
                if (!value) {
                    this.metadata.annotationCount = 1
                }
            }
        },
        created(){
            this.reloadTree().then(() => {
                let node = getFirstFinalChild(this.metadataCategoryTree);
                if (node) {
                    this.$refs['metadataCategoryTree'].setCurrentKey(node.id);
                    this.listQuery.categoryId = node.id;
                    this.reloadList();
                } else {

                }
            });
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
                this.metadataList = undefined;
                this.total = undefined;
                getMetadataList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.metadataList = response.data.records;
                    this.total = response.data.total;
                })
            },
            reloadTree(){
                this.treeLoading = true;
                return new Promise((resolve, reject) => {
                    getMetadataCategoryTree().then(response => {
                        this.metadataCategoryTree = response.data;
                        this.treeLoading = false;
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })
            },
            getDataType () {
                findDataType().then(response => {
                    this.dataTypeOptions = response.data
                })
            },
            getAllDicts() {
                getAllDictionaryIndex().then(response => {
                    this.dictOptions = response.data
                })
            },
            getCandidateData(id, categoryId) {
                return new Promise((resolve, reject) => {
                    findCandidateRelation(id, categoryId).then(response => {
                        this.candidateList = response.data
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                });
            },
            initCandidateTable() {
                Promise.all([this.getCandidateData(this.metadata.id, this.metadata.categoryId), this.$nextTick()]).then(() => {
                    this.checkRelatedRows();
                })
            },
            checkRelatedRows() {
                for (let item of this.relationData) {
                    for (let row of this.candidateList) {
                        if (item.id === row.id) {
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
            triggerTreeNode(data) {
                if (data.children && data.children.length > 0) {
                    this.$refs['metadataCategoryTree'].setCurrentKey(this.listQuery.categoryId);
                    return;
                }
                this.listQuery.categoryId = data.id;
                this.handleCurrentChange(1)
            },
            btnCreate(){
                if (!this.listQuery.categoryId) {
                    this.$message.warning('请选择分类再新增');
                    return;
                }
                this.resetMetadata();
                this.metadata.categoryId = this.listQuery.categoryId;
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetMetadata();
                if (!row.id) {
                    row = this.selectedRows[0];
                }
                this.metadata = deepClone(row);
                this.$nextTick(() => {
                    this.metadata.controlType = row.controlType;
                    this.$nextTick(() => {
                        this.$set(this.metadata, 'dataSource', row.dataSource);
                        this.metadata.checkModel = row.checkModel;
                        this.metadata.dataLength = row.dataLength;
                    });
                });
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
            handleRelation() {
                this.dialogRelationVisible = true;
            },
            handleUnRelate() {
                for (const row of this.selectedRowsRelation) {
                    for (const [index, item] of this.relationData.entries()) {
                        if (row.id === item.id) {
                            this.relationData.splice(index, 1);
                            break;
                        }
                    }
                }
                this.selectedRowsRelation = [];
            },
            doCreate(){
                this.$refs['metadataDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        if (this.metadata.type === 2) {
                            this.metadata.relationDataJson = JSON.stringify(this.relationData);
                        }
                        createOrUpdateMetadata(this.metadata).then(() => {
                            this.resetMetadataDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['metadataDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        if (this.metadata.type === 2) {
                            this.metadata.relationDataJson = JSON.stringify(this.relationData);
                        }
                        createOrUpdateMetadata(this.metadata).then(() => {
                            this.resetMetadataDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delMetadatas(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            doRelation() {
                if (this.selectedRowsCandidate.length === 0) {
                    this.$message.warning('请选择需要关联的数据');
                } else {
                    for (const objInfo of this.selectedRowsCandidate) {
                        if (JSON.stringify(this.relationData).indexOf(JSON.stringify(objInfo)) === -1) {
                            this.relationData.push(objInfo)
                        }
                    }
                    this.resetDialogRelation();
                }
            },
            resetMetadata(){
                this.metadata = {
                    id: undefined,
                    name: undefined,
                    briefName: undefined,
                    enName: undefined,
                    type: 1,
                    dataType: undefined,
                    controlType: undefined,
                    dataLength: undefined,
                    checkModel: undefined,
                    dataSource: undefined,
                    dictionaryId: undefined,
                    definition: undefined,
                    field: undefined,
                    required: false,
                    mandatory: false,
                    multiFlag: false,
                    annotationCount: 1,
                    controlLength: undefined,
                    categoryId: undefined,
                    relationId: undefined
                };
                this.relationData = [];
            },
            resetMetadataDialogAndList(){
                this.closeMetadataDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeMetadataDialog() {
                this.dialogVisible = false;
                this.resetMetadata();
                this.$refs['metadataDialogForm'].resetFields();
            },
            resetDialogRelation() {
                this.dialogRelationVisible = false;
                this.$refs['candidateTable'].clearSelection();
                this.selectedRowsCandidate = [];
            }
        }
    }
</script>


<style>
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #a6d1ff;
    }
    .el-radio.is-bordered+.el-radio.is-bordered {
        margin-left: 0;
    }
    .el-checkbox.is-bordered+.el-checkbox.is-bordered {
        margin-left: 0;
    }
</style>
