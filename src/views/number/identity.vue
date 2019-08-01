<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" style="width: 240px" placeholder="请输入姓名、身份证号码或电话号码" v-model.trim="listQuery.name"></el-input>
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
                    <el-button type="primary" :size="btnSize" icon="el-icon-download" @click="export2Excel">数据导出</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="identityList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="姓名" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="性别" prop="gender">
                    <template slot-scope="scope">
                        <span>{{scope.row.gender | enums('GenderEnum')}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="身份证号" prop="idcardNo"/>
                <el-table-column align="center" label="出生日期" prop="birthday"/>
                <el-table-column align="center" label="联系地址" prop="address"/>
                <el-table-column align="center" label="手机号码" prop="phone"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeIdentityDialog">
                <el-form ref="identityDialogForm" class="deyatech-form" :model="identity" label-position="right"
                         label-width="80px" :rules="identityRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model.trim="identity.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="gender">
                                <el-radio-group v-model="identity.gender">
                                    <el-radio v-for="item in enums['GenderEnum']" :label="item.code">{{item.value}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="身份证号" prop="idcardNo">
                                <el-input @blur="bindingIdCardGainBirth" v-model.trim="identity.idcardNo"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="出生日期" prop="birthday">
                                <el-input v-model="identity.birthday" :readonly="isreadOnly"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="联系地址" prop="address">
                                <el-input v-model.trim="identity.address"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号码" prop="phone">
                                <el-input v-model.trim="identity.phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="identity.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeIdentityDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getIdentityList,
        createOrUpdateIdentity,
        delIdentitys
    } from '@/api/number/identity';
    import {isvalidatemobile,cardid,validatename,isStartOrEndWithWhiteSpace,validatenull} from '@/util/validate';
    export default {
        name: 'identity',
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
            const validateMobile = (rule,value,callback) => {
                let result = isvalidatemobile(value);
                if (result[0]){
                    callback(new Error(result[1]));
                }else {
                    callback();
                }
            };
            const validateIdCard = (rule,value,callback) => {
                let result = cardid(value);
                if (result[0]){
                    callback(new Error(result[1]));
                }else{
                    callback();
                }
            };

            return {
                identityList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                identity: {
                    id: undefined,
                    idcardNo: undefined,
                    name: undefined,
                    gender: undefined,
                    birthday: undefined,
                    address: undefined,
                    avatar: undefined,
                    phone: undefined,
                    wechatOpenid: undefined
                },
                identityRules: {
                    idcardNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '身份证号码'},
                        {min: 18, max: 18, message: '请输入正确的身份证号码', trigger: 'blur'},
                        {validator: validateIdCard, trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '姓名'},
                        {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    gender: [
                        {required: true, message: this.$t("table.pleaseSelect") + '性别'}
                    ],
                    birthday: [
                        {required: true, message: this.$t("table.confirm") + '出生日期'}
                    ],
                    address: [
                        {required: true, message: this.$t("table.pleaseInput") + '联系地址'}
                    ],
                    avatar: [
                        {required: true, message: this.$t("table.pleaseInput") + '头像base64编码'}
                    ],
                    phone: [
                        {required: true, message: this.$t("table.pleaseInput") + '手机号码'},
                        {min: 11, max: 11, message: '长度11个数字', trigger: 'blur'},
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    wechatOpenid: [
                        {required: true, message: this.$t("table.pleaseInput") + '微信openId'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                isreadOnly: true
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
                    create: this.permission.identity_create,
                    update: this.permission.identity_update,
                    delete: this.permission.identity_delete
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
            searchReloadList(){
                this.listQuery.page = 1;
                this.reloadList();
            },
            reloadList(){
                this.listLoading = true;
                this.identityList = undefined;
                this.total = undefined;
                getIdentityList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.identityList = response.data.records;
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
                this.resetIdentity();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetIdentity();
                if (row.id) {
                    this.identity = deepClone(row);
                } else {
                    this.identity = deepClone(this.selectedRows[0]);
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
                this.$refs['identityDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateIdentity(this.identity).then(() => {
                            this.resetIdentityDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['identityDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateIdentity(this.identity).then(() => {
                            this.resetIdentityDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delIdentitys(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetIdentity(){
                this.identity = {
                    id: undefined,
                    idcardNo: undefined,
                    name: undefined,
                    gender: undefined,
                    birthday: undefined,
                    address: undefined,
                    avatar: undefined,
                    phone: undefined,
                    wechatOpenid: undefined
                }
            },
            resetIdentityDialogAndList(){
                this.closeIdentityDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeIdentityDialog() {
                this.dialogVisible = false;
                this.resetIdentity();
                this.$refs['identityDialogForm'].resetFields();
            },
            /**
             *根据身份证获取出生日期
             */
            bindingIdCardGainBirth() {
                let birthday = '';
                if(!validatenull(this.identity.idcardNo)){
                   if(this.identity.idcardNo.length === 18){
                       birthday = this.identity.idcardNo.substr(6,8);
                    }

                    birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
                }

                this.identity.birthday = birthday;
            },
            export2Excel() {
                require.ensure([], () => {
                    const Export2excel = require('@/excel/Export2excel');
                    //对应表格输出的title
                    const tHeader = ['姓名', '性别', '身份证号', '出生日期', '联系地址', "手机号码"];
                    // 对应表格输出的数据
                    const filterVal = ['name', 'gender', 'idcardNo', 'birthday', 'address', 'phone'];
                    if (this.total < this.listQuery.size && this.identityList) {
                        const data = this.identityList;
                        const excelData = this.formatJson(filterVal, data);
                        //对应下载文件的名字
                        Export2excel.export2Excel(tHeader, excelData, '用户信息excel' + new Date().toLocaleDateString().replace(/\//g,'-'));
                    } else {
                        const page = this.listQuery.page;
                        const size = this.listQuery.size;
                        this.listQuery.page = 1;
                        this.listQuery.size = 99999;
                        getIdentityList(this.listQuery).then(response => {
                            const data = response.data.records;
                            this.listQuery.page = page;
                            this.listQuery.size = size;
                            const excelData = this.formatJson(filterVal, data);
                            //对应下载文件的名字
                            Export2excel.export2Excel(tHeader, excelData, '用户信息excel' + new Date().toLocaleDateString().replace(/\//g,'-'));
                        })

                    }
                })               
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(data => {
                    if (data.gender == 1) {
                        data.gender = '男'
                    } else if (data.gender == 0) {
                        data.gender = '女'
                    } else {
                        data.gender = '未知'
                    }
                    return filterVal.map(j => data[j])
                });
            }
        }
    }
</script>


