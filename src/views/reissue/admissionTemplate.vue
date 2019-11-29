<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '准考证名称'" v-model.trim="listQuery.admissionName"></el-input>
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
            <el-table :data="admissionTemplateList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="分校" prop="schoolName"/>
                <el-table-column align="center" label="准考证名称" prop="admissionName"/>
                <el-table-column align="center" label="正面内容" prop="frontContent">
                    <template slot-scope="scope">
                        <el-button type="primary" :size="btnSize" @click.stop.safe="showFrontContent(scope.row.frontContent)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="背面内容" prop="backContent">
                    <template slot-scope="scope">
                        <el-button type="primary" :size="btnSize" @click.stop.safe="showBackContent(scope.row.backContent)">查看</el-button>
                    </template>
                </el-table-column>
<!--                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
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


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible" width="55%"
                       :close-on-click-modal="closeOnClickModal" @close="closeAdmissionTemplateDialog">
                <el-form ref="admissionTemplateDialogForm" class="deyatech-form" :model="admissionTemplate" label-position="right"
                         label-width="100px" :rules="admissionTemplateRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="分校" prop="schoolId">
                                <el-select v-model="admissionTemplate.schoolId" :placeholder="$t('table.pleaseSelect') + '分校'" style="width: 100%">
                                    <el-option
                                        v-for="item in allBranchSchoolUser"
                                        :key="item.id"
                                        :label="item.schoolName"
                                        :value="item.schoolId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="准考证名称" prop="admissionName">
                                <el-input v-model.trim="admissionTemplate.admissionName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="正面内容" prop="frontContent">
                                <editor v-model.trim="admissionTemplate.frontContent"
                                        :config="editorConfig"
                                        :default-msg="admissionTemplate.frontContent"
                                        ref="frontContent"
                                        id="frontContent">
                                </editor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="背面内容" prop="backContent">
                                <editor v-model.trim="admissionTemplate.backContent"
                                        :config="editorConfig"
                                        :default-msg="admissionTemplate.backContent"
                                        ref="backContent"
                                        id="backContent">
                                </editor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeAdmissionTemplateDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>


            <el-dialog title="正面内容" :visible.sync="dialogFrontContentVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeFrontContentDialog">
                <div v-html="frontContent"></div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click.stop.safe="printContent(frontContent)">打印</el-button>
                </span>
            </el-dialog>
            <el-dialog title="背面内容" :visible.sync="dialogBackContentVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeBackContentDialog">
                <div v-html="backContent"></div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click.stop.safe="printContent(backContent)">打印</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import editor from '@/components/editor/index.vue'
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getAdmissionTemplateList,
        createOrUpdateAdmissionTemplate,
        delAdmissionTemplates
    } from '@/api/reissue/admissionTemplate';
    import {
        getAllBranchSchoolUserByUserId
    } from '@/api/reissue/branchSchoolUser';

    export default {
        name: 'admissionTemplate',
        components: {
            editor
        },
        data() {
            return {
                admissionTemplateList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    admissionName: undefined
                },
                admissionTemplate: {
                    id: undefined,
                    schoolId: undefined,
                    admissionName: undefined,
                    frontContent: undefined,
                    backContent: undefined
                },
                admissionTemplateRules: {
                    schoolId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '分校'}
                    ],
                    admissionName: [
                        {required: true, message: this.$t("table.pleaseInput") + '准考证名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                    ],
                    frontContent: [
                        {required: true, message: this.$t("table.pleaseInput") + '正面内容'},
                        {min: 1, max: 65535, message: '长度在 1 到 65535 个字符', trigger: 'blur'},
                    ],
                    backContent: [
                        {required: true, message: this.$t("table.pleaseInput") + '背面内容'},
                        {min: 1, max: 65535, message: '长度在 1 到 65535 个字符', trigger: 'blur'},
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                allBranchSchoolUser: [],
                editorConfig: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 350,
                    zIndex: 3000,
                    /*imageUrlPrefix: (window.location.host.includes('http') ? window.location.host : 'http://' + window.location.host)
                        + '/manage/common/showPicImg?filePath=',
                    fileUrlPrefix: (window.location.host.includes('http') ? window.location.host : 'http://' + window.location.host)
                        + '/manage/common/download?filePath=',*/
                },
                dialogFrontContentVisible: false,
                dialogBackContentVisible: false,
                frontContent: undefined,
                backContent: undefined,
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
                    create: this.permission.admissionTemplate_create,
                    update: this.permission.admissionTemplate_update,
                    delete: this.permission.admissionTemplate_delete
                };
            }
        },
        created(){
            this.reloadList();
            this.getAllBranchSchoolUserByUserId();
        },
        methods: {
            resetSearch(){
                this.listQuery.admissionName = undefined;
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.admissionTemplateList = undefined;
                this.total = undefined;
                getAdmissionTemplateList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.admissionTemplateList = response.data.records;
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
                this.resetAdmissionTemplate();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetAdmissionTemplate();
                if (row.id) {
                    this.admissionTemplate = deepClone(row);
                } else {
                    this.admissionTemplate = deepClone(this.selectedRows[0]);
                }
                if (this.$refs['frontContent']) {
                    this.$refs['frontContent'].setUeContent(this.admissionTemplate.frontContent);
                }
                if (this.$refs['backContent']) {
                    this.$refs['backContent'].setUeContent(this.admissionTemplate.backContent);
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
                this.admissionTemplate.frontContent = this.$refs['frontContent'].getUeContent();
                this.admissionTemplate.backContent = this.$refs['backContent'].getUeContent();
                this.$refs['admissionTemplateDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateAdmissionTemplate(this.admissionTemplate).then(() => {
                            this.resetAdmissionTemplateDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.admissionTemplate.frontContent = this.$refs['frontContent'].getUeContent();
                this.admissionTemplate.backContent = this.$refs['backContent'].getUeContent();
                this.$refs['admissionTemplateDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateAdmissionTemplate(this.admissionTemplate).then(() => {
                            this.resetAdmissionTemplateDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delAdmissionTemplates(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetAdmissionTemplate(){
                this.admissionTemplate = {
                    id: undefined,
                    schoolId: undefined,
                    admissionName: undefined,
                    frontContent: undefined,
                    backContent: undefined
                }
            },
            resetAdmissionTemplateDialogAndList(){
                this.closeAdmissionTemplateDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeAdmissionTemplateDialog() {
                this.dialogVisible = false;
                this.resetAdmissionTemplate();
                this.$refs['admissionTemplateDialogForm'].resetFields();
                // 清除富文本缓存
                // $('#ueditor_textarea_editorValue').remove()
                this.$refs['frontContent'].setUeContent('');
                this.$refs['backContent'].setUeContent('');
            },
            getAllBranchSchoolUserByUserId(){
                getAllBranchSchoolUserByUserId().then(response => {
                    this.allBranchSchoolUser = response.data;
                })
            },
            showFrontContent(frontContent) {
                this.dialogFrontContentVisible = true;
                this.frontContent = frontContent;
            },
            closeFrontContentDialog() {
                this.dialogFrontContentVisible = false;
                this.frontContent = undefined;
            },
            showBackContent(backContent) {
                this.dialogBackContentVisible = true;
                this.backContent = backContent;
            },
            closeBackContentDialog() {
                this.dialogBackContentVisible = false;
                this.backContent = undefined;
            },
            printContent(content) {
                // console.log(content)
                // const oldHtml = document.body.innerHTML;
                // window.document.body.innerHTML = content;
                // window.print();
                // window.document.body.innerHTML = oldHtml;
                // 重新加载页面，以刷新数据
                // window.location.reload()

                var t = window.open("","打印");
                t.document.open();
                t.document.write(content);
                // 延迟打印，防止页面没有加载完成
                setTimeout(() => {
                    t.window.print();
                    t.close()
                }, 500);
            },
        }
    }
</script>


