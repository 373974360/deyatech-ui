<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-row>
                    <el-col :span="2">
                        <div>
                            <el-radio v-model="radio" label="1" border @change="radioChange(1)">扫码认证</el-radio>

                        </div>
                    </el-col>
                    <el-col :span="2">
                        <div>
                            <el-radio v-model="radio" label="2" border @change="radioChange(2)">公众号/APP认证</el-radio>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-if="scanAuth">
                    <el-col :span="4">
                        <el-input :size="searchSize" placeholder="姓名" v-model="certResultParams.fullName"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input :size="searchSize" placeholder="身份证号" v-model="certResultParams.idNum"></el-input>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="getCertResult">
                            {{$t('table.search')}}
                        </el-button>
                    </el-col>
                    <el-col :span="1">
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}
                        </el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-if="!scanAuth">
                    <el-col :span="3">
                        <el-select
                            v-model="certResultParams.companyName"
                            filterable
                            remote
                            placeholder="请输入公司名称"
                            :remote-method="getCompanyList"
                            @change="companyChange">
                            <el-option
                                v-for="item in optionsCompanyName"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-select
                            v-model="certResultParams.authId"
                            filterable
                            remote
                            placeholder="选择流水号"
                        >
                            <el-option
                                v-for="item in optionsAuthIdName"
                                :key="item.authId"
                                :label="item.createTime"
                                :value="item.authId">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="getCertResult">
                            {{$t('table.search')}}
                        </el-button>
                    </el-col>
                    <el-col :span="1">
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}
                        </el-button>
                    </el-col>
                </el-row>


            </div>

            <div class="deyatech-menu">
                <div class="deyatech-menu_right">
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="getCertResult"></el-button>
                </div>
            </div>
            <el-table :data="resultList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="姓名" prop="fullName"/>
                <el-table-column align="center" label="身份证号" prop="idNum"/>
                <el-table-column align="center" label="公司名称" prop="companyName" v-if="!scanAuth"/>
                <el-table-column  align="center" label="身份" prop="status">
                    <template slot-scope="scope">
                        <span v-if="scope.row.identityStatus == 2">股东</span>
                        <span v-if="scope.row.identityStatus == 1">经办人</span>
                        <span v-if="scope.row.identityStatus == 3">未知</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="认证结果" prop="certRes"/>
                <el-table-column align="center" label="认证方式" prop="authType">
                    <template slot-scope="scope">
                        <span v-if="scope.row.authType == 2">扫码</span>
                        <span v-if="scope.row.authType == 1">公众号</span>
                        <span v-if="scope.row.authType == 3">APP</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="认证时间" prop="authTime"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>

        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {validateQueryStr} from '@/util/validate';
    import {
        getAccessToken,
        getCompanyName,
        getAuthIdByCompanyName,
        getAuthenticateResult
    } from '@/api/authenticate/authenticateResult';

    export default {
        name: 'authenticateResult',
        data() {
            return {
                radio: '1',
                scanAuth: true,
                resultList: undefined,
                total: undefined,
                listLoading: false,
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                certResultParams: {
                    appAccessToken: '',
                    authId: '',
                    companyName: '',
                    authType: 3,
                    fullName:'',
                    idNum:''
                },
                optionsCompanyName: [],
                optionsAuthIdName: [],
                getAppAccessTokenTime: 0,
                appAccessTokenExpireSecond: 0
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
            this.getAppAccessToken();
        },
        methods: {
            radioChange(item) {
                if (item == 1) {
                    this.scanAuth = true;
                    this.certResultParams.authId = '';
                    this.certResultParams.companyName = '';
                } else {
                    this.scanAuth = false;
                    this.certResultParams.fullName = '';
                    this.certResultParams.idNum = '';
                }
                this.resultList = undefined;
            },
            companyChange(value) {
                this.certResultParams.authId = '';
                getAuthIdByCompanyName(value).then(response => {
                    if (response.status === 200) {
                        let reverse = response.data.reverse();
                        this.optionsAuthIdName = reverse;
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getCompanyList(query) {
                let companyName;
                this.certResultParams.authId = '';
                if (query !== '') {
                    let valid = validateQueryStr(query);
                    if (valid) {
                        this.$message.error(`输入中包含非法字符 ${valid}`)
                        return
                    }
                    if (/.*[\u4e00-\u9fa5]+.*$/.test(query)) {
                        companyName = query;
                    }
                    getCompanyName(companyName).then(response => {
                        if (response.status === 200) {
                            this.optionsCompanyName = response.data;
                        } else {
                            this.$message.error('数据加载失败')
                        }
                    })
                } else {
                    this.optionsCompanyName = [];
                }
            },

            getAppAccessToken() {
                return new Promise((resolve) => {
                    let authType = 3;
                    getAccessToken(authType).then(response => {
                        if (response.data.retCode === 0) {
                            this.getAppAccessTokenTime = Number(new Date());
                            this.appAccessTokenExpireSecond = response.data.expireSeconds;
                            this.certResultParams.appAccessToken = response.data.accessToken;
                            resolve(0);
                        } else {
                            this.$message.error('初始化微警认证失败(' + response.data.error_msg + ')')
                        }
                    })
                })
            },
            refreshAppAccessToken() {
                return new Promise((resolve) => {
                    const now = Number(new Date());
                    if (this.certResultParams.appAccessToken != '') {
                        if ((now - this.getAppAccessTokenTime) > this.appAccessTokenExpireSecond * 1000) {
                            this.getAppAccessToken().then(result => {
                                resolve(result);
                            });
                        } else {
                            resolve(0);
                        }
                    } else {
                        this.getAppAccessToken().then(result => {
                            resolve(result);
                        });
                    }
                })
            },
            getCertResult() {
                if (this.scanAuth) {
                    this.certResultParams.authType = 2
                    if (this.certResultParams.fullName == '' && this.certResultParams.idNum == '') {
                        this.$message.error('查询条件不能为空')
                    }else{
                        this.refreshAppAccessToken().then(resultApp => {
                            if (resultApp == 0) {
                                this.listLoading = true;
                                getAuthenticateResult(this.certResultParams).then(response => {
                                    if (response.status == 200) {
                                        for (let n in response.data) {
                                            let certRes = response.data[n].certRes;
                                            if (certRes == 0) {
                                                response.data[n].certRes = '认证成功';
                                            } else {
                                                response.data[n].certRes = '认证失败';
                                                response.data[n].authTime = '-';
                                            }
                                        }
                                        this.resultList = response.data;
                                        console.log(this.list);
                                    }
                                    this.listLoading = false;
                                })
                            }
                        });
                    }
                } else {

                    this.certResultParams.authType = 3
                    if (this.certResultParams.companyName == '') {
                        this.$message.error('请填写公司名称')
                    } else if (this.certResultParams.authId == '') {
                        this.$message.error('请填写流水号')
                    }else {
                        this.refreshAppAccessToken().then(resultApp => {
                            if (resultApp == 0) {
                                this.listLoading = true;
                                getAuthenticateResult(this.certResultParams).then(response => {
                                    if (response.status == 200) {
                                        for (let n in response.data) {
                                            let certRes = response.data[n].certRes;
                                            if (certRes == 0) {
                                                response.data[n].certRes = '认证成功';
                                            } else {
                                                response.data[n].certRes = '认证失败';
                                                response.data[n].authTime = '-';
                                            }
                                        }
                                        this.resultList = response.data;
                                        console.log(this.list);
                                    }
                                    this.listLoading = false;
                                })
                            }
                        });
                    }
                }

            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            resetSearch(){
                this.certResultParams = {
                    appAccessToken: '',
                    authId: '',
                    companyName: '',
                    authType: 3,
                    fullName:'',
                    idNum:''
                };
            }

        }
    }
</script>


