<template>
    <basic-container>
        <div class="deyatech-container pull-auto" style="min-height: 550px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="发布内容页" name="contentReplay">
                    <div class="tab_left">
                        <el-tree
                            :props="props"
                            :load="loadNode"
                            lazy
                            show-checkbox
                            @check-change="handleCheckChange">
                        </el-tree>
                    </div>
                    <div class="tab_right">
                        <el-form ref="pageDialogForm" class="deyatech-form" label-position="right"
                                 label-width="80px">
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="时间范围" prop="pagePath">
                                        <el-date-picker
                                            v-model="value7"
                                            type="daterange"
                                            align="right"
                                            unlink-panels
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            :picker-options="pickerOptions2">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="文件路径" prop="pagePath">
                                        <el-select v-model="value" placeholder="请选择">
                                            <el-option
                                                v-for="item in htmlPath"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" style="margin-left: 10px;">一键发布</el-button>
                        </span>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="发布栏目页" name="catalogReplay">
                    <div class="tab_left">
                        <el-tree
                            :props="props"
                            :load="loadNode"
                            lazy
                            show-checkbox
                            @check-change="handleCheckChange">
                        </el-tree>
                    </div>
                    <div class="tab_right">
                        <el-form ref="pageDialogForm" class="deyatech-form" label-position="right"
                                 label-width="80px">
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="文件路径" prop="pagePath">
                                        <el-select v-model="value" placeholder="请选择">
                                            <el-option
                                                v-for="item in htmlPath"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="文件名称" prop="pagePath">
                                        <el-select v-model="value" placeholder="请选择">
                                            <el-option
                                                v-for="item in htmlName"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" style="margin-left: 10px;">一键发布</el-button>
                        </span>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="全站发布" name="siteReplay">全站发布</el-tab-pane>
            </el-tabs>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'page',
        data() {
            return {
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                htmlPath: [{
                    value: '1',
                    label: '.../栏目英文名/.../栏目英文名/...'
                }, {
                    value: '2',
                    label: '.../栏目ID/.../栏目ID/...'
                }, {
                    value: '3',
                    label: '.../YYYY/MM/DD/...'
                }],
                htmlName: [{
                    value: '1',
                    label: '栏目ID'
                }, {
                    value: '2',
                    label: '栏目英文名'
                }, {
                    value: '3',
                    label: 'index'
                }],
                props: {
                    label: 'name',
                    children: 'zones'
                },
                count: 1,
                activeName: 'contentReplay',
                value7: '',
                value: ''
            }
        },
        computed: {
            ...mapGetters([
                'searchSize',
                'btnSize'
            ])
        },
        created(){
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
            }else{
                this.$message.error('请选择站点！');
            }
        },
        methods: {
            handleCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate);
            },
            handleNodeClick(data) {
                console.log(data);
            },
            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([{name: 'region1'}, {name: 'region2'}]);
                }
                if (node.level > 3) return resolve([]);

                var hasChild;
                if (node.data.name === 'region1') {
                    hasChild = true;
                } else if (node.data.name === 'region2') {
                    hasChild = false;
                } else {
                    hasChild = Math.random() > 0.5;
                }

                setTimeout(() => {
                    var data;
                    if (hasChild) {
                        data = [{
                            name: 'zone' + this.count++
                        }, {
                            name: 'zone' + this.count++
                        }];
                    } else {
                        data = [];
                    }
                    resolve(data);
                }, 500);
            }
        }
    }
</script>
<style>
    .tab_left{
        float:left;
        width: 20%;
        border-right: 1px solid #ccc;
        min-height:500px;
    }
    .tab_right{
        float:right;
        width: 75%;
    }
</style>


