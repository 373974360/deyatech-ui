<template>
    <basic-container>
        <div class="deyatech-container pull-auto" v-if="this.$store.state.common.siteId">
            <el-form ref="indexCodeDialogForm" :inline="true" class="deyatech-form" :model="reset" label-position="left" label-width="0" :rules="resetRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item>
                            <el-date-picker type="date" placeholder="选择开始日期" v-model="reset.start"></el-date-picker>
                            <el-date-picker type="date" placeholder="选择结束日期" v-model="reset.end" style="margin-left: 10px;margin-right: 10px"></el-date-picker>
                            <el-button v-if="btnEnable.save" type="primary" @click="doSave" :loading="submitLoading">索引码重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {resetIndex} from '@/api/assembly/indexCode';

    export default {
        name: 'indexCode',
        data() {
            const validateStart = (rule, value, callback) => {
                callback();
            };
            const validateEnd = (rule, value, callback) => {
                callback();
            };

            return {
                submitLoading: undefined,
                reset: {
                    siteId: this.$store.state.common.siteId,
                    start: undefined,
                    end: undefined
                },
                resetRules: {
                    start: [
                        {validator: validateStart, trigger: 'change'}
                    ],
                    end: [
                        {validator: validateEnd, trigger: 'change'}
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
                this.$refs['indexCodeDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        resetIndex(this.reset).then(() => {
                            this.submitLoading = false;
                            this.$message.success("重置成功");
                        }).catch((error)=>{
                            this.$message.error(error);
                        });
                    }
                });
            }
        }
    }
</script>


