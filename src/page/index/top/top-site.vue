<template>
    <el-cascader v-if="this.$store.state.common.selectSiteDisplay" placeholder="请选择站点" style="margin-top:16px;width: 400px;"
                 :options="stationGroupList" v-model="stationGroupTreePosition" @change="siteChange" size="small">
    </el-cascader>
</template>

<script>
    import {
        getClassificationStationCascader
    } from '@/api/resource/stationGroup';

    export default {
        name: "topSite",
        data() {
            return {
                stationGroupList: undefined,
                stationGroupTreePosition: undefined
            };
        },
        inject: ['reloadMainView'],
        created(){
            this.getAllStationGroup();
        },
        methods: {
            getAllStationGroup(){
                this.stationGroupList = [];
                getClassificationStationCascader().then(response => {
                    this.stationGroupList = response.data;
                    if(this.stationGroupList.length > 0){
                        let result = [];
                        this.getDefault(result, this.stationGroupList);
                        this.stationGroupTreePosition = result;
                        if (result.length > 0) {
                            this.$store.state.common.siteId = result[result.length - 1];
                        }
                    }
                })
            },
            getDefault(result, list) {
                if (list) {
                    result.push(list[0].value);
                    this.getDefault(result, list[0].children);
                }
            },
            siteChange(v){
                console.dir(v);
                if (v.length > 0) {
                    this.$store.state.common.siteId = v[v.length - 1];
                    this.reloadMainView();
                }
                // this.$router.go(0);
                // this.$router.history.current.meta.keepAlive = false
            }
        }
    };
</script>
