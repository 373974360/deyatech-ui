<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
<!--            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>-->

            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate" :disabled="selectedRows.length > 1">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
        </div>

        <el-table :data="catalogList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange" v-if="tableReset">
            <el-table-column type="selection" width="50" align="center"/>
            <!--<el-table-column align="center" label="站点id" prop="siteId"/>
            <el-table-column align="center" label="父节点id" prop="parentId"/>-->
            <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                                  parentKey="parentId" prop="name" label="栏目名称" width="200" align="center">
                <template slot-scope="scope">
                    <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-tree-column>
            <el-table-column align="center" label="栏目别名" prop="aliasName"/>
            <el-table-column align="center" label="排序" prop="sortNo"/>
<!--            <el-table-column align="center" label="英文名称" prop="ename"/>-->
<!--            <el-table-column align="center" label="是否显示" prop="showable"/>-->
                <el-table-column align="center" label="URL" prop="linkUrl"/>
<!--            <el-table-column align="center" label="工作流ID" prop="workflowId"/>-->
<!--            <el-table-column align="center" label="首页模板" prop="indexTemplate"/>-->
<!--            <el-table-column align="center" label="列表页模板" prop="listTemplate"/>-->
<!--            <el-table-column align="center" label="在树结构中位置" prop="treePosition"/>
            <el-table-column align="center" label="状态" prop="status"/>
            <el-table-column align="center" label="是否允许评论" prop="allowComment"/>
            <el-table-column align="center" label="是否允许分享: 0.否 1.是" prop="allowShare"/>
            <el-table-column align="center" label="应用id" prop="applicationId"/>
            <el-table-column align="center" label="属性id" prop="attributeId"/>
            <el-table-column align="center" label="自动发布:0.否 1.是" prop="autoRelease"/>
            <el-table-column align="center" label="内容对象id" prop="contectObjectId"/>
            <el-table-column align="center" label="显示条数" prop="displayNumber"/>
            <el-table-column align="center" label="生成栏目首页:0.否 1.是" prop="generateHome"/>
            <el-table-column align="center" label="在导航中显示: 0.否 1.是" prop="navigationShowAble"/>
            <el-table-column align="center" label="参与人员:0.会员 1.所有人" prop="participant"/>
            <el-table-column align="center" label="在树中显示: 0.否 1.是" prop="treeShowAble"/>
            <el-table-column align="center" label="是否启用工作流: 0.否 1.是" prop="workflowEnable"/>
            <el-table-column align="center" label="路径名，如果是多级栏目则用/分隔各级ename" prop="pathName"/>
            <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                        {{scope.row.enable | enums('EnableEnum')}}
                    </el-tag>
                </template>
            </el-table-column>-->
            <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                <template slot-scope="scope">
                    <el-button v-if="btnEnable.create" :title="$t('table.create')" type="primary" icon="el-icon-plus" :size="btnSize" circle
                               @click.stop.safe="btnCreate(scope.row)"></el-button>
                    <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                               @click.stop.safe="btnUpdate(scope.row)"></el-button>
                    <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                               @click.stop.safe="btnDelete(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                   :close-on-click-modal="closeOnClickModal" @close="closeCatalogDialog">
            <el-form ref="catalogDialogForm" class="deyatech-form" :model="catalog" label-position="right"
                     label-width="80px" :rules="catalogRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item :label="$t('table.parent')" label-width="140px">
                            <el-cascader :options="catalogCascader" v-model="catalogTreePosition"
                                         show-all-levels expand-trigger="click" clearable
                                         change-on-select style="width: 100%"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="栏目名称" prop="name" label-width="140px">
                            <el-input v-model="catalog.name"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="栏目别名" prop="aliasName" label-width="140px">
                            <el-input v-model="catalog.aliasName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="英文名称" prop="ename" label-width="140px">
                            <el-input v-model="catalog.ename"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="外部链接地址" prop="linkUrl" label-width="140px">
                            <el-input v-model="catalog.linkUrl"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="首页模板" prop="indexTemplate" label-width="140px">
                            <el-input v-model="catalog.indexTemplate"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="列表页模板" prop="listTemplate" label-width="140px">
                            <el-cascader
                                style="width: 100%"
                                placeholder="请选择模板地址"
                                clearable
                                expand-trigger="hover"
                                :options="templateTreeData"
                                v-model="selectListTemplate"
                                :props="cascaderProps"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="列表页显示条数" prop="displayNumber" label-width="140px">
                            <el-input-number v-model="catalog.displayNumber" :min=1 :max=100 style="width: 100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="是否自动发布" prop="autoRelease" label-width="140px">
                            <el-select v-model="catalog.autoRelease" style="width: 100%">
                                <el-option
                                    v-for = "o in loadEnum('YesNoEnum')"
                                    :label="o.value"
                                    :value="o.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否允许评论" prop="allowComment" label-width="140px">
                            <el-select v-model="catalog.allowComment" style="width: 100%">
                                <el-option
                                    v-for = "o in loadEnum('YesNoEnum')"
                                    :label="o.value"
                                    :value="o.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="是否允许分享" prop="allowShare" label-width="140px">
                            <el-select v-model="catalog.allowShare" style="width: 100%">
                                <el-option
                                    v-for = "o in loadEnum('YesNoEnum')"
                                    :label="o.value"
                                    :value="o.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否生成栏目首页" prop="generateHome" label-width="140px">
                            <el-select v-model="catalog.generateHome" style="width: 100%">
                                <el-option
                                    v-for = "o in loadEnum('YesNoEnum')"
                                    :label="o.value"
                                    :value="o.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="是否在导航中显示" prop="navigationShowAble" label-width="140px">
                            <el-select v-model="catalog.navigationShowAble" style="width: 100%">
                                <el-option
                                    v-for = "o in loadEnum('YesNoEnum')"
                                    :label="o.value"
                                    :value="o.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否在树中显示" prop="treeShowAble" label-width="140px">
                            <el-select v-model="catalog.treeShowAble" style="width: 100%">
                                <el-option
                                    v-for = "o in loadEnum('YesNoEnum')"
                                    :label="o.value"
                                    :value="o.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="参与人员" prop="participant" label-width="140px">
                            <el-radio v-model="catalog.participant" border :label="1">会员</el-radio>
                            <el-radio v-model="catalog.participant" border :label="2">所有人</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="是否启用工作流" prop="workflowEnable" label-width="140px">
                            <el-switch v-model="catalog.workflowEnable" :active-value=1 :inactive-value=0 @change="isWorkflowEnable">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="工作流" prop="workflowId" v-if="display" label-width="140px">
                            <el-select v-model="catalog.workflowId" placeholder="请选择工作流">
                                <el-option v-for="item in workflowList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item :label="$t('table.remark')" prop="remark" label-width="140px">
                            <el-input type="textarea" v-model="catalog.remark" :rows="3"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button :size="btnSize" @click="closeCatalogDialog">{{$t('table.cancel')}}</el-button>
            </span>
        </el-dialog>
    </basic-container>
