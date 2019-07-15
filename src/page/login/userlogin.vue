<template>
    <el-form class="login-form"
             status-icon
             :rules="loginRules"
             ref="loginForm"
             :model="loginForm"
             label-width="0">
        <el-form-item prop="account">
            <el-input size="small"
                      @keyup.enter.native="handleLogin"
                      v-model="loginForm.account"
                      auto-complete="off"
                      :placeholder="$t('login.account')">
                <i slot="prefix"
                   class="iconaccount"></i>
            </el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input size="small"
                      @keyup.enter.native="handleLogin"
                      :type="passwordType"
                      v-model="loginForm.password"
                      auto-complete="off"
                      :placeholder="$t('login.password')">
                <i class="el-icon-view el-input__icon"
                   slot="suffix"
                   @click="showPassword"></i>
                <i slot="prefix"
                   class="iconpassword"></i>
            </el-input>
        </el-form-item>
        <el-form-item prop="verifyCode">
            <el-row :span="24">
                <el-col :span="14">
                    <el-input size="small" @keyup.enter.native="handleLogin" :maxlength="imgCode.len"
                              v-model="loginForm.verifyCode"
                              auto-complete="off" :placeholder="$t('login.verifyCode')">
                        <i slot="prefix" class="iconsecurity"></i>
                    </el-input>
                </el-col>
                <el-col :span="10">
                    <div class="login-code">
                        <el-tooltip class="item" effect="dark" :content="$t('login.verifyCodeAlt')" placement="right">
                            <img :src="imgCode.src" class="login-code-img" @click="refreshCode"/>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item>
            <el-button type="primary"
                       size="small"
                       @click.native.prevent="handleLogin"
                       :loading="loginLoading"
                       class="login-submit">{{$t('login.submit')}}
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "userlogin",
        data() {
            return {
                loginForm: {
                    account: "",
                    password: "",
                    verifyCode: "",
                    random: ""
                },
                imgCode: {
                    src: "",
                    value: "",
                    len: 4
                },
                loginLoading: false,
                loginRules: {
                    account: [
                        {required: true, message: this.$t("login.account"), trigger: "blur"}
                    ],
                    password: [
                        {required: true, message: this.$t("login.password"), trigger: "blur"},
                        {min: 5, message: this.$t("login.passwordValidate"), trigger: "blur"}
                    ],
                    verifyCode: [
                        {required: true, message: this.$t("login.verifyCode"), trigger: "blur"},
                        {min: 4, max: 4, message: this.$t("login.verifyCodeValidate"), trigger: "blur"}
                    ]
                },
                passwordType: "password"
            };
        },
        created() {
            this.refreshCode();
        },
        mounted() {
        },
        computed: {
            ...mapGetters(["tagWel"])
        },
        props: [],
        methods: {
            refreshCode() {
                this.loginLoading = false;
                this.loginForm.verifyCode = "";
                this.loginForm.random = Math.random();
                this.imgCode.src = '/manage/common/getVerifyCode?random=' + this.loginForm.random;
            },
            showPassword() {
                this.passwordType == ""
                    ? (this.passwordType = "password")
                    : (this.passwordType = "");
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loginLoading = true;
                        this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
                            this.$message.success(this.$t("login.loginSuccess"));
                            this.$router.push({path: this.tagWel.value});
                            this.loginLoading = false;
                        }).catch(() => {
                            this.refreshCode();
                        });
                    }
                });
            }
        }
    };
</script>

<style>
</style>
