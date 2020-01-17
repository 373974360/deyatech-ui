<template>
    <el-cascader filterable ref="cstmInputDepartmentDascader" :options="departmentCascader" v-model="departmentValue"
                 :props="{ checkStrictly: true }"
                 :show-all-levels="showAllLevels"
                 :size="showSize"
                 :debounce="500" style="width: 100%"
                 :before-filter="beforeFilterDepartment"
                 @blur="blurDepartment"
                 @focus="focusDepartment"
                 @change="changeDepartment"
                 :placeholder="showPlaceholder"
    ></el-cascader>
</template>

<script>
    import {deepClone} from '@/util/util';
    import {getCascaderAttach} from '@/api/admin/department';

    export default {
        name: "input-department-cascader",
        props: {
            value: {},
            showAllLevels: {
                type: Boolean,
                default: false
            },
            showSize: {
                type: String,
                default: 'medium'
            },
            showPlaceholder: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                departmentList: [],
                departmentCascader: [],
                departmentCascaderBack: [],
                departmentCascaderLength: undefined,
                departmentValue:[],
                inputDepartmentName: undefined,
                increment: 1
            }
        },
        created() {
            this.getDepartmentCascader();
        },
        mounted() {
            this.init();
        },
        methods: {
            getDepartmentCascader() {
                getCascaderAttach().then(response => {
                    // 部门列表数据 id,parentId,treePosition, 根节点parentId是0,treePosition没有
                    this.departmentList = response.data.attachData;
                    // 部门级联数据 label,value,children,disabled
                    this.departmentCascader = response.data.cascaderData;
                    this.departmentCascaderLength = this.departmentCascader.length;
                    // 部门级联数据备份
                    this.departmentCascaderBack = deepClone(this.departmentCascader);
                    this.init();
                })
            },
            init() {
                if (!this.value) return;
                let value = [];
                let list = deepClone(this.departmentCascaderBack);
                let department = this.getDepartmentById(this.value);
                // 没有找到就认为是输入的数据
                if (!department) {
                    list.push(this.getItem(this.value));
                    value.push(this.value);
                } else {
                    if (department.treePosition) {
                        value = department.treePosition.substr(1).split('&');
                    }
                    value.push(this.value);
                }
                this.departmentCascader = list;
                this.departmentValue = value;
            },
            getDepartmentById(id) {
                let department = undefined;
                if (this.departmentList && id) {
                    for (let item of this.departmentList) {
                        if (id === item.id) {
                            department = deepClone(item);
                            break;
                        }
                    }
                }
                return department;
            },
            getItem(name) {
                return {
                    value: name,
                    label: name,
                    children: undefined,
                    disabled: false
                }
            },
            beforeFilterDepartment: function(value) {
                this.inputDepartmentName = value;
                return false;
            },
            blurDepartment() {
                if (!this.inputDepartmentName) return;
                this.$set(this.departmentCascader, this.departmentCascaderLength, this.getItem(this.inputDepartmentName));
                this.departmentValue = [this.inputDepartmentName];
                this.inputDepartmentName = undefined;
                this.changeDepartment(this.departmentValue);
            },
            focusDepartment() {
                this.$refs.cstmInputDepartmentDascader.$refs.input.$refs.input.select();
            },
            changeDepartment(v) {
                if (v && v.length > 0) {
                    this.$emit('input', v[v.length - 1]);
                } else {
                    this.$emit('input', '');
                }
            }
        }
    }
</script>

<style scoped>

</style>
