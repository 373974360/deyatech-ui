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
                        {required: true, message: '请选择开始日期'}
                    ],
                    end: [
                        {required: true, message: '请选择结束日期'}
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
                        resetIndex(this.reset).then(() => {
                            this.submitLoading = false;
                            this.$message.success("索引码重置成功");
                        }).catch((error)=>{
                            this.$message.error(error);
                        });
                    }
                });
            }
        }
    }
</script>


