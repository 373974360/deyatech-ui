<template>
    <basic-container>
        <div class="deyatech-container pull-auto" v-if="this.$store.state.common.siteId">
            <el-row :gutter="20" :span="24">
                <el-col :span="24">
                    <el-form ref="indexCodeDialogForm" :inline="true" class="deyatech-form" :model="reset" label-position="left" :rules="resetRules">
                        <el-form-item label="开始日期" prop="start">
                            <el-date-picker type="date" placeholder="请选择开始日期" v-model="reset.start" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束日期" prop="end">
                            <el-date-picker type="date" placeholder="请选择结束日期" v-model="reset.end" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button v-if="btnEnable.save" type="primary" @click="doSave" :loading="submitLoading">索引码重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {resetIndex} from '@/api/assembly/indexReset';

    export default {
        name: 'indexCode',
        data() {
            const checkStart = (rule, value, callback) => {
                if (value && this.reset.end) {
                    if (value > this.reset.end) {
                        callback(new Error('开始日期必须小于等于结束日期'));
                    } else {
                        callback();
                    }
                }
            };
            const checkEnd = (rule, value, callback) => {
                if (value && this.reset.start) {
                    if (value < this.reset.start) {
                        callback(new Error('结束日期必须大于等于开始日期'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                submitLoading: undefined,
                reset: {
                    siteId: this.$store.state.common.siteId,
                    start: undefined,
                    end: undefined
                },
                resetRules: {
                    siteId: [
                        {required: true, message: '请选择开始站点'}
                    ],
                    start: [
                        {required: true, message: '请选择开始日期'},
                        {validator: checkStart, trigger: 'change'}
                    ],
                    end: [
                        {required: true, message: '请选择结束日期'},
                        {validator: checkEnd, trigger: 'change'}
                    ]
                },
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
                    save: this.permission.indexReset_reset
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){

            }
        },
        methods: {
            doSave() {
                if (!this.reset.siteId) {
                    this.$message.error("请选择站点");
                }
                this.$refs['indexCodeDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        resetIndex(this.reset).then(response => {
                            this.submitLoading = false;
                            if (response.data) {
                                this.$message.success("索引码重置成功");
                            } else {
                                this.$message.success("索引码重置失败");
                            }
                        }).catch((error)=>{
                            this.$message.error(error);
                        });
                    }
                });
            }
        }
    }
</script>


