<template>
    <div class="hsy-datepicker" :style="divWidth">
        <div id="checkDates" class="calendar" v-show="isShow">
            <div class="tables">
                <div class="table">
                    <table>
                        <thead>
                        <tr>
                            <th colspan="7" class="month"> {{ pageDate.format && pageDate.format('YYYY年 M月') }} </th>
                        </tr>
                        <tr>
                            <th>日</th>
                            <th>一</th>
                            <th>二</th>
                            <th>三</th>
                            <th>四</th>
                            <th>五</th>
                            <th>六</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="row in dates">
                            <td :lable="date.date()" v-for="date in row" :class="date.cssClass"
                                @click="selectDate(date)">
                                {{ date.date()}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import moment from 'moment';
    export default {
        name: 'datepicker',
        props: {
            year: {
                type: Date,
                default: new Date().getFullYear()
            },
            month: {
                type: Number,
                default: ''
            },
            value: {},
            list: null,
            weekends: {
                type: Boolean,
                default: false
            },
            dateFormatter: {
                type: String,
                default: 'YYYY-MM-DD'
            },
            isShow: {
                type: Boolean,
                default: false
            },
            width: {
                type: Number,
                default: 350
            },
            height: {
                type: Number,
                default: 310
            }
        },
        data() {
            return {
                pageDate: [],
                dates: []
            }
        },
        watch: {
            list: {
                immediate: true,
                handler(val) {
                    if (val != null) {
                        this.list = val
                        this.pageDate = moment(this.year.getFullYear() + '-' + this.month, this.dateFormatter)
                        this.dates = this.prepareDates(this.pageDate)
                    }
                }
            }
        },
        computed: {
            // 格式化数据源
            data: function () {
                let me = this
                return TreeUtil.treeToArray(me.dataSource, null, null, me.defaultExpandAll);
            },
            divWidth() {
                return 'width:' + this.width + 'px;height:' + this.height + 'px';
            }
        },
        methods: {
            prepareDates(date) {
                let dayOfWeek = date.day()
                let dates = []
                let d
                // 将上个月之前的日期填充
                for (let i = dayOfWeek; i > 0; i--) {
                    d = date.clone().add(i, 'days')
                    d.cssClass = {
                        off: true
                    }
                    dates.push(d)
                }
                // 将本月的所有日期填充
                for (let i = 0, len = date.daysInMonth(); i < len; i++) {
                    d = date.clone().add(i, 'days')
                    dates.push(this.cssDate(d))
                }

                // 将下月的日期填充
                date = dates[dates.length - 1]
                let tail = 42 - dates.length
                for (let i = 1; i <= tail; i++) {
                    d = date.clone().add(i, 'days')
                    d.cssClass = {
                        off: true
                    }
                    dates.push(d)
                }

                // 分行显示
                let row = []
                let rows = [row]
                dates.forEach((date) => {
                    if (row.length !== 7) {
                        row.push(date)
                    } else {
                        row = [date]
                        rows.push(row)
                    }
                })
                return rows
            },
            cssDate(date) {
                let isActive = false;
                if (this.list != null && this.list.length > 0) {
                    for (let day of this.list) {
                        const days = date.format(this.dateFormatter);
                        if (days === day.date) {
                            isActive = true
                            this.value.push(days)
                        }
                    }
                } else {
                    if (this.weekends) {
                        if (date.day() === 6 || date.day() === 0) {
                            isActive = true
                            this.value.push(date.format(this.dateFormatter))
                        }
                    } else {
                        if (this.value.length > 1) {
                            for (let select of this.value) {
                                const dstr = date.format(this.dateFormatter);
                                if (dstr === select) {
                                    isActive = true
                                }
                            }
                        }
                    }
                }
                date.cssClass = {
                    active: isActive
                }
                return date
            },
            selectDate(date) {
                if (date.cssClass && date.cssClass.off) return
                if (date.cssClass && date.cssClass.active) {
                    date.cssClass.active = false;
                    const index = this.value.indexOf(date.format(this.dateFormatter))
                    this.value.splice(index, 1)
                } else {
                    date.cssClass.active = true;
                    this.value.push(date.format(this.dateFormatter))
                }
            }
        }
    }
</script>
<style scoped>
    .hsy-datepicker {
        display: inline-block;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
        font-weight: 400;
        font-size: 14px;
        float: left;
    }

    .hsy-datepicker .calendar {
        display: inline-block;
        background: #fff;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        padding: 13px 20px;
        position: absolute;
    }

    .hsy-datepicker .calendar .tables {
        white-space: nowrap;
    }

    .hsy-datepicker .calendar .table table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    .hsy-datepicker .calendar .table thead th.month {
        text-align: center;
    }

    .hsy-datepicker .calendar .table thead tr:last-child th {
        padding: 10px 0;
    }

    .hsy-datepicker .calendar .table thead th {
        color: #333;
        font-weight: normal;
    }

    .hsy-datepicker .calendar .table {
        color: #6a7288;
    }

    .hsy-datepicker .calendar .table td {
        padding: 8px;
        text-align: center;
    }

    .hsy-datepicker .calendar .table td:hover {
        width: 20px;
        height: 20px;
        padding: 5px;
        border-radius: 4px;
        white-space: nowrap;
        cursor: pointer;
        background-color: #eee;
        color: #333;
    }

    .hsy-datepicker .calendar .table td.off {
        color: #ccc;
    }

    .hsy-datepicker .calendar .table td.off:hover {
        background-color: #fff;
        cursor: default;
    }

    .hsy-datepicker .calendar .table td.active {
        background-color: #00A0FF;
        color: #fff;
        border-radius: 4px;
    }
</style>