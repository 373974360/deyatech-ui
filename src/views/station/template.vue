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
                            <el-form label-position="right" inline v-if="scope.row.metadataCollectionVo.metadataList" class="table-expand">
                                <el-form-item v-for="item in scope.row.metadataCollectionVo.metadataList"
                                              v-if="item.tableHead" :key="item.id" :label="'[元数据名称]: ' + item.metadata.name">
                                    <span>[元数据值]: {{scope.row.content[item.fieldName]}}</span>
                                </el-form-item>
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
                            <el-form-item label="资源分类" prop="resourceCategory"> <!--TODO-->
                                <el-select v-model="template.resourceCategory" placeholder="请选择资源分类">
                                    <!--<el-option
                                        v-for="m in modelList"
                                        :key="m.id"
                                        :label="m.name"
                                        :value="m.id">
                                    </el-option>-->
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="作者姓名" prop="author">
                                <el-input v-model="template.author"></el-input>
                            </el-form-item>
                        </el-col>
                        <!--<el-col :span="12">
                            <el-form-item label="编辑姓名" prop="editor">
                                <el-input v-model="template.editor"></el-input>
                            </el-form-item>
                        </el-col>-->
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="摘要" prop="resourceSummary">
                                <el-input type="textarea" v-model="template.resourceSummary" :rows="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="内容" prop="resourceContent">
                                <el-input type="textarea" v-model="template.resourceContent" :rows="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="关键字" prop="keyword">
                                <el-tag
                                    :key="tag"
                                    v-for="tag in dynamicTags"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose(tag)">
                                    {{tag}}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="inputVisible"
                                    v-model="inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm"
                                    @blur="handleInputConfirm"
                                    placeholder="最多二十个字"
                                    maxlength="20"
                                >
                                </el-input>
                                <el-button :disabled="dynamicTags.length >= 5" class="button-new-tag" size="small" @click="showInput">+ 添加关键字(最多5个)</el-button>
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
                                <!--<el-upload class="avatar-uploader"
                                           :action="uploadUrlCms"
                                           :data="{'path': siteUploadPath}"
                                           :accept="$store.state.common.imageAccepts"
                                           :show-file-list="false"
                                           :on-success="handleAvatarSuccess"
                                           :on-error="handleAvatarError"
                                           :before-upload="beforeAvatarUpload">
                                    <img v-if="template.thumbnailUrl" :src="showPicImgUrl"
                                         class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>-->

                                <el-upload class="avatar-uploader"
                                           :class="{hide: template.thumbnailUrl}"
                                           :action="uploadUrlCms"
                                           :data="{'path': siteUploadPath}"
                                           :accept="$store.state.common.imageAccepts"
                                           :file-list="thumbnailList"
                                           list-type="picture-card"
                                           :on-success="handleAvatarSuccess"
                                           :on-error="handleAvatarError"
                                           :before-upload="beforeAvatarUpload"
                                           :on-preview="handlePictureCardPreview"
                                           :on-remove="handleAvatarRemove">
                                    <i class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisiblePicture" z-index="1000">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
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
                                <el-switch v-model="template.flagExternal" @change="isFlagExternal">
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
                    <el-form-item v-if="metadataCollection.metadataList"
                        class="el-form-item" v-for="(item, index) in metadataCollection.metadataList"
                                  :key="item.id" :label="item.metadata.name" label-width="80px"
                                  :prop="'content.' + item.fieldName"
                                  :rules="item | formItemRules">
