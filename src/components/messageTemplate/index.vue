<template>
    <el-select :value="selectedValue" v-on:change="selectChange" placeholder="请选择">
        <el-option
            v-for="item in messageTemplates"
            :key="item.template_id"
            :label="item.sms_title"
            :value="item.template_id"
            >
        </el-option>
    </el-select>
</template>

<script>
    import request from '@/router/axios';

    export default {
        name: "message-template",
        model: {
            prop: 'templateId',
            event: 'change'
        },
        props: {
            templateId: String
        },
        data() {
            return {
                messageTemplates : []
            }
        },
        computed: {
            selectedValue: function() {
                return this.templateId;
            }
        },
        created() {
            this.getMessageTemplates();
        },
        methods: {
            selectChange(value) {
                this.$emit('change', value);
            },
            getMessageTemplates() {
                request({
                    url: '/manage/common/getSubMailMessageTemplates',
                    method: 'get'
                }).
                then(response => {
                    if (response.status == 200) {
                        this.messageTemplates = response.data;
                    } else {
                        this.messageTemplates = [];
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
