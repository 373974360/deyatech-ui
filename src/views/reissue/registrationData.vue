<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '学号'" v-model.trim="listQuery.studentId"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '姓名'" v-model.trim="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '学校代码'" v-model.trim="listQuery.schoolCode"></el-input>
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
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">
                        批量删除<i class="el-icon-delete el-icon--right"></i>
                    </el-button>
                    <el-upload
                        style="display: inline; margin-left: 10px;"
                        :limit="10"
                        :beforeUpload="beforeUpload"
                        :headers="$store.state.common.initHeaders"
                        action="/manage/reissue/registrationData/importExcel"
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
            <el-table :data="registrationDataList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
<!--                <el-table-column align="center" label="考试代码" prop="examCode"/>-->
<!--                <el-table-column align="center" label="考试类别代码" prop="examCategoryCode"/>-->
<!--                <el-table-column align="center" label="试卷号" prop="examPaperCode"/>-->
                <el-table-column align="center" label="试卷名称" prop="examPaperName"/>
                <el-table-column align="center" label="专业层次" prop="professionalLevel"/>
                <el-table-column align="center" label="专业名称" prop="professionalName"/>
                <el-table-column align="center" label="课程名称" prop="courseName"/>
                <el-table-column align="center" label="学号" prop="studentId"/>
                <el-table-column align="center" label="姓名" prop="name"/>
<!--                <el-table-column align="center" label="学校代码" prop="schoolCode"/>-->
                <el-table-column align="center" label="学校名称" prop="schoolName"/>
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
                        <el-button title="成绩管理" type="primary" icon="el-icon-tickets" :size="btnSize" circle
                                   @click.stop.safe="btnExamResults(scope.row)"></el-button>
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