<!--                        <template slot-scope>-->
                            <!-- 输入框 -->
                            <el-input v-if="item.controlType === 'inputElement'"
                                      v-model="template.content[item.fieldName]"></el-input>
                            <!-- 选择器 -->
                            <el-select v-if="item.controlType === 'selectElement'&& contentItemOptions[item.id]" v-model="template.content[item.fieldName]" placeholder="请选择">
                                <el-option v-for="opt in contentItemOptions[item.id]" :key="opt.id" :label="opt.codeText"
                                       :value="opt.id"></el-option>
                            </el-select>
                            <!-- 单选框 -->
                            <el-radio-group v-if="item.controlType === 'radioElement' && contentItemOptions[item.id]" v-model="template.content[item.fieldName]">
                                <el-radio v-for="opt in contentItemOptions[item.id]" :key="opt.id" :label="opt.id">
                                    {{opt.codeText}}
                                </el-radio>
                            </el-radio-group>
                            <!-- 多选框 -->
                            <el-checkbox-group v-if="item.controlType === 'checkboxElement' && contentItemOptions[item.id]" v-model="contentItemArray[item.fieldName]">
                                <el-checkbox v-for="opt in contentItemOptions[item.id]" :key="opt.id" :label="opt.id">
                                    {{opt.codeText}}
                                </el-checkbox>
                            </el-checkbox-group>
                            <!-- 文本域 -->
                            <el-input type="textarea" v-if="item.controlType === 'textareaElement'"
                                      v-model="template.content[item.fieldName]"></el-input>
                            <!-- 富文本 -->
                            <editor v-if="item.controlType === 'richTextElement'" :ref="item.id" :id="'editor' + index"
                                    :default-msg="editorDefaultMsg[item.id]" :config="editorConfig"></editor>
                            <!-- 时间类型 -->
                            <template v-if="item.metadata.dataType === 'date'">
                                <el-time-picker v-if="item.controlType === 'timeElement'" v-model="template.content[item.fieldName]"
                                                value-format="HH:mm:ss" placeholder="请选择时间"></el-time-picker>
                                <el-date-picker v-else-if="item.controlType === 'datetimeElement'"
                                                v-model="template.content[item.fieldName]"
                                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间"></el-date-picker>
                                <el-date-picker v-else v-model="template.content[item.fieldName]" type="date" value-format="yyyy-MM-dd"
                                                placeholder="请选择日期"></el-date-picker>
                            </template>

                            <el-upload v-if="item.controlType === 'fileElement'"
                                       :action="uploadUrlCms"
                                       :data="{'path': siteUploadPath}"
                                       multiple
                                       :file-list="uploadFileReader"
                                       :before-upload="beforeUpload"
                                       :on-success="handleSuccess"
                                       :on-preview="handlePreview"
                                       :on-remove="handleRemove"
                                       :before-remove="pickUploader(item.fieldName)">
                                <el-button size="small" type="primary" @click="pickUploader(item.fieldName)">点击上传</el-button>
                            </el-upload>
