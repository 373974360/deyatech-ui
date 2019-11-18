<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="请输入关键字" v-model.trim="listQuery.title"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchReloadList">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-dropdown v-if="btnEnable.create && isAddTemplate" style="margin-right: 10px" placement="bottom-start" @command="btnCreate">
                        <el-button type="primary" :size="btnSize">
                            {{$t('table.create')}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <div v-if="modelList.length > 0">
                                <el-dropdown-item v-for="m in modelList" :command="m.id">请选择内容模型：{{m.name}}</el-dropdown-item>
                            </div>
                            <div v-else>
                                <el-dropdown-item>
                                    该站点未配置内容模型
                                </el-dropdown-item>
                            </div>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete && listQuery.status == ContentStatusEnum.RECYCLE" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">彻底删除</el-button>
                    <el-button v-if="btnEnable.delete && listQuery.status == ContentStatusEnum.PUBLISH" type="danger" :size="btnSize" @click="btnCancel" :disabled="selectedRows.length < 1">撤销</el-button>
                    <el-button v-if="btnEnable.delete && listQuery.status != ContentStatusEnum.RECYCLE" type="warning" :size="btnSize" @click="btnRecycle" :disabled="selectedRows.length < 1">删除</el-button>

                    <el-dropdown style="margin-left: 10px" placement="bottom" @command="handleCommand">
                        <el-button type="warning" :size="btnSize">
                            生成内容页或索引<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="handleCheckedStaticContent">生成勾选的内容页</el-dropdown-item>
                            <el-dropdown-item command="handleCatalogStaticContent">生成当前栏目内容页</el-dropdown-item>
                            <el-dropdown-item command="handleSiteStaticContent">生成站点所有内容页</el-dropdown-item>
                            <el-dropdown-item command="handleCheckedReindex" divided>生成勾选的索引</el-dropdown-item>
                            <el-dropdown-item command="handleCatalogReindex">生成当前栏目索引</el-dropdown-item>
                            <!--<el-dropdown-item command="handleSiteReindex">生成站点所有索引</el-dropdown-item>-->
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="deyatech-menu_right">
                    显示设置<el-button type="primary" :size="btnSize" icon="el-icon-setting" circle @click="displaySetting"></el-button>
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>

            <el-row :span="24">
                <el-col :span="4">
                    <div class="classificationTree">
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
                </el-col>
                <el-col :span="20">
                    <div class="my-tabls">
                        <!--需要string类型的数据-->
                        <el-tabs v-model.trim="listQuery.status" type="card" @tab-click="handleTabClick">
                            <el-tab-pane v-for="item in enums['ContentStatusEnum']" :label="item.value" :key="item.code" :name="item.code.toString()"></el-tab-pane>
                        </el-tabs>
                    </div>
                    <!-- 内容表格 -->
                    <el-table :data="templateList" v-loading.body="listLoading" stripe border highlight-current-row
                              @selection-change="handleSelectionChange" style="border-top:none;">
                        <el-table-column type="selection" width="50" align="center"/>

                        <el-table-column align="left"
                                         v-for="item in headData"
                                         :label="item.label"
                                         :prop="item.prop">
                            <template slot-scope="scope">
                                <span v-if="item.prop == 'title'" class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.title}}</span>
                                <el-input-number v-else-if="item.prop == 'sortNo'" v-model.trim="scope.row.sortNo" controls-position="right" :precision="0" :step="1" :min="1" :max="9999" size="small" style="width:100px;" @change="sortNoChange(scope.row)"></el-input-number>
                                <el-checkbox v-else-if="item.prop == 'flagTop'" v-model="scope.row.flagTop" @change="flagTopChange(scope.row)"/>
                                <span v-else>{{scope.row[item.prop]}}</span>
                            </template>
                        </el-table-column>


                        <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                            <template slot-scope="scope">
                                <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle @click.stop.safe="btnUpdate(scope.row)"></el-button>
                                <el-button v-if="btnEnable.delete && listQuery.status == ContentStatusEnum.RECYCLE" title="彻底删除" type="danger" icon="el-icon-delete" :size="btnSize" circle @click.stop.safe="btnDelete(scope.row)"></el-button>
                                <el-button v-if="btnEnable.delete && listQuery.status == ContentStatusEnum.PUBLISH" title="撤销" type="danger" icon="iconskip" :size="btnSize" circle @click.stop.safe="btnCancel(scope.row)"></el-button>
                                <el-button v-if="btnEnable.delete && listQuery.status != ContentStatusEnum.RECYCLE" title="删除" type="danger" icon="el-icon-delete" :size="btnSize" circle @click.stop.safe="btnRecycle(scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="deyatech-pagination pull-right" background
                                   :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                   :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                                   @size-change="handleSizeChange" @current-change="handleCurrentChange">
                    </el-pagination>
                </el-col>
            </el-row>

            <!-- 表单 -->
            <el-dialog width="70%" :title="titleMap[dialogTitle]" :visible.sync="dialogVisible" :close-on-click-modal="closeOnClickModal" @close="closeTemplateDialog">

                <el-steps :active="stepsActive" finish-status="success" simple style="margin-top: -25px; margin-bottom: 20px" v-if="formList.length > 1">
                    <el-step v-for="step in formList" :key="step.pageNumber" :title="step.pageName"></el-step>
                </el-steps>

                <el-form v-show="formIndex == stepsActive" v-for="(form, formIndex) in formList" :ref="'dynamicForm' + formIndex" :model="form.pageModel"  class="deyatech-form" label-position="right" label-width="120px">

                    <template v-for="(row, rowIndex) in form.rows">
                        <el-row :span="24">
                            <el-col :span="item.controlLength == 1 ? 12 : 24"
                                    v-for="(item, itemIndex) in row">
                                <el-form-item :label="item.name"
                                              :prop="item.briefName"
                                              :rules="(item.briefName === 'resource_content' && formList[flagExternalIndex].pageModel['flag_external'] == 0) ? templateRules.resource_content : loadRules(item)"
                                              :style="(item.briefName === 'resource_summary' || item.briefName === 'keyword_') ? 'margin-bottom: 0' : ''">

                                    <!-- 输入框 -->
                                    <el-input v-if="item.controlType === 'inputElement'"
                                              v-model.trim="form.pageModel[item.briefName]"
                                              :maxlength="item.dataLength"
                                              :placeholder="'请输入' + item.name"></el-input>

                                    <!-- 文本域 -->
                                    <el-input v-else-if="item.controlType === 'textareaElement'"
                                              type="textarea"
                                              v-model.trim="form.pageModel[item.briefName]"
                                              :maxlength="item.dataLength" :rows="3"
                                              :placeholder="'请输入' + item.name"></el-input>

                                    <!-- 下拉框 -->
                                    <el-select v-else-if="item.controlType === 'selectElement'" filterable
                                               v-model.trim="form.pageModel[item.briefName]"
                                               :placeholder="'请选择' + item.name" style="width: 100%;">
                                        <el-option
                                            v-for="s in form.pageList[item.briefName]"
                                            :key="s.id"
                                            :label="s.codeText"
                                            :value="s.id">
                                        </el-option>
                                    </el-select>

                                    <!-- 单选框 -->
                                    <el-radio-group v-else-if="item.controlType === 'radioElement'"
                                                    v-model.trim="form.pageModel[item.briefName]">
                                        <el-radio
                                            v-for="rd in form.pageList[item.briefName]"
                                            :key="rd.id"
                                            :label="rd.id">{{rd.codeText}}</el-radio>
                                    </el-radio-group>

                                    <!-- 复选框 -->
                                    <el-checkbox-group v-else-if="item.controlType === 'checkboxElement'"
                                                       v-model.trim="form.pageModel['checkbox_' + item.briefName]">
                                        <el-checkbox
                                            v-for="ckb in form.pageList[item.briefName]"
                                            :key="ckb.id"
                                            :label="ckb.id">{{ckb.codeText}}</el-checkbox>
                                    </el-checkbox-group>

                                    <!-- 开关 -->
                                    <el-switch v-else-if="item.controlType === 'switchElement'"
                                               v-model.trim="form.pageModel[item.briefName]"
                                               :active-value="1"
                                               :inactive-value="0"></el-switch>

                                    <!-- 标签
                                    <el-tag v-else-if="item.controlType === 'tagElement'"
                                            v-for="tag in loadTag(form.pageModel[item.briefName])"
                                            :key="tag">{{tag}}</el-tag>
                                    -->

                                    <!-- 附件 -->
                                    <el-upload v-else-if="item.controlType === 'fileElement'"
                                               :action="uploadUrlCms" multiple
                                               :data="{path: siteUploadPath, siteId: $store.state.common.siteId, attach: formIndex + ',' + item.briefName}"
                                               :file-list="uploadFileReader"
                                               :before-upload="beforeFileUpload"
                                               :on-success="handleFileSuccess"
                                               :on-preview="handleFilePreview"
                                               :on-remove="handleFileRemove">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                    </el-upload>

                                    <!-- 图片 -->
                                    <template v-else-if="item.controlType === 'imageElement'">
                                        <el-upload class="avatar-uploader"
                                                   :class="{hide: form.pageModel[item.briefName]}"
                                                   :action="uploadUrlCms"
                                                   :data="{path: siteUploadPath, siteId: template.siteId, attach: formIndex + ',' + item.briefName}"
                                                   :accept="$store.state.common.imageAccepts"
                                                   list-type="picture-card"
                                                   :on-success="handleImageSuccess"
                                                   :on-error="handleImageError"
                                                   :before-upload="beforeImageUpload"
                                                   :on-preview="handleImageCardPreview"
                                                   :on-remove="handleImageRemove">
                                            <i class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                        <el-dialog :visible.sync="dialogVisiblePicture" :append-to-body="true">
                                            <img width="100%" :src="dialogImageUrl" alt="">
                                        </el-dialog>
                                    </template>

                                    <!-- 日期 -->
                                    <el-date-picker v-else-if="item.controlType === 'dateElement'"
                                                    v-model.trim="form.pageModel[item.briefName]"
                                                    value-format="yyyy-MM-dd" type="date"
                                                    placeholder="请选择日期"></el-date-picker>

                                    <!-- 时间 -->
                                    <el-time-picker v-else-if="item.controlType === 'timeElement'"
                                                    v-model.trim="form.pageModel[item.briefName]"
                                                    value-format="HH:mm:ss"
                                                    placeholder="请选择时间"></el-time-picker>

                                    <!-- 时间戳 -->
                                    <el-date-picker v-else-if="item.controlType === 'datetimeElement'"
                                                    v-model.trim="form.pageModel[item.briefName]"
                                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                                    placeholder="请选择时间"></el-date-picker>

                                    <!-- 富文本 -->
                                    <editor v-else-if="item.controlType === 'richTextElement'"
                                            :config="editorConfig"
                                            :id="'editor' + item.briefName"
                                            :ref="'editor' + item.briefName"
                                            :attach="formIndex + ',' + item.briefName"
                                            :default-msg="form.pageModel[item.briefName]"
                                            @editorPlainTxtChange="editorPlainTxtChange"
                                            @editorContentChange="contentChange"></editor>

                                    <span v-else>{{item.controlType}}</span>

                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :span="24" v-if="isShowRow(row, 'flag_external') && form.pageModel['flag_external']">
                            <el-col :span="24">
                                <el-form-item label="URL" prop="url" :rules="form.pageModel['flag_external'] ? templateRules.url : []">
                                    <el-input v-model.trim="form.pageModel['url']"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :span="24" v-if="isShowRow(row, 'resource_summary')" style="margin: 0; padding: 0;">
                            <el-col :span="24">
                                <el-form-item style="margin-bottom: 0"><el-button @click="extractSummary" :size="btnSize">提取摘要</el-button></el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :span="24" v-if="isShowRow(row, 'keyword_')" style="margin: 0; padding: 0;">
                            <el-col :span="24">
                                <el-form-item style="margin-bottom: 0"><el-button @click="extractKeyword" :size="btnSize">提取关键字</el-button></el-form-item>
                            </el-col>
                        </el-row>

                    </template>

                </el-form>
                <span v-if="stepsActive == form.pageNumber - 1" v-for="form in formList" slot="footer" class="dialog-footer"><!--ycx-->
                    <el-button v-if="form.pageNumber > 1" type="primary" :size="btnSize"
                               @click="previousStep(form.pageNumber - 1)">上一步</el-button>

                    <template v-if="form.pageModel['flag_external']">
                        <el-button type="primary" :size="btnSize" :loading="submitLoading"
                                   @click="doCreate(false)" >{{$t('table.confirm')}}</el-button>

                        <el-button :size="btnSize" :loading="submitLoading"
                                   @click="doCreate(true)">草稿</el-button>
                    </template>

                    <template v-else>
                        <el-button v-if="form.pageNumber < maxPage" type="primary" :size="btnSize"
                                   @click="nextStep(form.pageNumber - 1)">下一步</el-button>

                        <el-button v-if="form.pageNumber == maxPage" type="primary" :size="btnSize" :loading="submitLoading"
                                   @click="doCreate(false)" >{{$t('table.confirm')}}</el-button>

                        <el-button v-if="form.pageNumber == maxPage" :size="btnSize" :loading="submitLoading"
                                   @click="doCreate(true)">草稿</el-button>
                    </template>


                    <el-button :size="btnSize" @click="closeTemplateDialog">{{$t('table.cancel')}}</el-button>
                </span>

            </el-dialog>



            <el-dialog title="显示设置" width="30%" :visible.sync="displaySettingVisible" :close-on-click-modal="closeOnClickModal" @close="closeDisplaySettingDialog">
                <el-table :data="headList" border>
                    <el-table-column prop="label" label="名称"></el-table-column>
                    <el-table-column label="显示" align="center" width="50">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.show"/>
                        </template>
                    </el-table-column>
                    <el-table-column label="排序" align="center" width="100">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-arrow-up" :size="btnSize" circle title="上移" @click="sortFunctionUp(headList, scope.$index)"></el-button>
                            <el-button icon="el-icon-arrow-down" :size="btnSize" circle title="下移" @click="sortFunctionDown(headList, scope.$index)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="btnFunctionSave" :size="btnSize">保存</el-button>
                    <el-button :size="btnSize" @click="closeDisplaySettingDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

        </div>
    </basic-container>
