<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-for="t in customizationHeads" :label="t.name" :name="t.type">
                    <el-table :data="t.headList" border style="width: 500px" height="500px">
                        <el-table-column prop="label" label="名称"></el-table-column>
                        <el-table-column label="显示" align="center" width="50">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.show" :disabled="scope.row.disabled"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="排序" align="center" width="100">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-arrow-up" :size="btnSize" circle title="上移" @click="sortUp(t.headList, scope.$index)"></el-button>
                                <el-button icon="el-icon-arrow-down" :size="btnSize" circle title="下移" @click="sortDown(t.headList, scope.$index)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <el-button type="primary" @click="btnSave" style="margin-top: 10px">保存</el-button>

        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getAllCustomizationFunction,
        saveOrUpdateBatch
    } from '@/api/assembly/customizationFunction';
    import {getStore} from '@/util/store';

    export default {
        name: 'customizationFunctionTableHead',
        data() {
            return {
                customizationHeads: [],
                activeName: 'TABLE_HEAD_CATALOG'
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
                    tableHead: this.permission.CustomizationFunction_TableHead
                };
            }
        },
        created(){
            this.loadHeadData();
        },
        methods: {
            loadHeadData() {
                getAllCustomizationFunction().then(response=>{
                    this.customizationHeads = response.data;
                });
            },
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            sortUp(headList, index) {
                if (index > 0) {
                    const row = headList.splice(index, 1)[0];
                    headList.splice(index - 1, 0, row);
                }
            },
            sortDown(headList, index) {
                if (index !== headList.length - 1) {
                    const row = headList.splice(index, 1)[0];
                    headList.splice(index + 1, 0, row);
                }
            },
            btnSave() {
                let data = [];
                for (let h of this.customizationHeads) {
                    let cf = {};
                    cf.id = h.id;
                    cf.name = h.name;
                    cf.type = h.type;
                    cf.data = JSON.stringify(h.headList);
                    data.push(cf);
                }
                console.dir(data);
                saveOrUpdateBatch(JSON.stringify(data)).then(response=>{
                    if (response.status == 200 && response.data) {
                        this.$message.success("保存成功");
                    } else {
                        this.$message.success("保存失败");
                    }
                });
            }
        }
    }
</script>


