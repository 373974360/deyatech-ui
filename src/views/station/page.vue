<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>

                    <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.pageName" style="width: 300px;margin-left: 10px;margin-right:10px;"></el-input>
                    <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
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
                        <el-tree ref="pageTypeTree" :data="pageTypeTree" node-key="id" highlight-current
                                 default-expand-all :expand-on-click-node="false"
                                 @node-click="triggerTreeNode" v-loading="treeLoading">
                        </el-tree>
                    </div>
                </el-col>
                <el-col :span="20">
                    <el-table :data="pageList" v-loading.body="listLoading" stripe border highlight-current-row
                              @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center"/>
                        <el-table-column align="left" label="页面名称" prop="pageName" width="150"/>
                        <el-table-column align="left" label="英文名称" prop="pageEnglishName" width="100"/>
                        <el-table-column align="left" label="页面路径" prop="pagePath" width="100"/>
                        <el-table-column align="left" label="模板地址" prop="templatePath"/>
                        <el-table-column align="center" label="频率" prop="pageInterval" width="50"/>
                        <!--<el-table-column align="center" label="备注" prop="remark"/>
                        <el-table-column align="center" label="站点id" prop="siteId"/>
                        <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                                    {{scope.row.enable | enums('EnableEnum')}}
                                </el-tag>
                            </template>
                        </el-table-column>-->
                        <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                            <template slot-scope="scope">
                                <el-button title="复制引用" type="primary" icon="el-icon-document-copy" :size="btnSize" circle
                                           @click.stop.safe="btnCopyInclude(scope.row)"></el-button>
                                <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                           @click.stop.safe="btnUpdate(scope.row)"></el-button>
                                <el-button v-if="btnEnable.replay" title="发布静态页" type="success" icon="el-icon-check" :size="btnSize" circle
                                           @click.stop.safe="btnReplay(scope.row)"></el-button>
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
                </el-col>
            </el-row>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closePageDialog">
                <el-form ref="pageDialogForm" class="deyatech-form" :model="page" label-position="right"
                         label-width="80px" :rules="pageRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="页面名称" prop="pageName">
                                <el-input v-model.trim="page.pageName" maxlength="200"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="pageEnglishName">
                                <el-input v-model.trim="page.pageEnglishName" maxlength="200"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="页面路径" prop="pagePath">
                                <el-input v-model.trim="page.pagePath" maxlength="250"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="模板地址" prop="templatePath">
