<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="请输入标题或作者" v-model="listQuery.title"></el-input>
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

                    <el-dropdown style="margin-left: 10px" placement="bottom" @command="handleCommand">
                        <el-button type="warning" size="small">
                            生成内容页或索引<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="handleCheckedStaticContent">生成勾选的内容页</el-dropdown-item>
                            <el-dropdown-item command="handleCatalogStaticContent">生成当前栏目内容页</el-dropdown-item>
                            <el-dropdown-item command="handleSiteStaticContent">生成站点所有内容页</el-dropdown-item>
                            <el-dropdown-item command="handleCheckedReindex" divided>生成勾选的索引</el-dropdown-item>
                            <el-dropdown-item command="handleCatalogReindex">生成当前栏目索引</el-dropdown-item>
                            <el-dropdown-item command="handleSiteReindex">生成站点所有索引</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
<!--                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>-->
                </div>
            </div>
            <div class="standard-text">
                <!-- 栏目列表 -->
                <div class="left-tree" ref="leftTree" v-loading.body="listLoading">
                    <div class="left-tree-title">栏目列表</div>
                    <el-tree
                        ref="catalogTree"
                        :data="catalogList"
                        :props="defaultTreeProps"
                        node-key="id"
                        highlight-current
                        :default-expand-all="true"
                        :expand-on-click-node="false"
                        @node-click="handleNoteClick">
                    </el-tree>
                </div>
                <!-- 内容表格 -->
                <el-table class="table-list" :data="templateList" v-loading.body="listLoading" stripe border highlight-current-row
                          :height="treeHeight" ref="tableList"
                          @selection-change="handleSelectionChange">

                    <!--元数据相关 TODO-->
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-form label-position="right" inline class="form-model">
                                <!--<el-form-item v-for="item in scope.row.metaDataCollection.metaDataCollectionMetaDataDtoList"  TODO
                                              v-if="item.tableHand === 1" :key="item.id" :label="item.metaData.name + '：'">
                                    <span>{{scope.row.content[item.fieldName]}}</span>
                                </el-form-item>-->
                            </el-form>
                        </template>
                    </el-table-column>
                    <!--template表数据-->
                    <el-table-column type="selection" width="50" align="center"/>
                    <el-table-column align="center" label="内容模型" prop="contentModelName"/>
                    <el-table-column align="center" label="标题" prop="title"/>
                    <el-table-column align="center" label="作者姓名" prop="author"/>
                    <el-table-column align="center" label="URL" prop="url">
                        <!--<template slot-scope="scope">  TODO
                            <a :href="scope.row.url" target="_blank">静态</a>
                            <a :href="'/api/manage/cms/m/'+scope.row.siteId+'/' + scope.row.id" target="_blank">动态</a>
                        </template>-->
                    </el-table-column>
                    <el-table-column align="center" label="排序号" prop="sortNo"/>
                    <el-table-column align="center" label="是否置顶" prop="flagTop">
                        <template slot-scope="scope">
                            {{scope.row.flagTop ? '是' : '否'}}
                        </template>
                    </el-table-column>