</template>


<script>
    import editor from '@/components/editor/index.vue'
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {getStore} from '@/util/store'
    import {
        getTemplateList,
        createOrUpdateTemplate,
        delTemplates,
        recycleByIds, // 删除
        cancelByIds,  // 撤销
        updateSortNoById,
        updateFlagTopById,
        checkTitleExist,
        genStaticPage,
        reindex,
        keyword,
        summary,
        getDynamicForm,
        getBaseAndMetaField
    } from '@/api/station/template';
    import {
        getSiteUploadPath,
        getMaterial
    } from "../../api/station/material";
    import {
        getUserCatalogTree
    } from '@/api/station/catalog';
    import {
        getAllModelBySiteId,
        getModelByCatalogId
    } from '@/api/station/model';
    import {validateURL,validateEmail, isEnglish} from '@/util/validate';
    import {findMetadataCollectionAllData} from '@/api/metadata/collection';
    import {getDictionaryList} from '@/api/admin/dictionary';
    import {getTableHeadContentData, getCustomizationFunctionContent, saveOrUpdate} from '@/api/assembly/customizationFunction'

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
            const checkSortNo = (rule, value, callback) => {
                //除了数字
                if (/[^\d]/g.test(value)) {
                    callback(new Error('请输入正整数'));
                } else {
                    callback();
                }
            };
            const checkDefault = (rule, value, callback) => {
                callback();
            };
            return {
                headData: [],
                ContentStatusEnum:{
                    PUBLISH: undefined, // 已发布
                    VERIFY: undefined,  // 待审
                    CANCEL: undefined,  // 撤销
                    REJECT: undefined,  // 退稿
                    DRAFT: undefined,   // 草稿
                    RECYCLE: undefined  // 删除
                },
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
                    status: undefined // 已发布
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
                    url: [
                        {required: true, message: this.$t("table.pleaseInput") + 'URL'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'},
                        {validator: validateUrl, trigger: ['change', 'blur']}
                    ],
                    resource_content: [
                        {required: true, message: this.$t("table.pleaseInput") + '正文'}
                    ]
                    /*siteId: [
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

                    author: [
                        {required: true, message: this.$t("table.pleaseInput") + '作者姓名'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    editor: [
                        {required: true, message: this.$t("table.pleaseInput") + '编辑姓名'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    source: [
                        {required: true, message: this.$t("table.pleaseInput") + '来源'},
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
                        {required: true, message: this.$t("table.pleaseInput") + '权重'},
                        {validator: checkSortNo, trigger: ['blur','change']}
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
                    */
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
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
                uploadUrlCms: '/manage/station/material/uploadFile',
                siteUploadPath: '',
                thumbnailList: [],
                dialogImageUrl: undefined,
                dialogVisiblePicture: undefined,
                stepsActive: 0,
                resourceCategoryList: [],
                isAddTemplate: false,

                // 动态表单
                formList: [],
                formImageTemp:[],
                formFileTemp:[],
                maxPage: 0,
                flagExternalIndex: 0,
                baseFields: [],
                metaFields: [],

                // 显示设置
                displaySettingVisible: false,
                customizationFunction: undefined,
                headList: [],
            }
        },
        watch: {
            // 弹窗元数据相关部分 TODO
            contentItemArray: {
                handler(val) {
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

        },
        created(){
            // 动态表头
            this.loadHeadData();
            // 数据状态
            const array = getStore({name: 'enums'})['ContentStatusEnum'];
            for (let cs of array) {
                if (cs.var === 'PUBLISH') { // 已发布
                    this.ContentStatusEnum.PUBLISH = cs.code.toString();
                    this.listQuery.status = cs.code.toString();
                } else if (cs.var === 'VERIFY') { // 待审
                    this.ContentStatusEnum.VERIFY = cs.code.toString();
                } else if (cs.var === 'CANCEL') { // 撤销
                    this.ContentStatusEnum.CANCEL = cs.code.toString();
                } else if (cs.var === 'REJECT') { // 退稿
                    this.ContentStatusEnum.REJECT = cs.code.toString();
                } else if (cs.var === 'DRAFT') { // 草稿
                    this.ContentStatusEnum.DRAFT = cs.code.toString();
                } else if (cs.var === 'RECYCLE') { // 删除
                    this.ContentStatusEnum.RECYCLE = cs.code.toString();
                }
            }

            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                // 获取栏目
                this.getCatalogTree();
                // 获取站点关联的内容模型
                this.getAllModelBySiteId();
                // 获取站点上传路径
                this.getSiteUploadPath();
            }
        },
        methods: {//ycx
            // 加载图片地址
            loadImageSrc(url) {
                return "/manage/station/material/showPicImg?filePath=" + url + '&basePath=' + this.siteUploadPath.replace(/\\/g, '/')
            },
            // 加载标签数组
            loadTag(value) {
                if (value)
                    return value.split(',');
                else
                    return [];
            },
            // 加载规则
            loadRules(item) {
              let rules = [];
              if (item.required && item.required == true) {
                  let rule = {};
                  rule.required = true;
                  let please = "";
                  if (item.controlType === "inputElement" || item.controlType === "textareaElement" || item.controlType === "richTextElement") {
                      please = "请输入";
                  } else {
                      please = "请选择";
                  }
                  rule.message = please + item.name;
                  rules.push(rule);
              }
              if (item.checkModel) {
                  let rule = {};
                  rule.trigger = ['blur','change'];
                  if (item.checkModel === 'positiveInteger') {
                      rule.validator = (rule, value, callback) => {
                          if (!value) {
                              callback()
                          }
                          //除了数字
                          if (/[^\d]/g.test(value)) {
                              callback(new Error('请输入正整数'));
                          } else {
                              callback();
                          }
                      };
                  } else if (item.checkModel === 'mail') {
                      rule.validator = (rule, value, callback) => {
                          if (!value) {
                              callback()
                          }
                          if (validateEmail(value)) {
                              callback();
                          } else {
                              callback(new Error("请输入正确的邮箱地址"))
                          }
                      }
                  } else if (item.checkModel === 'int') {
                      rule.validator = (rule, value, callback) => {
                          if (!value) {
                              callback()
                          }
                          if (/^(\+|\-)?\d+$/.test(value)) {
                              callback();
                          } else {
                              callback(new Error('请输入整数'));
                          }
                      };
                  } else if (item.checkModel === 'english') {
                      rule.validator = (rule, value, callback) => {
                          if (!value) {
                              callback()
                          }
                          if (isEnglish(value)) {
                              callback();
                          } else {
                              callback(new Error('请输入英文字母'));
                          }
                      };
                  } else if (item.checkModel === 'float') {
                      rule.validator = (rule, value, callback) => {
                          if (!value) {
                              callback()
                          }
                          if (/^(\-|\+)?\d+(\.\d+)?$/.test(value)) {
                              callback();
                          } else {
                              callback(new Error('请输入浮点数'));
                          }
                      }
                  } else if (item.checkModel === 'chinese') {
                      rule.validator = (rule, value, callback) => {
                          if (!value) {
                              callback()
                          }
                          if (/^[\u4e00-\u9fa5]+$/.test(value)) {
                              callback();
                          } else {
                              callback(new Error('请输入中文'));
                          }
                      }
                  } else if (item.checkModel === 'url') {
                      rule.validator = (rule, value, callback) => {
                          if (!value) {
                              callback()
                          }
                          if (validateURL(value)) {
                              callback();
                          } else {
                              callback(new Error('URL格式错误'))
                          }
                      }
                  } else {
                      rule.validator = (rule, value, callback) => callback();
                  }
                  rules.push(rule);
              }
              return rules;
            },
            // 加载动态表头
            loadHeadData() {
                getTableHeadContentData().then(response=>{
                    this.headData = response.data;
                });
            },
            getCatalogTree(){
                this.listLoading = true;
                getUserCatalogTree({siteId: this.$store.state.common.siteId}).then(response => {
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
                console.dir(data);
                // 获取内容列表
                // 设置内容工作流id
                this.workflowKey = data.workflowKey;
                this.listQuery.cmsCatalogId = data.id;
                // 获取template
                this.reloadList();
                let children = data.children;
                if (!children) {
                    this.isAddTemplate = true;
                    this.getModelByCatalogId(data.id);
                } else {
                    this.isAddTemplate = false;
                }
            },
            handleTabClick() {
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
            getModelByCatalogId(catalogId) {
                this.listLoading = true;
                getModelByCatalogId({catalogId:catalogId}).then(response => {
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
                // this.total = undefined;
                getTemplateList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.templateList = response.data.records;
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
            },
            sortNoChange(row) {
                if (row) {
                    updateSortNoById({sortNo: row.sortNo, id: row.id}).then(response=>{
                        if (response.status == 200 && response.data) {
                            this.$message.success("权重修改成功")
                        } else {
                            this.$message.error("权重修改失败")
                        }
                    });
                }

            },
            flagTopChange(row) {
                if (row) {
                    updateFlagTopById({flagTop: row.flagTop, id: row.id}).then(response=>{
                        if (response.status == 200 && response.data) {
                            this.$message.success("置顶修改成功")
                        } else {
                            this.$message.error("置顶修改失败")
                        }
                    });
                }
            },
            // 加载动态表单
            loadForm(contentModelId, templateId) {
                getBaseAndMetaField({contentModelId: contentModelId}).then(response=>{
                    let data = response.data;
                    console.dir(data);
                    this.baseFields = data.baseFields;
                    this.metaFields = data.metaFields;
                    this.template.metaDataCollectionId = data.metaDataCollectionId;
                });

                getDynamicForm({contentModelId: contentModelId, templateId: templateId}).then(response=>{
                    this.formList = response.data;
                    console.dir(this.formList);
                    if (this.formList.length > 0) {
                        this.maxPage = this.formList.length;
                        for (let i = 0; i < this.formList.length; i++) {
                            let pageModel = this.formList[i].pageModel;
                            if (pageModel.hasOwnProperty("flag_external")) {
                                this.flagExternalIndex = i;
                                break;
                            }
                        }
                    } else {
                        this.maxPage = 0;
                        this.flagExternalIndex = 0;
                    }
                });
            },
            btnCreate(command){
                if (command) {
                    let catalogNode = this.$refs.catalogTree.getCurrentNode()
                    if (!catalogNode) {
                        this.$message.warning('请先选择栏目再执行此操作')
                        return
                    }
                    this.resetTemplate();
                    this.template.contentModelId = command;
                    this.template.siteId = this.listQuery.siteId;
                    this.template.cmsCatalogId = this.listQuery.cmsCatalogId;
                    this.template.workflowKey = this.workflowKey;
                    this.dialogTitle = 'create';
                    this.dialogVisible = true;
                    this.stepsActive = 0;
                    this.maxPage = 0;
                    this.formList = [];
                    this.formImageTemp = [];
                    this.formFileTemp = [];
                    this.loadForm(command, undefined);
                }

            },
            btnUpdate(row){
                this.resetTemplate();
                if (row.id) {
                    this.template = deepClone(row);
                } else {
                    this.template = deepClone(this.selectedRows[0]);
                }
                this.template.siteId = this.listQuery.siteId;
                this.template.cmsCatalogId = this.listQuery.cmsCatalogId;
                this.template.workflowKey = this.workflowKey;
                this.loadForm(this.template.contentModelId, this.template.id);
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnCancel(row){
                this.$confirm('此操作将撤销已发布信息, 是否继续？', this.$t("table.tip"), {type: 'error'}).then(() => {
                    let ids = [];
                    if (row.id) {
                        ids.push(row.id);
                    } else {
                        for(const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                    }
                    cancelByIds(ids).then((response)=>{
                        if (response.status == 200 && response.data) {
                            this.reloadList();
                            this.$message.success("撤销成功");
                        } else {
                            this.listLoading = false;
                            this.$message.error(response.message)
                        }
                    });
                });
            },
            // 删除
            btnRecycle(row){
                this.$confirm('此操作将删除该信息, 是否继续？', this.$t("table.tip"), {type: 'error'}).then(() => {
                    let ids = [];
                    if (row.id) {
                        ids.push(row.id);
                    } else {
                        for(const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                    }
                    recycleByIds(ids).then((response)=>{
                        if (response.status == 200 && response.data) {
                            this.reloadList();
                            this.$message.success("删除成功");
                        } else {
                            this.listLoading = false;
                            this.$message.error(response.message)
                        }
                    });
                });
            },
            // 彻底删除
            btnDelete(row){
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push({
                            id: row.id,
                            metaDataCollectionId: row.metaDataCollectionId,
                            contentId: row.content ? row.content.id_ : undefined,
                            contentModelId: row.contentModelId
                        });
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows){
                            ids.push({
                                id: deleteRow.id,
                                metaDataCollectionId: deleteRow.metaDataCollectionId,
                                contentId: deleteRow.content ? deleteRow.content.id_ : undefined,
                                contentModelId: deleteRow.contentModelId
                            });
                        }
                        this.doDelete(ids);
                    })
                }
            },
            // draftFlag草稿
            doCreate(draftFlag) {
                this.template.draftFlag = draftFlag;
                let _this = this;
                let formValidate = [];
                for (let form of this.formList) {
                    let formIndex = parseInt(form.pageNumber) - 1;
                    if (_this.$refs['dynamicForm' + formIndex]) {
                        formValidate.push(new Promise(function(resolve, reject) {
                            _this.$refs['dynamicForm' + formIndex][0].validate(valid => {
                                if(valid) {
                                    resolve();
                                }
                            });
                        }));
                    }
                }
                Promise.all(formValidate).then(function() {
                    let content = {};
                    for (let form of _this.formList) {
                        let pageModel = form.pageModel;
                        let checkboxFields = [];
                        let pageModelFields = Object.getOwnPropertyNames(pageModel);
                        for (let f of pageModelFields) {
                            if (f.startsWith('checkbox_')) {
                                checkboxFields.push(f.substring(f.indexOf('_') + 1));
                            }
                        }
                        // 基础字段
                        for (let base of _this.baseFields) {
                            let dest = base.replace(/_(\w)/g,function ($0,$1){return $1.toUpperCase();});
                            if (dest.endsWith('_')) {
                                dest = dest.substr(0, dest.length -1);
                            }
                            if (pageModel[base] || typeof(pageModel[base]) === 'number') {
                                _this.template[dest] = pageModel[base];
                            }
                        }
                        // 元数据字段
                        for (let meta of _this.metaFields) {
                            let isCheckbox = false;
                            for(let ckb of checkboxFields) {
                                if (ckb === meta) {
                                    isCheckbox = true;
                                    break;
                                }
                            }
                            if (isCheckbox) {
                                let arr = pageModel['checkbox_' + meta];
                                if (arr instanceof Array && arr.length > 0) {
                                    content[meta] = arr.join(',');
                                }
                            } else {
                                if (pageModel[meta] || typeof(pageModel[meta]) === 'number') {
                                    content[meta] = pageModel[meta];
                                }
                            }
                        }
                    }
                    if (draftFlag) {
                        _this.template.draftFlag = draftFlag;
                    }
                    _this.template.contentMapStr = JSON.stringify(content);
                    _this.template.metadataCollectionVo = undefined;
                    _this.template.content = undefined;

                    console.log("=== template ===");
                    console.dir(_this.template);
                    _this.submitLoading = true;
                    createOrUpdateTemplate(_this.template).then(() => {
                        _this.resetTemplateDialogAndList();
                        _this.$message.success(_this.$t("table.createSuccess"));
                    }, (error)=>{
                        _this.$message.error(error);
                    }).catch((err)=>{
                        _this.$message.error(err);
                    });
                });
            },
            doUpdate(draftFlag) {
                this.template.draftFlag = draftFlag;
                let _this = this;
                let formValidate = [];
                for (let form of this.formList) {
                    let formIndex = parseInt(form.pageNumber) - 1;
                    if (_this.$refs['dynamicForm' + formIndex]) {
                        formValidate.push(new Promise(function(resolve, reject) {
                            _this.$refs['dynamicForm' + formIndex][0].validate(valid => {
                                if(valid) {
                                    resolve();
                                }
                            });
                        }));
                    }
                }
                Promise.all(formValidate).then(function(){
                    let content = {};
                    for (let form of _this.formList) {
                        let pageModel = form.pageModel;
                        // 基础字段
                        for (let base of _this.baseFields) {
                            if (pageModel.hasOwnProperty(base)) {
                                let dest = base.replace(/_(\w)/g,function ($0,$1){return $1.toUpperCase();});
                                _this.template[dest] = pageModel[base];
                            }
                        }
                        // 元数据字段
                        for (let meta of _this.metaFields) {
                            if (pageModel.hasOwnProperty(meta) && pageModel[meta]) {
                                content[meta] = pageModel[meta];
                            }
                        }
                    }
                    if (draftFlag) {
                        _this.template.draftFlag = draftFlag;
                    }
                    _this.template.contentMapStr = JSON.stringify(content);
                    _this.submitLoading = true;
                    createOrUpdateTemplate(_this.template).then(() => {
                        _this.resetTemplateDialogAndList();
                        _this.$message.success(_this.$t("table.createSuccess"));
                    }, (error)=>{
                        _this.$message.error(error);
                    }).catch((err)=>{
                        _this.$message.error(err);
                    });
                });
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
                    content: {}
                }
            },
            resetTemplateDialogAndList(){
                this.closeTemplateDialog();
                this.submitLoading = false;
                this.stepsActive = 0;
                this.reloadList();
            },
            closeTemplateDialog() {
                this.dialogVisible = false;
                this.metadataCollection = {};
                this.metadataCollection.metadataList = [];
                this.editorDefaultMsg = {};
                this.contentItemOptions = {};
                this.contentItemArray = {};
                this.uploadFileList = {};
                this.uploadFileReader = [];
                this.dynamicTags = [];
                this.thumbnailList = [];
                this.stepsActive = 0;
                this.formList = [];
                this.formImageTemp =[];
                this.formFileTemp = [];
                this.resetTemplate();
                // this.$refs['templateDialogForm'].resetFields();
                // // 清空内容
                // if (this.$refs['resourceContent']) {
                //     this.$refs['resourceContent'].setUeContent('');
                // }
                // // 清除富文本缓存，否则二次以后加载失败
                // $('#ueditor_textarea_editorValue').remove()
                //
            },
            // getContentForm() {
            //     for (let model of this.modelList) {
            //         if (this.template.contentModelId == model.id) {
            //             // 设置内容模型名称
            //             this.template.contentModelName = model.name;
            //             // 设置元数据id
            //             this.template.metaDataCollectionId = model.metaDataCollectionId;
            //
            //             // 新增，元数据集为空，获取元数据集
            //             if (this.dialogTitle == 'create') {
            //                 // 获取数字字段，获取元数据集 TODO
            //                 const query = {id: model.metaDataCollectionId}
            //                 findMetadataCollectionAllData(query).then(response => {
            //                     if (response.status == 200 && response.data.length > 0) {
            //                         this.metadataCollection = response.data[0];
            //                         this.setMetadataAndDictionary();
            //                     } else {
            //                         this.$message.error('获取内容表单结构失败')
            //                     }
            //                 })
            //             } else {
            //                 this.setMetadataAndDictionary();
            //             }
            //         }
            //     }
            // },
            // 设置元数据值及字典选项
            // setMetadataAndDictionary() {
            //     for (let item of this.metadataCollection.metadataList) {
            //         // 初始化，必须!
            //         if (item.controlType === 'checkboxElement') {
            //             this.$set(this.contentItemArray, item.fieldName, [])
            //         }
            //
            //         // 元数据值
            //         let val = this.template.content[item.fieldName];
            //         if (val) {
            //             // 输入框元素, 设置值, 否则校验会出错
            //             if (item.controlType === 'inputElement') {
            //                 this.template.content[item.fieldName] = val.toString();
            //             }
            //             // 多选框元素
            //             if (item.controlType === 'checkboxElement') {
            //                 this.$set(this.contentItemArray, item.fieldName, val.split(','))
            //             }
            //             // 富文本元素
            //             if (item.controlType === 'richTextElement') {
            //                 this.$set(this.editorDefaultMsg, item.id, val)
            //             }
            //             // 上传文件
            //             if (item.controlType === 'fileElement') {
            //                 // 根据上传文件记录id查找文件信息
            //                 let fileIds = this.template.content[item.fieldName].split(',')
            //                 this.$set(this.uploadFileList, item.fieldName, [])
            //                 for (let id of fileIds) {
            //                     getMaterial(id).then(response => {
            //                         if (response.status == 200) {
            //                             let uploadFile = {
            //                                 id: response.data.id,
            //                                 name: response.data.name,
            //                                 url: response.data.url
            //                             }
            //                             // 读写分离 ，否则上传列表会出错
            //                             this.uploadFileReader.push(uploadFile);
            //                             this.uploadFileList[item.fieldName].push(uploadFile)
            //                         }
            //                     })
            //                 }
            //             }
            //         }
            //
            //         // 数据源是数据字典
            //         if (item.dataSource === 'dataItem') {
            //             // 根据字典id查询字典项
            //             getDictionaryList({indexId: item.dictionaryId}).then(response => {
            //                 if (response.status == 200) {
            //                     this.$set(this.contentItemOptions, item.id, eval(response.data))
            //                 } else {
            //                     this.$message.error('获取字典项失败')
            //                 }
            //             })
            //         }
            //     }
            // },
            // 选择菜单触发
            handleCommand(command) {
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
                /*if (command == 'handleSiteReindex') {
                    this.handleSiteReindex();
                }*/
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
            /*handleSiteReindex() {
                if (!this.listQuery.siteId) {
                    this.$message.error('请先选择站点！')
                    return
                }
                // 校验
                /!*const titles = [];
                for (let t of this.templateList) {
                    if (!t.flagSearch) {
                        titles.push(t.title);
                    }
                }
                if (titles.length > 0) {
                    this.$message.error('不被允许搜索到的内容不可以生成索引！内容标题：' + titles.join());
                    return;
                }*!/
                reindex({siteId: this.listQuery.siteId}).then(response => {
                    if (response.status == 200) {
                        this.$message.success('生成中，请稍后查看！')
                        this.reloadList()
                    } else {
                        this.$message.error('生成失败！')
                    }
                })
            },*/
            isFlagExternal (value) {
                // if (!value) {
                if (this.template.url) {
                    this.template.url = undefined;
                }
                // }
            },

            // 图片处理
            handleImageSuccess(response, file, fileList) {
                if (response.status === 200 && response.data.state === 'SUCCESS') {
                    let data = response.data;
                    let attach = data.attach.split(',');
                    let formIndex = attach[0];
                    let briefName = attach[1];
                    this.formList[formIndex].pageModel[briefName] = data.url;

                    // 丢弃原来的
                    let tmp = [];
                    for (let i = 0; i < this.formImageTemp.length; i++) {
                        let item = this.formImageTemp[i];
                        if (item.briefName != briefName) {
                            tmp.push(item)
                        }
                    }
                    this.formImageTemp = tmp;
                    // 存入新的
                    this.formImageTemp.push({
                        uid: file.uid,
                        briefName: briefName,
                        formIndex: formIndex
                    });
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handleImageError(err, file, fileList) {
                this.$message.error('网络不稳定，上传失败！')
            },
            beforeImageUpload(file) {
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
            handleImageCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisiblePicture = true;
            },
            handleImageRemove(file, fileList) {
                let target = undefined;
                // 丢弃原来的
                let tmp = [];
                for (let i = 0; i < this.formImageTemp.length; i++) {
                    let item = this.formImageTemp[i];
                    if (item.uid == file.uid) {
                        target = item;
                    } else {
                        tmp.push(item)
                    }
                }
                this.formImageTemp = tmp;
                if (target) {
                    this.formList[target.formIndex].pageModel[target.briefName] = undefined;
                }
            },

            // 文件处理
            getFileListUrl(fileList) {
                let tmp = [];
                for (let fl of fileList) {
                    let res = fl.response;
                    if (res.status == 200) {
                        tmp.push(res.data.url);
                    }
                }
                if (tmp.length > 0) {
                    return tmp.join(',');
                } else {
                    return undefined;
                }
            },
            beforeFileUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传文件大小不能超过 2MB!');
                }
                return isLt2M;
            },
            handleFileSuccess(response, file, fileList) {
                if (response.status === 200 && response.data.state === 'SUCCESS') {
                    let data = response.data;
                    let attach = data.attach.split(',');
                    let formIndex = attach[0];
                    let briefName = attach[1];
                    this.formList[formIndex].pageModel[briefName] = this.getFileListUrl(fileList);
                    // 存入新的
                    this.formFileTemp.push({
                        uid: file.uid,
                        briefName: briefName,
                        formIndex: formIndex
                    });
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handleFilePreview(file) {
                // 下载文件
                window.location.href = this.$store.state.common.downloadUrl + file.response.data.url + '&basePath=' + this.siteUploadPath.replace(/\\/g, '/')
            },
            handleFileRemove(file, fileList) {
                let target = undefined;
                // 丢弃原来的
                let tmp = [];
                for (let i = 0; i < this.formFileTemp.length; i++) {
                    let item = this.formFileTemp[i];
                    if (item.uid == file.uid) {
                        target = item;
                    } else {
                        tmp.push(item)
                    }
                }
                this.formFileTemp = tmp;
                if (target) {
                    this.formList[target.formIndex].pageModel[target.briefName] = this.getFileListUrl(fileList);
                }
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
            previousStep(formIndex) {
                this.stepsActive--;
            },
            nextStep(formIndex) {
                this.$refs['dynamicForm' + formIndex][0].validate(valid => {
                    if(valid) {
                        this.stepsActive++;
                    } else {
                        return false;
                    }
                });
            },
            displaySetting() {
                this.headList = [];
                this.displaySettingVisible = true;
                getCustomizationFunctionContent().then(response=>{
                    this.customizationFunction = response.data;
                    this.headList = this.customizationFunction.headList;
                });
            },
            closeDisplaySettingDialog() {
                this.displaySettingVisible = false;
                this.customizationFunction = undefined;
                this.headList = [];
            },
            sortFunctionUp(headList, index) {
                if (index > 0) {
                    const row = headList.splice(index, 1)[0];
                    headList.splice(index - 1, 0, row);
                }
            },
            sortFunctionDown(headList, index) {
                if (index !== headList.length - 1) {
                    const row = headList.splice(index, 1)[0];
                    headList.splice(index + 1, 0, row);
                }
            },
            btnFunctionSave() {
                let data = JSON.stringify(this.headList);
                this.customizationFunction.headList = undefined;
                this.customizationFunction.data = data;
                saveOrUpdate(this.customizationFunction).then(response=>{
                    if (response.status == 200 && response.data) {
                        this.loadHeadData();
                        this.closeDisplaySettingDialog();
                        this.$message.success("保存成功");
                    } else {
                        this.$message.success("保存失败");
                    }
                });
            },
            isShowRow(row, field) {
                if (row && row.length > 0) {
                    for (let item of row) {
                        if (item.briefName === field) {
                            return true;
                        }
                    }
                }
                return false;
            },
            contentChange(content, attach) {
                let value = attach.split(',');
                let formIndex = parseInt(value[0]);
                let briefName = value[1];
                this.formList[formIndex].pageModel[briefName] = content;
            },
            editorPlainTxtChange(content, attach) {
                console.log(content);
                let value = attach.split(',');
                let formIndex = parseInt(value[0]);
                let briefName = value[1];
                this.formList[formIndex].pageModel[briefName + '_PlainTxt'] = content;
            },
            extractSummary() {
                let titleFormIndex = -1
                let summaryFormIndex = -1;
                let contentIndex = -1;
                for (let i = 0; i < this.formList.length; i++) {
                    let pageModel = this.formList[i].pageModel;
                    if (pageModel.hasOwnProperty('title_')) {
                        titleFormIndex = i;
                    }
                    if (pageModel.hasOwnProperty('resource_summary')) {
                        summaryFormIndex = i;
                    }
                    if (pageModel.hasOwnProperty('resource_content')) {
                        contentIndex = i;
                    }
                    if (titleFormIndex != -1 && summaryFormIndex != -1 && contentIndex != -1) {
                        break;
                    }
                }
                if (titleFormIndex != -1 && summaryFormIndex != -1 && contentIndex != -1) {
                    let title = this.formList[titleFormIndex].pageModel['title_'];
                    let content = this.formList[contentIndex].pageModel['resource_content_PlainTxt'];
                    if (content) {
                        summary({title: title, content: content}).then(response=>{
                            if (response && response.status == 200) {
                                console.dir(response.data);
                                this.formList[summaryFormIndex].pageModel['resource_summary'] = response.data;
                            }
                        });
                    } else {
                        this.$message.error("请输入正文");
                    }
                } else {
                    this.$message.error("摘要提取错误");
                }
            },
            extractKeyword() {
                let contentIndex = -1;
                let keywordFormIndex = -1;
                let titleFormIndex = -1
                for (let i = 0; i < this.formList.length; i++) {
                    let pageModel = this.formList[i].pageModel;
                    if (pageModel.hasOwnProperty('title_')) {
                        titleFormIndex = i;
                    }
                    if (pageModel.hasOwnProperty('keyword_')) {
                        keywordFormIndex = i;
                    }
                    if (pageModel.hasOwnProperty('resource_content')) {
                        contentIndex = i;
                    }
                    if (titleFormIndex != -1 && keywordFormIndex != -1 && contentIndex != -1) {
                        break;
                    }
                }
                if (titleFormIndex != -1 && keywordFormIndex != -1 && contentIndex != -1) {
                    let title = this.formList[titleFormIndex].pageModel['title_'];
                    let content = this.formList[contentIndex].pageModel['resource_content_PlainTxt'];
                    if (!title) {
                        this.$message.error("请输入标题");
                        return;
                    }
                    if (!content) {
                        this.$message.error("请输入正文");
                        return;
                    }
                    if (title && content) {
                        // 标题最大80字节，正文最大65535字节
                        keyword({title: title, content: content}).then(response=>{
                            if (response && response.status == 200) {
                                if (response.data.length > 0) {
                                    console.dir(response.data);
                                    this.formList[keywordFormIndex].pageModel['keyword_'] = response.data.join(',');
                                }
                            }
                        });
                    }
                } else {
                    this.$message.error("关键字提取错误");
                }

            }
        }
    }
</script>
<style>
    .classificationTree {
        border:1px solid #eceef5;
        overflow-x: scroll;
        margin-right:10px;
        padding: 10px;
        height: 100%;
    }
    .el-textarea__inner {
        height: 100%;
    }
    .el-dialog__body {
        padding-bottom: 0;
    }
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
        background-color: #a6d1ff;
    }
    /deep/ .el-tree-node > .el-tree-node__children {
        overflow: visible !important;
    }

    /*表格*/
    .table-list{
        width: 100% !important;
        margin-top: 0px !important;
        /*margin-top: 1px !important;
        margin-left: 1px !important;*/
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
    .my-tabls>.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
        background-color: #F0F0F0;
        border-bottom: 1px solid #F0F0F0;
    }
    .el-tabs__nav-wrap {
        overflow: hidden;
        margin-bottom: 0px;
        position: relative;
    }
    .el-tabs__header{margin:0;}
    .appeal_table {
        width:100%;
    }
</style>

