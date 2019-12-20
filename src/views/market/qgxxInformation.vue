<template>
    <information :tagLabel="tag.label"></information>
</template>


<script>
    import {mapGetters} from 'vuex';
    import information from './information'

    export default {
        name: 'qgxxInformation',
        components: {
            information
        },
        data() {
            return {

            }
        },
        computed: {
            ...mapGetters([
                "tag",
            ]),
        },
        created(){},
        methods: {}
    }
</script>
