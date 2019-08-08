<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
<!--                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model="listQuery.name"></el-input>-->
                        <el-select v-model="listQuery.siteId" placeholder="请选择站点" :size="searchSize">
                            <el-option
                                v-for="s in stationGroup"
                                :key="s.id"
                                :label="s.name"
                                :value="s.id">
                            </el-option>
                        </el-select>
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
            <el-table :data="pageList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="页面名称" prop="pageName"/>
                <el-table-column align="center" label="英文名称" prop="pageEnglishName"/>
                <el-table-column align="center" label="页面路径" prop="pagePath"/>
                <el-table-column align="center" label="模板地址" prop="templatePath"/>
                <el-table-column align="center" label="备注" prop="remark"/>
                <!--<el-table-column align="center" label="站点id" prop="siteId"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
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
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closePageDialog">
                <el-form ref="pageDialogForm" class="deyatech-form" :model="page" label-position="right"
                         label-width="80px" :rules="pageRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="页面名称" prop="pageName">
                                <el-input v-model="page.pageName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="pageEnglishName">
                                <el-input v-model="page.pageEnglishName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="页面路径" prop="pagePath">
                                <el-input v-model="page.pagePath"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="模板地址" prop="templatePath">
<!--                                <el-input v-model="page.templatePath"></el-input>-->
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="publicFiles"
                                    v-model="selectTemplatePath"
                                    @change="handleChange">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="站点id" prop="siteId">
                                <el-input v-model="page.siteId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model="page.remark" :rows="3"/>
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
        existsPagePath
    } from '@/api/station/page';
    import {getAllStationGroup} from '@/api/resource/stationGroup';

    export default {
        name: 'page',
        data() {
            const validateTemplatePath = (rule, value, callback) => {
                if (this.selectTemplatePath) {
                    this.page.templatePath = '/' + this.selectTemplatePath.join('/');
                    if (this.page.templatePath.length > 255) {
                        callback(new Error('长度在 1 到 255 个字符'))
                        this.page.templatePath = undefined;
                    } else {
                        callback()
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
                existsPagePath(this.page).then(response => {
                    if (response.status != 200) {
                        callback(new Error(response.message))
                    } else {
                        callback()
                    }
                })
            }
            return {
                pageList: undefined,
                total: undefined,
                listLoading: false,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    siteId: undefined
                },
                page: {
                    id: undefined,
                    pageName: undefined,
                    pageEnglishName: undefined,
                    pagePath: undefined,
                    templatePath: undefined,
                    siteId: undefined
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
                    remark: [
                        {max: 500, message: '长度最多 500 个字符', trigger: 'blur'}
                    ],
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                stationGroup: [{
                    id: '1',
                    name: '德雅通科技'
                }],
                publicFiles: [{
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
                selectTemplatePath: undefined
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
                    delete: this.permission.page_delete
                };
            }
        },
        created(){
            this.getAllStationGroup();
            // this.reloadList();
        },
        methods: {
            getAllStationGroup() {
                getAllStationGroup().then(response => {
                    if (response.status == 200 && response.data.length > 0) {
                        this.stationGroup = response.data;
                    }
                })
            },
            resetSearch(){
                this.listQuery.siteId = undefined;
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
            // TODO 后台接口还未开发
            getAllPublicFiles() {
                /*getAllPublicFiles(this.listQuery).then(response => {
                    if (this.publicFiles.length > 0) {
                        this.publicFiles = response.data;
                    }
                })*/
            },
            btnCreate(){
                if (!this.listQuery.siteId) {
                    this.$message.warning("请先选择站点");
                    return
                }
                this.getAllPublicFiles();
                this.resetPage();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetPage();
                if (row.id) {
                    this.page = deepClone(row);
                } else {
                    this.page = deepClone(this.selectedRows[0]);
                }
                this.selectTemplatePath = this.page.templatePath.split('/').slice(1);
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
                this.$refs['pageDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        this.page.siteId = this.listQuery.siteId;
                        createOrUpdatePage(this.page).then(() => {
                            this.resetPageDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['pageDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdatePage(this.page).then(() => {
                            this.resetPageDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
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
                    pageName: undefined,
                    pageEnglishName: undefined,
                    pagePath: undefined,
                    templatePath: undefined,
                    siteId: undefined
                }
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
                console.log(value);
            }
        }
    }
</script>


