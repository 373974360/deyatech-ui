<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="请输入名称" v-model.trim="listQuery.name" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchList">{{$t('table.search')}}</el-button>
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
            <el-table :data="categoryList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="分类名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="站点" prop="siteName"/>
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
                                   @click.stop="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop="btnDelete(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeCategoryDialog">
                <el-form ref="categoryDialogForm" class="deyatech-form" :model="category" label-position="right"
                         label-width="100px" :rules="categoryRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="站点" prop="siteId">
                                <span v-text="this.$store.state.common.siteName"></span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="分类名称" prop="name">
                                <el-input v-model.trim="category.name" maxlength="50" placeholder="请输入分类名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="列表页模板" prop="listPageTemplate">
                                <el-cascader filterable
                                    v-model="selectedListTemplate"
                                    :props="templateProps"
                                    :options="listTemplates"
                                    @change="selectedListTemplateChange"
                                    placeholder="请选择列表页模板" style="width: 100%"></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="详情页模板" prop="detailPageTemplate">
                                <el-cascader filterable
                                    v-model="selectedDetailTemplate"
                                    :props="templateProps"
                                    :options="detailTemplates"
                                    @change="selectedDetailTemplateChange"
                                    placeholder="请选详情页模板" style="width: 100%"></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="category.remark" :rows="3" maxlength="500" placeholder="请输入备注"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeCategoryDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getCategoryListByNameAndSiteId,
        createOrUpdateCategory,
        delCategorys
    } from '@/api/interview/category';
    import {listTemplateAllFiles} from '@/api/template/template';

    export default {
        name: 'category',
        data() {
            return {
                categoryList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined,
                    siteId: undefined
                },
                category: {
                    id: undefined,
                    name: undefined,
                    siteId: undefined,
                    listPageTemplate: undefined,
                    detailPageTemplate: undefined
                },
                categoryRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '分类名称'}
                    ],
                    siteId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '站点'}
                    ],
                    listPageTemplate: [
                        {required: true, message: this.$t("table.pleaseSelect") + '列表页模板'}
                    ],
                    detailPageTemplate: [
                        {required: true, message: this.$t("table.pleaseSelect") + '详情页模板'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                listTemplates: [],
                detailTemplates: [],
                selectedListTemplate: [],
                selectedDetailTemplate: [],
                templateProps: {
                    value: 'fileName',
                    label: 'fileName',
                    children: 'children'
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
                    create: this.permission.category_create,
                    update: this.permission.category_update,
                    delete: this.permission.category_delete
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = true;
            if (this.$store.state.common.siteId) {
                this.loadTemplates();
                this.reloadList();
            }
        },
        methods: {
            selectedListTemplateChange(v) {
                if (v && v.length > 0) {
                    this.$set(this.category, 'listPageTemplate', '/' + v.join('/'));
                } else {
                    this.$set(this.category, 'listPageTemplate', undefined);
                }
            },
            selectedDetailTemplateChange(v) {
                if (v && v.length > 0) {
                    this.$set(this.category, 'detailPageTemplate', '/' + v.join('/'));
                } else {
                    this.$set(this.category, 'detailPageTemplate', undefined);
                }
            },
            loadTemplates() {
                this.listTemplates = [];
                listTemplateAllFiles(this.$store.state.common.siteId, "list").then(response => {
                    let result = JSON.parse(response.data);
                    this.listTemplates = result.files;
                });
                this.detailTemplates = [];
                listTemplateAllFiles(this.$store.state.common.siteId, "detail").then(response => {
                    let result = JSON.parse(response.data)
                    this.detailTemplates = result.files
                })
            },
            resetSearch(){
                this.listQuery.siteId = undefined;
                this.listQuery.name = undefined;
            },
            searchList(){
                this.listQuery.page = 1;
                this.reloadList();
            },
            reloadList(){
                this.listLoading = true;
                this.categoryList = undefined;
                this.listQuery.siteId = this.$store.state.common.siteId;
                getCategoryListByNameAndSiteId(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.categoryList = response.data.records;
                    this.total = response.data.total;
                }).catch(()=>{
                    this.listLoading = false;
                    this.total = 0;
                });
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
                this.resetCategory();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
                this.category.siteId = this.$store.state.common.siteId;
            },
            btnUpdate(row){
                this.resetCategory();
                if (row.id) {
                    this.category = deepClone(row);
                } else {
                    this.category = deepClone(this.selectedRows[0]);
                }
                this.selectedListTemplate = this.category.listPageTemplate.substring(1).split('/');
                this.selectedDetailTemplate = this.category.detailPageTemplate.substring(1).split('/');
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
                this.$refs['categoryDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateCategory(this.category).then(() => {
                            this.resetCategoryDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['categoryDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateCategory(this.category).then(() => {
                            this.resetCategoryDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delCategorys(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetCategory(){
                this.category = {
                    id: undefined,
                    name: undefined,
                    siteId: undefined,
                    listPageTemplate: undefined,
                    detailPageTemplate: undefined
                }
            },
            resetCategoryDialogAndList(){
                this.closeCategoryDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeCategoryDialog() {
                this.selectedListTemplate = [];
                this.selectedDetailTemplate = [];
                this.dialogVisible = false;
                this.resetCategory();
                this.$refs['categoryDialogForm'].resetFields();
            }
        }
    }
</script>


