<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model="listQuery.title"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.modelId" clearable placeholder="业务模型" style="width:120px;">
                            <el-option v-for="item in modelList" :label="item.modelName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.purId" clearable placeholder="诉求目的" style="width:120px;">
                            <el-option v-for="item in purposeList" :label="item.purposeName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                            :size="searchSize"
                            v-model="timeFrame"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions">
                        </el-date-picker>
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
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="recordList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="left" label="标题" prop="title" min-width="400"/>
                <el-table-column align="center" label="业务模型" prop="modelName" width="90"/>
                <el-table-column align="center" label="诉求目的" prop="purposeName" width="90"/>
                <el-table-column align="center" label="来信人IP" prop="ip" width="130"/>
                <el-table-column align="center" label="收件部门" prop="deptName" width="150"/>
                <el-table-column align="center" label="回复部门" prop="replyDeptName" width="150"/>
                <el-table-column align="center" label="公开意愿" prop="isOpen" width="90">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isOpen == 1">
                            是
                        </span>
                        <span v-if="scope.row.isOpen == 2">
                            否
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发布状态" prop="isPublish" width="90">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isPublish == 1">
                            是
                        </span>
                        <span v-if="scope.row.isPublish == 2">
                            否
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="来信时间" prop="createTime" width="200"/>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" fixed="right" align="center" width="100">
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
                       :close-on-click-modal="closeOnClickModal" @close="closeRecordDialog" width="60%">
                <el-form ref="recordDialogForm" class="deyatech-form" :model="record" label-position="right"
                         label-width="100px" :rules="recordRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="标题" prop="title">
                                <el-input v-model="record.title"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="信件状态" prop="flag">
                                <el-radio-group v-model="record.flag">
                                    <el-radio :label="0">未处理</el-radio>
                                    <el-radio :label="1">办理中</el-radio>
                                    <el-radio :label="2">已办结</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="业务模型" prop="modelId">
                                <el-select v-model="record.modelId" placeholder="请选择业务模型" style="width:100%">
                                    <el-option v-for="item in modelList" :label="item.modelName" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="诉求目的" prop="purId">
                                <el-select v-model="record.purId" placeholder="请选择业务模型" style="width:100%">
                                    <el-option v-for="item in purposeList" :label="item.purposeName" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="来信人姓名" prop="userName">
                                <el-input v-model="record.userName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证号码" prop="cardId">
                                <el-input v-model="record.cardId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="手机号码" prop="phone">
                                <el-input v-model="record.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="电子邮箱" prop="email">
                                <el-input v-model="record.email"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="通讯地址" prop="address">
                                <el-input v-model="record.address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="来信时间" prop="createTime">
                                <el-date-picker
                                    style="width:100%;"
                                    v-model="record.createTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择来信时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="收件部门" prop="deptId">
                                <el-cascader style="width: 100%" :options="departmentCascader" v-model="record.deptId"
                                             expand-trigger="hover" ></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="公开意愿" prop="isOpen">
                                <el-switch
                                    v-model="record.isOpen"
                                    active-text="是"
                                    inactive-text="否"
                                    :active-value=1 :inactive-value=2>
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否发布" prop="isPublish">
                                <el-switch
                                    v-model="record.isPublish"
                                    active-text="是"
                                    inactive-text="否"
                                    :active-value=1 :inactive-value=2>
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="来信内容" prop="content">
                                <editor v-model="record.content" :config="editorConfig" :default-msg="record.content" ref="content" id="content_index"></editor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="回复时间" prop="replyTime">
                                <el-date-picker
                                    style="width:100%;"
                                    v-model="record.replyTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择来信时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="回复部门" prop="replyDeptId">
                                <el-cascader style="width: 100%" :options="departmentCascader" v-model="record.replyDeptId"
                                             expand-trigger="hover" ></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="回复内容" prop="replyContent">
                                <editor v-model="record.replyContent" :config="editorConfig" :default-msg="record.replyContent" ref="replyContent" id="replyContent_index"></editor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeRecordDialog">{{$t('table.cancel')}}</el-button>
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
        getRecordList,
        createOrUpdateRecord,
        delRecords
    } from '@/api/appeal/record';
    import {
        getModeAllList
    } from '@/api/appeal/model';
    import {
        getPurposeAllList
    } from '@/api/appeal/purpose';
    import {getDepartmentCascader} from '@/api/admin/department';

    export default {
        name: 'record',
        components: {
            editor
        },
        data() {
            return {
                recordList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    title: undefined,
                    modelId: undefined,
                    purId: undefined,
                    timeFrame: undefined
                },
                record: {
                    id: undefined,
                    modelId: undefined,
                    purId: undefined,
                    title: undefined,
                    userName: undefined,
                    cardId: undefined,
                    phone: undefined,
                    email: undefined,
                    ip: undefined,
                    address: undefined,
                    sqCode: undefined,
                    queryCode: undefined,
                    deptId: undefined,
                    proDeptId: undefined,
                    isOpen: 2,
                    content: undefined,
                    isPublish: 2,
                    replyContent: undefined,
                    replyTime: undefined,
                    replyDeptId: undefined,
                    createTime: undefined,
                    flag: 0
                },
                recordRules: {
                    modelId: [
                        {required: true, message: this.$t("table.pleaseInput") + '业务ID'}
                    ],
                    purId: [
                        {required: true, message: this.$t("table.pleaseInput") + '诉求目的'}
                    ],
                    title: [
                        {required: true, message: this.$t("table.pleaseInput") + '标题'}
                    ],
                    userName: [
                        {required: true, message: this.$t("table.pleaseInput") + '来信人姓名'}
                    ],
                    deptId: [
                        {required: true, message: this.$t("table.pleaseInput") + '收件部门'}
                    ],
                    content: [
                        {required: true, message: this.$t("table.pleaseInput") + '来信内容'}
                    ],
                    createTime: [
                        {required: true, message: this.$t("table.pleaseInput") + '来信时间'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                modelList: [],
                purposeList: [],
                departmentCascader: [],
                editorConfig: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 350,
                    zIndex: 3000,
                    toolbars: [
                        [
                            'fullscreen', 'source', '|', 'undo', 'redo', '|',
                            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'searchreplace','|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                            'fontfamily', 'fontsize', '|',
                            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
                            'link', 'unlink', '|',
                            'insertimage', 'attachment','insertvideo','inserttable', '|',
                            'indent','removeformat', 'formatmatch', 'autotypeset','drafts'
                        ]
                    ]
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                timeFrame: undefined
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
                    create: this.permission.record_create,
                    update: this.permission.record_update,
                    delete: this.permission.record_delete
                };
            }
        },
        created(){
            this.reloadList();
            this.getModelList();
            this.getPurposeList();
            this.getDepartmentCascader();
        },
        methods: {
            getDepartmentCascader() {
                this.departmentCascader = [];
                getDepartmentCascader().then(response => {
                    this.departmentCascader = response.data;
                })
            },
            getModelList(){
                this.modelList = [];
                getModeAllList().then(response => {
                    this.modelList = response.data;
                })
            },
            getPurposeList(){
                this.purposeList = [];
                getPurposeAllList().then(response => {
                    this.purposeList = response.data;
                })
            },
            resetSearch(){
                this.listQuery.title = undefined;
                this.listQuery.modelId = undefined;
                this.listQuery.purId = undefined;
                this.listQuery.timeFrame = undefined;
                this.timeFrame = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.recordList = undefined;
                this.total = undefined;
                let times = this.timeFrame;
                if(times != undefined){
                    this.listQuery.timeFrame = times[0]+","+times[1];
                }else{
                    this.listQuery.timeFrame = undefined;
                }
                getRecordList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.recordList = response.data.records;
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
                this.resetRecord();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetRecord();
                if (row.id) {
                    this.record = deepClone(row);
                } else {
                    this.record = deepClone(this.selectedRows[0]);
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
                this.$refs['recordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        const deptId = this.record.deptId;
                        this.record.deptId = deptId[deptId.length-1];
                        const replyDeptId = this.record.replyDeptId;
                        this.record.replyDeptId = replyDeptId[replyDeptId.length-1];
                        this.record.content = this.$refs['content'].getUeContent();
                        this.record.replyContent = this.$refs['replyContent'].getUeContent();
                        createOrUpdateRecord(this.record).then(() => {
                            this.resetRecordDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['recordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        const deptId = this.record.deptId;
                        if(Array.isArray(deptId)){
                            this.record.deptId = deptId[deptId.length-1];
                        }
                        const replyDeptId = this.record.replyDeptId;
                        if(Array.isArray(replyDeptId)){
                            this.record.replyDeptId = replyDeptId[replyDeptId.length-1];
                        }
                        this.record.content = this.$refs['content'].getUeContent();
                        this.record.replyContent = this.$refs['replyContent'].getUeContent();
                        createOrUpdateRecord(this.record).then(() => {
                            this.resetRecordDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delRecords(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetRecord(){
                this.record = {
                    id: undefined,
                    modelId: undefined,
                    purId: undefined,
                    title: undefined,
                    userName: undefined,
                    cardId: undefined,
                    phone: undefined,
                    email: undefined,
                    ip: undefined,
                    address: undefined,
                    sqCode: undefined,
                    queryCode: undefined,
                    deptId: undefined,
                    proDeptId: undefined,
                    isOpen: 2,
                    content: undefined,
                    isPublish: 2,
                    replyContent: undefined,
                    replyTime: undefined,
                    replyDeptId: undefined,
                    createTime: undefined,
                    flag: 0
                };
            },
            resetRecordDialogAndList(){
                this.closeRecordDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeRecordDialog() {
                this.dialogVisible = false;
                this.resetRecord();
                this.$refs['recordDialogForm'].resetFields();
            }
        }
    }
</script>


