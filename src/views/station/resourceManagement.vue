<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <!--<div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>-->
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.detail" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">详情</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="resourceManagementList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column label="标题" prop="title" :show-overflow-tooltip="true"/>
                <el-table-column align="center" label="作者姓名" prop="author" :show-overflow-tooltip="true" width="90"/>
                <el-table-column align="center" label="资源分类" prop="resourceCategoryName" :show-overflow-tooltip="true" width="160"/>
                <el-table-column align="center" label="发布时间" prop="resourcePublicationDate" :show-overflow-tooltip="true" width="160">
                    <template slot-scope="scope">
                        {{scope.row.resourcePublicationDate ? scope.row.resourcePublicationDate.substr(0, 16) : ''}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="外链" prop="flagExternal" width="60">
                    <template slot-scope="scope">
                        {{scope.row.flagExternal | enums('YesNoEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="置顶" prop="flagTop" width="60">
                    <template slot-scope="scope">
                        {{scope.row.flagTop | enums('YesNoEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="权重" prop="sortNo" width="60"/>
                <el-table-column align="center" label="创建者" prop="createUserName" :show-overflow-tooltip="true" width="90"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        {{scope.row.status | enums('ContentStatusEnum')}}
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.detail" title="详情" type="primary" icon="el-icon-tickets" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop.safe="btnDelete(scope.row, false)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog title="详情" :visible.sync="dialogVisible" :close-on-click-modal="closeOnClickModal" @close="closeResourceManagementDialog">
                <el-row>
                    <el-col style="color: #409EFF; font-weight: bold;">基础数据</el-col>
                </el-row>

                <el-form class="deyatech-form " label-position="right" label-width="86px">
                    <el-row :span="24">
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="站点:" style="margin: 0;">{{template.siteName}}</el-form-item>
                        </el-col>
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="栏目:" style="margin: 0;">{{template.cmsCatalogName}}</el-form-item>
                        </el-col>
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="模型:" style="margin: 0;">{{template.contentModelName}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="标题:" style="margin: 0;">{{template.title}}</el-form-item>
                        </el-col>
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="来源:" style="margin: 0;">{{template.sourceName}}</el-form-item>
                        </el-col>
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="作者:" style="margin: 0;">{{template.author}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="置顶:" style="margin: 0;">{{template.flagTop | enums('YesNoEnum')}}</el-form-item>
                        </el-col>
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="权重:" style="margin: 0;">{{template.sortNo}}</el-form-item>
                        </el-col>
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="状态:" style="margin: 0;">{{template.status | enums('ContentStatusEnum')}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="资源分类:" style="margin: 0;">{{template.resourceCategoryName}}</el-form-item>
                        </el-col>
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="发布时间:" style="margin: 0;">{{template.resourcePublicationDate ? template.resourcePublicationDate.substr(0,16) : ''}}</el-form-item>
                        </el-col>
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="索引码:" style="margin: 0;">{{template.indexCode}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="创建者姓名:" style="margin: 0;">{{template.createUserName}}</el-form-item>
                        </el-col>
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="创建者部门:" style="margin: 0;">{{template.createUserDepartmentName}}</el-form-item>
                        </el-col>
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="创建时间:" style="margin: 0;">{{template.createTime ? template.createTime.substr(0,16) : ''}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="更新者姓名:" style="margin: 0;">{{template.updateUserName}}</el-form-item>
                        </el-col>
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="更新者部门:" style="margin: 0;">{{template.updateUserDepartmentName}}</el-form-item>
                        </el-col>
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="更新时间:" style="margin: 0;">{{template.updateTime ? template.updateTime.substr(0, 16) : ''}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="模板路径:" style="margin: 0;">{{template.templatePath}}</el-form-item>
                        </el-col>
                        <el-col :span="8" style="margin: 0;">
                            <el-form-item label="外链:" style="margin: 0;">{{template.flagExternal | enums('YesNoEnum')}}</el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="template.flagExternal">
                            <el-form-item label="URL:" style="margin: 0;">{{template.url}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12" style="margin: 0;">
                            <el-form-item label="缩略图:" style="margin: 0;">
                                <el-image v-if="template.thumbnail" v-for="rul in loadImageArray(template.thumbnail)"
                                          style="width: 60px; height: 60px; margin-right: 10px;"
                                          :src="loadImageSrc(rul)"
                                          :preview-src-list="[loadImageSrc(rul)]">
                                </el-image>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="24" style="margin: 0;">
                            <el-form-item label="关键字:" style="margin: 0;">{{template.keyword}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="24" style="margin: 0;">
                            <el-form-item label="摘要:" style="margin: 0;">{{template.resourceSummary}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="24" style="margin: 0;">
                            <el-form-item label="正文:" style="margin: 0;"><div v-html="template.resourceContent" style="max-height: 300px; overflow-y: scroll;"></div></el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <el-row>
                    <el-col style="color: #409EFF; font-weight: bold;">元数据</el-col>
                </el-row>

                <el-form class="deyatech-form " label-position="right" label-width="80px">
                    <el-row>
                        <el-col :span="12" style="margin: 0;" v-for="item in template.contentList">
                            <el-form-item :label="item.label" style="margin: 0;">{{item.value}}</el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete(template, true)">删除</el-button>
                    <el-button :size="btnSize" @click="closeResourceManagementDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {getResourceManagementList} from '@/api/station/resourceManagement';
    import {delTemplates} from '@/api/station/template';
    import {
        getSiteUploadPath
    } from "../../api/station/material";
    export default {
        name: 'resourceManagement',
        data() {
            return {
                siteUploadPath: '',
                resourceManagementList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    siteId: this.$store.state.common.siteId,
                    name: undefined
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                template: {
                    id_: undefined,
                    siteId: undefined,
                    templatePath: undefined,
                    cmsCatalogId: undefined,
                    contentModelId: undefined,
                    contentId: undefined,
                    status: undefined,
                    contentModelTemplateId: undefined,
                    url: undefined,
                    author: undefined,
                    source: undefined,
                    thumbnail: undefined,
                    title: undefined,
                    sortNo: undefined,
                    flagTop: undefined,
                    flagExternal: undefined,
                    resourceSummary: undefined,
                    resourceContent: undefined,
                    resourceCategory: undefined,
                    resourcePublicationDate: undefined,
                    keyword: undefined,
                    indexCode: undefined,
                    siteName: undefined,
                    cmsCatalogName: undefined,
                    resourceCategoryName: undefined,
                    createUserName: undefined,
                    createUserDepartmentName: undefined,
                    createTime: undefined,
                    updateUserName: undefined,
                    updateUserDepartmentName: undefined,
                    updateTime: undefined,
                    contentList: [],
                    // 无用
                    flagSearch: undefined,
                    views: undefined,
                    editor: undefined
                }
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
                    detail: this.permission.resourceManagement_detail,
                    delete: this.permission.resourceManagement_delete
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                this.listQuery.siteId = this.$store.state.common.siteId;
                this.loadSiteUploadPath();
                this.reloadList();
            }
        },
        methods: {
            loadImageArray(value) {
                if (!value) {
                    return [];
                }
                return value.split(',');
            },
            // 加载图片地址
            loadImageSrc(url) {
                if (!url) {
                    return '';
                }
                return '/manage/station/material/showImageBySiteIdAndUrl?siteId=' + this.$store.state.common.siteId + '&url=' + url;
            },
            loadSiteUploadPath() {
                getSiteUploadPath(this.listQuery).then(response => {
                    if (response.status == 200) {
                        this.siteUploadPath = response.data
                    } else {
                        this.$message.warning('获取站点上传文件存放地址失败')
                    }
                })
            },
            resetSearch(){
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.resourceManagementList = undefined;
                getResourceManagementList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.resourceManagementList = response.data.records;
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
            btnUpdate(row){
                this.template = undefined;
                if (row.id) {
                    this.template = deepClone(row);
                } else {
                    this.template = deepClone(this.selectedRows[0]);
                }
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row, flag){
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push({
                            id: row.id,
                            metaDataCollectionId: row.metaDataCollectionId,
                            contentId: row.contentId ? row.contentId : undefined,
                            contentModelId: row.contentModelId
                        });
                        this.doDelete(ids, flag);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows){
                            ids.push({
                                id: deleteRow.id,
                                metaDataCollectionId: deleteRow.metaDataCollectionId,
                                contentId: deleteRow.contentId ? deleteRow.contentId : undefined,
                                contentModelId: deleteRow.contentModelId
                            });
                        }
                        this.doDelete(ids, flag);
                    })
                }
            },
            doDelete(ids, flag) {
                this.listLoading = true;
                delTemplates(JSON.stringify(ids)).then(() => {
                    if (flag) {
                        this.closeResourceManagementDialog();
                    }
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            closeResourceManagementDialog() {
                this.dialogVisible = false;
            }
        }
    }
</script>

