<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="请输入事项名称" v-model.trim="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="btnSearch">
                            {{$t('table.search')}}
                        </el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">
                        {{$t('table.create')}}
                    </el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate"
                               :disabled="selectedRows.length != 1">{{$t('table.update')}}
                    </el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete"
                               :disabled="selectedRows.length < 1">{{$t('table.delete')}}
                    </el-button>
                    <el-button v-if="btnEnable.preorderConfig" type="primary" :size="btnSize" icon="el-icon-time"
                               @click="btnPreorderConfigBatch" :disabled="selectedRows.length < 1">{{'预约配置'}}
                    </el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="itemList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="事项名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="事项简称" prop="shortName"/>
                <el-table-column align="center" label="事项编码" prop="code"/>
                <el-table-column align="center" label="限号量" prop="limitNumber"/>
                <el-table-column align="center" label="是否第三方事项" prop="remoteEnable">
                    <template slot-scope="scope">
                        {{Number(scope.row.remoteEnable) | enums('YesNoEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="第三方事项" prop="remoteId"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center"
                                 width="200">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary"
                                   icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.preorderConfig" title="预约配置" type="primary" icon="el-icon-time"
                                   :size="btnSize" circle @click.stop.safe="btnPreorderConfig(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger"
                                   icon="el-icon-delete" :size="btnSize" circle
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
                       :close-on-click-modal="closeOnClickModal" @close="closeItemDialog">
                <el-form ref="itemDialogForm" class="deyatech-form" :model="item" label-position="right"
                         label-width="100px" :rules="itemRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="事项名称" prop="name">
                                <el-input v-model="item.name" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="事项简称" prop="shortName" label-width="130px">
                                <el-input v-model="item.shortName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="事项编码" prop="code">
                                <el-input v-model="item.code"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="限量号" prop="limitNumber">
                                <el-input v-model="item.limitNumber"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="是否第三方事项" prop="remoteEnable" label-width="130px">
                                <el-switch v-model="item.remoteEnable"
                                           :active-value="this.yesEnum.code"
                                           :inactive-value="this.noEnum.code"
                                           @change="changeDisplayOfRemoteId"
                                ></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="item.remoteEnable === this.yesEnum.code">
                        <el-col :span="24">
                            <el-form-item label="第三方事项" prop="remoteId">
                                <el-input v-model="item.remoteId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model="item.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeItemDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
            <!-- 预约配置 -->
            <el-dialog :title="'预约配置'" :visible.sync="dialogPreorderConfigVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closePreorderConfigDialog" class="el-dialog-table">
                <el-form ref="preorderConfigDialogForm" class="deyatech-form" :model="preorder"
                         :rules="preorderConfigRules" v-loading="dialogFormLoading">

                    <el-form-item label="可预约天数" :rules="preorderConfigRules.count" prop="days">
                        <el-input-number v-model="days" @change="handleChange" :min="0" :max="100"></el-input-number>
                    </el-form-item>
                    <el-table :data="preorder.preorderConfigList" v-loading.body="listLoading" stripe border :row-style="{height:'40'}" :cell-style="{padding:'0'}"  class="el-form-item-row-style">
                        <el-table-column align="center" label="时间段" prop="timeSlot"/>
                        <el-table-column align="center" label="可预约最大人数" prop="count">
                            <template slot-scope="scope">
                                <el-form-item :prop="'preorderConfigList.' + scope.$index + '.count'"
                                              :rules="preorderConfigRules.count">
                                    <el-input-number v-model="scope.row.count" :min="0" :max="100"></el-input-number>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSavePreorderConfig"
                               :loading="submitLoading">{{$t('table.confirm')}}
                    </el-button>
                    <el-button :size="btnSize" @click="closePreorderConfigDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {getStore} from '@/util/store';
    import {
        listByPreorderConfig,
        getByPreorderConfig,
        saveOrUpdate
    } from '../../api/number/preorderConfig';
    import {
        getListByPreorderTime
    } from '../../api/number/preorderTime';
    import {isStartOrEndWithWhiteSpace} from '@/util/validate';
    import {
        getItemList,
        createOrUpdateItem,
        delItems,
        countItem
    } from '@/api/item/item';

    export default {
        name: 'item',
        data() {
            const validateWhiteSpace = (rule, value, callback) => {
                let oldValue = '';
                let msg = '';
                if (rule.field === 'name') {
                    oldValue = this.itemTmp.name;
                    msg = '事项名称';
                } else if (rule.field === 'shortName') {
                    oldValue = this.itemTmp.shortName;
                    msg = '事项简称';
                } else if (rule.field === 'code') {
                    oldValue = this.itemTmp.code;
                    msg = '事项编码';
                }
                if (isStartOrEndWithWhiteSpace(value)) {
                    callback(new Error(msg + this.$t("errorMsg.blankSpace")));
                    return;
                }
                // 值被修改的情况
                if (oldValue && oldValue.trim() != value.trim()) {
                    let query = {field: rule.field, value: value};
                    countItem(query).then(res => {
                        if (res.data > 0) {
                            callback(new Error(msg + '已存在'));
                        } else {
                            callback();
                        }

                    }).catch(() => {
                        callback(new Error(msg + '检查请求出错'))
                    });
                } else {
                    callback();
                }
                callback();
            };
            const isInteger = (rule, value, callback) => {
                if (rule.field == "days") {
                    value = this.days;
                }
                if (!value && value != 0) {
                    return callback(new Error('输入不可以为空'));
                }
                setTimeout(() => {
                    if (!Number(value)) {
                        callback(new Error('请输入正整数'));
                    } else {
                        const re = /^[0-9]*[1-9][0-9]*$/;
                        const rsCheck = re.test(value);
                        if (!rsCheck) {
                            callback(new Error('请输入正整数'));
                        } else if (value > 10000) {
                            callback(new Error('超出范围(0-10000)，请重新输入'));
                        } else {
                            callback();
                        }
                    }
                }, 0);
            };
            return {
                heightSet: "0",
                padding: 0,
                itemList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                days: 0,
                item: {
                    id: undefined,
                    name: undefined,
                    shortName: undefined,
                    code: undefined,
                    remoteEnable: undefined,
                    remoteId: undefined
                },
                itemTmp: undefined,
                itemRules: {
                    name: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '事项名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateWhiteSpace, trigger: 'blur'}
                    ],
                    shortName: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '事项简称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateWhiteSpace, trigger: 'blur'}
                    ],
                    code: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '事项编码'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateWhiteSpace, trigger: 'blur'}
                    ],
                    limitNumber: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '事项编码'},
                        {min: 4, max: 4, message: '', trigger: 'blur'}
                    ],
                    remoteEnable: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否第三方'}
                    ],
                    remoteId: [
                        {required: false, whiteSpace: true, message: this.$t("table.pleaseInput") + '第三方事项'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    remark: [
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                yesEnum: undefined,
                noEnum: undefined,
                dialogPreorderConfigVisible: undefined,
                preorderConfig: {
                    id: undefined,
                    itemId: undefined,
                    timeId: undefined,
                    count: undefined,
                    days: undefined
                },
                preorderConfigRules: {
                    count: [
                        {validator: isInteger, trigger: 'blur'}
                    ],
                    days: [
                        {validator: isInteger, trigger: 'blur'}
                    ]
                },
                preorder: {
                    preorderConfigList: undefined
                },
                preorderConfigVo: {
                    count: undefined,
                    days: undefined,
                    timeId: undefined,
                    timeSlot:undefined,
                    id: undefined
                },
                dialogFormLoading: undefined,
                itemIds: [],
                timeSlot: undefined,
                counts: undefined,
                preorderConfigId: undefined,
                preorder1: undefined
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
                    create: this.permission.item_create,
                    update: this.permission.item_update,
                    delete: this.permission.item_delete,
                    preorderConfig: this.permission.item_preorderConfig
                };
            }
        },
        created() {
            this.reloadList();
            this.loadYesNoEnum();
            this.getPreorderTime();
        },
        methods: {
            getPreorderTime(){
                getListByPreorderTime().then(response => {
                    this.preorder.preorderConfigList = response.data.reverse();
                    this.preorder1 = response.data;
                })
            },
            handleChange(value) {
                this.days = value
            },
            btnSearch() {
                this.listQuery.page = 1;
                this.reloadList();
            },
            changeDisplayOfRemoteId() {
                this.itemRules.remoteId[0].required = this.item.remoteEnable == this.yesEnum.code ? true : false;
                this.item.remoteId = '';
            },
            loadYesNoEnum() {
                const array = getStore({name: 'enums'})['YesNoEnum'];
                if (array[0].var === 'YES') {
                    this.yesEnum = array[0];
                    this.noEnum = array[1];
                } else {
                    this.yesEnum = array[1];
                    this.noEnum = array[0];
                }
                this.yesEnum.code = this.yesEnum.code.toString();
                this.noEnum.code = this.noEnum.code.toString();
            },
            resetSearch() {
                this.listQuery.name = undefined;
            },
            reloadList() {
                this.listLoading = true;
                this.itemList = undefined;
                this.total = undefined;
                getItemList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.itemList = response.data.records;
                    this.total = response.data.total;
                })
            },
            handleSizeChange(val) {
                this.listQuery.size = val;
                this.reloadList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.reloadList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            btnCreate() {
                this.itemTmp = {
                    name: '',
                    shortName: '',
                    code: ''
                };
                this.resetItem();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row) {
                this.resetItem();
                if (row.id) {
                    this.item = deepClone(row);
                } else {
                    this.item = deepClone(this.selectedRows[0]);
                }
                this.itemTmp = {
                    name: this.item.name,
                    shortName: this.item.shortName,
                    code: this.item.code
                };
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row) {
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate() {
                this.$refs['itemDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateItem(this.item).then(() => {
                            this.resetItemDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate() {
                this.$refs['itemDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateItem(this.item).then(() => {
                            this.resetItemDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids) {
                this.listLoading = true;
                delItems(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetItem() {
                this.item = {
                    id: undefined,
                    name: undefined,
                    shortName: undefined,
                    code: undefined,
                    remoteEnable: '0',
                    remoteId: ''
                }
            },
            resetItemDialogAndList() {
                this.closeItemDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeItemDialog() {
                this.dialogVisible = false;
                this.resetItem();
                this.$refs['itemDialogForm'].resetFields();
            },
            btnPreorderConfig(row) {
                this.dialogPreorderConfigVisible = true;
                this.dialogFormLoading = true;
                this.preorderConfig.itemId = row.id;
                this.itemIds = [];
                this.itemIds.push(row.id);
                getByPreorderConfig(this.preorderConfig).then(response => {
                    this.dialogFormLoading = false;
                    this.listLoading = false;
                    if (response.data.days != 0) {
                        this.preorderConfigId = response.data.id;
                    }else{
                        this.preorderConfigId = undefined;
                    }
                    this.days = response.data.days;
                    let arr = response.data.timeId.split(",");
                    let arr2 = response.data.count.split(",");
                    let timeSlot = this.preorder1;
                    let timeSlotNew = [];
                    let timeIdNew = [];
                    let countNew=new Array(timeSlot.length);
                    for (let selectedRow of timeSlot) {
                        timeSlotNew.push(selectedRow.id);
                        timeIdNew.push(selectedRow.timeSlot);
                    }
                    let timeSlotArr = timeSlotNew;
                    let timeIdArr = arr;
                    for (let i = 0; i < timeIdArr.length; i++) {
                        for (let j = 0; j < timeSlotArr.length; j++) {
                            if(timeSlotArr[j] === timeIdArr[i]){
                                console.log(i);
                                countNew[j]=arr2[i]
                            }
                        }
                    }
                    let key = ['timeId', 'count','timeSlot','days'];
                    this.preorder.preorderConfigList = timeSlotNew.map(function (item, index) {
                        let obj = {};
                        obj[key[0]] = timeSlotNew[index];
                        obj[key[1]] = countNew[index];
                        obj[key[2]] = timeIdNew[index];
                        obj[key[3]] = 0;
                        return obj;
                    });
                })
            },
            btnPreorderConfigBatch() {
                this.dialogPreorderConfigVisible = true;
                this.dialogFormLoading = true;
                this.itemIds = [];
                for (let selectedRow of this.selectedRows) {
                    this.itemIds.push(selectedRow.id);
                }
                // 只选择一个
                if (this.itemIds.length == 1) {
                    this.preorderConfig.itemId = this.itemIds[0];
                }
                listByPreorderConfig(this.preorderConfig).then(response => {
                    this.dialogFormLoading = false;
                    this.listLoading = false;
                    this.preorder.preorderConfigList = response.data;
                })
            },
            closePreorderConfigDialog() {
                this.dialogPreorderConfigVisible = false;
                this.resetPreorderConfig();
                this.$refs['preorderConfigDialogForm'].resetFields();
            },
            resetPreorderConfig() {
                this.preorderConfig = {
                    id: undefined,
                    itemId: undefined,
                    timeId: undefined,
                    count: undefined,
                    days: undefined
                }

            },
            doSavePreorderConfig() {
                let list = this.preorder.preorderConfigList;
                let arr = [];
                let arr1 = [];
                let arr2 = [];
                for (let i in list) {
                    arr.push(list[i].timeId);
                    arr1.push(list[i].count);
                    arr2.push(list[i].timeSlot);
                }
                this.preorderConfigVo.timeId = arr.join(',');
                this.preorderConfigVo.timeSlot = arr2.join(',');
                this.preorderConfigVo.count = arr1.join(',');
                this.preorderConfigVo.days = this.days;
                this.preorderConfigVo.id = this.preorderConfigId;
                this.preorderConfigVo.itemIds = this.itemIds.join(',');
                this.$refs['preorderConfigDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        saveOrUpdate(this.preorderConfigVo).then(() => {
                            this.closePreorderConfigDialog();
                            this.$message.success(this.$t("table.updateSuccess"));
                            this.submitLoading = false;
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                });


            }
        }
    }
</script>