<!--            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeRegistrationDataDialog">
                <el-form ref="registrationDataDialogForm" class="deyatech-form" :model="registrationData" label-position="right"
                         label-width="80px" :rules="registrationDataRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="考试类别代码" prop="examCategoryCode">
                                <el-input v-model.trim="registrationData.examCategoryCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="试卷号" prop="examPaperCode">
                                <el-input v-model.trim="registrationData.examPaperCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="试卷名称" prop="examPaperName">
                                <el-input v-model.trim="registrationData.examPaperName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="专业层次" prop="professionalLevel">
                                <el-input v-model.trim="registrationData.professionalLevel"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="专业名称" prop="professionalName">
                                <el-input v-model.trim="registrationData.professionalName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="学号" prop="studentId">
                                <el-input v-model.trim="registrationData.studentId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model.trim="registrationData.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="学校代码" prop="schoolCode">
                                <el-input v-model.trim="registrationData.schoolCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="学校名称" prop="schoolName">
                                <el-input v-model.trim="registrationData.schoolName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="registrationData.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeRegistrationDataDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>-->

            <el-dialog title="成绩管理" :visible.sync="dialogExamResultsVisible" width="60%"
                       :close-on-click-modal="closeOnClickModal" @close="closeExamResultsDialog">
                <div class="deyatech-menu">
                    <div class="deyatech-menu_left">
                        <el-button v-if="btnEnable.examResultsCreate && examResultsList.length == 0" type="primary" :size="btnSize"
                                   @click="btnExamResultsCreate">{{$t('table.create')}}</el-button>
                    </div>
                    <div class="deyatech-menu_right">
                        <el-button icon="el-icon-refresh" :size="btnSize" circle @click="getExamResults"></el-button>
                    </div>
                </div>
                <el-table :data="examResultsList" v-loading.body="examResultsListLoading" stripe border highlight-current-row>
                    <el-table-column v-if="registrationData.examMethod == '实践环节'" align="center" label="组别" prop="group"/>
                    <el-table-column v-if="registrationData.examMethod == '实践环节'" align="center" label="等次" prop="rank"/>
                    <el-table-column v-if="registrationData.examMethod == '全形考'" align="center" label="班级代码" prop="classCode"/>
                    <el-table-column v-if="registrationData.examMethod == '全形考'" align="center" label="形成性考核（组成模块）">
                        <el-table-column align="center" label="平时作业（50%）">
                            <el-table-column align="center" label="作业&（70%）" prop="homework" :render-header="renderHeader"/>
                            <el-table-column align="center" label="实践&（30%）" prop="practical" :render-header="renderHeader"/>
                        </el-table-column>
                        <el-table-column align="center" label="网上学习（50%）">
                            <el-table-column align="center" label="论坛发帖&（40%）" prop="forumPosts" :render-header="renderHeader"/>
                            <el-table-column align="center" label="在线时长&（30%）" prop="onlineDuration" :render-header="renderHeader"/>
                            <el-table-column align="center" label="资源点击次数&（30%）" prop="resourceClicks" :render-header="renderHeader"/>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="成绩" prop="results"/>
                    <el-table-column align="center" label="复核成绩" prop="reviewResults"/>
                    <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                        <template slot-scope="scope">
                            <el-button v-if="btnEnable.examResultsUpdate && !scope.row.reviewResults" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                       @click.stop.safe="btnExamResultsUpdate(scope.row)"></el-button>
                            <el-button v-if="btnEnable.examResultsReview && !scope.row.reviewResults" title="复核" type="success" icon="el-icon-check" :size="btnSize" circle
                                       @click.stop.safe="btnExamResultsReview(scope.row)"></el-button>
                            <el-button v-if="btnEnable.examResultsDelete" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                       @click.stop.safe="btnExamResultsDelete(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-dialog :title="titleMap[dialogTitle] + '成绩'" :visible.sync="dialogExamResultsSaveOrUpdateVisible" width="60%"
                           :close-on-click-modal="closeOnClickModal" @close="closeExamResultsSaveOrUpdateDialog" append-to-body>
                    <el-form ref="examResultsDialogForm" class="deyatech-form" :model="examResults" label-position="right"
                             label-width="120px" :rules="examResultsRules">
                        <div v-if="registrationData.examMethod == '全形考'">
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="班级代码" prop="classCode">
                                        <el-input v-model.trim="examResults.classCode" :disabled="dialogTitle == 'review'"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="作业" prop="homework">
                                        <el-input-number v-model.trim="examResults.homework" :disabled="dialogTitle == 'review'"
                                                         @change="singleResultsChange" style="width: 100%"></el-input-number>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="实践" prop="practical">
                                        <el-input-number v-model.trim="examResults.practical" :min="0" :max="100" :disabled="dialogTitle == 'review'"
                                                         @change="singleResultsChange" style="width: 100%"></el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="论坛发帖" prop="forumPosts">
                                        <el-input-number v-model.trim="examResults.forumPosts" :min="0" :max="100" :disabled="dialogTitle == 'review'"
                                                         @change="singleResultsChange" style="width: 100%"></el-input-number>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="在线时长" prop="onlineDuration">
                                        <el-input-number v-model.trim="examResults.onlineDuration" :min="0" :max="100" :disabled="dialogTitle == 'review'"
                                                         @change="singleResultsChange" style="width: 100%"></el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="资源点击次数" prop="resourceClicks">
                                        <el-input-number v-model.trim="examResults.resourceClicks" :min="0" :max="100" :disabled="dialogTitle == 'review'"
                                                         @change="singleResultsChange" style="width: 100%"></el-input-number>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-if="registrationData.examMethod == '实践环节'">
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="组别" prop="group">
                                        <el-input v-model.trim="examResults.group" :min="0" :max="100" :disabled="dialogTitle == 'review'"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="等次" prop="rank">
                                        <el-input v-model.trim="examResults.rank" :min="0" :max="100" :disabled="dialogTitle == 'review'"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <el-row :gutter="20" :span="24">
                            <el-col :span="12">
                                <el-form-item label="成绩" prop="results">
                                    <el-input-number v-model.trim="examResults.results" :min="0" :max="100" :disabled="dialogTitle == 'review' || registrationData.examMethod == '全形考'"
                                                     style="width: 100%"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="dialogTitle == 'review'">
                                <el-form-item label="复核成绩" prop="reviewResults">
                                    <el-input-number v-model.trim="examResults.reviewResults" :min="0" :max="100" style="width: 100%"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doExamResultsCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                        <el-button v-if="dialogTitle=='update'" type="primary" :size="btnSize" @click="doExamResultsUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                        <el-button v-if="dialogTitle=='review'" type="primary" :size="btnSize" @click="doExamResultsReview" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                        <el-button :size="btnSize" @click="closeExamResultsSaveOrUpdateDialog">{{$t('table.cancel')}}</el-button>
                    </span>
                </el-dialog>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getRegistrationDataList,
        createOrUpdateRegistrationData,
        delRegistrationDatas
    } from '@/api/reissue/registrationData';
    import {
        getExamResults,
        createOrUpdateExamResults,
        delExamResultss
    } from '@/api/reissue/examResults';

    export default {
        name: 'registrationData',
        data() {
            return {
                registrationDataList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    studentId: undefined,
                    name: undefined,
                    schoolCode: undefined,
                },
                registrationData: {
                    id: undefined,
                    examCategoryCode: undefined,
                    examPaperCode: undefined,
                    examPaperName: undefined,
                    professionalLevel: undefined,
                    professionalName: undefined,
                    studentId: undefined,
                    name: undefined,
                    schoolCode: undefined,
                    schoolName: undefined
                },
                registrationDataRules: {
                    examCategoryCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '考试类别代码'}
                    ],
                    examPaperCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '试卷号'}
                    ],
                    examPaperName: [
                        {required: true, message: this.$t("table.pleaseInput") + '试卷名称'}
                    ],
                    professionalLevel: [
                        {required: true, message: this.$t("table.pleaseInput") + '专业层次'}
                    ],
                    professionalName: [
                        {required: true, message: this.$t("table.pleaseInput") + '专业名称'}
                    ],
                    studentId: [
                        {required: true, message: this.$t("table.pleaseInput") + '学号'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '姓名'}
                    ],
                    schoolCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '学校代码'}
                    ],
                    schoolName: [
                        {required: true, message: this.$t("table.pleaseInput") + '学校名称'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                dialogExamResultsVisible: false,
                examResultsList: [],
                examResultsListLoading: true,
                dialogExamResultsSaveOrUpdateVisible: false,
                examResults: {
                    id: undefined,
                    examPaperCode: undefined,
                    professionalNameLevel: undefined,
                    classCode: undefined,
                    studentId: undefined,
                    name: undefined,
                    group: undefined,
                    homework: undefined,
                    practical: undefined,
                    forumPosts: undefined,
                    onlineDuration: undefined,
                    resourceClicks: undefined,
                    results: undefined,
                    reviewResults: undefined,
                    rank: undefined
                },
                examResultsRules: {
                    classCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '班级代码'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'},
                    ],
                    group: [
                        {required: true, message: this.$t("table.pleaseInput") + '组别'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'},
                    ],
                    homework: [
                        {required: true, message: this.$t("table.pleaseInput") + '作业'}
                    ],
                    practical: [
                        {required: true, message: this.$t("table.pleaseInput") + '实践'}
                    ],
                    forumPosts: [
                        {required: true, message: this.$t("table.pleaseInput") + '论坛发帖'}
                    ],
                    onlineDuration: [
                        {required: true, message: this.$t("table.pleaseInput") + '在线时长'}
                    ],
                    resourceClicks: [
                        {required: true, message: this.$t("table.pleaseInput") + '资源点击次数'}
                    ],
                    results: [
                        {required: true, message: this.$t("table.pleaseInput") + '成绩'}
                    ],
                    reviewResults: [
                        {required: true, message: this.$t("table.pleaseInput") + '复核成绩'}
                    ],
                    rank: [
                        {required: true, message: this.$t("table.pleaseInput") + '等次'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'},
                    ]
                },
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
                    create: this.permission.registrationData_create,
                    update: this.permission.registrationData_update,
                    delete: this.permission.registrationData_delete,
                    examResultsCreate: this.permission.examResults_create,
                    examResultsUpdate: this.permission.examResults_update,
                    examResultsDelete: this.permission.examResults_delete,
                    examResultsReview: this.permission.examResults_review,
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.studentId = undefined;
                this.listQuery.name = undefined;
                this.listQuery.schoolCode = undefined;
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.registrationDataList = undefined;
                this.total = undefined;
                getRegistrationDataList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.registrationDataList = response.data.records;
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
                this.resetRegistrationData();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetRegistrationData();
                if (row.id) {
                    this.registrationData = deepClone(row);
                } else {
                    this.registrationData = deepClone(this.selectedRows[0]);
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
                this.$refs['registrationDataDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateRegistrationData(this.registrationData).then(() => {
                            this.resetRegistrationDataDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['registrationDataDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateRegistrationData(this.registrationData).then(() => {
                            this.resetRegistrationDataDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delRegistrationDatas(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetRegistrationData(){
                this.registrationData = {
                    id: undefined,
                    examCategoryCode: undefined,
                    examPaperCode: undefined,
                    examPaperName: undefined,
                    professionalLevel: undefined,
                    professionalName: undefined,
                    studentId: undefined,
                    name: undefined,
                    schoolCode: undefined,
                    schoolName: undefined
                }
            },
            resetRegistrationDataDialogAndList(){
                this.closeRegistrationDataDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeRegistrationDataDialog() {
                this.dialogVisible = false;
                this.resetRegistrationData();
                this.$refs['registrationDataDialogForm'].resetFields();
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
            btnExamResults(row) {
                this.resetRegistrationData();
                this.registrationData = deepClone(row);
                this.getExamResults();
                this.dialogExamResultsVisible = true;
            },
            getExamResults(){
                this.examResultsListLoading = true;
                this.examResultsList = [];
                const query = {
                    examPaperCode: this.registrationData.examPaperCode,
                    studentId: this.registrationData.studentId
                }
                getExamResults(query).then(response => {
                    this.examResultsListLoading = false;
                    if (Object.keys(response.data).length != 0) {
                        this.examResultsList.push(response.data);
                    }
                })
            },
            closeExamResultsDialog() {
                this.dialogExamResultsVisible = false;
                this.resetRegistrationData();
                this.examResultsList = [];
            },
            resetExamResults(){
                this.examResults = {
                    id: undefined,
                    examPaperCode: undefined,
                    professionalNameLevel: undefined,
                    classCode: undefined,
                    studentId: undefined,
                    name: undefined,
                    group: undefined,
                    homework: undefined,
                    practical: undefined,
                    forumPosts: undefined,
                    onlineDuration: undefined,
                    resourceClicks: undefined,
                    results: undefined,
                    reviewResults: undefined,
                    rank: undefined
                }
            },
            btnExamResultsCreate(){
                this.resetExamResults();
                this.examResults.examPaperCode = this.registrationData.examPaperCode;
                this.examResults.professionalNameLevel = this.registrationData.professionalName + '-' + this.registrationData.professionalLevel;
                this.examResults.studentId = this.registrationData.studentId;
                this.examResults.name = this.registrationData.name;
                this.dialogTitle = 'create';
                this.dialogExamResultsSaveOrUpdateVisible = true;
            },
            btnExamResultsUpdate(row){
                this.resetExamResults();
                this.examResults = deepClone(row);
                this.dialogTitle = 'update';
                this.dialogExamResultsSaveOrUpdateVisible = true;
            },
            btnExamResultsReview(row) {
                this.resetExamResults();
                this.examResults = deepClone(row);
                this.dialogTitle = 'review';
                this.dialogExamResultsSaveOrUpdateVisible = true;
            },
            btnExamResultsDelete(row){
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.doExamResultsDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows){
                            ids.push(deleteRow.id);
                        }
                        this.doExamResultsDelete(ids);
                    })
                }
            },
            doExamResultsCreate() {
                this.$refs['examResultsDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateExamResults(this.examResults).then(() => {
                            this.resetExamResultsSaveOrUpdateDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doExamResultsUpdate() {
                this.$refs['examResultsDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateExamResults(this.examResults).then(() => {
                            this.resetExamResultsSaveOrUpdateDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doExamResultsReview() {
                this.$refs['examResultsDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateExamResults(this.examResults).then(() => {
                            this.resetExamResultsSaveOrUpdateDialogAndList();
                            this.$message.success(this.$t("table.submitSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doExamResultsDelete(ids){
                this.examResultsListLoading = true;
                delExamResultss(ids).then(() => {
                    this.getExamResults();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetExamResultsSaveOrUpdateDialogAndList(){
                this.closeExamResultsSaveOrUpdateDialog();
                this.submitLoading = false;
                this.getExamResults();
            },
            closeExamResultsSaveOrUpdateDialog() {
                this.dialogExamResultsSaveOrUpdateVisible = false;
                this.resetExamResults();
                this.$refs['examResultsDialogForm'].resetFields();
            },
            // render 事件
            renderHeader (h,{column}) { // h即为cerateElement的简写，具体可看vue官方文档
                let header = column.label.split('&');
                return h(
                    'p', {style: 'margin: 0'},
                    [
                        h('p', {style: 'margin: 0'}, header[0]),
                        h('p', {style: 'margin: 0'}, header[1])
                    ],
                );
            },
            singleResultsChange() {
                // this.examResults.homework = this.examResults.homework ? this.examResults.homework : 0;
                // this.examResults.practical = this.examResults.practical ? this.examResults.practical : 0;
                // this.examResults.forumPosts = this.examResults.forumPosts ? this.examResults.forumPosts : 0;
                // this.examResults.onlineDuration = this.examResults.onlineDuration ? this.examResults.onlineDuration : 0;
                // this.examResults.resourceClicks = this.examResults.resourceClicks ? this.examResults.resourceClicks : 0;
                this.examResults.results = this.examResults.homework
                    + this.examResults.practical
                    + this.examResults.forumPosts
                    + this.examResults.onlineDuration
                    + this.examResults.resourceClicks
            }
        }
    }
</script>


<style>
    .el-table .cell {
        white-space: pre-line;
    }
</style>
