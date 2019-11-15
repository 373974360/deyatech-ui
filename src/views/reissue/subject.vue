<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '试卷号'" v-model.trim="listQuery.examPaperCode"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '试卷名称'" v-model.trim="listQuery.examPaperName"></el-input>
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
                        action="/manage/reissue/subject/importExcel"
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
            <el-table :data="subjectList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="考试代码" prop="examCode"/>
                <el-table-column align="center" label="终考手段" prop="examMethod"/>
                <el-table-column align="center" label="试卷号" prop="examPaperCode"/>
                <el-table-column align="center" label="试卷名称" prop="examPaperName"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeSubjectDialog">
                <el-form ref="subjectDialogForm" class="deyatech-form" :model="subject" label-position="right"
                         label-width="80px" :rules="subjectRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="考试代码" prop="examCode">
                                <el-input v-model.trim="subject.examCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="终考手段" prop="examMethod">
                                <el-input v-model.trim="subject.examMethod"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="试卷号" prop="examPaperCode">
                                <el-input v-model.trim="subject.examPaperCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="试卷名称" prop="examPaperName">
                                <el-input v-model.trim="subject.examPaperName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="subject.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeSubjectDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getSubjectList,
        createOrUpdateSubject,
        delSubjects
    } from '@/api/reissue/subject';

    export default {
        name: 'subject',
        data() {
            return {
                subjectList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    examPaperCode: undefined,
                    examPaperName: undefined
                },
                subject: {
                    id: undefined,
                    examCode: undefined,
                    examMethod: undefined,
                    examPaperCode: undefined,
                    examPaperName: undefined
                },
                subjectRules: {
                    examCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '考试代码'}
                    ],
                    examMethod: [
                        {required: true, message: this.$t("table.pleaseInput") + '终考手段'}
                    ],
                    examPaperCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '试卷号'}
                    ],
                    examPaperName: [
                        {required: true, message: this.$t("table.pleaseInput") + '试卷名称'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
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
                    create: this.permission.subject_create,
                    update: this.permission.subject_update,
                    delete: this.permission.subject_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.examPaperCode = undefined;
                this.listQuery.examPaperName = undefined;
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.subjectList = undefined;
                this.total = undefined;
                getSubjectList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.subjectList = response.data.records;
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
                this.resetSubject();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetSubject();
                if (row.id) {
                    this.subject = deepClone(row);
                } else {
                    this.subject = deepClone(this.selectedRows[0]);
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
                this.$refs['subjectDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateSubject(this.subject).then(() => {
                            this.resetSubjectDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['subjectDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateSubject(this.subject).then(() => {
                            this.resetSubjectDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delSubjects(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetSubject(){
                this.subject = {
                    id: undefined,
                    examCode: undefined,
                    examMethod: undefined,
                    examPaperCode: undefined,
                    examPaperName: undefined
                }
            },
            resetSubjectDialogAndList(){
                this.closeSubjectDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeSubjectDialog() {
                this.dialogVisible = false;
                this.resetSubject();
                this.$refs['subjectDialogForm'].resetFields();
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


