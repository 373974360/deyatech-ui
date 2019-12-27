<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '专业或课程代码'" v-model.trim="listQuery.professionalCode"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '专业或课程名称'" v-model.trim="listQuery.professionalName"></el-input>
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
                    <el-upload
                        style="display: inline; margin-left: 10px;"
                        :limit="10"
                        :beforeUpload="beforeUpload"
                        :headers="$store.state.common.initHeaders"
                        action="/manage/reissue/professionalCourses/importExcel"
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
            <el-table :data="professionalCoursesList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="教学部" prop="departmentName"/>
                <el-table-column align="center" label="专业代码" prop="professionalCode"/>
                <el-table-column align="center" label="专业名称" prop="professionalName"/>
                <el-table-column align="center" label="课程代码" prop="courseCode"/>
                <el-table-column align="center" label="课程名称" prop="courseName"/>
<!--                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.users" title="关联用户" type="primary" icon="iconadd-account" :size="btnSize" circle
                                   @click.stop.safe="btnUsers(scope.row)"></el-button>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeProfessionalCoursesDialog">
                <el-form ref="professionalCoursesDialogForm" class="deyatech-form" :model="professionalCourses" label-position="right"
                         label-width="80px" :rules="professionalCoursesRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="教学部" prop="departmentName">
                                <el-input v-model.trim="professionalCourses.departmentName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="课程代码" prop="courseCode">
                                <el-input v-model.trim="professionalCourses.courseCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="课程名称" prop="courseName">
                                <el-input v-model.trim="professionalCourses.courseName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="专业代码" prop="professionalCode">
                                <el-input v-model.trim="professionalCourses.professionalCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="专业名称" prop="professionalName">
                                <el-input v-model.trim="professionalCourses.professionalName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="professionalCourses.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeProfessionalCoursesDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>


            <el-dialog :title="titleMap['associateUser']" :visible.sync="dialogUsersVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeProfessionalCoursesUserDialog">
                <div v-loading="dialogUsersFormLoading">
                    <div class="dialog-search">
                        <el-cascader :options="departmentCascader" @change="handleDepartmentChange"
                                     class="dialog-search-item dialog-keywords" ref="mycascader"
                                     :show-all-levels="false" expand-trigger="hover" clearable change-on-select
                                     :size="searchSize" placeholder="根据部门筛选"></el-cascader>
                        <el-input v-model="userListQuery.userName" class="dialog-search-item dialog-keywords"
                                  clearable :size="searchSize" placeholder="根据姓名或帐户查询"></el-input>
                        <el-button type="primary" :size="searchSize" icon="el-icon-search" @click="reloadUserList">{{$t('table.search')}}</el-button>
                    </div>
                    <div class="dialog-search">
                        <el-checkbox v-model="showRelatedFlag" @change="handleShowRelated">只显示已关联用户</el-checkbox>
                    </div>
                    <div>
                        <el-table ref="workingGroupUserTable" :data="userList" border @select="selectRowUser"
                                  @select-all="selectAllUser" @selection-change="handleSelectionChangeProfessionalCoursesUser">
                            <el-table-column type="selection" width="50" align="center"></el-table-column>
                            <el-table-column prop="departmentName" label="部门"></el-table-column>
                            <el-table-column prop="userName" label="姓名"></el-table-column>
                            <el-table-column prop="userAccount" label="登录帐户"></el-table-column>
                        </el-table>
                        <el-pagination class="deyatech-pagination pull-right" background
                                       :current-page.sync="userListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                       :page-size="userListQuery.size" :layout="this.$store.state.common.pageLayout" :total="userTotal"
                                       @size-change="handleSizeChangeProfessionalCoursesUser" @current-change="handleCurrentChangeProfessionalCoursesUser">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveProfessionalCoursesUser"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeProfessionalCoursesUserDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getProfessionalCoursesList,
        createOrUpdateProfessionalCourses,
        delProfessionalCoursess
    } from '@/api/reissue/professionalCourses';
    import {
        getAllProfessionalCoursesUser,
        getProfessionalCoursesUserList,
        saveProfessionalCoursesUsers
    } from '@/api/reissue/professionalCoursesUser';
    import {getDepartmentCascader} from "@/api/admin/department";

    export default {
        name: 'professionalCourses',
        data() {
            return {
                professionalCoursesList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    professionalCode: undefined,
                    professionalName: undefined
                },
                professionalCourses: {
                    id: undefined,
                    departmentName: undefined,
                    courseCode: undefined,
                    courseName: undefined,
                    professionalCode: undefined,
                    professionalName: undefined
                },
                professionalCoursesRules: {
                    departmentName: [
                        {required: true, message: this.$t("table.pleaseInput") + '教学部'},
                        {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
                    ],
                    courseCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '课程代码'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
                    ],
                    courseName: [
                        {required: true, message: this.$t("table.pleaseInput") + '课程名称'},
                        {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
                    ],
                    professionalCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '专业代码'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
                    ],
                    professionalName: [
                        {required: true, message: this.$t("table.pleaseInput") + '专业名称'},
                        {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
                    ],
                    remark: [
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,

                currentRow: undefined,
                dialogUsersVisible: false,
                dialogUsersFormLoading: false,
                selectAllUserId: [],
                showRelatedFlag: false,
                userListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    departmentId: undefined,
                    userName: undefined,
                    coursesId: undefined
                },
                userList: [],
                userTotal: 0,
                departmentCascader: [],
                selectedRowsUser: [],
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
                    create: this.permission.professionalCourses_create,
                    update: this.permission.professionalCourses_update,
                    delete: this.permission.professionalCourses_delete,
                    users: this.permission.professionalCourses_users,
                };
            }
        },
        created(){
            this.loadDepartment();
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.professionalCode = undefined;
                this.listQuery.professionalName = undefined;
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.professionalCoursesList = undefined;
                this.total = undefined;
                getProfessionalCoursesList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.professionalCoursesList = response.data.records;
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
                this.resetProfessionalCourses();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetProfessionalCourses();
                if (row.id) {
                    this.professionalCourses = deepClone(row);
                } else {
                    this.professionalCourses = deepClone(this.selectedRows[0]);
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
                this.$refs['professionalCoursesDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateProfessionalCourses(this.professionalCourses).then(() => {
                            this.resetProfessionalCoursesDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['professionalCoursesDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateProfessionalCourses(this.professionalCourses).then(() => {
                            this.resetProfessionalCoursesDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delProfessionalCoursess(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetProfessionalCourses(){
                this.professionalCourses = {
                    id: undefined,
                    departmentName: undefined,
                    courseCode: undefined,
                    courseName: undefined,
                    professionalCode: undefined,
                    professionalName: undefined
                }
            },
            resetProfessionalCoursesDialogAndList(){
                this.closeProfessionalCoursesDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeProfessionalCoursesDialog() {
                this.dialogVisible = false;
                this.resetProfessionalCourses();
                this.$refs['professionalCoursesDialogForm'].resetFields();
            },

            btnUsers(row) {
                this.currentRow = row;
                this.dialogUsersVisible = true;
                this.dialogUsersFormLoading = true;
                this.selectAllUserId = [];
                this.loadProfessionalCoursesUser(row.id).then(res => {
                    if (res && res.length > 0) {
                        for (let professionalCoursesUser of res) {
                            this.selectAllUserId.push(professionalCoursesUser.userId)
                        }
                        this.showRelatedFlag = true;
                        this.handleShowRelated(true);
                    } else {
                        this.showRelatedFlag = false;
                        this.handleShowRelated(false);
                    }
                })
            },
            loadProfessionalCoursesUser(coursesId) {
                let query = {coursesId}
                return new Promise((resolve, reject) => {
                    getAllProfessionalCoursesUser(query).then(response => {
                        resolve(response.data)
                    }).catch(err => {
                        reject(err)
                    })
                });
            },
            handleShowRelated(checked) {
                if (checked) {
                    this.userListQuery.coursesId = this.currentRow.id;
                } else {
                    this.userListQuery.coursesId = undefined;
                }
                this.reloadUserList();
            },
            reloadUserList() {
                this.handleCurrentChangeProfessionalCoursesUser(1)
            },
            selectRowUser(selection, row) {
                let i = this.selectAllUserId.indexOf(row.userId)
                if (i < 0) {
                    this.selectAllUserId.push(row.userId)
                } else {
                    this.selectAllUserId.splice(i, 1)
                }
            },
            selectAllUser(selection) {
                if (selection.length > 0) {
                    for (let user of this.userList) {
                        if (this.selectAllUserId.indexOf(user.userId) < 0) {
                            this.selectAllUserId.push(user.userId)
                        }
                    }
                } else {
                    for (let user of this.userList) {
                        let i = this.selectAllUserId.indexOf(user.userId)
                        if (i >= 0) {
                            this.selectAllUserId.splice(i, 1)
                        }
                    }
                }
            },
            handleSelectionChangeProfessionalCoursesUser(rows) {
                this.selectedRowsUser = rows;
            },
            handleSizeChangeProfessionalCoursesUser(val) {
                this.userListQuery.size = val;
                this.loadUserList().then(() => {
                    this.checkRelatedUserRows();
                });
            },
            handleCurrentChangeProfessionalCoursesUser(val) {
                this.userListQuery.page = val;
                this.loadUserList().then(() => {
                    this.checkRelatedUserRows();
                });
            },
            loadUserList() {
                return new Promise((resolve, reject) => {
                    this.dialogUsersFormLoading = true;
                    getProfessionalCoursesUserList(this.userListQuery).then(response => {
                        this.dialogUsersFormLoading = false;
                        this.userList = response.data.records;
                        this.userTotal = response.data.total;
                        resolve();
                    }).catch(err => {
                        reject(err);
                    })
                });
            },
            checkRelatedUserRows() {
                this.$nextTick(() => {
                    if (this.selectAllUserId && this.selectAllUserId.length > 0) {
                        for (let row of this.userList) {
                            if (this.selectAllUserId.includes(row.userId)) {
                                this.$refs['workingGroupUserTable'].toggleRowSelection(row, true)
                            }
                        }
                    }
                });
            },
            closeProfessionalCoursesUserDialog() {
                this.dialogUsersVisible = false;
                this.submitLoading = false;
                let obj = {};
                obj.stopPropagation = () =>{};
                this.$refs.mycascader.clearValue(obj);
                this.userListQuery.departmentId = undefined;
                this.userListQuery.userName = undefined;
                this.userListQuery.coursesId = undefined;
            },
            loadDepartment() {
                getDepartmentCascader().then(response => {
                    this.departmentCascader = response.data
                })
            },
            handleDepartmentChange(val) {
                if (val.length > 0) {
                    this.userListQuery.departmentId = val[val.length - 1]
                } else {
                    this.userListQuery.departmentId = undefined
                }
            },
            doSaveProfessionalCoursesUser() {
                this.submitLoading = true;
                saveProfessionalCoursesUsers(this.currentRow.id, this.selectAllUserId).then(() => {
                    this.closeProfessionalCoursesUserDialog();
                    this.$message.success(this.$t("table.associateSuccess"));
                }).catch(() => {
                    this.submitLoading = false;
                })
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


