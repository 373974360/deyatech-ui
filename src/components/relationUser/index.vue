<template>
    <el-dialog :title="titleMap['associateUser']" :visible="visible"
               :close-on-click-modal="closeOnClickModal" @close="closeDialog">
        <div v-loading="formLoading">
            <div class="search">
                <el-cascader :options="departmentCascader" @change="handleDepartmentChange"
                             class="search-item dialog-keywords"
                             :show-all-levels="false" expand-trigger="hover" clearable change-on-select
                             :size="searchSize" placeholder="根据部门筛选"></el-cascader>
                <el-input v-model="userListQuery.name" class="search-item dialog-keywords"
                          clearable :size="searchSize" placeholder="根据姓名或帐户查询"></el-input>
                <el-button type="primary" :size="searchSize" icon="el-icon-search" @click="reloadUserList">
                    {{$t('table.search')}}
                </el-button>
            </div>
            <div class="search">
                <el-checkbox @change="handleShowRelated">只显示已关联用户</el-checkbox>
            </div>
            <div>
                <el-table ref="userTable" :data="userList" border @select="selectRowUser"
                          @select-all="selectAllUser" @selection-change="handleSelectionChangeUser">
                    <el-table-column type="selection" width="50" align="center"></el-table-column>
                    <el-table-column prop="departmentName" label="部门"></el-table-column>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="account" label="登录帐户"></el-table-column>
                </el-table>
                <el-pagination class="deyatech-pagination pull-right" background
                               :current-page.sync="userListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                               :page-size="userListQuery.size" :layout="this.$store.state.common.pageLayout"
                               :total="userTotal"
                               @size-change="handleSizeChangeUser" @current-change="handleCurrentChangeUser">
                </el-pagination>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :size="btnSize" @click="handleSubmit"
                       :loading="submitLoading">{{$t('table.confirm')}}
            </el-button>
            <el-button :size="btnSize" @click="closeDialog">{{$t('table.cancel')}}</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {getDepartmentCascader} from "@/api/admin/department";
    import {getUserList} from "@/api/admin/user";

    export default {
        name: "relation-user",
        props: {
            visible: false,
            selectedUserId: {},
            submitLoading: false,
            queryParams: {},
            showRelated: {},
            submit: {},
            cancel: {}
        },
        data() {
            return {
                departmentCascader: [],
                userListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    departmentId: undefined,
                    name: undefined
                },
                formLoading: false,
                userTotal: 0,
                userList: [],
                selectedRowsUser: [],
                dialogTitle: undefined
            };
        },
        computed: {
            ...mapGetters([
                'titleMap',
                'enums',
                'closeOnClickModal',
                'searchSize',
                'btnSize'
            ])
        },
        created() {
            this.loadDepartment();
            this.loadUserList();
        },
        methods: {
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
            handleShowRelated(checked) {
                if(this.showRelated){
                    this.showRelated(checked);
                }
                Object.assign(this.userListQuery, this.queryParams);
                this.reloadUserList();
            },
            loadUserList() {
                return new Promise((resolve, reject) => {
                    this.formLoading = true;
                    getUserList(this.userListQuery).then(response => {
                        this.formLoading = false;
                        this.userList = response.data.records;
                        this.userTotal = response.data.total;
                        resolve();
                    }).catch(err => {
                        reject(err);
                    })
                });
            },
            reloadUserList() {
                this.handleCurrentChangeUser(1)
            },
            selectRowUser(selection, row) {
                let i = this.selectedUserId.indexOf(row.id)
                if (i < 0) {
                    this.selectedUserId.push(row.id)
                } else {
                    this.selectedUserId.splice(i, 1)
                }
            },
            selectAllUser(selection) {
                if (selection.length > 0) {
                    for (let user of this.userList) {
                        if (this.selectedUserId.indexOf(user.id) < 0) {
                            this.selectedUserId.push(user.id)
                        }
                    }
                } else {
                    for (let user of this.userList) {
                        let i = this.selectedUserId.indexOf(user.id)
                        if (i >= 0) {
                            this.selectedUserId.splice(i, 1)
                        }
                    }
                }
            },
            handleSizeChangeUser(val) {
                this.userListQuery.size = val;
                this.loadUserList().then(() => {
                    this.checkRelatedUserRows();
                });
            },
            handleCurrentChangeUser(val) {
                this.userListQuery.page = val;
                this.loadUserList().then(() => {
                    this.checkRelatedUserRows();
                });
            },
            checkRelatedUserRows() {
                if (this.selectedUserId && this.selectedUserId.length > 0) {
                    for (let row of this.userList) {
                        if (this.selectedUserId.includes(row.id)) {
                            this.$refs['userTable'].toggleRowSelection(row, true)
                        }
                    }
                }
            },
            handleSelectionChangeUser(rows) {
                this.selectedRowsUser = rows;
            },
            handleSubmit() {
                if (this.submit) {
                    this.submit();
                }
            },
            closeDialog() {
                this.formLoading = false;
                if(this.cancel){
                    this.cancel();
                }
            }
        }
    }
</script>

<style>
    .search {
        margin-bottom: 20px;
    }

    .search-item {
        margin-right: 8px;
    }

    .dialog-keywords {
        width: 180px;
        height: 30px;
        line-height: 30px;
    }
</style>
