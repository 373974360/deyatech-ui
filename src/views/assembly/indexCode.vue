<template>
    <basic-container>
        <div class="deyatech-container pull-auto" v-if="this.$store.state.common.siteId">
            <el-form ref="indexCodeDialogForm" :inline="true" class="deyatech-form" :model="indexCode" label-position="left" label-width="0" :rules="indexCodeRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item>
                            <el-checkbox v-model="indexCode.codeChecked" :true-label="1" :false-label="0" class="infoCheckbox">前段码</el-checkbox>
                        </el-form-item>
                        <el-form-item>
                            <el-input value="各部门社会信用码" readonly style="border: none;" class="infoContent infoReadonly"></el-input>
                        </el-form-item>
                        <el-form-item prop="codeDelimiter">
                            <el-select v-model="indexCode.codeDelimiter" placeholder="请选择分隔符" class="delimiter">
                                <el-option v-for="item in delimiters" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item>
                            <el-checkbox v-model="indexCode.valueChecked" :true-label="1" :false-label="0" class="infoCheckbox">前段码-固定值</el-checkbox>
                        </el-form-item>
                        <el-form-item prop="value">
                            <el-input v-model.trim="indexCode.value" class="infoContent" maxlength="20" placeholder="请输入固定值"></el-input>
                        </el-form-item>
                        <el-form-item prop="valueDelimiter">
                            <el-select v-model="indexCode.valueDelimiter" placeholder="请选择分隔符" class="delimiter">
                                <el-option v-for="item in delimiters" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item>
                            <el-checkbox v-model="indexCode.formatChecked" :true-label="1" :false-label="0" class="infoCheckbox">信息编制日期</el-checkbox>
                        </el-form-item>
                        <el-form-item prop="format">
                            <el-select v-model="indexCode.format" placeholder="请选择格式" class="infoContent">
                                <el-option v-for="item in formats" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="formatDelimiter">
                            <el-select v-model="indexCode.formatDelimiter" placeholder="请选择分隔符" class="delimiter">
                                <el-option v-for="item in delimiters" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item>
                            <el-checkbox checked disabled class="infoCheckbox">信息流水号</el-checkbox>
                        </el-form-item>
                        <el-form-item prop="number">
                            <el-select v-model.trim="indexCode.number" placeholder="请选择位数" class="infoContent">
                                <el-option v-for="item in numbers" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <div>
                            <el-form-item><el-checkbox style="visibility: hidden" class="infoCheckbox"/></el-form-item>
                            <el-form-item>
                                <div class="infoContent" style="text-align: center;">
                                    <el-button v-if="btnEnable.save" type="primary" @click="doSave" :loading="submitLoading">保存</el-button>
                                    <el-button v-if="btnEnable.save" @click="doReset">重置</el-button>
                                </div>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
            </el-form>

        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getIndexCodeBySiteId,
        createOrUpdateIndexCode
    } from '@/api/assembly/indexCode';

    export default {
        name: 'indexCode',
        data() {
            const validateCodeDelimiter = (rule, value, callback) => {
                if (this.indexCode.codeChecked && value == undefined) {
                    callback(new Error("请选择分隔符"));
                }
                callback();
            };
            const validateValue = (rule, value, callback) => {
                if (this.indexCode.valueChecked && !value) {
                    callback(new Error("请输入固定值"));
                }
                callback();
            };
            const validateValueDelimiter = (rule, value, callback) => {
                if (this.indexCode.valueChecked && value == undefined) {
                    callback(new Error("请选择分隔符"));
                }
                callback();
            };
            const validateFormat = (rule, value, callback) => {
                if (this.indexCode.formatChecked && !value) {
                    callback(new Error("请选择格式"));
                }
                callback();
            };
            const validateFormatDelimiter = (rule, value, callback) => {
                if (this.indexCode.formatChecked && value == undefined) {
                    callback(new Error("请选择分隔符"));
                }
                callback();
            };
            const validateNumber = (rule, value, callback) => {
                if (!value) {
                    callback(new Error("请选择位数"));
                }
                callback();
            };
            return {
                formats: [
                    {value: 'yyyy', label: 'YYYY'},
                    {value: 'yyyyMM', label: 'YYYYMM'},
                    {value: 'yyyyMMdd', label: 'YYYYMMDD'}
                ],
                delimiters: [
                    {value: '', label: '无分隔'},
                    {value: '/', label: '反斜杠(/)'},
                    {value: '_', label: '下划线(_)'},
                    {value: '-', label: '横杠(-)'}
                ],
                numbers: [
                    {value: '4', label: '四位'},
                    {value: '5', label: '五位'},
                    {value: '6', label: '六位'},
                    {value: '7', label: '七位'},
                    {value: '8', label: '八位'},
                    {value: '9', label: '九位'},
                    {value: '10', label: '十位'},
                ],
                indexCode: {
                    id: undefined,
                    siteId: this.$store.state.common.siteId,
                    codeChecked: 0,
                    codeDelimiter: undefined,
                    valueChecked: 0,
                    value: undefined,
                    valueDelimiter: undefined,
                    formatChecked: 0,
                    format: undefined,
                    formatDelimiter: undefined,
                    number: undefined,
                    nextSerial: undefined
                },
                indexCodeRules: {
                    codeDelimiter: [
                        {validator: validateCodeDelimiter, trigger: 'change'}
                    ],
                    value: [
                        {validator: validateValue, trigger: 'change'}
                    ],
                    valueDelimiter: [
                        {validator: validateValueDelimiter, trigger: 'change'}
                    ],
                    format: [
                        {validator: validateFormat, trigger: 'change'}
                    ],
                    formatDelimiter: [
                        {validator: validateFormatDelimiter, trigger: 'change'}
                    ],
                    number: [
                        {validator: validateNumber, trigger: 'change'}
                    ]
                },
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
                    save: this.permission.indexCode_save
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                this.reload();
            }
        },
        methods: {
            reload() {
                getIndexCodeBySiteId(this.$store.state.common.siteId).then(response => {
                    if (response.data.id) {
                        this.indexCode = response.data;
                    } else {
                        this.resetIndexCode();
                    }
                });
            },
            resetIndexCode() {
                this.indexCode = {
                    id: undefined,
                    siteId: this.$store.state.common.siteId,
                    codeChecked: 0,
                    codeDelimiter: undefined,
                    valueChecked: 0,
                    value: undefined,
                    valueDelimiter: undefined,
                    formatChecked: 0,
                    format: undefined,
                    formatDelimiter: undefined,
                    number: undefined,
                    nextSerial: undefined
                }
            },
            doSave() {
                this.indexCode.siteId = this.$store.state.common.siteId;
                if (!this.indexCode.siteId) {
                    this.$message.error("请选择站点");
                }
                this.$refs['indexCodeDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateIndexCode(this.indexCode).then(() => {
                            this.reload();
                            this.submitLoading = false;
                            this.$message.success(this.$t("table.submitSuccess"));
                        }).catch((error)=>{
                            this.$message.error(error);
                        });
                    }
                });
            },
            doReset() {
                this.resetIndexCode();
                this.$refs['indexCodeDialogForm'].resetFields();
            }
        }
    }
</script>
<style>
    .el-checkbox__input.is-disabled+span.el-checkbox__label {
        color: #606266;
    }
    .infoCheckbox {
        width: 120px;
    }
    .infoContent {
        width: 200px;
    }
    .infoReadonly input {
        border: none;
    }
    .delimiter {
        width: 130px;
    }
</style>

