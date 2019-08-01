<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="按办件号搜索" v-model="listQuery.workNo">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" placeholder="请输入事项名称" v-model="listQuery.itemId" clearable
                                   filterable remote value-key="id" :remote-method="searchItem" style="width: 320px;">
                            <el-option v-for="item in optionsNames" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" placeholder="请选择交件方式" v-model="listQuery.handType" clearable>
                            <el-option v-for="item in enums['HandTypeEnum']" :key="item.code" :value="item.code" :label="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" placeholder="请选择交件状态" v-model="listQuery.handStatus" clearable>
                            <el-option v-for="item in enums['HandStatusEnum']" :key="item.code" :value="item.code" :label="item.value"
                                       v-if="listQuery.handType && String(item.code).indexOf(String(listQuery.handType)) === 0">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="list" v-loading.body="listLoading" stripe border highlight-current-row>
                <el-table-column align="center" label="办件号" prop="recordWorkNo">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" placement="right" content="点击查看">
                            <div style="cursor:pointer;" @click="showHandInfo(scope.row)">
                                <div>{{scope.row.recordWorkNo}}</div>
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="事项名称" prop="itemName">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" placement="right" content="点击查看">
                            <div style="cursor:pointer;" @click="showHandInfo(scope.row)">
                                <div>{{scope.row.itemName}}</div>
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交件方式" prop="handType">
                    <template slot-scope="scope">
                        <span v-if="scope.row.id">{{scope.row.handType | enums('HandTypeEnum')}}</span>
                        <span v-else>未设置</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交件状态" prop="handStatus">
                    <template slot-scope="scope">
                        <span v-if="scope.row.id">{{scope.row.handStatus | enums('HandStatusEnum')}}</span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="240">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.id && [21,22].includes(scope.row.handStatus)
                        && scope.row.mailboxOrder && [3,4].includes(scope.row.mailboxOrder.status)" type="primary" :size="btnSize"
                                   @click="showOpenCode(scope.row)">查看取件码</el-button>
                        <el-button-group v-else-if="scope.row.id && scope.row.handStatus===32">
                            <el-button type="primary" :size="btnSize" @click="showExpressInfo(scope.row.postInfo)">查看快递单号</el-button>
                            <el-button type="primary" :size="btnSize" @click="showLogistics(scope.row.postInfo)">查看物流</el-button>
                        </el-button-group>
                        <el-button-group v-else-if="scope.row.id && scope.row.handStatus===53">
                            <el-button type="primary" :size="btnSize" @click="showExpressInfo(scope.row.mailboxPost)">查看快递单号</el-button>
                            <el-button type="primary" :size="btnSize" @click="showLogistics(scope.row.mailboxPost)">查看物流</el-button>
                        </el-button-group>
                        <el-button-group v-else-if="scope.row.id && scope.row.handStatus===52
                        && (!scope.row.mailboxPost.expressOrder
                        || (scope.row.mailboxPost.expressOrder.status
                        && (scope.row.mailboxPost.expressOrder.status.indexOf('AF') === 0
                        || scope.row.mailboxPost.expressOrder.status.indexOf('F') === 0)))">
                            <el-button type="primary" :size="btnSize" v-if="scope.row.mailboxPost.expressOrder"
                                       @click="showEmsDesc(scope.row.mailboxPost.expressOrder)">失败原因</el-button>
                            <el-button type="primary" :size="btnSize" @click="mailboxPostMailRequest(scope.row)">重新揽件</el-button>
                        </el-button-group>
                        <el-button v-else type="primary" :size="btnSize" @click="showHandInfo(scope.row)">查看</el-button>
                        <el-button v-if="scope.row.handleFlag && scope.row.acceptStatus === 10" type="primary" :size="btnSize" @click="showMarkFinish(scope.row)">标记办结</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>

            <el-dialog title="交件信息" :visible.sync="handTypeVisible" :close-on-click-modal="closeOnClickModal">
                <el-form ref="handTypeInfoForm" :model="currentRow"
                         label-width="100px" class="small-space" label-position="right"
                         style="width: 80%; margin-left:10%;">
                    <el-form-item label="预审号">
                        <el-input v-model="currentRow.recordWorkNo" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="事项名称">
                        <el-input v-model="currentRow.itemName" disabled>
                        </el-input>
                    </el-form-item>
                    <!--<el-form-item label="申请时间">
                        <el-date-picker v-model="currentRow.applyTime" type="datetime" disabled>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="审批时间">
                        <el-date-picker v-model="currentRow.auditTime" type="datetime" disabled>
                        </el-date-picker>
                    </el-form-item>-->
                    <!--<el-form-item label="公司名称" v-if="currentRow.companyName">
                        <el-input v-model="currentRow.companyName" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="法人名称" v-if="currentRow.memberType === 3 && currentRow.memberName">
                        <el-input v-model="currentRow.memberName" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="法人联系电话" v-if="currentRow.memberType === 3 && currentRow.memberPhone">
                        <el-input v-model="currentRow.memberPhone" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="申请人姓名" v-if="currentRow.memberType !== 3">
                        <el-input v-model="currentRow.memberName" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" v-if="currentRow.memberType !== 3">
                        <el-input v-model="currentRow.memberPhone" disabled>
                        </el-input>
                    </el-form-item>-->
                    <template v-if="currentRow.id">
                        <el-form-item label="交件方式">
                            <span>&nbsp;&nbsp;<b>{{currentRow.handType | enums('HandTypeEnum')}}</b></span>
                        </el-form-item>
                        <el-form-item label="交件状态">
                            <span>&nbsp;&nbsp;<b>{{currentRow.handStatus | enums('HandStatusEnum')}}</b></span>
                            &nbsp;&nbsp;
                            <el-button v-if="[32,33].includes(currentRow.handStatus)" type="text"
                                       @click="showLogistics(currentRow.postInfo)">查看物流</el-button>
                            <el-button v-if="[53,54].includes(currentRow.handStatus)" type="text"
                                       @click="showLogistics(currentRow.mailboxPost)">查看物流</el-button>
                        </el-form-item>
                        <el-form-item label="交件时间" v-if="currentRow.handTime">
                            <el-date-picker v-model="currentRow.handTime" type="datetime" disabled>
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="快件箱" v-if="currentRow.handType===2">
                            <el-select v-model="currentRow.mailboxInfo.mailboxId" style="width: 100%" disabled>
                                <el-option v-for="item in mailboxList" :key="item.id"
                                           :value="item.id" :label="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="箱格序号" v-if="[22,23].includes(currentRow.handStatus) && currentRow.mailboxOrder.boxNo">
                            <el-input v-model="currentRow.mailboxOrder.boxNo" disabled>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="取件码" v-if="[22,23].includes(currentRow.handStatus)">
                            <el-input v-model="currentRow.mailboxOrder.openCode" disabled>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="收件手机号" v-if="currentRow.handType===2">
                            <el-input v-model="currentRow.mailboxInfo.consigneeMobile" disabled>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="快递公司" v-if="[32,33].includes(currentRow.handStatus)">
                            <span>&nbsp;&nbsp;<b>{{currentRow.postInfo.expressCompany | enums('ExpressCompanyEnum')}}</b></span>
                        </el-form-item>
                        <el-form-item label="快递单号" v-if="[32,33].includes(currentRow.handStatus)">
                            <el-input v-model="currentRow.postInfo.expressNumber" disabled>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="快递公司" v-if="[53,54].includes(currentRow.handStatus)">
                            <span>&nbsp;&nbsp;<b>{{currentRow.mailboxPost.expressCompany | enums('ExpressCompanyEnum')}}</b></span>
                        </el-form-item>
                        <el-form-item label="快递单号" v-if="[53,54].includes(currentRow.handStatus)">
                            <el-input v-model="currentRow.mailboxPost.expressNumber" disabled>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="收件地址" v-if="[3,5].includes(currentRow.handType)">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix card-header">
                                    <div class="card-item">
                                        <p class="p1">
                                            {{addresseeCard.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{addresseeCard.phone}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <!--<span v-if="addresseeCard.defaultFlag">默认</span>-->
                                        </p>
                                        <p>{{addresseeCard.address}}</p>
                                    </div>
                                </div>
                                <div class="card-body" v-show="false"></div>
                            </el-card>
                        </el-form-item>
                    </template>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button icon="circle-cross" type="danger" @click="handTypeVisible = false">关 闭</el-button>
                </div>
            </el-dialog>

            <el-dialog title="物流信息" :visible.sync="logisticsVisible" :close-on-click-modal="closeOnClickModal">
                <el-card class="box-card">
                    <div slot="header" class="clearfix card-header">
                        <p><b>物流状态&nbsp;&nbsp;&nbsp;&nbsp;{{logistics.deliverystatus | deliveryStatusFilter}}</b></p>
                        <p>承运来源：{{logistics.type | expressTypeFilter}}</p>
                        <p>运单编号：{{logistics.number}}
                            <el-button type="text" @click="refreshLogistics(logistics)">物流信息不对</el-button>
                        </p>
                    </div>
                </el-card>
                <div class="track-list">
                    <ul>
                        <li v-for="(item, index) in logistics.list"
                            :class="(index === 0 ? 'first' : '') + ' ' + (index === logistics.list.length - 1 ? 'last' : '')">
                            <div class="node-container">
                                <div class="node"></div>
                            </div>
                            <div class="content">
                                <p class="txt">{{item.status | removeNote(' ')}}</p>
                                <p class="time">{{item.time | date('YYYY-MM-DD HH:mm:ss')}}</p>
                            </div>
                        </li>
                        <div style="clear: both"></div>
                    </ul>
                </div>
            </el-dialog>

            <el-dialog title="标记办结" :visible.sync="markFinishVisible" :close-on-click-modal="closeOnClickModal"
                       :before-close="resetHandlingRecordForm">
                <el-form ref="handlingRecordForm" :model="handlingRecord" :rules="handlingRecordRules"
                         label-width="100px" class="small-space" label-position="right" v-loading="dialogLoading">
                    <el-form-item label="办结时间" prop="finishTime">
                        <el-date-picker v-model="handlingRecord.finishTime" type="datetime" :editable="false"
                                        value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="办结说明" prop="remark">
                        <el-input type="textarea" :rows="3" maxlength="500" v-model="handlingRecord.remark">
                        </el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize"
                               :loading="btnLoading" @click="submitMarkFinish">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="resetHandlingRecordForm">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {validateQueryStr} from "../../util/validate";
    import {
        findToReceiveList,
        queryLogistics,
        getHandMailboxOpenCode,
        mailboxPostMailRequest
    } from "../../api/accept/handType";
    import {
        getAllMailbox
    } from "../../api/accept/mailbox";
    import {
        getAllReceiveAdress
    } from "../../api/accept/receiveAdress";
    import {
        queryLogisticsRemote
    } from "../../api/express/logistics";
    import {
        getItemList
    } from "../../api/item/item";
    import {
        markFinish
    } from "../../api/handling/handlingRecord";

    export default {
        name: 'toReceive',
        data() {
            return {
                list: [],
                optionsName: [],
                optionsNames: [],
                mailboxList: [],
                addresseeList: [],
                total: null,
                listLoading: true,
                dialogLoading: false,
                btnLoading: false,
                currentRow: {},
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    itemId: undefined,
                    workNo: undefined,
                    handType: undefined,
                    handStatus: undefined
                },
                handTypeVisible: false,
                logisticsVisible: false,
                addresseeCard: {
                    name: '',
                    phone: '',
                    address: ''
                },
                logistics: {},
                markFinishVisible: false,
                handlingRecord: {
                    workNo: undefined,
                    finishTime: undefined,
                    remark: undefined
                },
                handlingRecordRules: {
                    finishTime: [
                        {required: true, message: '', trigger: 'change'}
                    ]
                }
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
            ])
        },
        created() {
            this.reloadList();
            this.getMailboxList();
            this.getAddresseeList();
        },
        methods: {
            resetSearch() {
                this.listQuery.itemId = undefined;
                this.listQuery.workNo = undefined;
                this.listQuery.handType = undefined;
                this.listQuery.handStatus = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.list = [];
                this.total = undefined;
                findToReceiveList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.list = response.data.records;
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
            getMailboxList() {
                const query = {};
                getAllMailbox(query).then(response => {
                    this.mailboxList = response.data
                });
            },
            getAddresseeList() {
                getAllReceiveAdress({}).then(response => {
                    this.addresseeList = response.data;
                })
            },
            searchItem(query) {
                const listQueryName = {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                };
                if (query !== '') {
                    let valid = validateQueryStr(query);
                    if (valid) {
                        this.$message.error(`输入中包含非法字符 ${valid}`)
                        return
                    }
                    if (/.*[\u4e00-\u9fa5]+.*$/.test(query)) {
                        listQueryName.name = query;
                    }
                    getItemList(listQueryName).then(response => {
                        this.optionsNames = response.data.records;
                    })
                } else {
                    this.optionsNames = [];
                }
            },
            showHandInfo(row) {
                this.currentRow = row;
                if (row.id) {
                    let addresseeId;
                    if (3 === row.handType) {
                        addresseeId = row.postInfo.addresseeId;
                    } else if (5 === row.handType) {
                        addresseeId = row.mailboxPost.receiverAddresseeId;
                    }
                    if (addresseeId) {
                        for (let item of this.addresseeList) {
                            if (item.id === addresseeId) {
                                this.addresseeCard = deepClone(item);
                                break;
                            }
                        }
                    }
                }
                this.handTypeVisible = true;
            },
            showOpenCode(handTypeInfo) {
                getHandMailboxOpenCode(handTypeInfo.workNo).then(response => {
                    if (response.data) {
                        const h = this.$createElement;
                        this.$msgbox({
                            title: '取件码',
                            message: h('p', { style: 'text-align: center' }, [
                                h('b', { style: 'font-size: 24px' }, response.data)
                            ]),
                            confirmButtonText: '关闭'
                        })
                    } else {
                        this.$message.error('未查询到取件码信息，也许用户还未投件');
                    }
                });
            },
            showExpressInfo(postInfo) {
                let company;
                for (const item of this.enums['ExpressCompanyEnum']) {
                    if (item.code === postInfo.expressCompany) {
                        company = item.value
                    }
                }
                const h = this.$createElement;
                this.$msgbox({
                    title: '快递信息',
                    message: h('p', { style: 'text-align: center' }, [
                        h('b', { style: 'font-size: 24px' }, company + ' : ' + postInfo.expressNumber)
                    ]),
                    confirmButtonText: '关闭'
                })
            },
            showLogistics(postInfo) {
                queryLogistics(postInfo.expressCompany, postInfo.expressNumber).then(response => {
                    this.logistics = response.data;
                    this.logisticsVisible = true;
                })
            },
            refreshLogistics(logistics) {
                queryLogisticsRemote(logistics.type, logistics.number, true).then(response => {
                    this.logistics = response.data;
                })
            },
            showEmsDesc(expressOrder) {
                const h = this.$createElement;
                this.$msgbox({
                    title: '上门取件状态描述',
                    message: h('p', { style: 'text-align: center' }, [
                        h('b', { style: 'font-size: 16px' }, expressOrder.desc)
                    ]),
                    confirmButtonText: '关闭'
                })
            },
            mailboxPostMailRequest(handTypeInfo) {
                mailboxPostMailRequest(handTypeInfo.workNo).then(() => {
                    this.$message.success('预约已提交');
                    this.reloadList();
                })
            },
            showMarkFinish(row) {
                console.log(row)
                this.markFinishVisible = true;
                this.handlingRecord.workNo = row.recordWorkNo;
            },
            submitMarkFinish() {
                this.$refs['handlingRecordForm'].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        this.btnLoading = true;
                        markFinish(this.handlingRecord).then(() => {
                            this.$message.success('操作成功');
                            this.resetHandlingRecordForm();
                        })
                    } else {
                        return false;
                    }
                })
            },
            resetHandlingRecordForm() {
                this.markFinishVisible = false;
                this.dialogLoading = false;
                this.btnLoading = false;
                this.resetHandlingRecordTemp();
                this.$refs['handlingRecordForm'].resetFields();
            },
            resetHandlingRecordTemp() {
                this.handlingRecord = {
                    workNo: undefined,
                    finishTime: undefined,
                    remark: undefined
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .item {
        margin-top: 10px;
        text-align: center;
    }

    .track-list{
        padding: 20px;
        position: relative;
        ul {
            list-style: none;
            overflow: visible;
            margin-top: 12px;
            li{
                position: relative;
                width: 100%;
                float: left;
                padding: 0px 25px;
                line-height: 18px;
                border-left: 1px solid #d0d0d0;
                color: #666;
                .node {
                    position: absolute;
                    left: -5px;
                    top: 0;
                    width: 10px;
                    height: 10px;
                    background-color: #d0d0d0;
                    border-radius: 10px;
                }
                .content {
                    width: 100%;
                    border-bottom: 1px solid #d0d0d0;
                    top: -18px;
                    position: relative;
                }
            }
            li.first {
                color: #dd1100;
                .node-container {
                    position: absolute;
                    top: -5px;
                    left: -10px;
                    width: 20px;
                    height: 20px;
                    background-color: #fbc0c2;
                    border-radius: 20px;
                    .node {
                        top: 4px;
                        left: 4px;
                        width: 12px;
                        height: 12px;
                        background-color: #dd1100;
                        border-radius: 12px;
                    }
                }
            }
            li.last {
                border: none;
                .content {
                    border: none;
                }
            }
        }
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    .card-header {
        .card-item {
            border: none;
            margin: 0;
            width: 80%;
            float: left;
        }
        .el-button {
            float: right;
        }
    }

    .card-item {
        padding: 8px;
        margin: 8px 0;
        font-size: 14px;
        border: 1px solid #d0d0d0;
        height: 80px;
        .el-radio {
            height: 64px;
            line-height: 64px;
            text-align: center;
            width: 10%;
            float: left;
        }
        p {
            margin: 0;
            height: 32px;
            line-height: 32px;
            width: 88%;
            float: left;
        }
        .p1 {
            font-size: 16px;
            font-weight: bold;
            span {
                padding: 3px 6px;
                color: #dd1100;
                font-size: 14px;
                font-weight: normal;
                border: 1px solid #dd1100;
                border-radius: 3px;
            }
        }
    }

    .clearfix:before, .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 100%;
        .el-card__body {
            padding: 0;
        }
        .card-body {
            padding: 12px;
        }
    }
</style>
<style>
    .el-input.is-disabled .el-input__inner {
        color: #1f2d3d;
    }

    .el-textarea.is-disabled .el-textarea__inner {
        color: #1f2d3d;
    }

    .el-select > .el-input {
        margin-bottom: -7px;
    }
</style>
