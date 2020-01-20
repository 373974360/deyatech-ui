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
            <el-table :data="templateAccessList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="内容ID" prop="infoId"/>
                <el-table-column align="center" label="栏目ID" prop="catId"/>
                <el-table-column align="center" label="内容标题" prop="infoTitle"/>
                <el-table-column align="center" label="访问者IP" prop="accessIp"/>
                <el-table-column align="center" label="URL" prop="accessUrl"/>
                <el-table-column align="center" label="时间" prop="accessTime"/>
                <el-table-column align="center" label="日期" prop="accessDay"/>
                <el-table-column align="center" label="月份" prop="accessMonth"/>
                <el-table-column align="center" label="年份" prop="accessYear"/>
                <el-table-column align="center" label="访问域名" prop="siteDomain"/>
                <el-table-column align="center" label="站点ID" prop="siteId"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeTemplateAccessDialog">
                <el-form ref="templateAccessDialogForm" class="deyatech-form" :model="templateAccess" label-position="right"
                         label-width="80px" :rules="templateAccessRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="内容ID" prop="infoId">
                                <el-input v-model.trim="templateAccess.infoId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="栏目ID" prop="catId">
                                <el-input v-model.trim="templateAccess.catId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="内容标题" prop="infoTitle">
                                <el-input v-model.trim="templateAccess.infoTitle"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="访问者IP" prop="accessIp">
                                <el-input v-model.trim="templateAccess.accessIp"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="URL" prop="accessUrl">
                                <el-input v-model.trim="templateAccess.accessUrl"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="时间" prop="accessTime">
                                <el-input v-model.trim="templateAccess.accessTime"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="日期" prop="accessDay">
                                <el-input v-model.trim="templateAccess.accessDay"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="月份" prop="accessMonth">
                                <el-input v-model.trim="templateAccess.accessMonth"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="年份" prop="accessYear">
                                <el-input v-model.trim="templateAccess.accessYear"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="访问域名" prop="siteDomain">
                                <el-input v-model.trim="templateAccess.siteDomain"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="站点ID" prop="siteId">
                                <el-input v-model.trim="templateAccess.siteId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="templateAccess.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeTemplateAccessDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getTemplateAccessList,
        createOrUpdateTemplateAccess,
        delTemplateAccesss
    } from '@/api/statistics/templateAccess';

    export default {
        name: 'templateAccess',
        data() {
            return {
                templateAccessList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                templateAccess: {
                    id: undefined,
                    infoId: undefined,
                    catId: undefined,
                    infoTitle: undefined,
                    accessIp: undefined,
                    accessUrl: undefined,
                    accessTime: undefined,
                    accessDay: undefined,
                    accessMonth: undefined,
                    accessYear: undefined,
                    siteDomain: undefined,
                    siteId: undefined
                },
                templateAccessRules: {
                    infoId: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容ID'}
                    ],
                    catId: [
                        {required: true, message: this.$t("table.pleaseInput") + '栏目ID'}
                    ],
                    infoTitle: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容标题'}
                    ],
                    accessIp: [
                        {required: true, message: this.$t("table.pleaseInput") + '访问者IP'}
                    ],
                    accessUrl: [
                        {required: true, message: this.$t("table.pleaseInput") + 'URL'}
                    ],
                    accessTime: [
                        {required: true, message: this.$t("table.pleaseInput") + '时间'}
                    ],
                    accessDay: [
                        {required: true, message: this.$t("table.pleaseInput") + '日期'}
                    ],
                    accessMonth: [
                        {required: true, message: this.$t("table.pleaseInput") + '月份'}
                    ],
                    accessYear: [
                        {required: true, message: this.$t("table.pleaseInput") + '年份'}
                    ],
                    siteDomain: [
                        {required: true, message: this.$t("table.pleaseInput") + '访问域名'}
                    ],
                    siteId: [
                        {required: true, message: this.$t("table.pleaseInput") + '站点ID'}
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
                    create: this.permission.templateAccess_create,
                    update: this.permission.templateAccess_update,
                    delete: this.permission.templateAccess_delete
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
                this.templateAccessList = undefined;
                this.total = undefined;
                getTemplateAccessList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.templateAccessList = response.data.records;
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
                this.resetTemplateAccess();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetTemplateAccess();
                if (row.id) {
                    this.templateAccess = deepClone(row);
                } else {
                    this.templateAccess = deepClone(this.selectedRows[0]);
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
                this.$refs['templateAccessDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateTemplateAccess(this.templateAccess).then(() => {
                            this.resetTemplateAccessDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['templateAccessDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateTemplateAccess(this.templateAccess).then(() => {
                            this.resetTemplateAccessDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delTemplateAccesss(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetTemplateAccess(){
                this.templateAccess = {
                    id: undefined,
                    infoId: undefined,
                    catId: undefined,
                    infoTitle: undefined,
                    accessIp: undefined,
                    accessUrl: undefined,
                    accessTime: undefined,
                    accessDay: undefined,
                    accessMonth: undefined,
                    accessYear: undefined,
                    siteDomain: undefined,
                    siteId: undefined
                }
            },
            resetTemplateAccessDialogAndList(){
                this.closeTemplateAccessDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeTemplateAccessDialog() {
                this.dialogVisible = false;
                this.resetTemplateAccess();
                this.$refs['templateAccessDialogForm'].resetFields();
            }
        }
    }
</script>


