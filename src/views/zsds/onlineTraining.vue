<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-date-picker
                            :size="searchSize"
                            v-model="dateRange"
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
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
                    <el-upload
                        style="display: inline; margin-left: 10px;"
                        :limit="10"
                        :beforeUpload="beforeUpload"
                        :headers="initHeaders"
                        action="/manage/zsds/onlineTraining/importExcel"
                        :on-success="importSuccess"
                        :on-error="importError">
                        <el-button type="primary" :size="btnSize">数据导入<i class="el-icon-upload el-icon--right"></i></el-button>
                    </el-upload>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="onlineTrainingList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="部门名称" prop="departmentName"/>
                <el-table-column align="center" label="培训期数" prop="period"/>
                <el-table-column align="center" label="培训人数" prop="number"/>
                <el-table-column align="center" label="添加时间" prop="createTime"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeOnlineTrainingDialog">
                <el-form ref="onlineTrainingDialogForm" class="deyatech-form" :model="onlineTraining" label-position="right"
                         label-width="80px" :rules="onlineTrainingRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="培训期数" prop="period">
                                <el-input v-model.trim="onlineTraining.period"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="培训人数" prop="number">
                                <el-input v-model.trim="onlineTraining.number"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model.trim="onlineTraining.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeOnlineTrainingDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getOnlineTrainingList,
        createOrUpdateOnlineTraining,
        delOnlineTrainings
    } from '@/api/zsds/onlineTraining';
    import {getToken} from '@/util/auth';

    export default {
        name: 'onlineTraining',
        data() {
            const validateNaturalNumber = (rule, value, callback) => {
                let regName = /^(0|[1-9][0-9]*)$/;
                if (!regName.test(value)) {
                    callback(new Error('请输入非负整数'))
                } else {
                    callback()
                }
            }
            return {
                onlineTrainingList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    startDate: undefined,
                    endDate: undefined,
                },
                onlineTraining: {
                    id: undefined,
                    departmentId: undefined,
                    period: undefined,
                    number: undefined
                },
                onlineTrainingRules: {
                    period: [
                        {required: true, message: this.$t("table.pleaseInput") + '培训期数'},
                        {min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur'},
                        {validator: validateNaturalNumber, trigger: 'blur'}
                    ],
                    number: [
                        {required: true, message: this.$t("table.pleaseInput") + '培训人数'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'},
                        {validator: validateNaturalNumber, trigger: 'blur'}
                    ],
                    remark: [
                        {max: 500, message: '长度最多 500 个字符', trigger: 'blur'}
                    ],
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                dateRange: [],
                initHeaders: {"Deyatech-Token": getToken()},
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
                    create: this.permission.onlineTraining_create,
                    update: this.permission.onlineTraining_update,
                    delete: this.permission.onlineTraining_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.dateRange = [];
                this.listQuery.startDate = undefined;
                this.listQuery.endDate = undefined;
            },
            searchReloadList(){
                if (this.dateRange.length != 0 ) {
                    this.listQuery.startDate = this.dateRange[0];
                    this.listQuery.endDate = this.dateRange[1];
                }
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.onlineTrainingList = undefined;
                this.total = undefined;
                getOnlineTrainingList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.onlineTrainingList = response.data.records;
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
                this.resetOnlineTraining();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetOnlineTraining();
                if (row.id) {
                    this.onlineTraining = deepClone(row);
                } else {
                    this.onlineTraining = deepClone(this.selectedRows[0]);
                }
                if (typeof(this.onlineTraining.period) != undefined) {
                    this.onlineTraining.period = this.onlineTraining.period.toString();
                }
                if (typeof(this.onlineTraining.number) != undefined) {
                    this.onlineTraining.number = this.onlineTraining.number.toString();
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
                this.$refs['onlineTrainingDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateOnlineTraining(this.onlineTraining).then(() => {
                            this.resetOnlineTrainingDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['onlineTrainingDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateOnlineTraining(this.onlineTraining).then(() => {
                            this.resetOnlineTrainingDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delOnlineTrainings(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetOnlineTraining(){
                this.onlineTraining = {
                    id: undefined,
                    departmentId: undefined,
                    period: undefined,
                    number: undefined
                }
            },
            resetOnlineTrainingDialogAndList(){
                this.closeOnlineTrainingDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeOnlineTrainingDialog() {
                this.dialogVisible = false;
                this.resetOnlineTraining();
                this.$refs['onlineTrainingDialogForm'].resetFields();
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
        }
    }
</script>


