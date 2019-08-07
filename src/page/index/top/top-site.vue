<template>
    <el-select v-model="siteId" placeholder="请选择站点" style="margin-top:12px;" @change="siteChange">
        <el-option
            v-for="item in stationGroupList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
    </el-select>
</template>

<script>
    import {
        getAllStationGroup
    } from '@/api/resource/stationGroup';

    export default {
        name: "topSite",
        data() {
            return {
                siteId: undefined,
                stationGroupList: []
            };
        },
        inject: ['reloadMainView'],
        created(){
            this.getAllStationGroup();
        },
        methods: {
            getAllStationGroup(){
                this.stationGroupList = [];
                getAllStationGroup().then(response => {
                    this.stationGroupList = response.data;
                })
            },
            siteChange(val){
                this.$store.state.common.siteId = val;
                // this.$router.go(0);
                this.reloadMainView();
                // this.$router.history.current.meta.keepAlive = false
            }
        }
    };
</script>
