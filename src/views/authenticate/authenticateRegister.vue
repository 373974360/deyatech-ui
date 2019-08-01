<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <el-container>
                <el-header>
                    <el-row :gutter="10" justify="center">
                        <el-col :span="12">
                            <span style="font-size: 18px">欢迎进入身份验证页面，请按照如下步骤操作，感谢您的配合！</span>
                        </el-col>
                    </el-row>
                </el-header>
                <el-container>
                    <el-aside width="50%">
                        <el-row>
                            <el-col :span="24" style="font-size: 14px">
                                <p> 1.请填写身份信息，确定正确后 点击请求认证按钮 <span style="color: red">(需要注意每次提交认证，身份信息的有效期为2小时，请在2小时内完成所有验证 ,如果身份信息过期，请重新请求认证）。</span>
                                </p>
                                <p>2.请使用微警APP或微信小程序“网证CTID”扫描页面生成的二维码。若二维码失效，请重新请求认证</p>
                                <p>3.完成所有认证操作后，可点击认证结果来确认认证是否成功</p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5" class="ewm">
                                <p style="text-align: center"><img src="@/assets/ctidxcx.png"/><br/>CTID小程序</p>
                            </el-col>
                            <el-col :span="5" class="ewm">
                                <p style="text-align: center"><img src="@/assets/ctidUserGuid.png"/><br/>网证CTID开通手册</p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="17">
                                <el-form id="checkboxTable" class="small-space" label-position="right"
                                         label-width="100px" ref="zwfwidentificationForm" :model="certTokenParams"
                                         :rules="certTokenRules">
                                    <el-form-item label="姓名" prop="fullName">
                                        <el-input style="width: 310px;" v-model="certTokenParams.fullName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="身份证号" prop="idNum">
                                        <el-input style="width: 310px;" v-model="certTokenParams.idNum"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" style="font-size: medium"
                                                   @click="clear()">清空数据
                                        </el-button>
                                        <el-button type="primary" style="font-size: medium"
                                                   @click="getCertToken()">请求认证
                                        </el-button>
                                        <el-button type="primary" style="font-size: medium"
                                                   @click="getCertResult()">查看结果
                                        </el-button>
                                        <el-button v-if="certResultBase64" type="primary"
                                                   style="font-size: medium;"
                                                   @click="printCertResult()">打印结果
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </el-col>

                        </el-row>
                    </el-aside>
                    <el-container>
                        <el-main>
                            <el-row style="padding-top: 120px">
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                </el-col>
                                <el-col :span="8">
                                    <div v-show="certTokenInfo.qrcode_content != ''" id="qrcode"></div>
                                </el-col>
                            </el-row>

                        </el-main>
                    </el-container>
                </el-container>
            </el-container>
            <iframe id="certResultIframe" src="about:blank" frameborder="0" height="0" width="0"
                    style="width:0;height: 0;"/>
        </div>

    </basic-container>
</template>


<script>
    import {
        getAccessToken,
        getCertToken,
        getCertResult
    } from '@/api/authenticate/authenticateResult';
    import {cardid} from '@/util/validate';
    import QRCode from 'qrcodejs2'

    export default {
        name: 'authenticateRegister',
        data() {
            const validateIdcard = (rule, value, callback) => {
                if (!cardid(value)) {
                    callback(new Error('身份证号格式不正确，请重新输入'));
                } else {
                    callback();
                }
            };
            return {
                dialogVisible: false,
                innerVisible: false,
                getAccessTokenTime: 0,
                accessTokenExpireSecond: 0,
                certTokenParams: {
                    scanAccessToken: '',
                    mode: 66,
                    authType: 2,
                    fullName: '',
                    idNum: '',
                    foreBackUrl: '',
                    certToken: '',
                    authId:'',
                    status: 0,
                    identityStatus:3
                },
                certTokenRules: {
                    fullName: [
                        {required: true, message: '请填写姓名', trigger: 'blur'},
                    ],
                    idNum: [
                        {required: true, message: '请填写身份证号码', trigger: 'blur'},
                        {validator: validateIdcard, trigger: 'blur'},
                    ]
                },
                certTokenInfo: {
                    qrcode_content: ''
                },
                certResultParams: {
                    scanAccessToken: '',
                    certToken: ''
                },
                qrcode: undefined,
                certResultBase64: undefined
            }
        },
        methods: {
            clear(){
                this.certTokenParams = {
                        fullName: '',
                        idNum: '',
                };
                localStorage.setItem('fullName','');
                localStorage.setItem('idNum','');
            },
            S4() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            },
            guid() {
                var _this =this;
                return (_this.S4()+_this.S4()+"-"+_this.S4()+"-"+_this.S4()+"-"+_this.S4()+"-"+_this.S4()+_this.S4()+_this.S4());
            },
            getAccessToken() {
                return new Promise((resolve) => {
                    let authType = 2;
                    getAccessToken(authType).then(response => {
                        if (response.data.retCode === 0) {
                            this.getAccessTokenTime = Number(new Date());
                            this.accessTokenExpireSecond = response.data.expireSeconds;
                            this.certTokenParams.scanAccessToken = response.data.accessToken;
                            this.certResultParams.scanAccessToken = response.data.accessToken;
                            localStorage.setItem('accessToken', response.data.accessToken);
                            localStorage.setItem('accessTokenTime', this.getAccessTokenTime);
                            localStorage.setItem('expireSeconds', response.data.expireSeconds);
                            resolve(0);
                        } else {
                            this.$message.error('初始化微警认证失败(' + response.data.error_msg + ')')
                        }
                    })
                })
            },
            getCertToken() {
                this.certTokenInfo.qrcode_content = '';
                this.certResultParams.certToken = '';
                this.certResultBase64 = undefined;
                this.certTokenParams.scanAccessToken = localStorage.getItem('accessToken');
                this.certTokenParams.authId = this.guid();
                //缓存姓名和身份证号码，防止刷新页面的时候信息清空
                localStorage.setItem('fullName',this.certTokenParams.fullName);
                localStorage.setItem('idNum',this.certTokenParams.idNum);
                this.$refs['zwfwidentificationForm'].validate(valid => {
                    if (valid) {
                        this.certTokenParams.idNum = this.certTokenParams.idNum.toUpperCase();
                        getCertToken(this.certTokenParams).then(response => {
                            if (response.data.retCode == 0) {
                                this.$message.success("请求微警认证成功，请使用微信扫一扫扫描二维码进行认证");
                                this.certTokenInfo.qrcode_content = response.data.tokenInfo.qrcodeContent;
                                this.certTokenParams.certToken = response.data.tokenInfo.certToken;
                                this.qrcode.makeCode(response.data.tokenInfo.qrcodeContent);
                            }else {
                                this.$message.success("accessToken失效，重新点击请求认证");
                                this.getAccessToken();
                            }

                        })
                    }
                });
            },
            getCertResult() {
                if (this.certTokenParams.certToken != '' && this.certTokenParams.scanAccessToken != '') {
                    this.certResultBase64 = undefined;
                    getCertResult(this.certTokenParams).then(response => {
                        if (response.data.retCode == 0) {
                            switch(response.data.authData.resCode) {
                                case 0 :
                                    this.$message.success("用户信息已通过微警认证");
                                    break;
                                case 4009 :
                                    this.$message.error('帐号校验失败')
                                    break;
                                case 4101 :
                                    this.$message.error('身份认证不匹配，请确认信息输入正确')
                                    break;
                                case 4109 :
                                    this.$message.error('非库内人员；该人员身份信息未收录，无法完成身份认证')
                                    break;
                                case 5204 :
                                    this.$message.error('用户取消认证')
                                    break;
                                default :
                                    this.$message.error('未能成功获取认证结果')
                            }
                            if (response.data.certURL) {
                                this.certResultBase64 = 'data:image/png;base64,' + response.data.certURL;
                                var doc = document.getElementById("certResultIframe").contentDocument || document.frames["certResultIframe"].document;
                                doc.body.innerHTML = '<html><body ><div style="text-align:center;margin-top:30%;"><img src="' + this.certResultBase64 + '"/></div></body></html>'; //进入可编辑模式前存好
                            }
                        }else{
                            this.$message.error(response.data.retMessage)
                        }
                    })
                } else {
                    this.$message.warning('请先填写信息并请求认证')
                }
            },
            printCertResult() {
                document.getElementById("certResultIframe").contentWindow.print()
            }
        },
        mounted() {
            let accessTokenTime = localStorage.getItem('accessTokenTime');
            this.certTokenParams.fullName = localStorage.getItem('fullName');
            this.certTokenParams.idNum = localStorage.getItem('idNum');
            let expireSeconds = localStorage.getItem('expireSeconds');
            const now = Number(new Date());
            if (now - accessTokenTime > expireSeconds * 1000) {
                this.getAccessToken();
            }
            this.qrcode = new QRCode('qrcode', {
                width: 300,
                height: 300,
            });
        }
    }
</script>

<style scoped="scoped">
    .el-row {
        margin-bottom: 20px;

    :last-child {
        margin-bottom: 0;
    }

    }
    .el-col {
        border-radius: 4px;
        line-height: 40px;
    }

    .ewm img {
        width: 150px;
    }

</style>

