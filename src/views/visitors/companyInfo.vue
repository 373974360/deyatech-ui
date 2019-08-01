<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="请输入公司名称或地址" v-model.trim="listQuery.enterpriseName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-upload
                        :limit="100"
                        :beforeUpload="beforeUpload"
                        :headers="initHeaders"
                        action="/manage/visitors/companyInfo/importExcel"
                        :on-success="importSuccess"
                        :on-error="importError">
                        <el-button size="small" type="primary">点击上传Excel<i class="el-icon-upload el-icon--right"></i></el-button>
                        <span slot="tip" class="el-upload__tip" style="color: red; margin-left: 10px">只能上传Excel文件，且不超过2M</span>
                    </el-upload>
                    <!--<el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>-->
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="companyInfoList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <!--<el-table-column type="selection" width="50" align="center"/>-->
                <el-table-column align="center" label="企业名称" prop="enterpriseName"/>
                <el-table-column align="center" label="组织机构代码" prop="organizationCode"/>
                <el-table-column align="center" label="经营范围" prop="businessScope"/>
                <el-table-column align="center" label="机构住所" prop="address"/>
                <el-table-column align="center" label="面积" prop="area"/>
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
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
                </el-table-column>-->
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeCompanyInfoDialog">
                <el-form ref="companyInfoDialogForm" class="deyatech-form" :model="companyInfo" label-position="right"
                         label-width="80px" :rules="companyInfoRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="企业名称" prop="enterpriseName">
                                <el-input v-model="companyInfo.enterpriseName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="组织机构代码" prop="organizationCode">
                                <el-input v-model="companyInfo.organizationCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="经营范围" prop="businessScope">
                                <el-input v-model="companyInfo.businessScope"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="机构住所" prop="address">
                                <el-input v-model="companyInfo.address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="面积" prop="area">
                                <el-input v-model="companyInfo.area"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="companyInfo.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeCompanyInfoDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getCompanyInfoList,
        createOrUpdateCompanyInfo,
        delCompanyInfos,
        importExcel
    } from '@/api/visitors/companyInfo';
    import {getToken} from '@/util/auth'

    export default {
        name: 'companyInfo',
        data() {
            return {
                companyInfoList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    enterpriseName: undefined
                },
                companyInfo: {
                    id: undefined,
                    enterpriseName: undefined,
                    organizationCode: undefined,
                    businessScope: undefined,
                    address: undefined,
                    area: undefined
                },
                companyInfoRules: {
                    enterpriseName: [
                        {required: true, message: this.$t("table.pleaseInput") + '企业名称'}
                    ],
                    organizationCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '组织机构代码'}
                    ],
                    businessScope: [
                        {required: true, message: this.$t("table.pleaseInput") + '经营范围'}
                    ],
                    address: [
                        {required: true, message: this.$t("table.pleaseInput") + '机构住所'}
                    ],
                    area: [
                        {required: true, message: this.$t("table.pleaseInput") + '面积'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                initHeaders: {"Deyatech-Token": getToken()}
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
                    create: this.permission.companyInfo_create,
                    update: this.permission.companyInfo_update,
                    delete: this.permission.companyInfo_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
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
                const flag = extension || extension2 && isLt2M;
                if (flag) {
                    this.listLoading = true;
                }
                return flag;
            },
            importSuccess(response) {
                this.listLoading = false;
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
                this.$message.error("上传失败！");
            },
            resetSearch(){
                this.listQuery.enterpriseName = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.companyInfoList = undefined;
                this.total = undefined;
                getCompanyInfoList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.companyInfoList = response.data.records;
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
                this.resetCompanyInfo();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetCompanyInfo();
                if (row.id) {
                    this.companyInfo = deepClone(row);
                } else {
                    this.companyInfo = deepClone(this.selectedRows[0]);
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
                this.$refs['companyInfoDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateCompanyInfo(this.companyInfo).then(() => {
                            this.resetCompanyInfoDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['companyInfoDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateCompanyInfo(this.companyInfo).then(() => {
                            this.resetCompanyInfoDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delCompanyInfos(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetCompanyInfo(){
                this.companyInfo = {
                    id: undefined,
                    enterpriseName: undefined,
                    organizationCode: undefined,
                    businessScope: undefined,
                    address: undefined,
                    area: undefined
                }
            },
            resetCompanyInfoDialogAndList(){
                this.closeCompanyInfoDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeCompanyInfoDialog() {
                this.dialogVisible = false;
                this.resetCompanyInfo();
                this.$refs['companyInfoDialogForm'].resetFields();
            }
        }
    }
</script>


