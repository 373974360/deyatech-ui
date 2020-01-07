<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-cascader :options="departmentCascader" @change="handleDepartmentChange" v-model="selectedOptions"
                                     class="dialog-search-item dialog-keywords" ref="mycascader"
                                     :show-all-levels="false" expand-trigger="hover" clearable change-on-select
                                     :size="searchSize" placeholder="根据市场筛选"></el-cascader>
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
                        <el-date-picker
                            :size="searchSize"
                            v-model.trim="addTimeRange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="添加开始时间"
                            end-placeholder="添加结束时间"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchReloadList">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                        <el-button type="primary" :size="btnSize" @click="export2Excel">
                            导出<i class="el-icon-download el-icon--right"></i>
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                    <el-upload
                        style="display: inline; margin-left: 10px;"
                        :limit="10"
                        :beforeUpload="beforeUpload"
                        :headers="initHeaders"
                        action="/manage/market/priceInfo/importExcel"
                        :data="{importType: importType}"
                        :on-success="importSuccess"
                        :on-error="importError">
                        <el-button v-if="btnEnable.wholesaleImport" type="primary" :size="btnSize" @click="importExcel1">批发数据导入<i class="el-icon-upload el-icon--right"></i></el-button>
                        <el-button v-if="btnEnable.retailImport" type="primary" :size="btnSize" @click="importExcel2">零售数据导入<i class="el-icon-upload el-icon--right"></i></el-button>
                        <el-button v-if="btnEnable.locationImport" type="primary" :size="btnSize" @click="importExcel3">产地数据导入<i class="el-icon-upload el-icon--right"></i></el-button>
                        <el-button v-if="btnEnable.agriculturalImport" type="primary" :size="btnSize" @click="importExcel4">农资数据导入<i class="el-icon-upload el-icon--right"></i></el-button>
                    </el-upload>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button type="primary" :size="btnSize" style="margin-right: 10px">数据样表下载<i class="el-icon-document el-icon--right"></i></el-button>
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <template v-if="allMarketType && allMarketType.length > 0">
                <el-tabs class="table-tab" type="card" @tab-click="handleTabClick">
                    <el-tab-pane v-for="item in allMarketType" :label="item.marketName"></el-tab-pane>
                </el-tabs>
            </template>
            <el-table :data="priceInfoList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="产品名称" prop="productName"/>
                <el-table-column align="center" label="产品分类" prop="typeName"/>
<!--                <el-table-column align="center" label="市场分类" prop="marketName"/>-->
                <el-table-column align="center" label="价格" prop="price"/>
                <el-table-column align="center" label="单位" prop="unit"/>
                <el-table-column align="center" label="市场名称" prop="scName"/>
                <el-table-column align="center" label="批发/零售" prop="isSell">
                    <template slot-scope="scope">
                        {{scope.row.isSell | isSell}}
                    </template>
                </el-table-column>
