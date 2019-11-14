<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <!--<el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.levelCode" clearable :placeholder="$t('table.pleaseSelect') + '评价等级'">
                            <el-option
                                v-for="item in loadEnum('EvaluationLevelEnum')"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.channel" clearable :placeholder="$t('table.pleaseSelect') + '评价渠道'">
                            <el-option
                                v-for="item in loadEnum('EvaluationChannelEnum')"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.subMatter" clearable :placeholder="$t('table.pleaseSelect') + '事项主题'">
                            <el-option
                                v-for="item in loadEnum('ServiceObjectEnum')"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input clearable :size="searchSize" :placeholder="$t('table.pleaseInput') + '事项编码'" v-model="listQuery.itemCode" style="width: 187px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input clearable :size="searchSize" :placeholder="$t('table.pleaseInput') + '事项名称'" v-model="listQuery.itemName" style="width: 187px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input clearable :size="searchSize" :placeholder="$t('table.pleaseInput') + '用户姓名'" v-model="listQuery.userName" style="width: 187px"></el-input>
                    </el-form-item>-->
                    <el-form-item label="评价时间">
                        <el-date-picker
                            style="width: 384px"
                            :size="searchSize"
                            v-model="submitTimeRange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            align="right"
                            start-placeholder="评价时间开始"
                            end-placeholder="评价时间结束"
                            :default-time="['00:00:00', '23:59:59']"
                            @change="submitTimeRangeChange">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <div class="deyatech-menu">
                <div class="deyatech-menu_right">
                    <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadPage">{{$t('table.search')}}</el-button>
                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                </div>
            </div>

            <h3 class="table-title">分项指标“差评”情况分析</h3>
            <el-table :data="countByDeptDimensionCodeList" v-loading.body="listDeptDimensionCodeLoading" stripe border highlight-current-row>
                <el-table-column align="center" type="index" label="序号"/>
                <el-table-column align="center" label="部门名称" prop="acceptDept"/>
                <el-table-column align="center" label="服务规范性">
                    <el-table-column align="center" label="评价指标">
                        <el-table-column align="center" label="办事场所">
                            <template slot-scope="scope">
                                {{scope.row.countByCodeMap['101'] ? scope.row.countByCodeMap['101'].count : 0
                                + scope.row.countByCodeMap['201'] ? scope.row.countByCodeMap['201'].count : 0}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="办事窗口">
                            <template slot-scope="scope">
                                {{scope.row.countByCodeMap['102'] ? scope.row.countByCodeMap['102'].count : 0
                                + scope.row.countByCodeMap['202'] ? scope.row.countByCodeMap['202'].count : 0}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="一表申请">
                            <template slot-scope="scope">
                                {{scope.row.countByCodeMap['103'] ? scope.row.countByCodeMap['103'].count : 0
                                + scope.row.countByCodeMap['203'] ? scope.row.countByCodeMap['203'].count : 0}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="评价数">
                        <el-table-column align="center" label="差评总数">
                            <template slot-scope="scope">
                                {{scope.row.countByDimensionMap['1'] ? scope.row.countByDimensionMap['1'].count : 0}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="占比">
                            <template slot-scope="scope">
                                {{(scope.row.countByDimensionMap['1'] ? scope.row.countByDimensionMap['1'].rate : 0).toFixed(2)}}%
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="服务便捷性">
                    <el-table-column align="center" label="评价指标">
                        <el-table-column align="center" label="网办深度">
                            <template slot-scope="scope">
                                {{scope.row.countByCodeMap['104'] ? scope.row.countByCodeMap['104'].count : 0
                                + scope.row.countByCodeMap['204'] ? scope.row.countByCodeMap['204'].count : 0}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="移动办理">
                            <template slot-scope="scope">
                                {{scope.row.countByCodeMap['105'] ? scope.row.countByCodeMap['105'].count : 0
                                + scope.row.countByCodeMap['205'] ? scope.row.countByCodeMap['205'].count : 0}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="跑动次数">
                            <template slot-scope="scope">
                                {{scope.row.countByCodeMap['106'] ? scope.row.countByCodeMap['106'].count : 0
                                + scope.row.countByCodeMap['206'] ? scope.row.countByCodeMap['206'].count : 0}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="评价数">
                        <el-table-column align="center" label="差评总数">
                            <template slot-scope="scope">
                                {{scope.row.countByDimensionMap['2'] ? scope.row.countByDimensionMap['2'].count : 0}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="占比">
                            <template slot-scope="scope">
                                {{(scope.row.countByDimensionMap['2'] ? scope.row.countByDimensionMap['2'].rate : 0).toFixed(2)}}%
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="服务精准性">
                    <el-table-column align="center" label="评价指标">
                        <el-table-column align="center" label="服务引导">
                            <template slot-scope="scope">
                                {{scope.row.countByCodeMap['107'] ? scope.row.countByCodeMap['107'].count : 0
                                + scope.row.countByCodeMap['207'] ? scope.row.countByCodeMap['207'].count : 0}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="申报材料">
                            <template slot-scope="scope">
                                {{scope.row.countByCodeMap['108'] ? scope.row.countByCodeMap['108'].count : 0
                                + scope.row.countByCodeMap['208'] ? scope.row.countByCodeMap['208'].count : 0}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="办理时间">
                            <template slot-scope="scope">
                                {{scope.row.countByCodeMap['109'] ? scope.row.countByCodeMap['109'].count : 0
                                + scope.row.countByCodeMap['209'] ? scope.row.countByCodeMap['209'].count : 0}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="评价数">
                        <el-table-column align="center" label="差评总数">
                            <template slot-scope="scope">
                                {{scope.row.countByDimensionMap['3'] ? scope.row.countByDimensionMap['3'].count : 0}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="占比">
                            <template slot-scope="scope">
                                {{(scope.row.countByDimensionMap['3'] ? scope.row.countByDimensionMap['3'].rate : 0).toFixed(2)}}%
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="窗口服务">
                    <el-table-column align="center" label="评价指标">
                        <el-table-column align="center" label="服务质量">
                            <template slot-scope="scope">
                                {{scope.row.countByCodeMap['110'] ? scope.row.countByCodeMap['110'].count : 0
                                + scope.row.countByCodeMap['210'] ? scope.row.countByCodeMap['210'].count : 0}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="服务态度">
                            <template slot-scope="scope">
                                {{scope.row.countByCodeMap['111'] ? scope.row.countByCodeMap['111'].count : 0
                                + scope.row.countByCodeMap['211'] ? scope.row.countByCodeMap['211'].count : 0}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="评价数">
                        <el-table-column align="center" label="差评总数">
                            <template slot-scope="scope">
                                {{scope.row.countByDimensionMap['4'] ? scope.row.countByDimensionMap['4'].count : 0}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="占比">
                            <template slot-scope="scope">
                                {{(scope.row.countByDimensionMap['4'] ? scope.row.countByDimensionMap['4'].rate : 0).toFixed(2)}}%
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="总评价数" prop="count"/>
            </el-table>

            <!--<el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>-->
        </div>
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {getStore} from '@/util/store';
    import {
        qryCountByDeptDimensionCode,
    } from "../../api/evaluate/count";

    export default {
        name: 'deptStatistics2',
        data() {
            return {
                countByDeptDimensionCodeList: [],
                listDeptDimensionCodeLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    channel: undefined,
                    itemCode: undefined,
                    itemName: undefined,
                    subMatter: undefined,
                    proDepartment: undefined,
                    userName: undefined,
                    levelCode: undefined,
                    anonymityFlag: undefined,
                    publicFlag: undefined,
                    evaluationTimeStart: undefined,
                    evaluationTimeEnd: undefined,
                },
                submitTimeRange: []
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
        created(){
            this.reloadPage();
        },
        methods: {
            reloadPage() {
                this.loadCountByDeptDimensionCodeList();
            },
            resetSearch(){
                this.listQuery.channel = undefined;
                this.listQuery.itemCode = undefined;
                this.listQuery.itemName = undefined;
                this.listQuery.subMatter = undefined;
                this.listQuery.proDepartment = undefined;
                this.listQuery.userName = undefined;
                this.listQuery.levelCode = undefined;
                this.listQuery.anonymityFlag = undefined;
                this.listQuery.publicFlag = undefined;
                this.listQuery.evaluationTimeStart = undefined;
                this.listQuery.evaluationTimeEnd = undefined;
                this.submitTimeRange = [];
            },
            loadCountByDeptDimensionCodeList() {
                this.listDeptDimensionCodeLoading = true;
                this.countByDeptDimensionCodeList = [];
                qryCountByDeptDimensionCode(this.listQuery).then(response => {
                    this.listDeptDimensionCodeLoading = false;
                    this.countByDeptDimensionCodeList = response.data;
                })
            },
            loadEnum(name) {
                return getStore({name: 'enums'})[name];
            },
            submitTimeRangeChange(submitTimeRange) {
                if (submitTimeRange && submitTimeRange.length > 0) {
                    this.listQuery.evaluationTimeStart = submitTimeRange[0];
                    this.listQuery.evaluationTimeEnd = submitTimeRange[1];
                } else {
                    this.listQuery.evaluationTimeStart = undefined;
                    this.listQuery.evaluationTimeEnd = undefined;
                }
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/css/evaluateStatistics.css";
</style>
