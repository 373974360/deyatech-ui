<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-date-picker class="filter-item" v-model.trim="year" align="right" type="year" placeholder="选择年份" @change="handlerChange"
                                style="width:252px">
                </el-date-picker>
                <el-button v-if="btnEnable.update" class="filter-item" style="margin-left: 10px;" type="primary" icon="circle-check" @click="save">保存</el-button>
            </div>
            <div class="deyatech-menu" style="margin-top:20px;">
                <div v-show="!listLoading">
                    <date-picker v-model="value" :list="list" :year="year" :month="1" :weekends="true" :isShow="true"></date-picker>
                    <date-picker v-model="value" :list="list" :year="year" :month="2" :weekends="true" :isShow="true"></date-picker>
                    <date-picker v-model="value" :list="list" :year="year" :month="3" :weekends="true" :isShow="true"></date-picker>
                    <date-picker v-model="value" :list="list" :year="year" :month="4" :weekends="true" :isShow="true"></date-picker>
                    <date-picker v-model="value" :list="list" :year="year" :month="5" :weekends="true" :isShow="true"></date-picker>
                    <date-picker v-model="value" :list="list" :year="year" :month="6" :weekends="true" :isShow="true"></date-picker>
                    <date-picker v-model="value" :list="list" :year="year" :month="7" :weekends="true" :isShow="true"></date-picker>
                    <date-picker v-model="value" :list="list" :year="year" :month="8" :weekends="true" :isShow="true"></date-picker>
                    <date-picker v-model="value" :list="list" :year="year" :month="9" :weekends="true" :isShow="true"></date-picker>
                    <date-picker v-model="value" :list="list" :year="year" :month="10" :weekends="true" :isShow="true"></date-picker>
                    <date-picker v-model="value" :list="list" :year="year" :month="11" :weekends="true" :isShow="true"></date-picker>
                    <date-picker v-model="value" :list="list" :year="year" :month="12" :weekends="true" :isShow="true"></date-picker>
                </div>
            </div>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import DatePicker from '@/components/datePicker';
    import {saveOrUpdateBatch, getHolidayList} from '@/api/admin/holiday';

    export default {
        name: 'date',
        data() {
            return {
                year: new Date(),
                value: [],
                list: null,
                listLoading: false
            }
        },
        computed: {
            ...mapGetters([
                'permission'
            ]),
            btnEnable() {
                return {
                    update: this.permission.holiday_update,
                };
            }
        },
        components: {
            DatePicker
        },
        methods: {
            handlerChange() {
                this.getHoliday();
                this.value = [];
            },
            getHoliday() {
                this.listLoading = true;
                const year = {
                    year: this.year.getFullYear()
                }
                getHolidayList(year).then(response => {
                    this.list = response.data;
                    this.listLoading = false;
                })
            },
            save() {
                const dataParam = {
                    year: this.year.getFullYear(),
                    value: this.value
                }
                saveOrUpdateBatch(dataParam).then(() => {
                    this.$message.success('保存成功');
                })
            }
        },
        created() {
            this.getHoliday();
        },
    }
</script>


