<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="申请编码" v-model.trim="listQuery.ysqCode"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model.trim="listQuery.modelId" clearable placeholder="业务模型" style="width:120px;">
                            <el-option v-for="item in modelList" :label="item.modelName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                            :size="searchSize"
                            v-model.trim="timeFrame"
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
            <el-table :data="applyOpenRecordList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="申请编码" prop="ysqCode"/>
                <el-table-column align="center" label="申请人类型" prop="ysqType"/>
                <el-table-column align="center" label="申请人" prop="name"/>
                <el-table-column align="center" label="申请部门" prop="doDeptName"/>
                <el-table-column align="center" label="提交时间" prop="createTime"/>
                <el-table-column align="center" label="是否发布" prop="isPublish"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeApplyOpenRecordDialog">
                <el-form ref="applyOpenRecordDialogForm" class="deyatech-form" :model="applyOpenRecord" label-position="right"
                         label-width="80px" :rules="applyOpenRecordRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="申请人类型" prop="ysqType">
                                <el-input v-model.trim="applyOpenRecord.ysqType"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model.trim="applyOpenRecord.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="工作单位" prop="company">
                                <el-input v-model.trim="applyOpenRecord.company"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="证件名称" prop="cardName">
                                <el-input v-model.trim="applyOpenRecord.cardName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="证件号码" prop="cardCode">
                                <el-input v-model.trim="applyOpenRecord.cardCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="组织机构代码" prop="orgCode">
                                <el-input v-model.trim="applyOpenRecord.orgCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="营业执照代码" prop="licence">
                                <el-input v-model.trim="applyOpenRecord.licence"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="法人代表" prop="legalperson">
                                <el-input v-model.trim="applyOpenRecord.legalperson"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="联系人" prop="linkman">
                                <el-input v-model.trim="applyOpenRecord.linkman"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系电话" prop="tel">
                                <el-input v-model.trim="applyOpenRecord.tel"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="联系传真" prop="fax">
                                <el-input v-model.trim="applyOpenRecord.fax"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号码" prop="phone">
                                <el-input v-model.trim="applyOpenRecord.phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="电子邮箱" prop="email">
                                <el-input v-model.trim="applyOpenRecord.email"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="通讯地址" prop="address">
                                <el-input v-model.trim="applyOpenRecord.address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="邮政编码" prop="postcode">
                                <el-input v-model.trim="applyOpenRecord.postcode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所需信息内容描述" prop="content">
                                <el-input v-model.trim="applyOpenRecord.content"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="用途描述" prop="description">
                                <el-input v-model.trim="applyOpenRecord.description"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否申请减免费用" prop="isDerate">
                                <el-input v-model.trim="applyOpenRecord.isDerate"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="获取信息方式" prop="getMethod">
                                <el-input v-model.trim="applyOpenRecord.getMethod"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否接受其他方式" prop="isOther">
                                <el-input v-model.trim="applyOpenRecord.isOther"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否发布" prop="isPublish">
                                <el-input v-model.trim="applyOpenRecord.isPublish"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="申请状态" prop="flag">
                                <el-input v-model.trim="applyOpenRecord.flag"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="applyOpenRecord.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeApplyOpenRecordDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getApplyOpenRecordList,
        createOrUpdateApplyOpenRecord,
        delApplyOpenRecords
    } from '@/api/assembly/applyOpenRecord';
    import {getAllApplyOpenModelList} from '@/api/assembly/applyOpenModel';

    export default {
        name: 'applyOpenRecord',
        data() {
            return {
                applyOpenRecordList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    ysqCode: undefined,
                    timeFrame: undefined,
                    modelId: undefined
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
                timeFrame: undefined,
                applyOpenRecord: {
                    id: undefined,
                    modelId: undefined,
                    ysqCode: undefined,
                    queryCode: undefined,
                    ysqType: undefined,
                    name: undefined,
                    company: undefined,
                    cardName: undefined,
                    cardCode: undefined,
                    orgCode: undefined,
                    licence: undefined,
                    legalperson: undefined,
                    linkman: undefined,
                    tel: undefined,
                    fax: undefined,
                    phone: undefined,
                    email: undefined,
                    address: undefined,
                    postcode: undefined,
                    content: undefined,
                    description: undefined,
                    isDerate: undefined,
                    getMethod: undefined,
                    isOther: undefined,
                    isPublish: undefined,
                    flag: undefined
                },
                applyOpenRecordRules: {
                    ysqType: [
                        {required: true, message: this.$t("table.pleaseInput") + '申请人类型；1=公民，2=法人或者其他组织'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '姓名'}
                    ],
                    company: [
                        {required: true, message: this.$t("table.pleaseInput") + '工作单位'}
                    ],
                    cardName: [
                        {required: true, message: this.$t("table.pleaseInput") + '证件名称'}
                    ],
                    cardCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '证件号码'}
                    ],
                    orgCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '组织机构代码'}
                    ],
                    licence: [
                        {required: true, message: this.$t("table.pleaseInput") + '营业执照代码'}
                    ],
                    legalperson: [
                        {required: true, message: this.$t("table.pleaseInput") + '法人代表'}
                    ],
                    linkman: [
                        {required: true, message: this.$t("table.pleaseInput") + '联系人'}
                    ],
                    tel: [
                        {required: true, message: this.$t("table.pleaseInput") + '联系电话'}
                    ],
                    fax: [
                        {required: true, message: this.$t("table.pleaseInput") + '联系传真'}
                    ],
                    phone: [
                        {required: true, message: this.$t("table.pleaseInput") + '手机号码'}
                    ],
                    email: [
                        {required: true, message: this.$t("table.pleaseInput") + '电子邮箱'}
                    ],
                    address: [
                        {required: true, message: this.$t("table.pleaseInput") + '通讯地址'}
                    ],
                    postcode: [
                        {required: true, message: this.$t("table.pleaseInput") + '邮政编码'}
                    ],
                    content: [
                        {required: true, message: this.$t("table.pleaseInput") + '所需信息内容描述'}
                    ],
                    description: [
                        {required: true, message: this.$t("table.pleaseInput") + '用途描述'}
                    ],
                    isDerate: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否申请减免费用；1=是，2=否'}
                    ],
                    getMethod: [
                        {required: true, message: this.$t("table.pleaseInput") + '获取信息方式'}
                    ],
                    isOther: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否接受其他方式；1=是，2=否'}
                    ],
                    isPublish: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否发布；1=是，2=否'}
                    ],
                    flag: [
                        {required: true, message: this.$t("table.pleaseInput") + '申请状态；1=未处理，2=已受理，3=已回复，4=无效'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                modelList: []
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
                    create: this.permission.applyopen_create,
                    update: this.permission.applyopen_update,
                    delete: this.permission.applyopen_delete
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
            this.getModelList();
        },
        methods: {
            getModelList(){
                this.modelList = [];
                getAllApplyOpenModelList().then(response => {
                    this.modelList = response.data;
                })
            },
            resetSearch(){
                this.listQuery.ysqCode = undefined;
                this.listQuery.timeFrame = undefined;
                this.listQuery.modelId = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.applyOpenRecordList = undefined;
                this.total = undefined;
                let times = this.timeFrame;
                if(times != undefined){
                    this.listQuery.timeFrame = times[0]+","+times[1];
                }else{
                    this.listQuery.timeFrame = undefined;
                }
                getApplyOpenRecordList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.applyOpenRecordList = response.data.records;
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
                this.resetApplyOpenRecord();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetApplyOpenRecord();
                if (row.id) {
                    this.applyOpenRecord = deepClone(row);
                } else {
                    this.applyOpenRecord = deepClone(this.selectedRows[0]);
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
                this.$refs['applyOpenRecordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateApplyOpenRecord(this.applyOpenRecord).then(() => {
                            this.resetApplyOpenRecordDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['applyOpenRecordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateApplyOpenRecord(this.applyOpenRecord).then(() => {
                            this.resetApplyOpenRecordDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delApplyOpenRecords(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetApplyOpenRecord(){
                this.applyOpenRecord = {
                    id: undefined,
                    modelId: undefined,
                    ysqCode: undefined,
                    queryCode: undefined,
                    ysqType: undefined,
                    name: undefined,
                    company: undefined,
                    cardName: undefined,
                    cardCode: undefined,
                    orgCode: undefined,
                    licence: undefined,
                    legalperson: undefined,
                    linkman: undefined,
                    tel: undefined,
                    fax: undefined,
                    phone: undefined,
                    email: undefined,
                    address: undefined,
                    postcode: undefined,
                    content: undefined,
                    description: undefined,
                    isDerate: undefined,
                    getMethod: undefined,
                    isOther: undefined,
                    isPublish: undefined,
                    flag: undefined
                }
            },
            resetApplyOpenRecordDialogAndList(){
                this.closeApplyOpenRecordDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeApplyOpenRecordDialog() {
                this.dialogVisible = false;
                this.resetApplyOpenRecord();
                this.$refs['applyOpenRecordDialogForm'].resetFields();
            }
        }
    }
</script>


