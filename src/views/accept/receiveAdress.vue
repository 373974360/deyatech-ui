<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="请输入姓名、电话或地址" v-model="listQuery.name"></el-input>
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
            <el-table :data="receiveAdressList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="姓名" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="电话" prop="phone"/>
                <el-table-column align="center" label="地址" prop="address"/>
                <el-table-column align="center" label="邮编" prop="postCode"/>
                <el-table-column align="center" label="是否是默认地址" prop="defaultAble">
                    <template slot-scope="scope">
                        {{Number(scope.row.defaultAble) | enums('YesNoEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="$t('table.remark')" prop="remark"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeReceiveAdressDialog">
                <el-form ref="receiveAdressDialogForm" class="deyatech-form" :model="receiveAdress" label-position="right"
                         label-width="80px" :rules="receiveAdressRules">
                    <el-row :gutter="20" :span="24" style="margin-left: 30px">
                        <el-col :span="11">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="receiveAdress.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="电话" prop="phone">
                                <el-input v-model="receiveAdress.phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" style="margin-left: 30px">
                        <el-col :span="11">
                            <el-form-item label="地址" prop="address">
                                <el-input v-model="receiveAdress.address"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="邮编" prop="postCode">
                                <el-input v-model="receiveAdress.postCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" style="margin-left: 0px">
                        <el-col :span="11">
                            <el-form-item label="是否是默认地址" prop="defaultAble" label-width="100">
                                <el-switch
                                    v-model="receiveAdress.defaultAble"
                                    active-value="true"
                                    inactive-value="false">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" style="margin-left: 30px">
                        <el-col :span="22">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="receiveAdress.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeReceiveAdressDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getReceiveAdressList,
        createOrUpdateReceiveAdress,
        delReceiveAdresss
    } from '@/api/accept/receiveAdress';
    import {
        isvalidatemobile,
        isPhone,
        validatename,
        isStartOrEndWithWhiteSpace,
        isZipCode
    } from '@/util/validate';

    export default {
        name: 'receiveAdress',
        data() {
            const validateName = (rule,value,callback) => {
                if(isStartOrEndWithWhiteSpace(value)){
                    callback(new Error(this.$t("errorMsg.blankSpace")));
                    return;
                }
                if(!validatename(value)){
                    callback(new Error("请输入正确姓名"));
                    return;
                }
                callback();
            };
            const validatePhone = (rule,value,callback) => {
                let isMobileResult = isvalidatemobile(value);
                let isPhoneResult = isPhone(value);
                if (!isMobileResult[0] || isPhoneResult){
                    callback();
                }else{
                    callback(new Error("请输入正确电话"));
                }
            };
            const isWhiteSpace = (rule, value, callback) => {
                if (isStartOrEndWithWhiteSpace(value)) {
                    callback(new Error('输入空白字符无效'));
                } else {
                    callback();
                }
            };
            const validateZipCode = (rule,value,callback) => {
                if (isZipCode(value)){
                    callback();
                }else{
                    callback(new Error("请输入正确邮编"));
                }
            };
            return {
                receiveAdressList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                receiveAdress: {
                    id: undefined,
                    name: undefined,
                    phone: undefined,
                    address: undefined,
                    postCode: undefined,
                    defaultAble: undefined
                },
                receiveAdressRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '姓名'},
                        {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: this.$t("table.pleaseInput") + '电话'},
                        {validator: validatePhone, trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: this.$t("table.pleaseInput") + '地址'},
                        {max: 500, message: '最多 500 个字符', trigger: 'blur'},
                        {validator: isWhiteSpace, trigger: 'blur'}
                    ],
                    postCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '邮编'},
                        {validator: validateZipCode, trigger: 'blur'}
                    ],
                    remark: [
                        {max: 500, message: '最多 500 个字符', trigger: 'blur'}
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
                    create: this.permission.receiveAdress_create,
                    update: this.permission.receiveAdress_update,
                    delete: this.permission.receiveAdress_delete
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
                this.receiveAdressList = undefined;
                this.total = undefined;
                getReceiveAdressList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.receiveAdressList = response.data.records;
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
                this.resetReceiveAdress();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetReceiveAdress();
                if (row.id) {
                    this.receiveAdress = deepClone(row);
                } else {
                    this.receiveAdress = deepClone(this.selectedRows[0]);
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
                this.$refs['receiveAdressDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        if(this.receiveAdress.defaultAble == undefined) {
                            this.receiveAdress.defaultAble = false;
                        }
                        createOrUpdateReceiveAdress(this.receiveAdress).then(() => {
                            this.resetReceiveAdressDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['receiveAdressDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateReceiveAdress(this.receiveAdress).then(() => {
                            this.resetReceiveAdressDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delReceiveAdresss(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetReceiveAdress(){
                this.receiveAdress = {
                    id: undefined,
                    name: undefined,
                    phone: undefined,
                    address: undefined,
                    postCode: undefined,
                    defaultAble: undefined
                }
            },
            resetReceiveAdressDialogAndList(){
                this.closeReceiveAdressDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeReceiveAdressDialog() {
                this.dialogVisible = false;
                this.resetReceiveAdress();
                this.$refs['receiveAdressDialogForm'].resetFields();
            }
        }
    }
</script>