<!--                        </template>-->
                    </el-form-item>

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
    import editor from '@/components/editor/index.vue'
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getTemplateList,
        createOrUpdateTemplate,
        delTemplates,
        checkTitleExist,
        genStaticPage,
        reindex,
        getSiteUploadPath,
        getUploadFile
    } from '@/api/station/template';
    import {
        getCatalogTree
    } from '@/api/station/catalog';
    import {
        getAllModelBySiteId
    } from '@/api/station/model';
    import {validateURL} from '@/util/validate';
    import {findMetadataCollectionAllData} from '@/api/metadata/collection';
    import {getDictionaryList} from '@/api/admin/dictionary';

    export default {
        name: 'template',
        components: {
            editor
        },
        data() {
            const validateTitle = (rule, value, callback) => {
                const query = {
                    title: value,
                    siteId: this.template.siteId,
                    cmsCatalogId: this.template.cmsCatalogId,
                    id: this.template.id,
                }
                checkTitleExist(query).then(response => {
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
                    thumbnailUrl: undefined,
                    title: undefined,
                    flagSearch: undefined,
                    sortNo: undefined,
                    flagTop: undefined,
                    views: undefined,
                    flagExternal: undefined,
                    resourceSummary: undefined,
                    resourceContent: undefined,
                    resourceCategory: undefined,
                    keyword: undefined,
                    workflowKey: undefined,
                    contentModelName: undefined,
                    contentMapStr: undefined,
                    content: {},
                    metaDataCollectionId: undefined
                },
                contentItemArray: {},
                editorDefaultMsg: {},
                contentItemOptions: {},
                uploadFileList: {},
                uploadFileReader: [],
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
                    ],
                    resourceSummary: [
                        {max: 500, message: '长度最多 500 个字符', trigger: 'blur'}
                    ],
                    resourceContent: [
                        {max: 500, message: '长度最多 500 个字符', trigger: 'blur'}
                    ],
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
                workflowKey: undefined,
                metadataCollection: {
                    metadataList: []
                },
                editorConfig: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 350,
                    zIndex: 3000
                },
                currentUploaderKey: undefined,
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
                uploadUrlCms: '/manage/station/material/uploadFile',
                siteUploadPath: '',
                thumbnailList: [],
                dialogImageUrl: undefined,
                dialogVisiblePicture: undefined,
            }
        },
        watch: {
            // 弹窗元数据相关部分 TODO
            contentItemArray: {
                handler(val) {
                    // console.log(JSON.stringify(val))
                    for (let item in val) {
                        this.template.content[item] = val[item].join()
                    }
                },
                deep: true
            },
        },
        filters: {
            // 弹窗元数据相关部分 TODO
            formItemRules(item) {
                let rules = []
                if (item.metadata.required) {
                    rules.push({required: true, message: '不能为空', trigger: 'blur'})
                }
                if (item.metadata.dataLength) {
                    rules.push({
                        max: parseInt(item.metadata.dataLength),
                        message: '不能超过' + item.metadata.dataLength + '个字符',
                        trigger: 'blur'
                    })
                }
                // console.log(`rules[${item.fieldName}]`, rules)
                return rules
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
                    create: this.permission.template_create,
                    update: this.permission.template_update,
                    delete: this.permission.template_delete
                };
            },
            // 特殊字符转义
            /*showPicImgUrl() {
                return this.$store.state.common.showPicImgUrl + this.template.thumbnailUrl + '&basePath=' + this.siteUploadPath.replace(/\\/g, '/')
            }*/
        },
        updated() {
            this.changeHeight()
        },
        created(){
            console.log("siteId: " + this.$store.state.common.siteId);
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                // 获取栏目
                this.getCatalogTree();
                // 获取站点关联的内容模型
                this.getAllModelBySiteId();
                // 获取站点上传路径
                this.getSiteUploadPath();
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
                // 设置内容工作流id
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
            getSiteUploadPath() {
                getSiteUploadPath(this.listQuery).then(response => {
                    if (response.status == 200) {
                        this.siteUploadPath = response.data
                    } else {
                        this.$message.warning('获取站点上传文件存放地址失败')
                    }
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
                    this.metadataCollection = row.metadataCollectionVo;
                    // this.template.content = row.content;
                } else {
                    this.template = deepClone(this.selectedRows[0]);
                    this.metadataCollection = this.selectedRows[0].metadataCollectionVo;
                    // this.template.content = row.content;
                }
                if (this.template.thumbnailUrl) {
                    this.thumbnailList.push({
                        id: this.template.thumbnail,
                        url: this.$store.state.common.showPicImgUrl + this.template.thumbnailUrl + '&basePath=' + this.siteUploadPath.replace(/\\/g, '/')
                    })
                }
                this.dynamicTags = this.template.keyword ? this.template.keyword.split(',') : [];
                this.template.workflowKey = this.workflowKey;
                this.dialogTitle = 'update';
                this.dialogVisible = true;
                this.getContentForm();
            },
            btnDelete(row){
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push({
                            id: row.id,
                            metaDataCollectionId: row.metaDataCollectionId,
                            contentId: row.content.id_
                        });
                        // console.log("ids: " + JSON.stringify(ids))
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows){
                            ids.push({
                                id: deleteRow.id,
                                metaDataCollectionId: deleteRow.metaDataCollectionId,
                                contentId: deleteRow.content.id_
                            });
                        }
                        // console.log("ids: " + JSON.stringify(ids))
                        this.doDelete(ids);
                    })
                }
            },
            doCreate(){

                // 元数据相关 TODO
                // 富文本
                for (let item of this.metadataCollection.metadataList) {
                    if (item.controlType === 'richTextElement') {
                        this.$set(this.template.content, item.fieldName, this.$refs[item.id][0].getUeContent())
                    }
                }
                // 文件上传
                for (let item in this.uploadFileList) {
                    let ids = []
                    for (let file of this.uploadFileList[item]) {
                        ids.push(file.id)
                    }
                    this.template.content[item] = ids.join()
                }

                this.$refs['templateDialogForm'].validate(valid => {
                    if(valid) {
                        // 元数据信息字符串
                        this.template.contentMapStr = JSON.stringify(this.template.content);

                        if (!this.template.flagSearch) {
                            this.template.flagSearch = false;
                        }
                        if (!this.template.flagTop) {
                            this.template.flagTop = false;
                        }
                        if (!this.template.flagExternal) {
                            this.template.flagExternal = false;
                        }

                        // 关键字标签
                        this.template.keyword = this.dynamicTags.join();

                        console.log("template: " + JSON.stringify(this.template))
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
                // 元数据相关 TODO
                // 富文本
                for (let item of this.metadataCollection.metadataList) {
                    if (item.controlType === 'richTextElement') {
                        this.$set(this.template.content, item.fieldName, this.$refs[item.id][0].getUeContent())
                    }
                }
                // 文件上传
                for (let item in this.uploadFileList) {
                    let ids = []
                    for (let file of this.uploadFileList[item]) {
                        ids.push(file.id)
                    }
                    this.template.content[item] = ids.join()
                }

                this.$refs['templateDialogForm'].validate(valid => {
                    if(valid) {
                        // 元数据信息字符串
                        this.template.contentMapStr = JSON.stringify(this.template.content);

                        // 删除查询出来的元数据信息
                        // Vue.delete(this.template, 'content');
                        Vue.delete(this.template, 'metadataCollectionVo');

                        // 关键字标签
                        this.template.keyword = this.dynamicTags.join();

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
                delTemplates(JSON.stringify(ids)).then(() => {
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
                    thumbnailUrl: undefined,
                    title: undefined,
                    flagSearch: undefined,
                    sortNo: undefined,
                    flagTop: undefined,
                    views: undefined,
                    flagExternal: undefined,
                    resourceSummary: undefined,
                    resourceContent: undefined,
                    resourceCategory: undefined,
                    keyword: undefined,
                    workflowKey: undefined,
                    contentModelName: undefined,
                    contentMapStr: undefined,
                    content: {},
                    metaDataCollectionId: undefined
                }
            },
            resetTemplateDialogAndList(){
                this.closeTemplateDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeTemplateDialog() {
                this.dialogVisible = false;
                this.metadataCollection = {};
                this.editorDefaultMsg = {};
                this.contentItemOptions = {};
                this.contentItemArray = {};
                this.uploadFileList = {};
                this.uploadFileReader = [];
                this.currentUploaderKey = undefined;
                this.dynamicTags = [];
                this.thumbnailList = [];
                this.resetTemplate();
                // 清除富文本缓存，否则二次以后加载失败
                $('#ueditor_textarea_editorValue').remove()
                this.$refs['templateDialogForm'].resetFields();
            },
            handleModelChange() {
                // 清除已经填值的其他元数据集的元数据信息
                this.template.content = {};
                // 清除富文本缓存，否则切换内容模型会出现多余的富文本框
                $('#ueditor_textarea_editorValue').remove()
                this.getContentForm();
            },
            // 获取内容对象 TODO
            getContentForm() {
                for (let model of this.modelList) {
                    if (this.template.contentModelId == model.id) {
                        // console.log(JSON.stringify(model))
                        // 设置内容模型名称
                        this.template.contentModelName = model.name;
                        // 设置元数据id
                        this.template.metaDataCollectionId = model.metaDataCollectionId;

                        // 新增，元数据集为空，获取元数据集
                        if (this.dialogTitle == 'create') {
                            // 获取数字字段，获取元数据集 TODO
                            const query = {id: model.metaDataCollectionId}
                            findMetadataCollectionAllData(query).then(response => {
                                if (response.status == 200 && response.data.length > 0) {
                                    this.metadataCollection = response.data[0];
                                    this.setMetadataAndDictionary();
                                } else {
                                    this.$message.error('获取内容表单结构失败')
                                }
                            })
                        } else {
                            this.setMetadataAndDictionary();
                        }
                    }
                }
            },
            // 设置元数据值及字典选项
            setMetadataAndDictionary() {
                // console.log('content', this.template.content)
                for (let item of this.metadataCollection.metadataList) {
                    // 初始化，必须!
                    if (item.controlType === 'checkboxElement') {
                        this.$set(this.contentItemArray, item.fieldName, [])
                    }

                    // 元数据值
                    let val = this.template.content[item.fieldName];
                    if (val) {
                        // 输入框元素, 设置值, 否则校验会出错
                        if (item.controlType === 'inputElement') {
                            this.template.content[item.fieldName] = val.toString();
                        }
                        // 多选框元素
                        if (item.controlType === 'checkboxElement') {
                            this.$set(this.contentItemArray, item.fieldName, val.split(','))
                        }
                        // 富文本元素
                        if (item.controlType === 'richTextElement') {
                            this.$set(this.editorDefaultMsg, item.id, val)
                        }
                        // 上传文件
                        if (item.controlType === 'fileElement') {
                            // 根据上传文件记录id查找文件信息
                            let fileIds = this.template.content[item.fieldName].split(',')
                            this.$set(this.uploadFileList, item.fieldName, [])
                            for (let id of fileIds) {
                                getUploadFile(id).then(response => {
                                    if (response.status == 200) {
                                        let uploadFile = {
                                            id: response.data.id,
                                            name: response.data.name,
                                            url: response.data.url
                                        }
                                        // 读写分离 ，否则上传列表会出错
                                        this.uploadFileReader.push(uploadFile);
                                        this.uploadFileList[item.fieldName].push(uploadFile)
                                    }
                                })
                            }
                        }
                    }
                    // 数据源是数据字典
                    if (item.dataSource === 'dataItem') {
                        // 根据字典id查询字典项
                        getDictionaryList({indexId: item.dictionaryId}).then(response => {
                            if (response.status == 200) {
                                this.$set(this.contentItemOptions, item.id, eval(response.data))
                            } else {
                                this.$message.error('获取字典项失败')
                            }
                        })
                    }
                }
            },
            handleAvatarSuccess(res, file) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    // this.template.thumbnail = res.data.url;
                    this.$set(this.template, 'thumbnail', res.data.customData.id)
                    this.$set(this.template, 'thumbnailUrl', res.data.customData.url)
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
                    this.$message.error('上传图片格式不正确!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisiblePicture = true;
            },
            handleAvatarRemove() {
                this.template.thumbnail = '';
                this.template.thumbnailUrl = '';
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
                // 校验
                const titles = [];
                for (let t of this.templateList) {
                    for (let id of ids) {
                        if (id == t.id && !t.flagSearch) {
                            titles.push(t.title);
                        }
                    }
                }
                if (titles.length > 0) {
                    this.$message.error('不被允许搜索到的内容不可以生成索引！内容标题：' + titles.join());
                    return;
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
                // 校验
                const titles = [];
                for (let t of this.templateList) {
                    if (this.listQuery.cmsCatalogId == t.cmsCatalogId && !t.flagSearch) {
                        titles.push(t.title);
                    }
                }
                if (titles.length > 0) {
                    this.$message.error('不被允许搜索到的内容不可以生成索引！内容标题：' + titles.join());
                    return;
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
                // 校验
                const titles = [];
                for (let t of this.templateList) {
                    if (!t.flagSearch) {
                        titles.push(t.title);
                    }
                }
                if (titles.length > 0) {
                    this.$message.error('不被允许搜索到的内容不可以生成索引！内容标题：' + titles.join());
                    return;
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
            isFlagExternal (value) {
                if (!value) {
                    if (this.template.url) {
                        this.template.url = undefined;
                    }
                }
            },
            beforeUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传文件大小不能超过 2MB!');
                }
                return isLt2M;
            },
            handleSuccess(res, file) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.$message.success('上传成功！');

                    let uploadFile = {
                        id: res.data.customData.id,
                        name: res.data.customData.name,
                        url: res.data.customData.url}

                    // 初始化uploadFileList
                    if (!this.uploadFileList[this.currentUploaderKey]) {
                        this.$set(this.uploadFileList, this.currentUploaderKey, [])
                    }
                    this.uploadFileList[this.currentUploaderKey].push(uploadFile)
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handlePreview(file) {
                console.log(file)
                // 下载文件
                // window.open(this.$store.state.common.downloadUrl + file.url + '&basePath=' + this.siteUploadPath.replace(/\\/g, '/'));
                window.location.href = this.$store.state.common.downloadUrl + file.url + '&basePath=' + this.siteUploadPath.replace(/\\/g, '/')
            },
            handleRemove(file, fileList) {
                for (let [index, item] of this.uploadFileList[this.currentUploaderKey].entries()) {
                    if (file.id === item.id) {
                        this.uploadFileList[this.currentUploaderKey].splice(index, 1)
                    }
                }
            },
            pickUploader(key) {
                // console.log('file-key: ', key)
                this.currentUploaderKey = key
            },
            // 动态添加关键字 start
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            // 动态添加关键字 end
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
        /*background-color: #ebb563;*/
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
        width: 178px;
        height: 178px;
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
    .avatar-uploader .el-upload-list__item {
        width: 178px;
        height: 178px;
    }
    .avatar-uploader .el-upload-list__item .el-upload-list__item-status-label {
        display: none;
    }
    .hide .el-upload--picture-card {
        display: none;
    }

    /*table-expand*/
    .table-expand {
        font-size: 0;
    }
    .table-expand label {
        width: 160px;
        color: #99a9bf;
    }
    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    /*关键字*/
    .el-tag {
        margin-right: 10px;
    }
    .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 320px;
        margin-right: 10px;
        vertical-align: bottom;
    }
</style>

