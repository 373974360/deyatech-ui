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
        },
        watch: {
            defaultMsg: function() {
                this.ue.setContent(this.defaultMsg)
            }
        },
        methods: {
            getUeContent() {
                return this.ue.getContent()
            },
            setUeContent(v) {
                return this.ue.setContent(v)
            }
        },
        beforeDestroy() {
            console.log('销毁富文本id: ' + this.id);
            this.ue.destroy()
            this.ue = null
        }
    }
</script>
