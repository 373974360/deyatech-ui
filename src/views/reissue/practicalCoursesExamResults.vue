<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '专业名称及层次'" v-model.trim="listQuery.majorNameLevel" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '学号'" v-model.trim="listQuery.studentId" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '姓名'" v-model.trim="listQuery.name" clearable></el-input>
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
            <el-table :data="practicalCoursesExamResultsList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="专业名称及层次" prop="majorNameLevel"/>
                <el-table-column align="center" label="学号" prop="studentId"/>
                <el-table-column align="center" label="姓名" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="组别" prop="group"/>
                <el-table-column align="center" label="成绩" prop="results"/>
                <el-table-column align="center" label="等次" prop="rank"/>
                <el-table-column align="center" label="复核成绩" prop="reviewResults"/>
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update && !scope.row.reviewResults" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="!scope.row.reviewResults" title="复核" type="success" icon="el-icon-check" :size="btnSize" circle
                                   @click.stop.safe="btnReview(scope.row)"></el-button>
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
                       :close-on-click-modal="closeOnClickModal" @close="closePracticalCoursesExamResultsDialog">
                <el-form ref="practicalCoursesExamResultsDialogForm" class="deyatech-form" :model="practicalCoursesExamResults" label-position="right"
                         label-width="120px" :rules="practicalCoursesExamResultsRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="专业名称及层次" prop="majorNameLevel">
                                <el-input v-model.trim="practicalCoursesExamResults.majorNameLevel" :disabled="dialogTitle == 'review'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="学号" prop="studentId">
                                <el-input v-model.trim="practicalCoursesExamResults.studentId" :disabled="dialogTitle == 'review'"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model.trim="practicalCoursesExamResults.name" :disabled="dialogTitle == 'review'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="组别" prop="group">
                                <el-input v-model.trim="practicalCoursesExamResults.group" :disabled="dialogTitle == 'review'"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="成绩" prop="results">
                                <el-input v-model.trim="practicalCoursesExamResults.results" :disabled="dialogTitle == 'review'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="等次" prop="rank">
                                <el-input v-model.trim="practicalCoursesExamResults.rank" :disabled="dialogTitle == 'review'"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="dialogTitle == 'review'">
                        <el-col :span="12">
                            <el-form-item label="复核成绩" prop="reviewResults">
                                <el-input v-model.trim="practicalCoursesExamResults.reviewResults"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="practicalCoursesExamResults.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closePracticalCoursesExamResultsDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getPracticalCoursesExamResultsList,
        createOrUpdatePracticalCoursesExamResults,
        delPracticalCoursesExamResultss
    } from '@/api/reissue/practicalCoursesExamResults';
    import {validatename} from '@/util/validate';

    export default {
        name: 'practicalCoursesExamResults',
        data() {
            const validateName = (rule, value, callback) => {
                let result = validatename(value)
                if (result) {
                    callback()
                } else {
                    callback(new Error(this.$t("table.pleaseInput") + '正确的姓名'))
                }
            };
            return {
                practicalCoursesExamResultsList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    majorNameLevel: undefined,
                    name: undefined,
                    studentId: undefined,
                },
                practicalCoursesExamResults: {
                    id: undefined,
                    majorNameLevel: undefined,
                    name: undefined,
                    studentId: undefined,
                    group: undefined,
                    results: undefined,
                    reviewResults: undefined,
                    rank: undefined
                },
                practicalCoursesExamResultsRules: {
                    majorNameLevel: [
                        {required: true, message: this.$t("table.pleaseInput") + '专业名称及层次'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '姓名'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    studentId: [
                        {required: true, message: this.$t("table.pleaseInput") + '学号'},
                        {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'},
                    ],
                    group: [
                        {required: true, message: this.$t("table.pleaseInput") + '组别'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'},
                    ],
                    results: [
                        {required: true, message: this.$t("table.pleaseInput") + '成绩'},
                        {min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur'},
                    ],
                    reviewResults: [
                        {required: true, message: this.$t("table.pleaseInput") + '复核成绩'},
                        {min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur'},
                    ],
                    rank: [
                        {required: true, message: this.$t("table.pleaseInput") + '等次'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'},
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
                    create: this.permission.practicalCoursesExamResults_create,
                    update: this.permission.practicalCoursesExamResults_update,
                    delete: this.permission.practicalCoursesExamResults_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.majorNameLevel = undefined;
                this.listQuery.studentId = undefined;
                this.listQuery.name = undefined;
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.practicalCoursesExamResultsList = undefined;
                this.total = undefined;
                getPracticalCoursesExamResultsList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.practicalCoursesExamResultsList = response.data.records;
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
                this.resetPracticalCoursesExamResults();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetPracticalCoursesExamResults();
                if (row.id) {
                    this.practicalCoursesExamResults = deepClone(row);
                } else {
                    this.practicalCoursesExamResults = deepClone(this.selectedRows[0]);
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
                this.$refs['practicalCoursesExamResultsDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdatePracticalCoursesExamResults(this.practicalCoursesExamResults).then(() => {
                            this.resetPracticalCoursesExamResultsDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['practicalCoursesExamResultsDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdatePracticalCoursesExamResults(this.practicalCoursesExamResults).then(() => {
                            this.resetPracticalCoursesExamResultsDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delPracticalCoursesExamResultss(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetPracticalCoursesExamResults(){
                this.practicalCoursesExamResults = {
                    id: undefined,
                    majorNameLevel: undefined,
                    name: undefined,
                    studentId: undefined,
                    group: undefined,
                    results: undefined,
                    reviewResults: undefined,
                    rank: undefined
                }
            },
            resetPracticalCoursesExamResultsDialogAndList(){
                this.closePracticalCoursesExamResultsDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closePracticalCoursesExamResultsDialog() {
                this.dialogVisible = false;
                this.resetPracticalCoursesExamResults();
                this.$refs['practicalCoursesExamResultsDialogForm'].resetFields();
            },
            btnReview(row){
                this.resetPracticalCoursesExamResults();
                if (row.id) {
                    this.practicalCoursesExamResults = deepClone(row);
                } else {
                    this.practicalCoursesExamResults = deepClone(this.selectedRows[0]);
                }
                this.dialogTitle = 'review';
                this.dialogVisible = true;
            },
        }
    }
</script>