<!--                <el-table-column align="center" label="产地" prop="location"/>-->
<!--                <el-table-column align="center" label="产品等级" prop="productLevel"/>-->
<!--                <el-table-column align="center" label="上市量" prop="landings"/>-->
<!--                <el-table-column align="center" label="交易量" prop="tradings"/>-->
<!--                <el-table-column align="center" label="来源" prop="sourceFrom"/>-->
                <el-table-column align="center" label="添加时间" prop="addTime"/>
                <el-table-column align="center" label="添加用户" prop="addUser"/>
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
                            <el-form-item label="售卖方式" prop="isSell">
                                <el-radio-group v-model.trim="priceInfo.isSell"
                                                :disabled="!priceInfo.marketName || priceInfo.marketName.indexOf('批发') == -1 && priceInfo.marketName.indexOf('零售') == -1">
                                    <el-radio :label="0">批发</el-radio>
                                    <el-radio :label="1">零售</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="产地" prop="location">
                                <el-input v-model.trim="priceInfo.location"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="产品等级" prop="productLevel">
                                <el-input v-model.trim="priceInfo.productLevel"></el-input>
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
                        <el-col :span="24">
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
        delPriceInfos,
        getAllPriceInfo,
        validatePrice
    } from '@/api/market/priceInfo';
    import {getAllMarketType}from '@/api/market/marketType';
    import {getAllProductType} from '@/api/market/productType';
    import {getAllProduct} from '@/api/market/product';
    import {getToken} from '@/util/auth';
    import {getDepartmentCascader} from "@/api/admin/department";

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
            const validateIsSell = (rule, value, callback) => {
                if (this.priceInfo.marketName && (this.priceInfo.marketName.indexOf("批发") != -1 || this.priceInfo.marketName.indexOf("零售") != -1)
                        && value != 0 && value != 1) {
                    callback(new Error(this.$t("table.pleaseSelect") + '售卖方式'));
                } else {
                    callback();
                }
            };
            return {
                priceInfoList: [],
                total: 0,
                listLoading: true,
                addTimeRange: undefined,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    addStartTime: undefined,
                    addEndTime: undefined,
                    productName: undefined,
                    marketId: undefined,
                    typeId: undefined,
                    scName: undefined,
                    isSell: undefined,
                },
                priceInfo: {
                    id: undefined,
                    marketId: undefined,
                    typeId: undefined,
                    productId: undefined,
                    price: undefined,
                    unit: undefined,
                    isSell: undefined,
                    location: undefined,
                    productLevel: undefined,
                    landings: undefined,
                    tradings: undefined,
                    sourceFrom: undefined,
                    marketName: undefined,
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
                    isSell: [
                        {validator: validateIsSell, trigger: 'blur'}
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
                initHeaders: {"Deyatech-Token": getToken()},
                importType: undefined,
                productTypeQuery: [],
                departmentCascader: [],
                selectedOptions: [],
            }
        },
        filters: {
            isSell: function (code) {
                var value = '';
                switch (code) {
                    case 0: value = "批发"; break;
                    case 1: value = "零售"; break;
                }
                return value;
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
                    delete: this.permission.priceInfo_delete,
                    wholesaleImport: this.permission.wholesale_import,
                    retailImport: this.permission.retail_import,
                    locationImport: this.permission.location_import,
                    agriculturalImport: this.permission.agricultural_import,
                };
            }
        },
        created(){
            this.loadDepartment();
            Promise.all([this.getAllMarketType(), this.getAllProductType()]).then(() => {
                this.handleTabClick();
            });
            this.getAllProduct();
        },
        methods: {
            loadDepartment() {
                getDepartmentCascader().then(response => {
                    this.departmentCascader = response.data
                })
            },
            handleDepartmentChange(val) {
                if (val.length > 0) {
                    const cascaderObj = this.getCascaderObj(val, this.departmentCascader);
                    this.listQuery.scName = cascaderObj.label;
                } else {
                    this.listQuery.scName = undefined;
                }
            },
            getCascaderObj(val, opt) {
                const selectList = val.map(function (value, index, array) {
                    for (var itm of opt) {
                        if (itm.value == value) { opt = itm.children; return itm; }
                    }
                    return null;
                });
                return selectList.find((obj)=>{
                    return obj.value === val[val.length - 1];
                });
            },
            resetSearch(){
                this.addTimeRange = undefined;
                this.listQuery.addStartTime = undefined;
                this.listQuery.addEndTime = undefined;
                this.listQuery.productName = undefined;
                this.listQuery.typeId = undefined;
                this.listQuery.scName = undefined;
                this.selectedOptions = [];
            },
            searchReloadList() {
                if (this.addTimeRange) {
                    this.listQuery.addStartTime = this.addTimeRange[0];
                    this.listQuery.addEndTime = this.addTimeRange[1];
                }
                this.handleCurrentChange(1);
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
                    this.productTypeFormFilter(row.marketId);
                    this.productFormFilter(row.typeId);
                    this.priceInfo = deepClone(row);
                } else {
                    this.productTypeFormFilter(this.selectedRows[0].marketId);
                    this.productTypeFormFilter(this.selectedRows[0].typeId);
                    this.priceInfo = deepClone(this.selectedRows[0]);
                }
                this.priceInfo.price = this.priceInfo.price + '';
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
            validatePrice() {
                return new Promise((resolve, reject) => {
                    validatePrice(this.priceInfo).then(response => {
                        if (!response.data) {
                            resolve(response);
                        } else {
                            this.$message.error("保存或者更新失败，价格涨幅波动过大");
                        }
                    }).catch(error => {
                        reject(error);
                    });
                });
            },
            doCreate(){
                this.$refs['priceInfoDialogForm'].validate(valid => {
                    if(valid) {
                        // 校验价格
                        var _this = this;
                        this.validatePrice().then(function () {
                            _this.submitLoading = true;
                            createOrUpdatePriceInfo(_this.priceInfo).then(() => {
                                _this.resetPriceInfoDialogAndList();
                                _this.$message.success(_this.$t("table.createSuccess"));
                            })
                        });
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
                    isSell: undefined,
                    location: undefined,
                    productLevel: undefined,
                    landings: undefined,
                    tradings: undefined,
                    sourceFrom: undefined,
                    marketName: undefined,
                }
            },
            resetPriceInfoDialogAndList(){
                this.closePriceInfoDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closePriceInfoDialog() {
                this.dialogVisible = false;
                this.productTypeForm = [];
                this.productForm = [];
                this.resetPriceInfo();
                this.$refs['priceInfoDialogForm'].resetFields();
            },
            getAllMarketType(){
                return new Promise((resolve, reject) => {
                    this.allMarketType = [];
                    getAllMarketType().then(response => {
                        if (response.data && response.data.length > 0) {
                            for(let marketType of response.data) {
                                if (marketType.id == 1 || marketType.marketName.indexOf('批发零售') != -1) {
                                    const wholesale = deepClone(marketType);
                                    wholesale.marketName = '批发市场';
                                    const retail = deepClone(marketType);
                                    retail.marketName = '零售市场';
                                    this.allMarketType.push(wholesale);
                                    this.allMarketType.push(retail);
                                } else {
                                    this.allMarketType.push(marketType);
                                }
                            }
                        }
                        resolve();
                    }).catch(err => {
                        reject(err);
                    })
                });
            },
            getAllProductType(){
                return new Promise((resolve, reject) => {
                    this.allProductType = [];
                    getAllProductType().then(response => {
                        this.allProductType = response.data;
                        resolve();
                    }).catch(err => {
                        reject(err);
                    })
                });
            },
            getAllProduct(){
                this.allProduct = [];
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
                let marketType = {};
                marketType = this.allMarketType.find((marketType)=>{
                    return marketType.id === marketId;
                });
                this.priceInfo.marketName = marketType.marketName;
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
            export2Excel() {
                if (!this.addTimeRange) {
                    this.$message.error('请选择时间');
                    return;
                }
                this.listQuery.addStartTime = this.addTimeRange[0];
                this.listQuery.addEndTime = this.addTimeRange[1];
                getAllPriceInfo(this.listQuery).then(response => {
                    if (response.data.length == 0) {
                        this.$message.warning('数据为空');
                        return;
                    }
                    require.ensure([], () => {
                        const Export2excel = require('@/excel/Export2excel');
                        //对应表格输出的title
                        const tHeader = ['序号', '市场分类', '产品分类', '产品名称', '价格', '单位', '市场名称', '批发/零售',
                            '产地', '产品级别', '上市量', '交易量', '来源', '备注', '导入时间', '添加用户'];
                        // 对应表格输出的数据
                        const filterVal = ['rowNumber', 'marketName', 'typeName', 'productName', 'price', 'unit', 'scName', 'isSell',
                            'location', 'productLevel', 'landings', 'tradings', 'sourceFrom', 'remark', 'addTime', 'addUser'];
                        const excelData = this.formatJson(filterVal, response.data);
                        //对应下载文件的名字
                        Export2excel.export2Excel(tHeader, excelData, '价格信息excel' + new Date().toLocaleDateString().replace(/\//g,'-'));
                    })
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(
                    function (c) {
                        let result = ''
                        if (c == 'isSell') {
                            switch (v[c]) {
                                case 0: result = '批发'; break;
                                case 1: result = '零售'; break;
                            }
                        } else {
                            result = v[c];
                        }
                        return result;
                    }
                ))
            },
            beforeUpload(file) {
                const suffix = file.name.substring(file.name.lastIndexOf('.')+1);
                const extension = suffix === 'xls';
                const extension2 = suffix === 'xlsx';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if(!extension && !extension2) {
                    this.$message({
                        message: '上传文件只能是 xls、xlsx格式!',
                        type: 'warning'
                    });
                }
                if(!isLt2M) {
                    this.$message({
                        message: '上传文件大小不能超过 2MB!',
                        type: 'warning'
                    });
                }
                const flag = (extension || extension2) && isLt2M;
                if (flag) {
                    this.listLoading = true;
                }
                return flag;
            },
            importSuccess(response) {
                this.listLoading = false;
                this.importType = undefined;
                if(response.status == 200) {
                    const map = response.data;
                    this.$message.success("上传成功！上传成功 " + map.successCount + " 条，上传失败 " + map.failCount + "条！请稍后查询！");
                    this.reloadList();
                } else {
                    this.$message.error(response.message);
                }
            },
            importError() {
                this.listLoading = false;
                this.importType = undefined;
                this.$message.error("上传失败！");
            },
            importExcel1() {this.importType = '1';},
            importExcel2() {this.importType = '2';},
            importExcel3() {this.importType = '3';},
            importExcel4() {this.importType = '4';},
            productTypeQueryFilter(marketId) {
                this.listQuery.typeId = undefined;
                this.productTypeQuery = [];
                for (let productType of this.allProductType) {
                    if (marketId == productType.marketId) {
                        this.productTypeQuery.unshift(productType);
                    }
                }
            },
            handleTabClick(tab) {
                var label = ''
                if (tab) {
                    label = tab.label;
                } else {
                    label = this.allMarketType[0].marketName;
                }
                if (label == '批发市场') {
                    this.listQuery.isSell = 0;
                } else if (label == '零售市场') {
                    this.listQuery.isSell = 1;
                } else {
                    this.listQuery.isSell = undefined;
                }
                const marketType = this.allMarketType.find((marketType)=>{
                    return marketType.marketName === label;
                });
                this.listQuery.marketId = marketType.id;
                this.productTypeQueryFilter(this.listQuery.marketId);
                this.reloadList();
            }
        }
    }
</script>

<style>
    .table-tab > .el-tabs__header {
        border-bottom: none;
    }
    .table-tab .el-tabs__header {
        margin: 0;
    }
</style>
