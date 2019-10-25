<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-select :size="searchSize" :placeholder="$t('table.pleaseSelect') + '市场分类'" v-model.trim="listQuery.marketId" @change="productTypeQueryFilter">
                            <el-option
                                v-for="item in allMarketType"
                                :key="item.id"
                                :label="item.marketName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" :placeholder="$t('table.pleaseSelect') + '产品分类'" v-model.trim="listQuery.typeId">
                            <el-option
                                ref="productTypeQuery"
                                v-for="item in productTypeQuery"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '产品名称'" v-model.trim="listQuery.productName"></el-input>
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
            <el-table :data="productList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="产品名称" prop="productName"/>
                <el-table-column align="center" label="产品分类" prop="typeName"/>
                <el-table-column align="center" label="市场分类" prop="marketName"/>
                <el-table-column align="center" label="添加时间" prop="createTime"/>
                <el-table-column align="center" label="备注" prop="remark"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeProductDialog">
                <el-form ref="productDialogForm" class="deyatech-form" :model="product" label-position="right"
                         label-width="80px" :rules="productRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="市场分类" prop="marketId">
                                <el-select v-model.trim="product.marketId" :placeholder="$t('table.pleaseSelect') + '市场分类'" style="width: 100%" @change="productTypeFormFilter">
                                    <el-option
                                        v-for="item in allMarketType"
                                        :key="item.id"
                                        :label="item.marketName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="产品分类" prop="typeId">
                                <el-select v-model.trim="product.typeId" :placeholder="$t('table.pleaseSelect') + '产品分类'" style="width: 100%">
                                    <el-option
                                        v-for="item in productTypeForm"
                                        :key="item.id"
                                        :label="item.typeName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="产品名称" prop="productName">
                                <el-input v-model.trim="product.productName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model.trim="product.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeProductDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getProductList,
        createOrUpdateProduct,
        delProducts
    } from '@/api/market/product';
    import {getAllMarketType}from '@/api/market/marketType';
    import {getAllProductType} from '@/api/market/productType';

    export default {
        name: 'product',
        data() {
            return {
                productList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    productName: undefined,
                    marketId: undefined,
                    typeId: undefined,
                },
                product: {
                    id: undefined,
                    marketId: undefined,
                    typeId: undefined,
                    productName: undefined,
                    remark: undefined,
                },
                productRules: {
                    marketId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '市场分类'}
                    ],
                    typeId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '产品分类'}
                    ],
                    productName: [
                        {required: true, message: this.$t("table.pleaseInput") + '产品名称'},
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                    ],
                    remark: [
                        {max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur'}
                    ],
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                allMarketType: [],
                allProductType: [],
                productTypeForm: [],
                productTypeQuery: [],
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
                    create: this.permission.product_create,
                    update: this.permission.product_update,
                    delete: this.permission.product_delete
                };
            }
        },
        created(){
            this.getAllMarketType();
            this.getAllProductType();
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.productName = undefined;
                this.listQuery.marketId = undefined;
                this.listQuery.typeId = undefined;
                this.productTypeQuery = [];
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.productList = undefined;
                this.total = undefined;
                getProductList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.productList = response.data.records;
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
                this.resetProduct();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetProduct();
                if (row.id) {
                    this.productTypeFormFilter(row.marketId);
                    this.product = deepClone(row);
                } else {
                    this.productTypeFormFilter(this.selectedRows[0].marketId);
                    this.product = deepClone(this.selectedRows[0]);
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
                this.$refs['productDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateProduct(this.product).then(() => {
                            this.resetProductDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['productDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateProduct(this.product).then(() => {
                            this.resetProductDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delProducts(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetProduct(){
                this.product = {
                    id: undefined,
                    marketId: undefined,
                    typeId: undefined,
                    productName: undefined,
                    addTime: undefined,
                    comments: undefined,
                    status: undefined
                }
            },
            resetProductDialogAndList(){
                this.closeProductDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeProductDialog() {
                this.dialogVisible = false;
                this.productTypeForm = [];
                this.resetProduct();
                this.$refs['productDialogForm'].resetFields();
            },
            getAllMarketType(){
                getAllMarketType().then(response => {
                    this.allMarketType = response.data;
                })
            },
            getAllProductType(){
                getAllProductType().then(response => {
                    this.allProductType = response.data;
                })
            },
            productTypeFormFilter(marketId) {
                this.product.typeId = undefined;
                this.productTypeForm = [];
                for (let productType of this.allProductType) {
                    if (marketId == productType.marketId) {
                        this.productTypeForm.push(productType);
                    }
                }
            },
            productTypeQueryFilter(marketId) {
                this.listQuery.typeId = undefined;
                this.productTypeQuery = [];
                for (let productType of this.allProductType) {
                    if (marketId == productType.marketId) {
                        this.productTypeQuery.push(productType);
                    }
                }
            },
        }
    }
</script>