</template>

<script>
    import {
        getCatalogTree,
        getCatalogCascader,
        createOrUpdateCatalog,
        delCatalogs,
        existsName,
        existsAliasName,
        existsEname
    } from '@/api/station/catalog';
    import {deepClone, setExpanded} from '@/util/util';
    import {mapGetters} from 'vuex';
    import {getStore} from '@/util/store';
    import pinyin from 'pinyin';
    import {listTemplateAllFiles} from '@/api/template/template';

    export default {
        name: 'catalog',
        data() {
            const validateName = (rule, value, callback) => {
                const query = {
                    id: this.catalog.id,
                    parentId: this.catalog.parentId ? this.catalog.parentId : '0',
                    siteId : this.listQuery.siteId,
                    name: value
                }
                existsName(query).then(response => {
                    if (response.status == 200) {
                        if (response.data) {
                            callback(new Error('名称已存在'))
                        } else {
                            if (!this.catalog.ename) {
                                this.catalog.ename = pinyin(this.catalog.name, {
                                    style: pinyin.STYLE_FIRST_LETTER
                                }).join('')
                            }
                            callback()
                        }
                    } else {
                        callback(new Error('检查名称重复失败'))
                    }
                })
            }
            const validateAliasName = (rule, value, callback) => {
                const query = {
                    id: this.catalog.id,
                    parentId: this.catalog.parentId ? this.catalog.parentId : '0',
                    siteId : this.listQuery.siteId,
                    aliasName: value
                }
                existsAliasName(query).then(response => {
                    if (response.status == 200) {
                        if (response.data) {
                            callback(new Error('别名已存在'))
                        } else {
                            callback()
                        }
                    } else {
                        callback(new Error('检查别名重复失败'))
                    }
                })
            }
            const validateEname = (rule, value, callback) => {
                const query = {
                    id: this.catalog.id,
                    parentId: this.catalog.parentId ? this.catalog.parentId : '0',
                    siteId : this.listQuery.siteId,
                    ename: value
                }
                existsEname(query).then(response => {
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
            const validateListTemplate = (rule, value, callback) => {
                this.catalog.listTemplate = '/';
                if (this.selectListTemplate) {
                    this.catalog.listTemplate += this.selectListTemplate.join('/');
                }
                if (this.catalog.listTemplate.length > 50) {
                    callback(new Error('模板路径过长，最多 50 个字符'))
                    this.catalog.listTemplate = undefined;
                } else {
                    callback()
                }
            }
            return {
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    siteId: this.$store.state.common.siteId
                },
                catalogList: undefined,
                listLoading: false,
                catalog: {
                    id: undefined,
                    siteId: undefined,
                    parentId: undefined,
                    name: undefined,
                    aliasName: undefined,
                    ename: undefined,
                    showable: undefined,
                    linkUrl: undefined,
                    workflowId: undefined,
                    indexTemplate: undefined,
                    listTemplate: undefined,
                    sortNo: undefined,
                    treePosition: undefined,
                    status: undefined,
                    allowComment: undefined,
                    allowShare: undefined,
                    applicationId: undefined,
                    attributeId: undefined,
                    autoRelease: undefined,
                    contectObjectId: undefined,
                    displayNumber: undefined,
                    generateHome: undefined,
                    navigationShowAble: undefined,
                    participant: undefined,
                    treeShowAble: undefined,
                    workflowEnable: undefined,
                    pathName: undefined
                },
                catalogCascader: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                selectedRows: [],
                catalogRules: {
                    siteId: [
                        {required: true, message: this.$t("table.pleaseInput") + '站点id'}
                    ],
                    parentId: [
                        {required: true, message: this.$t("table.pleaseInput") + '父节点id'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '栏目名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    aliasName: [
                        {required: true, message: this.$t("table.pleaseInput") + '栏目别名'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateAliasName, trigger: 'blur'}
                    ],
                    ename: [
                        {required: true, message: this.$t("table.pleaseInput") + '英文名称'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'},
                        {validator: validateEname, trigger: 'blur'}
                    ],
                    linkUrl: [
                        {required: true, message: this.$t("table.pleaseInput") + '外部链接地址'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    showable: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否显示'}
                    ],
                    workflowId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '工作流'}
                    ],
                    indexTemplate: [
                        // {required: true, message: this.$t("table.pleaseInput") + '首页模板'}
                        {max: 50, message: '模板路径过长，最多 50 个字符', trigger: 'blur'}
                    ],
                    listTemplate: [
                        {validator: validateListTemplate, trigger: 'change'}
                    ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '排序号'}
                    ],
                    treePosition: [
                        {required: true, message: this.$t("table.pleaseInput") + '在树结构中位置'}
                    ],
                    status: [
                        {required: true, message: this.$t("table.pleaseInput") + '状态'}
                    ],
                    allowComment: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否允许评论'}
                    ],
                    allowShare: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否允许分享'}
                    ],
                    applicationId: [
                        {required: true, message: this.$t("table.pleaseInput") + '应用id'}
                    ],
                    attributeId: [
                        {required: true, message: this.$t("table.pleaseInput") + '属性id'}
                    ],
                    autoRelease: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否自动发布'}
                    ],
                    contectObjectId: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容对象id'}
                    ],
                    displayNumber: [
                        {required: true, message: this.$t("table.pleaseInput") + '显示条数'}
                    ],
                    generateHome: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否生成栏目首页'}
                    ],
                    navigationShowAble: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否在导航中显示'}
                    ],
                    participant: [
                        {required: true, message: this.$t("table.pleaseSelect") + '参与人员'}
                    ],
                    treeShowAble: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否在树中显示'}
                    ],
                    workflowEnable: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否启用工作流'}
                    ],
                    pathName: [
                        {required: true, message: this.$t("table.pleaseInput") + '路径名，如果是多级栏目则用/分隔各级ename'}
                    ],
                    remark: [
                        {max: 500, message: '长度最多 500 个字符', trigger: 'blur'}
                    ]
                },
                lastExpanded: undefined,
                tableReset: true,
                templateTreeData: [{
                    value: 'deyatech',
                    label: '德雅通科技',
                    children: [{
                        value: 'xiangmu.html',
                        label: '项目',
                    },{
                        value: 'yanfa.html',
                        label: '研发',
                    }]
                }],
                cascaderProps: {
                    value: 'fileName',
                    label: 'fileName',
                    children: 'children'
                },
                selectListTemplate: undefined,
                workflowList: [],
                display: false
            }
        },
        created() {
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                this.reloadList();
                this.listTemplateAllFiles();
            }else{
                this.$message.error('请选择站点！');
            }
        },
        computed: {
            catalogTreePosition: {
                get() {
                    if (this.catalog.treePosition) {
                        return this.catalog.treePosition.substr(1).split('&');
                    }
                },
                set(v) {
                    if (v.length > 0) {
                        this.catalog.parentId = v[v.length - 1];
                        this.catalog.treePosition = "&" + v.join('&') + "&" + this.catalog.parentId;
                    } else {
                        this.catalog.parentId = '0';
                        this.catalog.treePosition = undefined;
                    }
                }
            },
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
                    create: this.permission.catalog_create,
                    update: this.permission.catalog_update,
                    delete: this.permission.catalog_delete
                };
            }
        },
        methods: {
/*            resetSearch(){
                this.listQuery.siteId = this.$store.state.common.siteId;
            },*/
            reloadList(){
                if (!this.listQuery.siteId) {
                    this.$message.warning("请先选择站点");
                    return
                }
                this.listLoading = true;
                getCatalogTree(this.listQuery).then(response => {
                    this.tableReset = false;
                    this.catalogList = response.data;
                    if (this.lastExpanded) {
                        this.catalogList = setExpanded(this.catalogList, this.lastExpanded);
                    }
                    this.$nextTick(() => {
                        this.tableReset = true
                    });
                    this.listLoading = false;
                })
            },
            getCatalogCascader(query){
                this.submitLoading = true;
                getCatalogCascader(query).then(response => {
                    this.submitLoading = false;
                    this.catalogCascader = response.data;
                })
            },
            handleSelectionChange(rows){
                this.selectedRows = rows;
            },
            loadEnum(name) {
                return getStore({name: 'enums'})[name]
            },
            // 获取模板
            listTemplateAllFiles(){
                this.templateTreeData = [];
                listTemplateAllFiles(this.listQuery.siteId).then(response => {
                    let result = JSON.parse(response.data)
                    this.templateTreeData = result.files
                })
            },
            btnCreate(row){
                if (!(this.listQuery.siteId || row.siteId)) {
                    this.$message.warning("请先选择站点");
                    return
                }
                this.resetCatalog();
                if (row.id) {
                    if(row.treePosition){
                        this.catalog.treePosition = row.treePosition + "&" + row.id;
                    }else{
                        this.catalog.treePosition = "&" + row.id;
                    }
                    this.catalog.parentId = row.id;
                    this.getCatalogCascader({siteId : row.siteId});
                } else {
                    if (this.selectedRows.length == 1) {
                        if(this.selectedRows[0].treePosition){
                            this.catalog.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
                        }else{
                            this.catalog.treePosition = "&" + this.selectedRows[0].id;
                        }
                        this.catalog.parentId = this.selectedRows[0].id;
                    } else {
                        this.catalog.parentId = '0';
                        this.catalog.treePosition = undefined;
                    }
                    this.getCatalogCascader({siteId : this.listQuery.siteId});
                }
                this.catalog.children = undefined;
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetCatalog();
                if (row.id) {
                    this.catalog = deepClone(row);
                } else {
                    this.catalog = deepClone(this.selectedRows[0]);
                }
                this.isWorkflowEnable(this.catalog.workflowEnable);
                this.catalog.children = undefined;
                this.getCatalogCascader({siteId : row.siteId});
                this.selectListTemplate = this.catalog.listTemplate.split('/').slice(1);
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row){
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.lastExpanded = row.treePosition;
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows) {
                            this.lastExpanded = deleteRow.treePosition;
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate(){
                this.$refs['catalogDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        this.catalog.siteId = this.listQuery.siteId;
                        createOrUpdateCatalog(this.catalog).then(() => {
                            this.lastExpanded = this.catalog.treePosition;
                            this.resetCatalogDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doUpdate(){
                this.$refs['catalogDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateCatalog(this.catalog).then(() => {
                            this.lastExpanded = this.catalog.treePosition;
                            this.resetCatalogDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delCatalogs(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetCatalog(){
                this.catalog = {
                    id: undefined,
                    siteId: undefined,
                    parentId: undefined,
                    name: undefined,
                    aliasName: undefined,
                    ename: undefined,
                    showable: undefined,
                    linkUrl: undefined,
                    workflowId: undefined,
                    indexTemplate: undefined,
                    listTemplate: undefined,
                    sortNo: undefined,
                    treePosition: undefined,
                    status: undefined,
                    allowComment: undefined,
                    allowShare: undefined,
                    applicationId: undefined,
                    attributeId: undefined,
                    autoRelease: undefined,
                    contectObjectId: undefined,
                    displayNumber: undefined,
                    generateHome: undefined,
                    navigationShowAble: undefined,
                    participant: undefined,
                    treeShowAble: undefined,
                    workflowEnable: 0,
                    pathName: undefined
                }
            },
            resetCatalogDialogAndList(){
                this.closeCatalogDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeCatalogDialog() {
                this.display = false;
                this.dialogVisible = false;
                this.selectListTemplate = undefined;
                this.resetCatalog();
                this.$refs['catalogDialogForm'].resetFields();
            },
            handleChange(value) {
                console.log(value);
            },
            isWorkflowEnable (value) {
                if (value == 1) {
                    this.getWorkflowList();
                    this.display = true
                } else {
                    this.catalog.workflowId = undefined
                    this.display = false
                }
            },
            // TODO 获取工作流
            getWorkflowList() {
                this.workflowList = [{
                    id: '1',
                    name: '工作流1',
                },{
                    id: '2',
                    name: '工作流2',
                }]
                /*getWorkflowList().then(response => {
                    if (response.status == 200) {
                        this.workflowList = response.data
                    } else {
                        this.$message.error('工作流数据获取失败')
                    }
                })*/
            }
        }
    }
</script>

