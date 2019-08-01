<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="预审编号、办件编号或事项名称" v-model="listQuery.itemName" style="width: 215px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.status" placeholder="预审状态">
                            <el-option
                                v-for = "o in loadEnum('PreauditStatusEnum')"
                                :label="o.value"
                                :value="o.code">
                            </el-option>
                        </el-select>
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
            <el-table :data="preauditRecordList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column align="center" label="预审编号" prop="id"/>
                <el-table-column align="center" label="办件编号" prop="workNo"/>
                <el-table-column align="center" label="事项名称" prop="itemName"/>
                <!--<el-table-column align="center" label="材料版本" prop="materialsVersion"/>-->
                <!--<el-table-column align="center" label="前台用户编号" prop="memberId"/>-->
                <el-table-column align="center" label="阿里预审编号" prop="aliId"/>
                <el-table-column align="center" label="申请时间" prop="createTime"/>
                <el-table-column align="center" label="审核期限" prop="checkDeadline"/>
                <el-table-column align="center" label="预审状态" prop="status">
                    <template slot-scope="scope">
                        {{scope.row.status | enums('PreauditStatusEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="备注" prop="remark"/>
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                    <template slot-scope="scope">
                        <!--<el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop.safe="btnDelete(scope.row)"></el-button>-->
                        <el-button :title="scope.row.status == 1 ? '审核' : '查看'" :type="scope.row.status == 1 ? 'primary' : 'success'" :size="btnSize"
                                   @click.stop.safe="btnCheckOrView(scope.row)">{{scope.row.status == 1 ? '审核' : '查看'}}</el-button>
                        <el-button v-if="scope.row.operateTime" title="预审记录" type="danger" :size="btnSize"
                                   @click.stop.safe="btnPreauditReson(scope.row)">预审记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closePreauditRecordDialog">
                <el-form ref="preauditRecordDialogForm" class="deyatech-form" :model="preauditRecord" label-position="right"
                         label-width="80px" :rules="preauditRecordRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="办件编号" prop="workNo">
                                <el-input v-model="preauditRecord.workNo"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="事项编号" prop="itemId">
                                <el-input v-model="preauditRecord.itemId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="材料关联信息版本" prop="materialsVersion">
                                <el-input v-model="preauditRecord.materialsVersion"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="前台用户编号" prop="memberId">
                                <el-input v-model="preauditRecord.memberId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="阿里预审编号" prop="aliId">
                                <el-input v-model="preauditRecord.aliId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="预审状态" prop="status">
                                <el-input v-model="preauditRecord.status"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="preauditRecord.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closePreauditRecordDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <el-dialog :title="checkOrViewDialogTitle" :visible.sync="checkOrViewDialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeCheckOrViewDialog">
                <div v-if="member.infoPerson">
                    <h2 class="h2-style-show">申请人信息：</h2>
                    <table class="viewTable">
                        <tr>
                            <td class="column">姓名</td>
                            <td>{{this.member.infoPerson.customerName}}</td>
                        </tr>
                        <tr>
                            <td class="column">身份证号</td>
                            <td>{{this.member.infoPerson.idNumber}}</td>
                        </tr>
                        <tr>
                            <td class="column">手机</td>
                            <td>{{this.member.infoPerson.customerPhone}}</td>
                        </tr>
                        <tr>
                            <td class="column">地址</td>
                            <td>{{this.member.infoPerson.customerAddress}}</td>
                        </tr>
                    </table>
                </div>
                <div v-if="member.infoLegal">
                    <h2 class="h2-style-show">办事企业/机构信息：</h2>
                    <table class="viewTable">
                        <tr>
                            <td class="column">办事企业/机构</td>
                            <td>{{this.member.infoLegal.enterpriseName}}</td>
                        </tr>
                        <tr>
                            <td class="column">统一社会信用代码</td>
                            <td>{{this.member.infoLegal.licenseNo}}</td>
                        </tr>
                        <tr>
                            <td class="column">法人姓名</td>
                            <td>{{this.member.infoLegal.legalName}}</td>
                        </tr>
                        <tr>
                            <td class="column">法人身份证号</td>
                            <td>{{this.member.infoLegal.legalIdNumber}}</td>
                        </tr>
                        <tr>
                            <td class="column">企业/机构地址</td>
                            <td>{{this.member.infoLegal.enterpriseAddress}}</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h2 class="h2-style-show">预审材料：</h2>
                    <el-table :data="preauditMaterialsList" v-loading.body="preauditMaterialsListLoading" stripe border highlight-current-row>
                        <el-table-column align="center" :label="'材料名称' + (preauditRecord.materialsVersion ? '(材料版本:' + preauditRecord.materialsVersion + ')' : '')" prop="materialsName"/>
                        <el-table-column align="center" label="链接" prop="materialsUrl">
                            <template slot-scope="scope">
                                <div v-for="(url, index) in scope.row.materialsUrl.split(',')">
                                    <a :href="url" target="_blank">[ {{index + 1}}. 点击查看 ]</a>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div>
                    <h2 class="h2-style-show">预审结果：</h2>
                    <el-form v-if="preauditRecord.status == 1" ref="checkDialogForm" label-width="100px" :model="preauditRecord" :rules="checkRules">
                        <el-form-item label="预审编号">
                            <el-input v-model="preauditRecord.id" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="办理事项">
                            <el-input v-model="preauditRecord.itemName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="提交资料时间">
                            <el-input v-model="preauditRecord.createTime" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="预审结果" prop="status">
                            <el-select v-model="currentStatus" @change="initOption">
                                <el-option
                                    v-for = "o in loadEnum('PreauditStatusEnum').splice(1)"
                                    :label="o.value"
                                    :value="o.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="currentStatus" label="预审意见">
                            <el-input type="textarea" rows="3" v-model="preauditReson.option"></el-input>
                        </el-form-item>
                    </el-form>
                    <table v-if="preauditRecord.status != 1" class="viewTable">
                        <tr>
                            <td class="column">预审编号</td>
                            <td>{{this.preauditRecord.id}}</td>
                        </tr>
                        <tr>
                            <td class="column">办理事项</td>
                            <td>{{this.preauditRecord.itemName}}</td>
                        </tr>
                        <tr>
                            <td class="column">提交资料时间</td>
                            <td>{{this.preauditRecord.createTime}}</td>
                        </tr>
                        <tr>
                            <td class="column">预审人员</td>
                            <td>{{this.preauditRecord.userName}}</td>
                        </tr>
                        <tr>
                            <td class="column">预审时间</td>
                            <td>{{this.preauditRecord.operateTime}}</td>
                        </tr>
                        <tr>
                            <td class="column">预审状态</td>
                            <td>{{this.preauditRecord.status | enums('PreauditStatusEnum')}}</td>
                        </tr>
                        <tr>
                            <td class="column">预审意见</td>
                            <td>{{this.preauditRecord.preauditOption}}</td>
                        </tr>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="preauditRecord.status == 1" type="primary" :size="btnSize" @click="doCheck" :loading="submitLoading">提交预审结果</el-button>
                </span>
            </el-dialog>

            <el-dialog title="预审记录" :visible.sync="preauditResonDialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closePreauditResonDialog">
                <el-table :data="preauditResonList" v-loading.body="preauditResonListLoading" stripe border>
                    <el-table-column align="center" label="预审操作用户" prop="userName"/>
                    <el-table-column align="center" label="预审状态" prop="status">
                        <template slot-scope="scope">
                            {{scope.row.status | enums('PreauditStatusEnum')}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="预审意见" prop="option"/>
                    <el-table-column align="center" label="预审时间" prop="operateTime"/>
                </el-table>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {getStore} from '@/util/store';
    import {
        getPreauditRecordList,
        createOrUpdatePreauditRecord,
        delPreauditRecords,
        getUserDetailsById
    } from '@/api/preaudit/preauditRecord';
    import {getAllPreauditMaterials} from '@/api/preaudit/preauditMaterials';
    import {getAllPreauditReson, createOrUpdatePreauditReson} from '@/api/preaudit/preauditReson';

    export default {
        name: 'preauditRecord',
        data() {
            const isSelected = (rule, value, callback) => {
                if (this.currentStatus) {
                    callback();
                } else {
                    callback(new Error(this.$t("table.pleaseSelect") + '预审结果'))
                }
            };
            return {
                preauditRecordList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    itemName: undefined,
                    status: undefined
                },
                preauditRecord: {
                    id: undefined,
                    workNo: undefined,
                    itemId: undefined,
                    materialsVersion: undefined,
                    memberId: undefined,
                    aliId: undefined,
                    status: undefined,
                    itemName: undefined,
                    createTime: undefined,
                    preauditOption: undefined,
                    operateTime: undefined,
                    userName: undefined
                },
                preauditRecordRules: {
                    workNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '办件编号'}
                    ],
                    itemId: [
                        {required: true, message: this.$t("table.pleaseInput") + '事项编号'}
                    ],
                    materialsVersion: [
                        {required: true, message: this.$t("table.pleaseInput") + '材料关联信息版本'}
                    ],
                    memberId: [
                        {required: true, message: this.$t("table.pleaseInput") + '前台用户编号'}
                    ],
                    aliId: [
                        {required: true, message: this.$t("table.pleaseInput") + '阿里预审编号'}
                    ],
                    status: [
                        {required: true, message: this.$t("table.pleaseInput") + '预审状态'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                checkOrViewDialogTitle: undefined,
                checkOrViewDialogVisible: false,
                currentStatus: undefined,
                preauditMaterialsList: undefined,
                checkRules: {
                    status: [
                        {validator: isSelected, trigger: 'change'}
                    ]
                },
                preauditReson: {
                    id: undefined,
                    preauditId: undefined,
                    userId: undefined,
                    option: undefined,
                    operateTime: undefined,
                    status: undefined,
                    aliId: undefined
                },
                preauditMaterialsListLoading: true,
                member: {
                    infoPerson: undefined,
                    infoLegal: undefined
                    /*customerName: undefined,
                    idNumber: undefined,
                    customerPhone: undefined,
                    customerAddress: undefined,
                    enterpriseName: undefined,
                    licenseNo: undefined,
                    legalName: undefined,
                    legalIdNumber: undefined,
                    enterpriseAddress: undefined*/
                },
                preauditResonDialogTitle: undefined,
                preauditResonDialogVisible: false,
                preauditResonListLoading: false,
                preauditResonList: undefined
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
                    create: this.permission.preauditRecord_create,
                    update: this.permission.preauditRecord_update,
                    delete: this.permission.preauditRecord_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery = {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    id: undefined,
                    status: undefined
                }
            },
            searchReloadList(){
                this.listQuery.page = 1;
                this.reloadList();
            },
            reloadList(){
                this.listLoading = true;
                this.preauditRecordList = undefined;
                this.total = undefined;
                getPreauditRecordList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.preauditRecordList = response.data.records;
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
                this.resetPreauditRecord();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetPreauditRecord();
                if (row.id) {
                    this.preauditRecord = deepClone(row);
                } else {
                    this.preauditRecord = deepClone(this.selectedRows[0]);
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
                this.$refs['preauditRecordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdatePreauditRecord(this.preauditRecord).then(() => {
                            this.resetPreauditRecordDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['preauditRecordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdatePreauditRecord(this.preauditRecord).then(() => {
                            this.resetPreauditRecordDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delPreauditRecords(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetPreauditRecord(){
                this.preauditRecord = {
                    id: undefined,
                    workNo: undefined,
                    itemId: undefined,
                    materialsVersion: undefined,
                    memberId: undefined,
                    aliId: undefined,
                    status: undefined,
                    itemName: undefined,
                    createTime: undefined
                }
            },
            resetPreauditRecordDialogAndList(){
                this.closePreauditRecordDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closePreauditRecordDialog() {
                this.dialogVisible = false;
                this.resetPreauditRecord();
                this.$refs['preauditRecordDialogForm'].resetFields();
            },
            btnCheckOrView(row){
                this.preauditRecord = deepClone(row);
                this.checkOrViewDialogVisible = true;
                this.preauditMaterialsListLoading = true;
                this.preauditMaterialsList = undefined;
                const materialsQuery = {"preauditId": this.preauditRecord.id}
                getAllPreauditMaterials(materialsQuery).then(response => {
                    this.preauditMaterialsListLoading = false;
                    this.preauditMaterialsList = response.data;
                })
                const memberQuery = {"memberId": this.preauditRecord.memberId}
                getUserDetailsById(memberQuery).then(response => {
                    if (response.data.infoPerson) {
                        this.member.infoPerson = response.data.infoPerson
                    } else {
                        this.member.infoLegal = response.data.infoLegal
                    }
                })
            },
            loadEnum(name) {
                return getStore({name: 'enums'})[name];
            },
            initOption() {
                if (this.currentStatus == 3) {
                    this.preauditReson.option = '确认通过'
                } else {
                    this.preauditReson.option = '1、\n' + '2、\n' + '3、'
                }
            },
            closeCheckOrViewDialog() {
                this.checkOrViewDialogVisible = false;
                this.resetPreauditRecord();
                this.resetMember();
                //this.$refs['checkDialogForm'].resetFields();
            },
            resetMember() {
                this.member.infoPerson = undefined;
                this.member.infoLegal = undefined;
            },
            doCheck() {
                this.$refs['checkDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        this.preauditReson.status = this.currentStatus;
                        this.preauditReson.preauditId = this.preauditRecord.id;
                        this.preauditReson.aliId = this.preauditRecord.aliId;
                        createOrUpdatePreauditReson(this.preauditReson).then(() => {
                            this.resetCheckOrViewDialogAndList();
                            this.$message.success("预审成功");
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetCheckOrViewDialogAndList(){
                this.closeCheckOrViewDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            btnPreauditReson(row) {
                this.preauditResonDialogVisible = true;
                this.preauditResonListLoading = true;
                this.preauditResonList = undefined;
                const query = {"preauditId": row.id}
                getAllPreauditReson(query).then(response => {
                    this.preauditResonListLoading = false;
                    this.preauditResonList = response.data;
                })
            },
            closePreauditResonDialog() {
                this.preauditResonDialogVisible = false;
                this.resetPreauditReson();
            },
            resetPreauditReson(){
                this.preauditReson = {
                    id: undefined,
                    preauditId: undefined,
                    userId: undefined,
                    status: undefined,
                    option: undefined,
                    operateTime: undefined
                }
            }
        }
    }
</script>

<style>
    .h2-style-show {
        font-weight: 400;
        font-size: 24px;
        margin-top: 20px;
    }
    .viewTable, .viewTable tr, table tr td { border:1px solid #E6EAEE; }
    .viewTable { font-size: 14px; color: #71787E; }
    .viewTable tr td { border:1px solid #E6EAEE; width: 460px; height: 50px; line-height: 35px; box-sizing: border-box; padding: 0 10px; }
    .viewTable tr td.column { background-color: #EFF3F6; color: #393C3E; }
    a { text-decoration: underline blue; color: blue }
</style>