<!--                                <el-input v-model.trim="page.templatePath"></el-input>-->
                                <el-cascader filterable
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="templateTreeData"
                                    v-model.trim="selectTemplatePath"
                                    :props="cascaderProps"
                                    @change="handleChange">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="更新频率" prop="pageInterval">
                                <el-input v-model.trim="page.pageInterval" maxlength="4"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="栏目绑定">
                                <el-cascader filterable
                                    style="width: 100%"
                                    placeholder="请选择绑定栏目"
                                    :options="catalogList"
                                    :props="catalogProps"
                                    v-model.trim="pageCatalogList"
                                    clearable></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="自动更新" prop="autoUpdate">
                                <el-switch v-model.trim="page.autoUpdate" :active-value=1 :inactive-value=0></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model.trim="page.remark" :rows="3" maxlength="500"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closePageDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
            <el-dialog title="复制引用代码" :visible.sync="copyDialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeCopyDialog">
                <el-input type="textarea" v-model.trim="includeHtml" :rows="5"></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize"
                               v-clipboard:copy="this.includeHtml"
                               v-clipboard:success="doCopySuccess"
                               v-clipboard:error="doCopyError">复制</el-button>
                    <el-button :size="btnSize" @click="closeCopyDialog">取消</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {isEnglish} from '@/util/validate';
    import {
        getPageList,
        createOrUpdatePage,
        delPages,
        existsPagePath,
        existsTemplatePath,
        replay
    } from '@/api/station/page';
    import {
        getCatalogTree,
    } from '@/api/station/catalog';
    import {
        getPageTypeTree
    } from '@/api/station/pageType';
    import {listTemplateAllFiles} from '@/api/template/template';
    import {getPageCatalogList} from '@/api/station/pageCatalog';

    export default {
        name: 'page',
        data() {
            const checkInterval = (rule, value, callback) => {
                if (/[^\d]/.test(value)) {
                    callback(new Error('请输入正整数'));
                } else {
                    callback();
                }
            }
            const validateTemplatePath = (rule, value, callback) => {
                if (this.selectTemplatePath) {
                    this.page.templatePath = '/' + this.selectTemplatePath.join('/');
                    if (this.page.templatePath.length > 255) {
                        callback(new Error('长度在 1 到 255 个字符'))
                        this.page.templatePath = undefined;
                    } else {
                        existsTemplatePath(this.page).then(response => {
                            if (response && response.data) {
                                callback(new Error(this.$t("table.pleaseSelect") + '模板地址'))
                            } else {
                                callback()
                            }
                        }).catch((error)=>{
                            callback(new Error(error))
                        });
                    }
                } else {
                    callback(new Error(this.$t("table.pleaseSelect") + '模板地址'))
                }
            }
            const validatePageEnglishName = (rule, value, callback) => {
                if (isEnglish(value)) {
                    callback()
                } else {
                    callback(new Error(this.$t("table.pleaseInput") + '正确的英文名称'))
                }
            }
            const validatePagePath = (rule, value, callback) => {
                if (!this.page.pageEnglishName) {
                    callback(new Error('请先输入英文名称'))
                }
                const regExp = /^(\/([\u4E00-\u9FA5]|\w)+)*\/$/;
                if (!regExp.test(value)) {
                    callback(new Error("页面路径以‘/’开头和结尾，不许出现连续多个‘/’及特殊符号"))
                    return
                }
                this.page.siteId = this.listQuery.siteId;
                this.page.ids = undefined;
                existsPagePath(this.page).then(response => {
                    if (response && response.data) {
                        callback(new Error(response.data))
                    } else {
                        callback()
                    }
                }).catch((error)=>{
                    callback(new Error(error))
                });
            }
            return {
                pageTypeTree: undefined,
                pageList: undefined,
                total: undefined,
                listLoading: false,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    siteId: this.$store.state.common.siteId,
                    typeId: undefined,
                    pageName: undefined
                },
                page: {
                    id: undefined,
                    typeId: undefined,
                    pageName: undefined,
                    pageEnglishName: undefined,
                    pagePath: undefined,
                    templatePath: undefined,
                    siteId: undefined,
                    autoUpdate: 0,
                    pageInterval: 60,
                    ids: undefined
                },
                pageRules: {
                    pageName: [
                        {required: true, message: this.$t("table.pleaseInput") + '页面名称'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    pageEnglishName: [
                        {required: true, message: this.$t("table.pleaseInput") + '英文名称'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'},
                        {validator: validatePageEnglishName, trigger: 'blur'}
                    ],
                    pagePath: [
                        {required: true, message: this.$t("table.pleaseInput") + '页面路径'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'},
                        {validator: validatePagePath, trigger: 'blur'}
                    ],
                    templatePath: [
                        {required: true, validator: validateTemplatePath, trigger: 'change'}
                    ],
                    pageInterval: [
                        { required: true, message: this.$t("table.pleaseInput") + '更新频率'},
                        {validator: checkInterval, trigger: ['change', 'blur']}
                    ],
                    autoUpdate: [
                        { required: true, message: this.$t("table.selectInput") + '自动更新'},
                    ],
                    remark: [
                        {max: 500, message: '长度最多 500 个字符', trigger: 'blur'}
                    ],
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                templateTreeData: [],
                cascaderProps: {
                    value: 'fileName',
                    label: 'fileName',
                    children: 'children'
                },
                catalogProps: {
                    multiple: true,
                    value: 'id',
                    label: 'name',
                    children: 'children'
                },
                selectTemplatePath: undefined,
                catalogList: undefined,
                pageCatalogList: undefined,
                treeLoading: false,
                copyDialogVisible: false,
                includeHtml: undefined
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
                    create: this.permission.page_create,
                    update: this.permission.page_update,
                    delete: this.permission.page_delete,
                    replay: this.permission.page_replay
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                this.reloadPageTypeTree();
                this.reloadList();
                this.listTemplateAllFiles();
            }
        },
        methods: {
            btnCopyInclude(row){
                this.copyDialogVisible = true;
                this.includeHtml = '<!-- '+row.pageName+' start -->\n' +
                    '<!--#include virtual=\''+row.pagePath+row.pageEnglishName+'.html\'-->\n' +
                    '<!-- '+row.pageName+' end -->';
            },
            doCopySuccess(){
                this.$message.success("复制成功");
            },
            doCopyError(){
                this.$message.error("复制失败");
            },
            closeCopyDialog(){
                this.copyDialogVisible = false;
            },
            triggerTreeNode(data) {
                if (data.children && data.children.length > 0) {
                    this.$refs['pageTypeTree'].setCurrentKey(this.listQuery.typeId);
                    return;
                }
                this.listQuery.typeId = data.id;
                this.handleCurrentChange(1)
            },
            resetSearch(){
                this.listQuery.siteId = this.$store.state.common.siteId;
                this.listQuery.pageName = undefined;
                this.reloadList();
            },
            reloadList(){
                if (!this.listQuery.siteId) {
                    this.$message.warning("请先选择站点");
                    return
                }
                this.listLoading = true;
                this.pageList = undefined;
                this.total = undefined;
                getPageList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.pageList = response.data.records;
                    this.total = response.data.total;
                })
            },
            reloadPageTypeTree(){
                this.treeLoading = true;
                return new Promise((resolve, reject) => {
                    getPageTypeTree({siteId: this.listQuery.siteId}).then(response => {
                        this.pageTypeTree = response.data;
                        this.treeLoading = false;
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })
            },
            getCatalogTree(){
                const query = {siteId: this.listQuery.siteId}
                getCatalogTree(query).then(response => {
                    this.catalogList = response.data;
                })
            },
            getPageCatalogList(pageId){
                let ids = [];
                getPageCatalogList({pageId:pageId}).then(response => {
                    for(const row of response.data){
                        ids.push(row.catId.split(","));
                    }
                })
                this.pageCatalogList = ids;
            },
            listTemplateAllFiles(){
                this.templateTreeData = [];
                listTemplateAllFiles(this.listQuery.siteId,"").then(response => {
                    let result = JSON.parse(response.data)
                    this.templateTreeData = result.files
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
                this.resetPage();
                if(!this.listQuery.typeId){
                    this.$message.warning("请选择页面分类");
                }else{
                    this.page.typeId = this.listQuery.typeId;
                    this.getCatalogTree();
                    this.dialogTitle = 'create';
                    this.dialogVisible = true;
                }
            },
            btnUpdate(row){
                this.resetPage();
                if (row.id) {
                    this.page = deepClone(row);
                } else {
                    this.page = deepClone(this.selectedRows[0]);
                }
                this.getCatalogTree();
                this.selectTemplatePath = this.page.templatePath.split('/').slice(1);
                this.dialogTitle = 'update';
                this.dialogVisible = true;
                this.getPageCatalogList(row.id);
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
            btnReplay(row){
                replay(row).then(() => {
                    this.$message.success("发布成功");
                })
            },
            doCreate(){
                this.$refs['pageDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        this.page.siteId = this.listQuery.siteId;
                        let ids = [];
                        if(this.pageCatalogList != undefined){
                            for(const pageCatalog of this.pageCatalogList){
                                ids.push(pageCatalog.join(","))
                            }
                        }
                        this.page.ids = ids;
                        createOrUpdatePage(this.page).then(() => {
                            this.resetPageDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        }).catch(()=>{
                            this.submitLoading = false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['pageDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        let ids = [];
                        if(this.pageCatalogList != undefined){
                            for(const pageCatalog of this.pageCatalogList){
                                ids.push(pageCatalog.join(","))
                            }
                        }
                        this.page.ids = ids;
                        createOrUpdatePage(this.page).then(() => {
                            this.resetPageDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        }).catch(()=>{
                            this.submitLoading = false;
                        });
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delPages(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetPage(){
                this.page = {
                    id: undefined,
                    typeId: undefined,
                    pageName: undefined,
                    pageEnglishName: undefined,
                    pagePath: undefined,
                    templatePath: undefined,
                    siteId: undefined,
                    autoUpdate: 0,
                    pageInterval: 60,
                    ids: undefined
                }
                this.pageCatalogList = undefined;
            },
            resetPageDialogAndList(){
                this.closePageDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closePageDialog() {
                this.dialogVisible = false;
                this.selectTemplatePath = undefined;
                this.resetPage();
                this.$refs['pageDialogForm'].resetFields();
            },
            handleChange(value) {
            }
        }
    }
</script>


