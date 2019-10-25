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
            <el-table :data="priceInfoList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="产品名称" prop="productName"/>
                <el-table-column align="center" label="产品分类" prop="typeName"/>
                <el-table-column align="center" label="市场分类" prop="marketName"/>
                <el-table-column align="center" label="价格" prop="price"/>
                <el-table-column align="center" label="单位" prop="unit"/>
                <el-table-column align="center" label="市场名称" prop="scName"/>
<!--                <el-table-column align="center" label="批发/零售" prop="isSell"/>-->
<!--                <el-table-column align="center" label="产地" prop="location"/>-->
<!--                <el-table-column align="center" label="产品等级" prop="productLevel"/>-->
<!--                <el-table-column align="center" label="上市量" prop="landings"/>-->
<!--                <el-table-column align="center" label="交易量" prop="tradings"/>-->
<!--                <el-table-column align="center" label="来源" prop="sourceFrom"/>-->
                <el-table-column align="center" label="添加时间" prop="createTime"/>
                <el-table-column align="center" label="添加用户" prop="createBy"/>
                <el-table-column align="center" label="备注" prop="remark"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closePriceInfoDialog">
                <el-form ref="priceInfoDialogForm" class="deyatech-form" :model="priceInfo" label-position="right"
                         label-width="80px" :rules="priceInfoRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="市场分类" prop="marketId">
                                <el-select v-model.trim="priceInfo.marketId" :placeholder="$t('table.pleaseSelect') + '市场分类'" style="width: 100%" @change="productTypeFormFilter">
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
                                <el-select v-model.trim="priceInfo.typeId" :placeholder="$t('table.pleaseSelect') + '产品分类'" style="width: 100%" @change="productFormFilter">
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
                            <el-form-item label="产品名称" prop="productId">
                                <el-select v-model.trim="priceInfo.productId" :placeholder="$t('table.pleaseSelect') + '产品名称'" style="width: 100%">
                                    <el-option
                                        v-for="item in productForm"
                                        :key="item.id"
                                        :label="item.productName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="价格" prop="price">
                                <el-input v-model.trim="priceInfo.price"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="单位" prop="unit">
                                <el-input v-model.trim="priceInfo.unit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="产地" prop="location">
                                <el-input v-model.trim="priceInfo.location"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="上市量" prop="landings">
                                <el-input v-model.trim="priceInfo.landings"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="交易量" prop="tradings">
                                <el-input v-model.trim="priceInfo.tradings"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="产品等级" prop="productLevel">
                                <el-input v-model.trim="priceInfo.productLevel"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="来源" prop="sourceFrom">
                                <el-input v-model.trim="priceInfo.sourceFrom"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model.trim="priceInfo.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closePriceInfoDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getPriceInfoList,
        createOrUpdatePriceInfo,
        delPriceInfos
    } from '@/api/market/priceInfo';
    import {getAllMarketType}from '@/api/market/marketType';
    import {getAllProductType} from '@/api/market/productType';
    import {getAllProduct} from '@/api/market/product';

    export default {
        name: 'priceInfo',
        data() {
            const validatePrice = (rule, value, callback) => {
                const reg = /^([1-9][0-9]*|0)([.][0-9]{1,2})?$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error(this.$t("table.pleaseInput") + '正确价格，小数点后最多两位'));
                }
            };
            return {
                priceInfoList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                priceInfo: {
                    id: undefined,
                    marketId: undefined,
                    typeId: undefined,
                    productId: undefined,
                    price: undefined,
                    unit: undefined,
                    location: undefined,
                    landings: undefined,
                    tradings: undefined,
                    productLevel: undefined,
                    sourceFrom: undefined,
                },
                priceInfoRules: {
                    marketId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '市场分类'}
                    ],
                    typeId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '产品分类'}
                    ],
                    productId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '产品名称'}
                    ],
                    price: [
                        {required: true, message: this.$t("table.pleaseInput") + '价格'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'},
                        {validator: validatePrice, trigger: 'blur'}
                    ],
                    unit: [
                        {required: true, message: this.$t("table.pleaseInput") + '单位(例：元/公斤 元/升)'},
                        {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'},
                    ],
                    location: [
                        {min: 0, max: 1000, message: '长度在 0 到 1000 个字符', trigger: 'blur'},
                    ],
                    landings: [
                        {min: 0, max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur'},
                    ],
                    tradings: [
                        {min: 0, max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur'},
                    ],
                    productLevel: [
                        {min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur'},
                    ],
                    sourceFrom: [
                        {min: 0, max: 2000, message: '长度在 0 到 2000 个字符', trigger: 'blur'},
                    ],
                    remark: [
                        {max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur'}
                    ],
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                departmentCascader: [],
                allMarketType: [],
                allProductType: [],
                allProduct: [],
                productTypeForm: [],
                productForm: [],
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
                    create: this.permission.priceInfo_create,
                    update: this.permission.priceInfo_update,
                    delete: this.permission.priceInfo_delete
                };
            }
        },
        created(){
            this.getAllMarketType();
            this.getAllProductType();
            this.getAllProduct();
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.priceInfoList = undefined;
                this.total = undefined;
                getPriceInfoList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.priceInfoList = response.data.records;
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
                this.resetPriceInfo();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetPriceInfo();
                if (row.id) {
                    this.priceInfo = deepClone(row);
                } else {
                    this.priceInfo = deepClone(this.selectedRows[0]);
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
                this.$refs['priceInfoDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdatePriceInfo(this.priceInfo).then(() => {
                            this.resetPriceInfoDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['priceInfoDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdatePriceInfo(this.priceInfo).then(() => {
                            this.resetPriceInfoDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delPriceInfos(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetPriceInfo(){
                this.priceInfo = {
                    id: undefined,
                    marketId: undefined,
                    typeId: undefined,
                    productId: undefined,
                    price: undefined,
                    unit: undefined,
                    location: undefined,
                    landings: undefined,
                    tradings: undefined,
                    productLevel: undefined,
                    sourceFrom: undefined,
                }
            },
            resetPriceInfoDialogAndList(){
                this.closePriceInfoDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closePriceInfoDialog() {
                this.dialogVisible = false;
                this.resetPriceInfo();
                this.$refs['priceInfoDialogForm'].resetFields();
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
            getAllProduct(){
                getAllProduct().then(response => {
                    this.allProduct = response.data;
                })
            },
            productTypeFormFilter(marketId) {
                this.priceInfo.typeId = undefined;
                this.priceInfo.productId = undefined;
                this.productTypeForm = [];
                this.productForm = [];
                for (let productType of this.allProductType) {
                    if (marketId == productType.marketId) {
                        this.productTypeForm.push(productType);
                    }
                }
            },
            productFormFilter(typeId) {
                this.priceInfo.productId = undefined;
                this.productForm = [];
                for (let product of this.allProduct) {
                    if (typeId == product.typeId) {
                        this.productForm.push(product);
                    }
                }
            },
        }
    }
</script>


