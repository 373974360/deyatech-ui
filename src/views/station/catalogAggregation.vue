<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name"></el-input>
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
            <el-table :data="catalogAggregationList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="栏目id" prop="cmsCatalogId"/>
                <el-table-column align="center" label="关键字" prop="keyword"/>
                <el-table-column align="center" label="发布机构" prop="publishOrganization"/>
                <el-table-column align="center" label="发布时间段" prop="publishTime"/>
                <el-table-column align="center" label="发布人" prop="publisher"/>
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
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeCatalogAggregationDialog">
                <el-form ref="catalogAggregationDialogForm" class="deyatech-form" :model="catalogAggregation" label-position="right"
                         label-width="80px" :rules="catalogAggregationRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="栏目id" prop="cmsCatalogId">
                                <el-input v-model.trim="catalogAggregation.cmsCatalogId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="关键字" prop="keyword">
                                <el-input v-model.trim="catalogAggregation.keyword"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="发布机构" prop="publishOrganization">
                                <el-input v-model.trim="catalogAggregation.publishOrganization"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发布时间段" prop="publishTime">
                                <el-input v-model.trim="catalogAggregation.publishTime"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="发布人" prop="publisher">
                                <el-input v-model.trim="catalogAggregation.publisher"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="catalogAggregation.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeCatalogAggregationDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getCatalogAggregationList,
        createOrUpdateCatalogAggregation,
        delCatalogAggregations
    } from '@/api/station/catalogAggregation';

    export default {
        name: 'catalogAggregation',
        data() {
            return {
                catalogAggregationList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                catalogAggregation: {
                    id: undefined,
                    cmsCatalogId: undefined,
                    keyword: undefined,
                    publishOrganization: undefined,
                    publishTime: undefined,
                    publisher: undefined
                },
                catalogAggregationRules: {
                    cmsCatalogId: [
                        {required: true, message: this.$t("table.pleaseInput") + '栏目id'}
                    ],
                    keyword: [
                        {required: true, message: this.$t("table.pleaseInput") + '关键字'}
                    ],
                    publishOrganization: [
                        {required: true, message: this.$t("table.pleaseInput") + '发布机构'}
                    ],
                    publishTime: [
                        {required: true, message: this.$t("table.pleaseInput") + '发布时间段'}
                    ],
                    publisher: [
                        {required: true, message: this.$t("table.pleaseInput") + '发布人'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false
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
                    create: this.permission.catalogAggregation_create,
                    update: this.permission.catalogAggregation_update,
                    delete: this.permission.catalogAggregation_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.catalogAggregationList = undefined;
                this.total = undefined;
                getCatalogAggregationList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.catalogAggregationList = response.data.records;
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
                this.resetCatalogAggregation();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetCatalogAggregation();
                if (row.id) {
                    this.catalogAggregation = deepClone(row);
                } else {
                    this.catalogAggregation = deepClone(this.selectedRows[0]);
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
                this.$refs['catalogAggregationDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateCatalogAggregation(this.catalogAggregation).then(() => {
                            this.resetCatalogAggregationDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['catalogAggregationDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateCatalogAggregation(this.catalogAggregation).then(() => {
                            this.resetCatalogAggregationDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delCatalogAggregations(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetCatalogAggregation(){
                this.catalogAggregation = {
                    id: undefined,
                    cmsCatalogId: undefined,
                    keyword: undefined,
                    publishOrganization: undefined,
                    publishTime: undefined,
                    publisher: undefined
                }
            },
            resetCatalogAggregationDialogAndList(){
                this.closeCatalogAggregationDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeCatalogAggregationDialog() {
                this.dialogVisible = false;
                this.resetCatalogAggregation();
                this.$refs['catalogAggregationDialogForm'].resetFields();
            }
        }
    }
</script>


