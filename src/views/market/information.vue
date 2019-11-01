<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-select :size="searchSize" v-model.trim="listQuery.categoryId" :placeholder="$t('table.pleaseSelect') + '分类'" clearable style="width: 100%">
                            <el-option
                                v-for="item in allCategory"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseSelect') + '标题'" v-model.trim="listQuery.title"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseSelect') + '作者'" v-model.trim="listQuery.author"></el-input>
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
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="informationList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="分类" prop="categoryName"/>
                <el-table-column align="center" label="标题" prop="title"/>
<!--                <el-table-column align="center" label="内容" prop="content"/>-->
                <el-table-column align="center" label="作者" prop="author"/>
<!--                <el-table-column align="center" label="来源" prop="source"/>-->
                <el-table-column align="center" label="发布状态" prop="status">
                    <template slot-scope="scope">
                        {{scope.row.status | releaseStatusFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发布时间" prop="releaseTime"/>
                <el-table-column align="center" label="添加时间" prop="createTime"/>
<!--                <el-table-column align="center" label="点击数" prop="clicks"/>-->
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="!scope.row.status" title="发布" type="success" icon="el-icon-check" :size="btnSize" circle
                                   @click.stop.safe="doRelease(scope.row)"></el-button>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeInformationDialog">
                <el-form ref="informationDialogForm" class="deyatech-form" :model="information" label-position="right"
                         label-width="80px" :rules="informationRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="分类" prop="categoryId">
                                <el-select v-model.trim="information.categoryId" :placeholder="$t('table.pleaseSelect') + '分类'" style="width: 100%">
                                    <el-option
                                        v-for="item in allCategory"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="标题" prop="title">
                                <el-input v-model.trim="information.title"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="作者" prop="author">
                                <el-input v-model.trim="information.author"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="来源" prop="source">
                                <el-input v-model.trim="information.source"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="内容" prop="content">
                                <el-input type="textarea" v-model.trim="information.content" :rows="5"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model.trim="information.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeInformationDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getInformationList,
        createOrUpdateInformation,
        delInformations,
        doRelease
    } from '@/api/market/information';
    import {getAllCategory} from '@/api/market/informationCategory';

    export default {
        name: 'information',
        data() {
            return {
                informationList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    categoryId: undefined,
                    title: undefined,
                    author: undefined,
                },
                information: {
                    id: undefined,
                    categoryId: undefined,
                    title: undefined,
                    content: undefined,
                    author: undefined,
                    source: undefined,
                    status: undefined,
                    releaseTime: undefined,
                    clicks: undefined
                },
                informationRules: {
                    categoryId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '分类'}
                    ],
                    title: [
                        {required: true, message: this.$t("table.pleaseInput") + '标题'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                    ],
                    content: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容'},
                        {min: 1, max: 4000, message: '长度在 1 到 4000 个字符', trigger: 'blur'},
                    ],
                    author: [
                        {required: true, message: this.$t("table.pleaseInput") + '作者'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                    ],
                    source: [
                        {required: true, message: this.$t("table.pleaseInput") + '来源'},
                        {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'},
                    ],
                    remark: [
                        {max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur'}
                    ],
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                allCategory: [],
            }
        },
        filters: {
            releaseStatusFilter: function (status) {
                const releaseStatusMap = {
                    0: '未发布',
                    1: '已发布'
                };
                return releaseStatusMap[status]
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
                    create: this.permission.information_create,
                    update: this.permission.information_update,
                    delete: this.permission.information_delete
                };
            }
        },
        created(){
            this.getAllCategory();
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.categoryId = undefined;
                this.listQuery.title = undefined;
                this.listQuery.author = undefined;
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.informationList = undefined;
                this.total = undefined;
                getInformationList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.informationList = response.data.records;
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
                this.resetInformation();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetInformation();
                if (row.id) {
                    this.information = deepClone(row);
                } else {
                    this.information = deepClone(this.selectedRows[0]);
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
                this.$refs['informationDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateInformation(this.information).then(() => {
                            this.resetInformationDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['informationDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateInformation(this.information).then(() => {
                            this.resetInformationDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delInformations(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetInformation(){
                this.information = {
                    id: undefined,
                    categoryId: undefined,
                    title: undefined,
                    content: undefined,
                    author: undefined,
                    source: undefined,
                    status: undefined,
                    releaseTime: undefined,
                    clicks: undefined
                }
            },
            resetInformationDialogAndList(){
                this.closeInformationDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeInformationDialog() {
                this.dialogVisible = false;
                this.resetInformation();
                this.$refs['informationDialogForm'].resetFields();
            },
            getAllCategory(){
                getAllCategory().then(response => {
                    this.allCategory = response.data;
                })
            },
            doRelease(row) {
                if (row.status) {
                    this.$message.error('该信息已发布');
                    return;
                }
                this.$confirm('此操作将发布内容信息, 是否继续？', this.$t("table.tip"), {type: 'success'}).then(() => {
                    doRelease({id: row.id}).then(() => {
                        this.reloadList();
                        this.$message.success('发布成功');
                    })
                })
            }
        }
    }
</script>


