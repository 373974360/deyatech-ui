<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-select :size="searchSize" v-model="checkItemIds" class="filter-item" multiple filterable placeholder="选择事项">
                            <el-option :key="item.id" v-for="item in itemList" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select :size="searchSize" v-model="checkWindowIds" class="filter-item" multiple filterable placeholder="选择窗口"
                                   @change="reloadItemList">
                            <el-option :key="window.id" v-for="window in windowList" :label="window.name" :value="window.id">
                            </el-option>
                        </el-select>
                        <el-date-picker :size="searchSize" class="filter-item" v-model="listQuery.startDate" type="datetime" :editable="false"
                                        placeholder="抽号开始时间" :clearable="false" format="yyyy-MM-dd HH:mm:ss" clearable
                                        value-format="yyyy-MM-dd HH:mm:ss" @change="checkDate">
                        </el-date-picker>
                        <el-date-picker :size="searchSize" class="filter-item" v-model="listQuery.endDate" type="datetime" :editable="false"
                                        placeholder="抽号结束时间" :clearable="false" format="yyyy-MM-dd HH:mm:ss" clearable
                                        value-format="yyyy-MM-dd HH:mm:ss" @change="checkDate">
                        </el-date-picker>
                        <el-input :size="searchSize" class="filter-item" :placeholder="'请输入身份证号码或手机号码'" v-model.trim="listQuery.phone" style="width: 220px"></el-input>
                        <el-button :size="searchSize" class="filter-item" type="primary" icon="el-icon-search"  @click="searchReloadList">{{$t('table.search')}}</el-button>
                        <el-button :size="searchSize" class="filter-item" icon="el-icon-delete" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                    <el-button type="primary" :size="btnSize" icon="el-icon-download" @click="export2Excel">数据导出</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="commentList" v-loading.body="listLoading" stripe border>
                <el-table-column align="center" label="姓名" prop="name"/>
                <el-table-column align="center" label="身份证号码" prop="idcardNo" width="170px"/>
                <el-table-column align="center" label="电话号码" prop="phone"/>
                <el-table-column align="center" label="抽号号码" prop="callOrderNo"/>
                <el-table-column align="center" label="抽号时间" prop="callCreateTime" width="150px"/>
                <el-table-column align="center" label="事项名称" prop="itemName"/>
                <el-table-column align="center" label="窗口名称" prop="windowName"/>
                <el-table-column align="center" label="是否叫号" prop="isCalled"/>
                <el-table-column align="center" label="叫号时间" prop="callTime" width="150px"/>
                <el-table-column align="center" label="等待时长（分）" prop="waitingTime"/>
                <el-table-column align="center" label="评分" prop="score"  width="150px">
                    <template slot-scope="scope">
                        <el-rate
                            v-model="scope.row.score"
                            disabled
                            text-color="#ff9900">
                        </el-rate>
                        <!--{{scope.row.score}}-->
                    </template>
                </el-table-column>
                <el-table-column align="center" label="评价描述" prop="remark"/>
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">-->
                            <!--{{scope.row.enable | enums('EnableEnum')}}-->
                        <!--</el-tag>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
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
                       :close-on-click-modal="closeOnClickModal" @close="closeCommentDialog">
                <el-form ref="commentDialogForm" class="deyatech-form" :model="comment" label-position="right"
                         label-width="80px" :rules="commentRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="叫号信息编号" prop="callId">
                                <el-input v-model="comment.callId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评分" prop="score">
                                <el-input v-model="comment.score"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="comment.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeCommentDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getCommentList,
        createOrUpdateComment,
        delComments
    } from '@/api/number/comment';
    import {getAllWindows} from '@/api/number/window';
    import {getItemsByWindowAndDepartment} from '@/api/item/item';
    import {date} from '@/api/statistics/orderAndLine';

    export default {
        name: 'comment',
        data() {
            return {
                commentList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    itemIds: undefined,
                    windowIds: undefined,
                    startDate: undefined,
                    endDate: undefined,
                    phone: undefined
                },
                checkItemIds: [],
                checkWindowIds: [],
                itemList: [],
                windowList: [],
                itemListQuery: {
                    windowIds: ''
                },
                comment: {
                    id: undefined,
                    callId: undefined,
                    score: undefined
                },
                commentRules: {
                    callId: [
                        {required: true, message: this.$t("table.pleaseInput") + '叫号信息编号'}
                    ],
                    score: [
                        {required: true, message: this.$t("table.pleaseInput") + '评分'}
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
                    create: this.permission.comment_create,
                    update: this.permission.comment_update,
                    delete: this.permission.comment_delete
                };
            }
        },
        created(){
            this.listQuery.startDate = this.getTodayStart();
            this.listQuery.endDate = this.getTodayEnd();
            this.getItemList();
            this.getWindowList();
            this.reloadList();
        },
        methods: {
            checkDate() {
                if (this.listQuery.startDate > this.listQuery.endDate) {
                    alert("开始时间不得大于结束时间！")
                }
            },
            getWindowList() {
                getAllWindows().then(response => {
                    if (response.status === 200) {
                        this.windowList = response.data;
                    } else {
                        this.$message.error('窗口信息加载失败')
                    }
                })
            },
            getItemList() {
                this.itemListQuery.windowIds = this.checkWindowIds.join();
                getItemsByWindowAndDepartment(this.itemListQuery).then(response => {
                    if (response.status === 200) {
                        this.itemList = response.data
                    } else {
                        this.$message.error('事项信息加载失败')
                    }
                })
            },
            reloadItemList() {
                this.checkItemIds = [];
                this.getItemList();
                this.listQuery.itemIds = [];
            },
            resetSearch(){
                this.checkWindowIds = [];
                this.listQuery.startDate = undefined;
                this.listQuery.endDate = undefined;
                this.listQuery.phone = undefined;
                this.reloadItemList();
            },
            searchReloadList(){
                this.listQuery.page = 1;
                this.reloadList();
            },
            reloadList(){
                if (this.listQuery.startDate > this.listQuery.endDate) {
                    alert("开始时间不得大于结束时间！")
                    return;
                }
                this.listQuery.itemIds = this.checkItemIds.join();
                this.listQuery.windowIds = this.checkWindowIds.join();
                this.listLoading = true;
                this.commentList = undefined;
                this.total = undefined;
                getCommentList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.commentList = response.data.records;
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
                this.resetComment();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetComment();
                if (row.id) {
                    this.comment = deepClone(row);
                } else {
                    this.comment = deepClone(this.selectedRows[0]);
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
                this.$refs['commentDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateComment(this.comment).then(() => {
                            this.resetCommentDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['commentDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateComment(this.comment).then(() => {
                            this.resetCommentDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delComments(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetComment(){
                this.comment = {
                    id: undefined,
                    callId: undefined,
                    score: undefined
                }
            },
            resetCommentDialogAndList(){
                this.closeCommentDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeCommentDialog() {
                this.dialogVisible = false;
                this.resetComment();
                this.$refs['commentDialogForm'].resetFields();
            },
            getTodayStart() {
                return date(new Date().setHours(0, 0, 0), 'YYYY-MM-DD HH:mm:ss');
            },
            getTodayEnd() {
                return date(new Date().setHours(23, 59, 59), 'YYYY-MM-DD HH:mm:ss');
            },
            export2Excel() {
                require.ensure([], () => {
                    const Export2excel = require('@/excel/Export2excel');
                    //对应表格输出的title
                    const tHeader = ['姓名', '身份证号码', '电话号码', '抽号号码', '抽号时间', "事项名称", '窗口名称', '是否叫号', '叫号时间', '等待时长（分）', '评分', '评价描述'];
                    // 对应表格输出的数据
                    const filterVal = ['name', 'idcardNo', 'phone', 'callOrderNo', 'callCreateTime', 'itemName', 'windowName', 'isCalled', 'callTime', 'waitingTime', 'score', 'remark'];
                    if (this.total < this.listQuery.size && this.commentList) {
                        const data = this.commentList;
                        const excelData = this.formatJson(filterVal, data);
                        //对应下载文件的名字
                        Export2excel.export2Excel(tHeader, excelData, '抽号信息excel' + new Date().toLocaleDateString().replace(/\//g,'-'));
                    } else {
                        const page = this.listQuery.page;
                        const size = this.listQuery.size;
                        this.listQuery.page = 1;
                        this.listQuery.size = 99999;
                        getCommentList(this.listQuery).then(response => {
                            const data = response.data.records;
                            this.listQuery.page = page;
                            this.listQuery.size = size;
                            const excelData = this.formatJson(filterVal, data);
                            //对应下载文件的名字
                            Export2excel.export2Excel(tHeader, excelData, '抽号信息excel' + new Date().toLocaleDateString().replace(/\//g,'-'));
                        })
                    }
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }
</script>
<style>
    .filter-item {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 10px;
        margin-left: 10px;
    }
</style>

