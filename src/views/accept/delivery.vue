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
                        <el-select :size="searchSize" placeholder="按事项名称搜索" v-model="listQuery.itemId" clearable
                                   filterable remote value-key="id" :remote-method="searchItem" style="width: 320px;">
                            <el-option v-for="item in itemList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" placeholder="请选择取件方式" v-model="listQuery.takeType" clearable>
                            <el-option v-for="item in enums['TakeTypeEnum']" :key="item.code" :value="item.code" :label="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" placeholder="请选择取件状态" v-model="listQuery.takeStatus" clearable>
                            <el-option v-for="item in enums['TakeStatusEnum']" :key="item.code" :value="item.code" :label="item.value"
                                       v-if="listQuery.takeType && String(item.code).indexOf(String(listQuery.takeType)) === 0">
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
                <el-table-column align="center" label="办件号">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" placement="right" content="点击查看">
                            <div style="cursor:pointer;" @click="showProcessTakeInfo(scope.row)">
                                <div>{{scope.row.recordWorkNo}}</div>
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="事项名称">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" placement="right" content="点击查看">
                            <div style="cursor:pointer;" @click="showProcessTakeInfo(scope.row)">
                                <div>{{scope.row.itemName}}</div>
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <!--<el-table-column align="center" label="申请企业（个人）" min-width="260">
                    <template slot-scope="scope">
                    </template>
                </el-table-column>-->
                <!--<el-table-column align="center" label="办结时间" width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.finishTime | date('YYYY-MM-DD HH:mm:ss')}}</span>
                    </template>
                </el-table-column>-->
                <el-table-column align="center" label="取件方式">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" placement="right" content="点击修改">
                            <el-button type="text" @click="changeTakeType(scope.row)">
                                <span v-if="scope.row.takeType">{{scope.row.takeType | enums('TakeTypeEnum')}}</span>
                                <span v-else>未设置</span>
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="取件状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.takeStatus">{{scope.row.takeStatus | enums('TakeStatusEnum')}}</span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="240">
                    <template slot-scope="scope">
                        <template v-if="scope.row.id">
                            <el-button v-if="[11,32].includes(scope.row.takeStatus)"
                                       type="primary" :size="btnSize" @click="completeTake(scope.row)">确认取件</el-button>
                            <el-button v-else-if="scope.row.takeStatus === 21 && (!scope.row.mailboxOrderId || [1,6,7,8].includes(scope.row.mailboxOrder.status))"
                                       type="primary" :size="btnSize" @click="mailboxReserve(scope.row)">预约投递</el-button>
                            <el-tooltip v-else-if="scope.row.takeStatus === 21 && scope.row.mailboxOrder.status === 2"
                                        class="item" effect="dark" placement="right" content="点击更新状态">
                                <el-button type="text" :size="btnSize" @click="mailboxInfoUpdate(scope.row)">预约中...</el-button>
                            </el-tooltip>
                            <el-button-group v-else-if="scope.row.takeStatus === 21 && scope.row.mailboxOrder.status === 3">
                                <el-button type="primary" :size="btnSize" @click="showReserveCode(scope.row)">获取<br>开箱码</el-button>
                                <el-button type="primary" :size="btnSize" @click="mailboxCancelReserve(scope.row)">取消<br>预约</el-button>
                                <el-button type="primary" :size="btnSize" @click="mailboxInfoUpdate(scope.row)">更新<br>状态</el-button>
                            </el-button-group>
                            <el-button v-else-if="scope.row.takeStatus === 22" type="primary" :size="btnSize" @click="mailboxStatusUpdate(scope.row)">
                                更新状态
                            </el-button>
                            <el-button v-else-if="scope.row.takeStatus === 31" type="primary" :size="btnSize"
                                       @click="enterExpressInfo(scope.row)">录入邮寄信息</el-button>
                            <el-button v-else type="primary" :size="btnSize" @click="showProcessTakeInfo(scope.row)">查看</el-button>
                        </template>
                        <span v-else>请设置取件方式</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>

            <el-dialog title="修改取件信息" :visible.sync="takeTypeVisible" :close-on-click-modal="closeOnClickModal"
                       :before-close="resetTakeTypeForm">
                <el-form ref="takeTypeForm" :model="takeTypeInfo" :rules="takeTypeInfoRules"
                         label-width="120px" class="small-space" label-position="right"
                         style="width: 80%; margin-left:10%;" v-loading="dialogLoading">
                    <el-form-item label="取件方式" prop="takeType">
                        <el-select v-model="takeTypeInfo.takeType" @change="changeTakeTypeInfo">
                            <el-option v-for="item in takeTypeList" :key="item"
                                       :value="item" :label="item | enums('TakeTypeEnum')">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="信包箱" prop="mailboxInfo.mailboxId" v-show="takeTypeInfo.takeType === 2"
                                  :rules="takeTypeInfo.takeType === 2 ? takeTypeInfoRules.mailboxId : []">
                        <el-select v-model="takeTypeInfo.mailboxInfo.mailboxId" style="width:100%"
                                   @change="validateField('takeTypeForm', 'mailboxInfo.mailboxId')">
                            <el-option v-for="item in mailboxList" :key="item.id"
                                       :value="item.id" :label="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="收件人姓名" prop="mailboxInfo.consigneeName" v-show="takeTypeInfo.takeType == 2"
                                  :rules="takeTypeInfo.takeType == 2 ? takeTypeInfoRules.mailboxConsigneeName : []">
                        <el-input v-model="takeTypeInfo.mailboxInfo.consigneeName"
                                  @blur="validateField('takeTypeForm', 'mailboxInfo.consigneeName')">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="收件人手机号" prop="mailboxInfo.consigneeMobile" v-show="takeTypeInfo.takeType == 2"
                                  :rules="takeTypeInfo.takeType == 2 ? takeTypeInfoRules.mailboxConsigneeMobile : []">
                        <el-input v-model="takeTypeInfo.mailboxInfo.consigneeMobile"
                                  @blur="validateField('takeTypeForm', 'mailboxInfo.consigneeMobile')">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="收件人姓名" prop="postInfo.name" v-if="takeTypeInfo.takeType == 3 && !cardVisible"
                                  :rules="takeTypeInfo.takeType == 3 ? takeTypeInfoRules.postName : []">
                        <el-input v-model="takeTypeInfo.postInfo.name"
                                  @blur="validateField('takeTypeForm', 'postInfo.name')">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="postInfo.phone" v-if="takeTypeInfo.takeType == 3 && !cardVisible"
                                  :rules="takeTypeInfo.takeType == 3 ? takeTypeInfoRules.postPhone : []">
                        <el-input v-model="takeTypeInfo.postInfo.phone"
                                  @blur="validateField('takeTypeForm', 'postInfo.phone')">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="收件地址" prop="postInfo.address" v-if="takeTypeInfo.takeType == 3 && !cardVisible"
                                  :rules="takeTypeInfo.takeType == 3 ? takeTypeInfoRules.postAddress : []">
                        <el-input v-model="takeTypeInfo.postInfo.address"
                                  @blur="validateField('takeTypeForm', 'postInfo.address')">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="收件地址" prop="postInfo.addresseeId" v-if="takeTypeInfo.takeType == 3 && cardVisible">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix card-header">
                                <div class="card-item">
                                    <p class="p1">
                                        {{cardHeader.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{cardHeader.phone}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <span v-if="cardHeader.defaultFlag">默认</span>
                                    </p>
                                    <p>{{cardHeader.address}}</p>
                                </div>
                                <el-button type="primary" @click="showCardItems">选择地址</el-button>
                                <el-button type="text" @click="showTakeTypeAddresseeForm">添加地址</el-button>
                            </div>
                            <div class="card-body" v-show="cardItemVisible">
                                <div v-for="item in memberAddressList" :key="item.id" class="card-item">
                                    <el-radio v-model="takeTypeInfo.postInfo.addresseeId" :label="item.id">{{item.remark}}
                                    </el-radio>
                                    <p class="p1">
                                        {{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.phone}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <span v-if="item.defaultFlag">默认</span>
                                    </p>
                                    <p>{{item.address}}</p>
                                </div>
                                <div v-if="!memberAddressList || memberAddressList.length <= 0">没有任何收件地址信息</div>
                            </div>
                        </el-card>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button icon="circle-cross" type="danger" @click="resetTakeTypeForm">取 消</el-button>
                    <el-button type="primary" icon="circle-check" @click="submitTakeTypeInfo" :loading="btnLoading">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="邮寄信息" :visible.sync="expressInfoVisible" :close-on-click-modal="closeOnClickModal"
                       :before-close="resetExpressInfoForm">
                <el-form ref="expressInfoForm" :model="expressInfo" :rules="expressFormRules"
                         label-width="80px" class="small-space" label-position="left"
                         style="width: 80%; margin-left:10%;" v-loading="dialogLoading">
                    <el-form-item label="快递公司" prop="expressCompany">
                        <el-select v-model="expressInfo.expressCompany" placeholder="请选择快递公司" style="width:100%">
                            <el-option
                                v-for="item in enums['ExpressCompanyEnum']"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                        <!--<el-input v-model="expressInfo.expressCompany"></el-input>-->
                    </el-form-item>
                    <el-form-item label="快递单号" prop="expressNumber">
                        <el-input v-model="expressInfo.expressNumber">
                        </el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="submitTakeTypeExpress" type="primary" icon="circle-check" :loading="btnLoading">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="取件信息" :visible.sync="processOfflineVisible" :close-on-click-modal="closeOnClickModal">
                <el-form ref="processOfflineForm" :model="currentRow"
                         label-width="100px" class="small-space" label-position="right"
                         style="width: 80%; margin-left:10%;" v-loading="dialogLoading">
                    <el-form-item label="办件号">
                        <el-input v-model="currentRow.recordWorkNo" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="事项名称">
                        <span><b>{{currentRow.itemName}}</b></span>
                    </el-form-item>
                    <el-form-item label="办结时间">
                        <el-date-picker v-model="currentRow.finishTime" type="datetime" disabled>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="取件方式">
                        <span>&nbsp;&nbsp;<b>{{currentRow.takeType | enums('TakeTypeEnum')}}</b></span>
                    </el-form-item>
                    <el-form-item label="取件状态">
                        <span>&nbsp;&nbsp;<b>{{currentRow.takeStatus | enums('TakeStatusEnum')}}</b></span>
                        &nbsp;&nbsp;
                        <el-button v-if="[32,33].includes(currentRow.takeStatus)" type="text"
                                   @click="showLogistics(currentRow)">查看物流</el-button>
                    </el-form-item>
                    <el-form-item label="取件时间" v-if="[12,23,33].includes(currentRow.takeStatus)">
                        <el-date-picker v-model="currentRow.takeTime" type="datetime" disabled>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="信包箱" v-if="currentRow.takeType === 2">
                        <el-select v-model="currentRow.mailboxInfo.mailboxId" disabled style="width:100%">
                            <el-option v-for="item in mailboxList" :key="item.id"
                                       :value="item.id" :label="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="箱格序号" v-if="[22,23].includes(currentRow.takeStatus) && currentRow.mailboxOrder.boxNo">
                        <span>&nbsp;&nbsp;<b>{{currentRow.mailboxOrder.boxNo}}</b></span>
                    </el-form-item>
                    <el-form-item label="取件人手机号" v-if="currentRow.takeType === 2">
                        <el-input v-model="currentRow.mailboxOrder.consigneeMobile" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="开箱码" v-if="currentRow.takeType === 2 && currentRow.mailboxOrder && currentRow.mailboxOrder.resvCode">
                        <el-input v-model="currentRow.mailboxOrder.resvCode" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="取件码" v-if="[22,23].includes(currentRow.takeStatus)">
                        <el-input v-model="currentRow.mailboxOrder.openCode" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="快递公司" v-if="[32,33].includes(currentRow.takeStatus)">
                        <el-select v-model="currentRow.postInfo.expressCompany" disabled>
                            <el-option v-for="item in enums['ExpressCompanyEnum']" :key="item.code" :label="item.value" :value="item.code">{{item.value}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="快递单号" v-if="[32,33].includes(currentRow.takeStatus)">
                        <el-input v-model="currentRow.postInfo.expressNumber" disabled>
                        </el-input>
                    </el-form-item>
                    <!--<el-form-item label="收件人姓名" v-if="currentRow.takeType == 3">
                        <el-input v-model="currentRow.postInfo.name" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="收件人手机号" v-if="currentRow.takeType == 3">
                        <el-input v-model="currentRow.postInfo.mobilephone" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="收件地址" v-if="currentRow.takeType == 3">
                        <el-input v-model="currentRow.postInfo.address" disabled>
                        </el-input>
                    </el-form-item>-->
                    <el-form-item label="收件地址" v-if="currentRow.takeType === 3">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix card-header">
                                <div class="card-item">
                                    <p class="p1">
                                        {{cardHeader.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{cardHeader.phone}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <!--<span v-if="cardHeader.defaultFlag">默认</span>-->
                                    </p>
                                    <p>{{cardHeader.address}}</p>
                                </div>
                            </div>
                            <div class="card-body" v-show="false"></div>
                        </el-card>
                    </el-form-item>
                    <el-form-item label="出件窗口" v-if="window && window.name">
                        <span>&nbsp;&nbsp;<b>{{window.name}}</b></span>
                    </el-form-item>
                    <el-form-item label="出件人员" v-if="user && user.name">
                        <span>&nbsp;&nbsp;<b>{{user.name}} {{user.empNo}}</b></span>
                    </el-form-item>
                </el-form>
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
        </div>
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {isvalidatemobile, validateQueryStr} from "../../util/validate";
    import {
        findDeliveryList,
        saveTakeType,
        saveExpressInfo,
        complete,
        mailboxReserve,
        mailboxReserveCancel
    } from "../../api/accept/takeType";
    import {
        queryLogistics
    } from "../../api/accept/handType";
    import {
        getItemDelivery
    } from "../../api/item/itemDelivery";
    import {
        getAllMailbox
    } from "../../api/accept/mailbox";
    import {
        getMemberAddress,
        getAllMemberAddress
    } from "../../api/accept/memberAddress";
    import {
        getMailboxOrderDetail,
        getMailboxOrderStatus
    } from "../../api/mailbox";
    import {
        queryLogisticsRemote
    } from "../../api/express/logistics";
    import {
        getItemList
    } from "../../api/item/item";
    import {
        getUser
    } from "../../api/admin/user";
    import {
        getWindow
    } from "../../api/number/window";
    import {
        getHandlingRecord,
        getTakeUserInfo
    } from "../../api/handling/handlingRecord";

    export default {
        name: 'delivery',
        data() {
            const validateMobile = (rule, value, callback) => {
                const result = isvalidatemobile(value);
                if (result[0]) {
                    callback(new Error(result[1]))
                } else {
                    callback()
                }
            };
            return {
                list: null,
                itemList: [],
                mailboxList: [],
                takeTypeList: [],
                total: null,
                listLoading: true,
                dialogLoading: false,
                btnLoading: false,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    itemId: undefined,
                    workNo: undefined,
                    takeType: undefined,
                    takeStatus: undefined
                },
                takeTypeVisible: false,
                expressInfoVisible: false,
                processOfflineVisible: false,
                logisticsVisible: false,
                currentRow: {},
                user: {},
                window: {},
                takeTypeInfo: {
                    id: '',
                    workNo: '',
                    memberId: '',
                    takeType: '',
                    mailboxInfo: {
                        id: '',
                        mailboxId: '',
                        consigneeName: '',
                        consigneeMobile: ''
                    },
                    postInfo: {
                        id: '',
                        name: '',
                        phone: '',
                        address: '',
                        addresseeId: ''
                    }
                },
                takeTypeInfoRules: {
                    mailboxId: [
                        {required: true, message: '请选择信包箱', trigger: 'change'}
                    ],
                    mailboxConsigneeName: [
                        {required: true, message: '收件人姓名不能为空', trigger: 'blur'}
                    ],
                    mailboxConsigneeMobile: [
                        {required: true, message: '收件人手机号不能为空', trigger: 'blur'},
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    postName: [
                        {required: true, message: '收件人姓名不能为空', trigger: 'blur'}
                    ],
                    postPhone: [
                        {required: true, message: '收件人手机号不能为空', trigger: 'blur'},
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    postAddress: [
                        {required: true, message: '收件地址不能为空', trigger: 'blur'}
                    ]
                },
                expressInfo: {
                    id: '',
                    workNo: '',
                    expressCompany: '',
                    expressNumber: ''
                },
                expressFormRules: {
                    expressCompany: [
                        {required: true, message: '请输入快递公司', trigger: 'blur'}
                    ],
                    expressNumber: [
                        {required: true, message: '请输入快递单号', trigger: 'blur'}
                    ]
                },
                cardHeader: {
                    name: '',
                    phone: '',
                    address: '',
                    defaultFlag: false
                },
                memberAddressList: [],
                cardItemVisible: false,
                cardVisible: false,
                logistics: {},
                takeUserInfo: {
                    name: '',
                    phone: '',
                    address: ''
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
        watch: {
            'takeTypeInfo.postInfo.addresseeId'() {
                if (this.cardVisible) {
                    this.initCardHeader();
                    this.cardItemVisible = false;
                }
            }
        },
        created() {
            this.reloadList();
            this.getMailboxList();
        },
        methods: {
            resetSearch() {
                this.listQuery.itemId = undefined;
                this.listQuery.workNo = undefined;
                this.listQuery.takeType = undefined;
                this.listQuery.takeStatus = undefined;
            },
            reloadList() {
                this.listLoading = true;
                this.list = [];
                this.total = undefined;
                findDeliveryList(this.listQuery).then(response => {
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
            searchItem(query) {
                return new Promise((resolve, reject) => {
                    const listQueryName = {
                        page: this.$store.state.common.page,
                        size: this.$store.state.common.size,
                        name: undefined
                    };
                    if (query !== '') {
                        let valid = validateQueryStr(query);
                        if (valid) {
                            this.$message.error(`输入中包含非法字符 ${valid}`);
                            return reject();
                        }
                        if (/.*[\u4e00-\u9fa5]+.*$/.test(query)) {
                            listQueryName.name = query;
                        }
                        if (listQueryName.name) {
                            getItemList(listQueryName).then(response => {
                                this.itemList = response.data.records;
                                resolve();
                            }).catch(err => {
                                reject(err)
                            })
                        }
                    } else {
                        this.itemList = [];
                        resolve();
                    }
                });
            },
            completeTake(row) {
                this.$confirm('确定标记为客户已取件吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    complete(row.workNo).then(() => {
                        this.reloadList();
                        this.listLoading = false;
                    })
                }).catch(() => {
                    console.dir('取消');
                });
            },
            mailboxReserve(row) {
                this.listLoading = true;
                mailboxReserve(row.workNo).then(() => {
                    this.$message.success('预约已提交，请耐心等待');
                    this.reloadList();
                    this.listLoading = false;
                });
            },
            mailboxCancelReserve(row) {
                this.listLoading = true;
                mailboxReserveCancel(row.workNo).then(() => {
                    this.$message.success('取消成功');
                    this.reloadList();
                    this.listLoading = false;
                })
            },
            mailboxInfoUpdate(row) {
                this.listLoading = true;
                getMailboxOrderDetail(row.mailboxOrderId).then(() => {
                    this.$message.success('快件信息已更新');
                    this.reloadList();
                    this.listLoading = false;
                }).catch(err => {
                    this.$message.error(err || '获取快件信息失败');
                });
            },
            mailboxStatusUpdate(row) {
                this.listLoading = true;
                getMailboxOrderStatus(row.mailboxOrderId).then(() => {
                    this.$message.success('快件状态已更新');
                    this.reloadList();
                    this.listLoading = false;
                })
            },
            showReserveCode(row) {
                const h = this.$createElement;
                this.$msgbox({
                    title: '开箱码',
                    message: h('p', { style: 'text-align: center' }, [
                        h('b', { style: 'font-size: 24px' }, row.mailboxOrder.resvCode)
                    ]),
                    confirmButtonText: '关闭'
                })
            },
            changeTakeType(row) {
                if (row.takeStatus && row.takeStatus !== 11 && row.takeStatus !== 21 && row.takeStatus !== 31) {
                    this.$message.warning('当前状态不可修改取件方式');
                    return;
                }
                this.takeTypeInfo.workNo = row.recordWorkNo;
                if (row.id) {
                    this.takeTypeInfo.id = row.id;
                    this.takeTypeInfo.takeType = row.takeType;
                    if (row.mailboxInfo) {
                        this.takeTypeInfo.mailboxInfo = deepClone(row.mailboxInfo);
                    }
                    if (row.postInfo) {
                        this.takeTypeInfo.postInfo = deepClone(row.postInfo);
                    }
                    if (this.takeTypeInfo.takeType === 3 && this.takeTypeInfo.postInfo
                        && this.takeTypeInfo.postInfo.addresseeId) {
                        this.getMemberAddressee(this.takeTypeInfo.postInfo.addresseeId)
                    }
                }
                this.getItemTakeTypes(row.itemId);
                let idcardNo = '';
                this.getHandlingRecordInfo(row.recordWorkNo).then(record => {
                    const member = eval('(' + record.detail + ')');
                    this.takeTypeInfo.memberId = member.idcardNo;
                    idcardNo = member.idcardNo;
                    this.getMemberAddressees(member.idcardNo);
                    this.loadTakeUserInfo(member.idcardNo, row.recordWorkNo).then(res => {
                        this.takeUserInfo.name = res.name;
                        this.takeUserInfo.phone = res.phone;
                        this.takeUserInfo.address = res.address;
                        console.dir(this.takeUserInfo);
                    });
                });
                this.takeTypeVisible = true;
            },
            loadTakeUserInfo(idcardNo, workNo) {
                return new Promise((resolve, reject) => {
                    getTakeUserInfo({idcardNo: idcardNo, workNo: workNo}).then(response => {
                        resolve(response.data)
                    }).catch(err => {
                        reject(err)
                    });
                });
            },
            resetTakeTypeForm() {
                this.takeTypeVisible = false;
                this.resetTakeTypeTemp();
                this.$refs['takeTypeForm'].resetFields();
            },
            resetTakeTypeTemp() {
                this.takeTypeInfo = {
                    id: '',
                    workNo: '',
                    memberId: '',
                    takeType: '',
                    mailboxInfo: {
                        id: '',
                        mailboxId: '',
                        consigneeName: '',
                        consigneeMobile: ''
                    },
                    postInfo: {
                        id: '',
                        name: '',
                        phone: '',
                        address: '',
                        addresseeId: ''
                    }
                }
            },
            submitTakeTypeInfo() {
                this.$refs['takeTypeForm'].validate(valid => {
                    if (valid) {
                        this.btnLoading = true;
                        this.dialogLoading = true;
                        saveTakeType(this.takeTypeInfo).then(() => {
                            this.dialogLoading = false;
                            this.btnLoading = false;
                            this.resetTakeTypeForm();
                            this.$message.success('修改成功');
                            this.reloadList();
                        })
                    } else {
                        return false;
                    }
                })
            },
            getMemberAddressee(addresseeId) {
                getMemberAddress(addresseeId).then(response => {
                    this.cardHeader = deepClone(response.data);
                    this.cardVisible = true;
                })
            },
            getItemTakeTypes(itemId) {
                return new Promise((resolve, reject) => {
                    this.takeTypeList = [];
                    if (!itemId) {
                        return reject();
                    }
                    getItemDelivery({itemId}).then(response => {
                        const takeTypeList = response.data.takeType.split(',');
                        for (const takeType of takeTypeList) {
                            this.takeTypeList.push(parseInt(takeType))
                        }
                        resolve();
                    }).catch(err => {
                        reject(err)
                    })
                })
            },
            getHandlingRecordInfo(workNo) {
                return new Promise((resolve, reject) => {
                    getHandlingRecord({workNo}).then(response => {
                        resolve(response.data)
                    }).catch(err => {
                        reject(err)
                    })
                })
            },
            getMemberAddressees(memberId) {
                return new Promise((resolve, reject) => {
                    getAllMemberAddress({memberId}).then(response => {
                        this.memberAddressList = response.data;
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })
            },
            changeTakeTypeInfo() {
                this.initCardHeader();
                if (this.takeTypeInfo.takeType == 2) {
                    if (!this.takeTypeInfo.mailboxInfo.consigneeName) this.takeTypeInfo.mailboxInfo.consigneeName = this.takeUserInfo.name;
                    if (!this.takeTypeInfo.mailboxInfo.consigneeMobile) this.takeTypeInfo.mailboxInfo.consigneeMobile = this.takeUserInfo.phone;
                } else if (this.takeTypeInfo.takeType == 3) {
                    if (!this.takeTypeInfo.postInfo.name) this.takeTypeInfo.postInfo.name = this.takeUserInfo.name;
                    if (!this.takeTypeInfo.postInfo.phone) this.takeTypeInfo.postInfo.phone = this.takeUserInfo.phone;
                    if (!this.takeTypeInfo.postInfo.address) this.takeTypeInfo.postInfo.address = this.takeUserInfo.address;
                }
            },
            initCardHeader() {
                if (!this.memberAddressList || this.memberAddressList.length <= 0 || this.takeTypeInfo.takeType != 3) {
                    this.cardVisible = false;
                    this.takeTypeInfo.postInfo.addresseeId = undefined;
                    this.resetCardHeader();
                    this.cardItemVisible = false;
                    return;
                }
                let addressee;
                if (this.takeTypeInfo.postInfo.addresseeId) {
                    for (let item of this.memberAddressList) {
                        if (item.id === this.takeTypeInfo.postInfo.addresseeId) {
                            addressee = item;
                            break;
                        }
                    }
                } else {
                    for (let item of this.memberAddressList) {
                        if (item.defaultFlag) {
                            addressee = item;
                            break;
                        }
                    }
                    if (!addressee) {
                        addressee = this.memberAddressList[0];
                    }
                }
                this.takeTypeInfo.postInfo.addresseeId = addressee.id;
                this.cardHeader = deepClone(addressee);
                this.cardVisible = true;
            },
            resetCardHeader() {
                this.cardHeader = {
                    name: '',
                    phone: '',
                    address: '',
                    defaultFlag: false
                }
            },
            showCardItems() {
                this.cardItemVisible = !this.cardItemVisible;
            },
            showTakeTypeAddresseeForm() {
                this.cardVisible = false;
                this.takeTypeInfo.postInfo.addresseeId = undefined;
                this.resetCardHeader();
                this.cardItemVisible = false;
            },
            enterExpressInfo(row) {
                this.expressInfo.id = row.postInfo.id;
                this.expressInfo.workNo = row.workNo;
                this.expressInfoVisible = true;
            },
            submitTakeTypeExpress() {
                this.$refs['expressInfoForm'].validate(valid => {
                    if (valid) {
                        this.$confirm('邮寄信息保存后将不可修改，请确认信息是否填写正确', '提示', {
                            confirmButtonText: '填写正确',
                            cancelButtonText: '返回确认',
                            type: 'warning'
                        }).then(() => {
                            this.btnLoading = true;
                            this.dialogLoading = true;
                            saveExpressInfo(this.expressInfo).then(() => {
                                this.dialogLoading = false;
                                this.btnLoading = false;
                                this.resetExpressInfoForm();
                                this.$message.success('信息保存成功');
                                this.reloadList();
                            });
                        }).catch(() => {
                            console.dir('取消');
                        });
                    } else {
                        return false;
                    }
                });
            },
            resetExpressInfoForm() {
                this.expressInfoVisible = false;
                this.resetExpressInfoTemp();
                this.$refs['expressInfoForm'].resetFields();
            },
            resetExpressInfoTemp() {
                this.expressInfo = {
                    id: '',
                    workNo: '',
                    expressCompany: '',
                    expressNumber: ''
                }
            },
            showProcessTakeInfo(row) {
                this.currentRow = row;
                this.processOfflineVisible = true;
                if (row.takeType === 3 && row.postInfo && row.postInfo.addresseeId) {
                    this.getMemberAddressee(row.postInfo.addresseeId)
                }
                this.getUser(row.userId);
                this.getWindow(row.windowId);
            },
            showLogistics(takeTypeInfo) {
                const company = takeTypeInfo.postInfo.expressCompany;
                const number = takeTypeInfo.postInfo.expressNumber;
                queryLogistics(company, number).then(response => {
                    this.logistics = response.data;
                    this.logisticsVisible = true;
                    if (this.logistics && this.logistics.deliverystatus === 3 && takeTypeInfo.takeStatus !== 33) {
                        this.reloadList();
                        this.listLoading = false;
                    }
                })
            },
            refreshLogistics(logistics) {
                queryLogisticsRemote(logistics.type, logistics.number, true).then(response => {
                    this.logistics = response.data;
                    if (this.logistics && this.logistics.deliverystatus === 3) {
                        this.reloadList();
                        this.listLoading = false;
                    }
                })
            },
            getUser(userId) {
                if (userId) {
                    getUser(userId).then(response => {
                        this.user = response.data;
                    })
                }
            },
            getWindow(windowId) {
                if (windowId) {
                    getWindow(windowId).then(response => {
                        this.window = response.data;
                    })
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