<!--                    <el-table-column align="center" label="站点id" prop="siteId"/>-->
<!--                    <el-table-column align="center" label="模板路径" prop="templatePath"/>-->
<!--                    <el-table-column align="center" label="栏目ID" prop="cmsCatalogId"/>-->
<!--                    <el-table-column align="center" label="内容模型ID" prop="contentModelId"/>-->
<!--                    <el-table-column align="center" label="内容唯一ID" prop="contentId"/>-->
<!--                    <el-table-column align="center" label="状态" prop="status"/>-->
<!--                    <el-table-column align="center" label="内容模型模板ID" prop="contentModelTemplateId"/>-->
<!--                    <el-table-column align="center" label="编辑姓名" prop="editor"/>-->
<!--                    <el-table-column align="center" label="来源" prop="source"/>-->
<!--                    <el-table-column align="center" label="缩略图" prop="thumbnail"/>-->
<!--                    <el-table-column align="center" label="是否允许搜索到" prop="flagSearch"/>-->
<!--                    <el-table-column align="center" label="浏览次数" prop="views"/>-->
<!--                    <el-table-column align="center" label="是否是外链" prop="flagExternal"/>-->
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
            </div>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>

            <!--弹窗-->
            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeTemplateDialog">
                <el-form ref="templateDialogForm" class="deyatech-form" :model="template" label-position="right"
                         label-width="80px" :rules="templateRules">

                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="内容模型" prop="contentModelId">
                                <el-select v-model="template.contentModelId" placeholder="请选择内容模型"
                                           @change="handleModelChange" :disabled="dialogTitle == 'update'">
                                    <el-option
                                        v-for="m in modelList"
                                        :key="m.id"
                                        :label="m.name"
                                        :value="m.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="标题" prop="title">
                                <el-input v-model="template.title"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="作者姓名" prop="author">
                                <el-input v-model="template.author"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="编辑姓名" prop="editor">
                                <el-input v-model="template.editor"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="来源" prop="source">
                                <el-input v-model="template.source"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="排序号" prop="sortNo">
                                <el-input-number v-model="template.sortNo" :min=1 :max=65535></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="缩略图" prop="thumbnail">
                            <el-upload class="avatar-uploader"
                                       :action="this.$store.state.common.uploadUrl"
                                       :accept="this.$store.state.common.imageAccepts"
                                       :show-file-list="false"
                                       :on-success="handleAvatarSuccess"
                                       :on-error="handleAvatarError"
                                       :before-upload="beforeAvatarUpload">
                                <img v-if="template.thumbnail" :src="this.$store.state.common.showPicImgUrl + template.thumbnail"
                                     class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="搜索可见" prop="flagSearch">
                                <el-switch v-model="template.flagSearch">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否置顶" prop="flagTop">
                                <el-switch v-model="template.flagTop">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否外链" prop="flagExternal">
                                <el-switch v-model="template.flagExternal">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="URL" prop="url" v-if="template.flagExternal">
                                <el-input v-model="template.url"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <!-- 选择内容模型后，元数据等相关 TODO -->
                    <!--<el-form-item class="el-form-item" v-for="(item, index) in contentFormData.metaDataCollectionMetaDataDtoList"
                                  :key="item.id" :label="item.metaData.name + '：'" :label-width="formLabelWidth"
                                  :prop="'content.' + [item.fieldName]"
                                  :rules="item | formItemRules">
                        <template slot-scope>
                            <el-input v-if="item.controlType === 'inputElement'"
                                      v-model="dialogList.content[item.fieldName]"></el-input>
                            <el-select v-if="item.controlType === 'selectElement'" v-model="dialogList.content[item.fieldName]"
                                       placeholder="请选择">
                                <el-option v-for="opt in contentItemOptions[item.id]" :key="opt.id" :label="opt.name"
                                           :value="opt.dataDictionaryId"></el-option>
                            </el-select>
                            <el-radio-group v-if="item.controlType === 'radioElement'" v-model="dialogList.content[item.fieldName]">
                                <el-radio v-for="opt in contentItemOptions[item.id]" :key="opt.id" :label="opt.dataDictionaryId">
                                    {{opt.name}}
                                </el-radio>
                            </el-radio-group>
                            <el-checkbox-group v-if="item.controlType === 'checkboxElement'" v-model="contentItemArray[item.fieldName]">
                                <el-checkbox v-for="opt in contentItemOptions[item.id]" :key="opt.id" :label="opt.dataDictionaryId">
                                    {{opt.name}}
                                </el-checkbox>
                            </el-checkbox-group>

                            <el-input type="textarea" v-if="item.controlType === 'textareaElement'"
                                      v-model="dialogList.content[item.fieldName]"></el-input>
                            <editor v-if="item.controlType === 'richTextElement'" :ref="item.id" :id="'editor' + index"
                                    :default-msg="editorDefaultMsg[item.id]" :config="editorConfig"></editor>

                            <template v-if="item.metaData.dataType === 'date'">
                                <el-time-picker v-if="item.controlType === 'timeElement'" v-model="dialogList.content[item.fieldName]"
                                                value-format="HH:mm:ss" placeholder="请选择时间"></el-time-picker>
                                <el-date-picker v-else-if="item.controlType === 'datetimeElement'"
                                                v-model="dialogList.content[item.fieldName]"
                                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间"></el-date-picker>
                                <el-date-picker v-else v-model="dialogList.content[item.fieldName]" type="date" value-format="yyyy-MM-dd"
                                                placeholder="请选择日期"></el-date-picker>
                            </template>

                            <el-upload v-if="item.controlType === 'fileElement'"
                                       :action="uploadUrl"
                                       multiple
                                       :file-list="uploadFileList[item.fieldName]"
                                       :before-upload="beforeAvatarUpload"
                                       :on-success="handleSuccess"
                                       :on-preview="handlePreview"
                                       :on-remove="handleRemove"
                                       :before-remove="pickUploader(item.fieldName)">
                                <el-button size="small" type="primary" @click="pickUploader(item.fieldName)">点击上传</el-button>
                            </el-upload>
                        </template>
                    </el-form-item>-->

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeTemplateDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getTemplateList,
        createOrUpdateTemplate,
        delTemplates,
        checkTitleExist,
        genStaticPage,
        reindex
    } from '@/api/station/template';
    import {
        getCatalogTree
    } from '@/api/station/catalog';
    import {
        getAllModelBySiteId
    } from '@/api/station/model';
    import {validateURL} from '@/util/validate';



    export default {
        name: 'template',
        data() {
            const validateTitle = (rule, value, callback) => {
                this.template.title = value;
                checkTitleExist(this.template).then(response => {
                    if (response.status == 200) {
                        if (response.data) {
                            callback(new Error('当前栏目中已存在该标题内容'))
                        } else {
                            callback()
                        }
                    } else {
                        callback(new Error('检查内容重复查询失败'))
                    }
                })
            }
            const validateUrl = (rule, value, callback) => {
                if (this.template.flagExternal) {
                    if (!value) {
                        callback(new Error('请输入URL'))
                    } else {
                        if (!validateURL(value)) {
                            callback(new Error('URL格式错误'))
                        } else {
                            callback()
                        }
                    }
                }
            }
            return {
                treeHeight: 0,
                templateList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    title: undefined,
                    siteId: this.$store.state.common.siteId,
                    cmsCatalogId: undefined,
                },
                template: {
                    id: undefined,
                    siteId: undefined,
                    templatePath: undefined,
                    cmsCatalogId: undefined,
                    contentModelId: undefined,
                    contentId: undefined,
                    status: undefined,
                    contentModelTemplateId: undefined,
                    url: undefined,
                    author: undefined,
                    editor: undefined,
                    source: undefined,
                    thumbnail: undefined,
                    title: undefined,
                    flagSearch: undefined,
                    sortNo: undefined,
                    flagTop: undefined,
                    views: undefined,
                    flagExternal: undefined,
                    workflowKey: undefined
                },
                templateRules: {
                    siteId: [
                        {required: true, message: this.$t("table.pleaseInput") + '站点id'}
                    ],
                    templatePath: [
                        {required: true, message: this.$t("table.pleaseInput") + '模板路径'}
                    ],
                    cmsCatalogId: [
                        {required: true, message: this.$t("table.pleaseInput") + '栏目ID'}
                    ],
                    contentModelId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '内容模型'}
                    ],
                    contentId: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容唯一ID'}
                    ],
                    status: [
                        {required: true, message: this.$t("table.pleaseInput") + '状态'}
                    ],
                    contentModelTemplateId: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容模型模板ID'}
                    ],
                    url: [
                        // {required: true, message: this.$t("table.pleaseInput") + 'URL'}
                        {validator: validateUrl, trigger: 'blur'}
                    ],
                    author: [
                        {required: true, message: this.$t("table.pleaseInput") + '作者姓名'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    editor: [
                        {required: true, message: this.$t("table.pleaseInput") + '编辑姓名'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    source: [
                        {max: 255, message: '长度最多 255 个字符', trigger: 'blur'}
                    ],
                    thumbnail: [
                        // {required: true, message: this.$t("table.pleaseInput") + '缩略图'}
                    ],
                    title: [
                        {required: true, message: this.$t("table.pleaseInput") + '标题'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'},
                        {validator: validateTitle, trigger: 'blur'}
                    ],
                    flagSearch: [
                        // {required: true, message: this.$t("table.pleaseInput") + '是否允许搜索到'}
                    ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '排序号'}
                    ],
                    flagTop: [
                        // {required: true, message: this.$t("table.pleaseInput") + '是否置顶'}
                    ],
                    views: [
                        // {required: true, message: this.$t("table.pleaseInput") + '浏览次数'}
                    ],
                    flagExternal: [
                        // {required: true, message: this.$t("table.pleaseInput") + '是否是外链'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                catalogList: [],
                defaultTreeProps: {
                    children: 'children',
                    label: 'name'
                },
                modelList: [],
                modelTemplateList: [],
                workflowKey: undefined
            }
        },
        watch: {
            // 弹窗元数据相关部分 TODO
            /*contentItemArray: {
                handler(val) {
                    for (let item in val) {
                        this.dialogList.content[item] = val[item].join()
                    }
                },
                deep: true
            },*/
        },
        filters: {
            // 弹窗元数据相关部分 TODO
            /*formItemRules(item) {
                let rules = []
                if (item.metaData.required === 1) {
                    rules.push({required: true, message: '不能为空', trigger: 'blur'})
                }
                if (item.metaData.dataLength) {
                    rules.push({
                        max: parseInt(item.metaData.dataLength),
                        message: '不能超过' + item.metaData.dataLength + '个字符',
                        trigger: 'blur'
                    })
                }
                return rules
            }*/
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
                    create: this.permission.template_create,
                    update: this.permission.template_update,
                    delete: this.permission.template_delete
                };
            }
        },
        updated() {
            this.changeHeight()
        },
        created(){
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                // 获取栏目
                this.getCatalogTree();
                // 获取站点关联的内容模型
                this.getAllModelBySiteId();
            }else{
                this.$message.error('请选择站点！');
            }
        },
        methods: {
            changeHeight() {
                let windowHeight = window.innerHeight;
                this.$refs['leftTree'].style.height = windowHeight - 400 + 'px';
                this.treeHeight = this.$refs['leftTree'].style.height
            },
            getCatalogTree(){
                this.listLoading = true;
                getCatalogTree(this.listQuery).then(response => {
                    this.catalogList = response.data;
                    this.setDefaultCurrentNode()
                    this.listLoading = false;
                })
            },
            setDefaultCurrentNode() {
                if (this.catalogList.length > 0) {
                    this.$nextTick(function(){
                        this.$refs['catalogTree'].setCurrentKey(this.catalogList[0].id);
                    })
                    this.handleNoteClick(this.catalogList[0])
                }
            },
            handleNoteClick(data) {
                // console.log("catalog: " + JSON.stringify(data))
                // 获取内容列表
                // 设置内容工作流id TODO
                this.workflowKey = data.workflowKey;
                this.listQuery.cmsCatalogId = data.id;
                // 获取template
                this.reloadList();
            },
            getAllModelBySiteId() {
                this.listLoading = true;
                getAllModelBySiteId(this.listQuery).then(response => {
                    this.modelList = response.data;
                    this.listLoading = false;
                })
            },
            resetSearch(){
                this.listQuery.title = undefined;
            },
            searchReloadList(){
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.templateList = undefined;
                this.total = undefined;
                getTemplateList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.templateList = response.data.records;
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
                let catalogNode = this.$refs.catalogTree.getCurrentNode()
                if (!catalogNode) {
                    this.$message.warning('请先选择栏目再执行此操作')
                    return
                }
                this.resetTemplate();
                this.template.siteId = this.listQuery.siteId;
                this.template.cmsCatalogId = this.listQuery.cmsCatalogId;
                this.template.workflowKey = this.workflowKey;
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetTemplate();
                if (row.id) {
                    this.template = deepClone(row);
                } else {
                    this.template = deepClone(this.selectedRows[0]);
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

                // 元数据相关 TODO
                /*for (let item of this.contentFormData.metaDataCollectionMetaDataDtoList) {
                    if (item.controlType === 'richTextElement') {
                        this.$set(this.dialogList.content, item.fieldName, this.$refs[item.id][0].getUeContent())
                    }
                }
                for (let item in this.uploadFileList) {
                    let ids = []
                    for (let file of this.uploadFileList[item]) {
                        ids.push(file.id)
                    }
                    this.dialogList.content[item] = ids.join()
                }*/
                this.$refs['templateDialogForm'].validate(valid => {
                    if(valid) {
                        if (!this.template.flagSearch) {
                            this.template.flagSearch = false;
                        }
                        if (!this.template.flagTop) {
                            this.template.flagTop = false;
                        }
                        if (!this.template.flagExternal) {
                            this.template.flagExternal = false;
                            this.template.url = undefined
                        }
                        // console.log("template: " + JSON.stringify(this.template))
                        this.submitLoading = true;
                        createOrUpdateTemplate(this.template).then(() => {
                            this.resetTemplateDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['templateDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateTemplate(this.template).then(() => {
                            this.resetTemplateDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delTemplates(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetTemplate(){
                this.template = {
                    id: undefined,
                    siteId: undefined,
                    templatePath: undefined,
                    cmsCatalogId: undefined,
                    contentModelId: undefined,
                    contentId: undefined,
                    status: undefined,
                    contentModelTemplateId: undefined,
                    url: undefined,
                    author: undefined,
                    editor: undefined,
                    source: undefined,
                    thumbnail: undefined,
                    title: undefined,
                    flagSearch: undefined,
                    sortNo: undefined,
                    flagTop: undefined,
                    views: undefined,
                    flagExternal: undefined,
                    workflowKey: undefined
                }
            },
            resetTemplateDialogAndList(){
                this.closeTemplateDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeTemplateDialog() {
                this.dialogVisible = false;
                this.resetTemplate();
                this.$refs['templateDialogForm'].resetFields();
            },
            handleModelChange() {
                // 获取内容对象
                this.getContentForm()
            },
            getContentForm() {
                for (let model of this.modelList) {
                    if (this.template.contentModelId == model.id) {
                        // console.log(JSON.stringify(model))
                    }
                }

                // 获取数字字段，获取元数据集 TODO
                /*getByIdContentModel(this.dialogList.contentModelId).then(response => {
                    if (response.ok) {
                        this.contentFormData = response.data.metaDataCollection
                        for (let item of this.contentFormData.metaDataCollectionMetaDataDtoList) {
                            if (item.controlType === 'checkboxElement') {
                                let val = this.dialogList.content[item.fieldName]
                                this.$set(this.contentItemArray, item.fieldName, val ? val.split(',') : [])
                            }
                            if (item.controlType === 'richTextElement') {
                                this.$set(this.editorDefaultMsg, item.id, this.dialogList.content[item.fieldName])
                            }
                            if (item.dataSource === 'dataItem') {
                                // 数据源是数据字典，根据字典id查询字典项
                                findDictionaryItemTreeById(item.dictionaryId).then(response => {
                                    if (response.ok) {
                                        this.$set(this.contentItemOptions, item.id, eval(response.data))
                                    } else {
                                        this.$message.error('获取字典项失败')
                                    }
                                })
                            }
                            if (item.controlType === 'fileElement') {
                                // 根据上传文件记录id查找文件信息
                                let fileIds = this.dialogList.content[item.fieldName].split(',')
                                this.$set(this.uploadFileList, item.fieldName, [])
                                for (let id of fileIds) {
                                    getUploadFile(id).then(response => {
                                        if (response.ok) {
                                            this.uploadFileList[item.fieldName].push({
                                                id: response.data.id,
                                                name: response.data.name,
                                                url: response.data.url
                                            })
                                        }
                                    })
                                }
                            }
                        }
                    } else {
                        this.$message.error('获取内容表单结构失败')
                    }
                })*/
            },
            handleAvatarSuccess(res, file) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.template.thumbnail = res.data.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handleAvatarError() {
                this.$message.error('网络不稳定，上传失败！')
            },
            beforeAvatarUpload(file) {
                const isJPG = this.$store.state.common.imageAccepts.includes(file.type);
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片格式不正确!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            // 选择菜单触发
            handleCommand(command) {
                console.log(command)
                // 生成勾选的内容页
                if (command == 'handleCheckedStaticContent') {
                    this.handleCheckedStaticContent();
                }
                // 生成当前栏目的内容页
                if (command == 'handleCatalogStaticContent') {
                    this.handleCatalogStaticContent();
                }
                // 生成整个站点的内容页
                if (command == 'handleSiteStaticContent') {
                    this.handleSiteStaticContent();
                }
                // 生成勾选的索引页
                if (command == 'handleCheckedReindex') {
                    this.handleCheckedReindex();
                }
                // 生成当前栏目的索引
                if (command == 'handleCatalogReindex') {
                    this.handleCatalogReindex();
                }
                // 生成整个站点的索引
                if (command == 'handleSiteReindex') {
                    this.handleSiteReindex();
                }
            },
            // 批量生成勾选的内容页
            handleCheckedStaticContent() {
                if (!this.listQuery.siteId) {
                    this.$message.error('请先选择站点！')
                    return
                }
                let ids = []
                for (const row of this.selectedRows) {
                    ids.push(row.id)
                }
                if (ids.length === 0) {
                    this.$message.info('请先勾选数据')
                    return
                }
                let params = {
                    ids: ids.join(),
                    siteId: this.listQuery.siteId
                }
                genStaticPage(params).then(response => {
                    if (response.status == 200) {
                        this.$message.success('操作成功！')
                        this.reloadList()
                    } else {
                        this.$message.error('操作失败！')
                    }
                })
            },
            // 批量生成当前栏目的内容页
            handleCatalogStaticContent() {
                if (!this.listQuery.siteId) {
                    this.$message.error('请先选择站点！')
                    return
                }
                if (!this.listQuery.cmsCatalogId) {
                    this.$message.error('请先选择栏目！')
                    return
                }
                let params = {
                    cmsCatalogId: this.listQuery.cmsCatalogId,
                    siteId: this.listQuery.siteId
                }
                genStaticPage(params).then(response => {
                    if (response.status == 200) {
                        this.$message.success('操作成功！')
                        this.reloadList()
                    } else {
                        this.$message.error('操作失败！')
                    }
                })
            },
            // 批量生成整个站点的内容页
            handleSiteStaticContent() {
                if (!this.listQuery.siteId) {
                    this.$message.error('请先选择站点！')
                    return
                }
                genStaticPage({siteId: this.listQuery.siteId}).then(response => {
                    if (response.status == 200) {
                        this.$message.success('操作成功！')
                        this.reloadList()
                    } else {
                        this.$message.error('操作失败！')
                    }
                })
            },
            // 批量生成勾选的索引
            handleCheckedReindex() {
                if (!this.listQuery.siteId) {
                    this.$message.error('请先选择站点！')
                    return
                }
                let ids = []
                for (let row of this.selectedRows) {
                    ids.push(row.id)
                }
                if (ids.length === 0) {
                    this.$message.info('请先勾选数据')
                    return
                }
                let params = {
                    ids: ids.join(),
                    siteId: this.listQuery.siteId
                }
                reindex(params).then(response => {
                    if (response.status == 200) {
                        this.$message.success('生成中，请稍后查看！')
                        this.reloadList()
                    } else {
                        this.$message.error('生成失败！')
                    }
                })
            },
            // 批量生成当前栏目的索引
            handleCatalogReindex() {
                if (!this.listQuery.siteId) {
                    this.$message.error('请先选择站点！')
                    return
                }
                if (!this.listQuery.cmsCatalogId) {
                    this.$message.error('请先选择栏目！')
                    return
                }
                let params = {
                    cmsCatalogId: this.listQuery.cmsCatalogId,
                    siteId: this.listQuery.siteId
                }
                reindex(params).then(response => {
                    if (response.status == 200) {
                        this.$message.success('生成中，请稍后查看！')
                        this.reloadList()
                    } else {
                        this.$message.error('生成失败！')
                    }
                })
            },
            // 批量生成整个站点的索引
            handleSiteReindex() {
                if (!this.listQuery.siteId) {
                    this.$message.error('请先选择站点！')
                    return
                }
                reindex({siteId: this.listQuery.siteId}).then(response => {
                    if (response.status == 200) {
                        this.$message.success('生成中，请稍后查看！')
                        this.reloadList()
                    } else {
                        this.$message.error('生成失败！')
                    }
                })
            },
        }
    }
</script>
<style>
    /*标准管理树*/
    .standard-text{
        display: flex;
        justify-content: flex-start;
        overflow: auto;
        margin-top: 20px;
    }

    /*组织机构树*/
    /*树字体*/
    .el-tree {
        font-size: 14px;
        color: #535353;
    }
    /*树编辑弹框*/
    .tree-edit .el-textarea{
        width: 434px;
    }
    .left-tree
    {
        width: 210px;
        margin-right:10px;
        background:white;
        border:1px solid #EBEEF5;
        overflow-x: auto;
        overflow-y: auto;
    }
    .left-tree .el-tree {
        display: inline-block;
        margin: 10px ;
        min-width: 90%;
    }
    .left-tree::-webkit-scrollbar {/*滚动条整体样式*/
        width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 4px;
    }
    .left-tree::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #f0f7ff;
    }
    .left-tree::-webkit-scrollbar-track {/*滚动条里面轨道*/
        /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
        border-radius: 0;
        background: #fff;
    }
    /*设置根节点上编辑按钮*/
    .custom-tree-node {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    /*编辑按钮弹框*/
    /deep/ .el-dialog__body .el-input__inner{
        padding-right: 30px;
        -moz-user-select: text;
        -webkit-user-select: text;
        -ms-user-select: text;
    }
    /*表格样式根据elementUIIndex样式文件来设置*/
    /*树节点选中状态高亮色的设置*/
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #ebb563;
    }
    /deep/ .el-tree-node > .el-tree-node__children {
        overflow: visible !important;
    }
    .left-tree-title {
        color: #909399;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
        border-bottom: 1px solid #EBEEF5;
        padding: 14px 0px;
    }

    /*表格*/
    .table-list{
        width: 100% !important;
        margin-top: 0px !important;
    }

    /*缩略图*/
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>

