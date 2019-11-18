<template>
    <div>
        <div :id="this.id"></div>
    </div>
</template>

<script>
    export default {
        name: 'editor',
        props: {
            id: {
                type: String
            },
            defaultMsg: {
                type: String,
                default: ''
            },
            attach: {
                type: String,
                default: ''
            },
            config: {
                type: Object,
                default: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: '350'
                }
            }
        },
        data() {
            return {
                ue: null
            }
        },
        mounted() {
            this.ue = UE.getEditor(this.id, this.config)
            this.ue.addListener('ready', () => {
                this.ue.setContent(this.defaultMsg)
            })
            this.ue.addListener('contentChange', this.contentChange);
        },
        methods: {
            contentChange() {
                this.$emit('editorContentChange', this.ue.getContent(), this.attach);
                this.$emit('editorContentTxtChange', this.ue.getContentTxt(), this.attach);// 获取编辑器中的纯文本内容,没有段落格式
                this.$emit('editorPlainTxtChange', this.ue.getPlainTxt(), this.attach);// 得到编辑器的纯文本内容，但会保留段落格式
            },
            getUeContent() {
                return this.ue.getContent()
            },
            setUeContent(v) {
                return this.ue.setContent(v)
            }
        },
        beforeDestroy() {
            this.ue.destroy()
            this.ue = null
        }
    }
</script>
