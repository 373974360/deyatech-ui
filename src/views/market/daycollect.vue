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
            <el-table :data="daycollectList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
<!--                <el-table-column align="center" label="" prop="marketId"/>-->
<!--                <el-table-column align="center" label="" prop="typeId"/>-->
<!--                <el-table-column align="center" label="" prop="productId"/>-->
                <el-table-column align="center" label="价格" prop="price"/>
                <el-table-column align="center" label="单位" prop="unit"/>
                <el-table-column align="center" label="收款日期" prop="collectDate"/>
                <el-table-column align="center" label="是否出售" prop="isSell"/>
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
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeDaycollectDialog">
                <el-form ref="daycollectDialogForm" class="deyatech-form" :model="daycollect" label-position="right"
                         label-width="80px" :rules="daycollectRules">
                    <!--<el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="" prop="marketId">
                                <el-input v-model.trim="daycollect.marketId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="" prop="typeId">
                                <el-input v-model.trim="daycollect.typeId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                    <el-row :gutter="20" :span="24">
                        <!--<el-col :span="12">
                            <el-form-item label="" prop="productId">
                                <el-input v-model.trim="daycollect.productId"></el-input>
                            </el-form-item>
                        </el-col>-->
                        <el-col :span="12">
                            <el-form-item label="价格" prop="price">
                                <el-input v-model.trim="daycollect.price"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="单位" prop="unit">
                                <el-input v-model.trim="daycollect.unit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="收款日期" prop="collectDate">
                                <el-input v-model.trim="daycollect.collectDate"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否出售" prop="isSell">
                                <el-input v-model.trim="daycollect.isSell"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="daycollect.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeDaycollectDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getDaycollectList,
        createOrUpdateDaycollect,
        delDaycollects
    } from '@/api/market/daycollect';

    export default {
        name: 'daycollect',
        data() {
            return {
                daycollectList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                daycollect: {
                    id: undefined,
                    marketId: undefined,
                    typeId: undefined,
                    productId: undefined,
                    price: undefined,
                    unit: undefined,
                    collectDate: undefined,
                    isSell: undefined
                },
                daycollectRules: {
                    marketId: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ],
                    typeId: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ],
                    productId: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ],
                    price: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ],
                    unit: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ],
                    collectDate: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ],
                    isSell: [
                        {required: true, message: this.$t("table.pleaseInput") + ''}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
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
                    create: this.permission.daycollect_create,
                    update: this.permission.daycollect_update,
                    delete: this.permission.daycollect_delete
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
                this.daycollectList = undefined;
                this.total = undefined;
                getDaycollectList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.daycollectList = response.data.records;
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
                this.resetDaycollect();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetDaycollect();
                if (row.id) {
                    this.daycollect = deepClone(row);
                } else {
                    this.daycollect = deepClone(this.selectedRows[0]);
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
                this.$refs['daycollectDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateDaycollect(this.daycollect).then(() => {
                            this.resetDaycollectDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['daycollectDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateDaycollect(this.daycollect).then(() => {
                            this.resetDaycollectDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delDaycollects(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetDaycollect(){
                this.daycollect = {
                    id: undefined,
                    marketId: undefined,
                    typeId: undefined,
                    productId: undefined,
                    price: undefined,
                    unit: undefined,
                    collectDate: undefined,
                    isSell: undefined
                }
            },
            resetDaycollectDialogAndList(){
                this.closeDaycollectDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeDaycollectDialog() {
                this.dialogVisible = false;
                this.resetDaycollect();
                this.$refs['daycollectDialogForm'].resetFields();
            },
        }
    }
</script>


