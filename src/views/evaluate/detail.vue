<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model="listQuery.name"></el-input>
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
            <el-table :data="detailList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="组织机构代码" prop="organizationalCode"/>
                <el-table-column align="center" label="事项编码" prop="itemCode"/>
                <el-table-column align="center" label="事项办理项编码" prop="processItemCode"/>
                <el-table-column align="center" label="事项名称" prop="itemName"/>
                <el-table-column align="center" label="事项主题（个人=1，法人=2）" prop="subMatter"/>
                <el-table-column align="center" label="办件编号" prop="processNumber"/>
                <el-table-column align="center" label="办件状态" prop="proStatus"/>
                <el-table-column align="center" label="受理部门" prop="proDepartment"/>
                <el-table-column align="center" label="经办人" prop="proManager"/>
                <el-table-column align="center" label="评价渠道（pc端=1，移动端=2，二维码=3，政务大厅平板电脑=4，政务大厅其他终端=5）" prop="channel"/>
                <el-table-column align="center" label="评价人身份唯一标识" prop="userId"/>
                <el-table-column align="center" label="评价人姓名" prop="userName"/>
                <el-table-column align="center" label="用户属性（个人=1、法人=2）" prop="userProp"/>
                <el-table-column align="center" label="是否匿名（是=1、否=2）" prop="anonymityFlag"/>
                <el-table-column align="center" label="评价等级（整体满意度）" prop="levelCode"/>
                <el-table-column align="center" label="测评指标编码（501，502），多选用,隔开" prop="contentCode"/>
                <el-table-column align="center" label="文字评价" prop="words"/>
                <el-table-column align="center" label="提交时间" prop="submitTime"/>
                <el-table-column align="center" label="评价次数（首次评价=1，二次评价=2）" prop="number"/>
                <el-table-column align="center" label="审核状态（无需审核=1，已审核=2，未审核=3）无审核系统默认为1" prop="status"/>
                <el-table-column align="center" label="是否公开（公开=1，不公开=2）无审核系统默认为1" prop="publicFlag"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
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
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeDetailDialog">
                <el-form ref="detailDialogForm" class="deyatech-form" :model="detail" label-position="right"
                         label-width="80px" :rules="detailRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="组织机构代码" prop="organizationalCode">
                                <el-input v-model="detail.organizationalCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="事项编码" prop="itemCode">
                                <el-input v-model="detail.itemCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="事项办理项编码" prop="processItemCode">
                                <el-input v-model="detail.processItemCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="事项名称" prop="itemName">
                                <el-input v-model="detail.itemName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="事项主题（个人=1，法人=2）" prop="subMatter">
                                <el-input v-model="detail.subMatter"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="办件编号" prop="processNumber">
                                <el-input v-model="detail.processNumber"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="办件状态" prop="proStatus">
                                <el-input v-model="detail.proStatus"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="受理部门" prop="proDepartment">
                                <el-input v-model="detail.proDepartment"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="经办人" prop="proManager">
                                <el-input v-model="detail.proManager"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评价渠道（pc端=1，移动端=2，二维码=3，政务大厅平板电脑=4，政务大厅其他终端=5）" prop="channel">
                                <el-input v-model="detail.channel"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="评价人身份唯一标识" prop="userId">
                                <el-input v-model="detail.userId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评价人姓名" prop="userName">
                                <el-input v-model="detail.userName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="用户属性（个人=1、法人=2）" prop="userProp">
                                <el-input v-model="detail.userProp"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否匿名（是=1、否=2）" prop="anonymityFlag">
                                <el-input v-model="detail.anonymityFlag"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="评价等级（整体满意度）" prop="levelCode">
                                <el-input v-model="detail.levelCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="测评指标编码（501，502），多选用,隔开" prop="contentCode">
                                <el-input v-model="detail.contentCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="文字评价" prop="words">
                                <el-input v-model="detail.words"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="提交时间" prop="submitTime">
                                <el-input v-model="detail.submitTime"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="评价次数（首次评价=1，二次评价=2）" prop="number">
                                <el-input v-model="detail.number"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="审核状态（无需审核=1，已审核=2，未审核=3）无审核系统默认为1" prop="status">
                                <el-input v-model="detail.status"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否公开（公开=1，不公开=2）无审核系统默认为1" prop="public">
                                <el-input v-model="detail.publicFlag"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="detail.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeDetailDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getDetailList,
        createOrUpdateDetail,
        delDetails
    } from '@/api/evaluate/detail';

    export default {
        name: 'detail',
        data() {
            return {
                detailList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                detail: {
                    id: undefined,
                    organizationalCode: undefined,
                    itemCode: undefined,
                    processItemCode: undefined,
                    itemName: undefined,
                    subMatter: undefined,
                    processNumber: undefined,
                    proStatus: undefined,
                    proDepartment: undefined,
                    proManager: undefined,
                    channel: undefined,
                    userId: undefined,
                    userName: undefined,
                    userProp: undefined,
                    anonymityFlag: undefined,
                    levelCode: undefined,
                    contentCode: undefined,
                    words: undefined,
                    submitTime: undefined,
                    number: undefined,
                    status: undefined,
                    publicFlag: undefined
                },
                detailRules: {
                    organizationalCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '组织机构代码'}
                    ],
                    itemCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '事项编码'}
                    ],
                    processItemCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '事项办理项编码'}
                    ],
                    itemName: [
                        {required: true, message: this.$t("table.pleaseInput") + '事项名称'}
                    ],
                    subMatter: [
                        {required: true, message: this.$t("table.pleaseInput") + '事项主题（个人=1，法人=2）'}
                    ],
                    processNumber: [
                        {required: true, message: this.$t("table.pleaseInput") + '办件编号'}
                    ],
                    proStatus: [
                        {required: true, message: this.$t("table.pleaseInput") + '办件状态'}
                    ],
                    proDepartment: [
                        {required: true, message: this.$t("table.pleaseInput") + '受理部门'}
                    ],
                    proManager: [
                        {required: true, message: this.$t("table.pleaseInput") + '经办人'}
                    ],
                    channel: [
                        {required: true, message: this.$t("table.pleaseInput") + '评价渠道（pc端=1，移动端=2，二维码=3，政务大厅平板电脑=4，政务大厅其他终端=5）'}
                    ],
                    userId: [
                        {required: true, message: this.$t("table.pleaseInput") + '评价人身份唯一标识'}
                    ],
                    userName: [
                        {required: true, message: this.$t("table.pleaseInput") + '评价人姓名'}
                    ],
                    userProp: [
                        {required: true, message: this.$t("table.pleaseInput") + '用户属性（个人=1、法人=2）'}
                    ],
                    anonymityFlag: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否匿名（是=1、否=2）'}
                    ],
                    levelCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '评价等级（整体满意度）'}
                    ],
                    contentCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '测评指标编码（501，502），多选用,隔开'}
                    ],
                    words: [
                        {required: true, message: this.$t("table.pleaseInput") + '文字评价'}
                    ],
                    submitTime: [
                        {required: true, message: this.$t("table.pleaseInput") + '提交时间'}
                    ],
                    number: [
                        {required: true, message: this.$t("table.pleaseInput") + '评价次数（首次评价=1，二次评价=2）'}
                    ],
                    status: [
                        {required: true, message: this.$t("table.pleaseInput") + '审核状态（无需审核=1，已审核=2，未审核=3）无审核系统默认为1'}
                    ],
                    publicFlag: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否公开（公开=1，不公开=2）无审核系统默认为1'}
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
                    create: this.permission.detail_create,
                    update: this.permission.detail_update,
                    delete: this.permission.detail_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.detailList = undefined;
                this.total = undefined;
                getDetailList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.detailList = response.data.records;
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
                this.resetDetail();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetDetail();
                if (row.id) {
                    this.detail = deepClone(row);
                } else {
                    this.detail = deepClone(this.selectedRows[0]);
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
                this.$refs['detailDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateDetail(this.detail).then(() => {
                            this.resetDetailDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['detailDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateDetail(this.detail).then(() => {
                            this.resetDetailDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delDetails(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetDetail(){
                this.detail = {
                    id: undefined,
                    organizationalCode: undefined,
                    itemCode: undefined,
                    processItemCode: undefined,
                    itemName: undefined,
                    subMatter: undefined,
                    processNumber: undefined,
                    proStatus: undefined,
                    proDepartment: undefined,
                    proManager: undefined,
                    channel: undefined,
                    userId: undefined,
                    userName: undefined,
                    userProp: undefined,
                    anonymityFlag: undefined,
                    levelCode: undefined,
                    contentCode: undefined,
                    words: undefined,
                    submitTime: undefined,
                    number: undefined,
                    status: undefined,
                    publicFlag: undefined
                }
            },
            resetDetailDialogAndList(){
                this.closeDetailDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeDetailDialog() {
                this.dialogVisible = false;
                this.resetDetail();
                this.$refs['detailDialogForm'].resetFields();
            }
        }
    }
</script>


