<template>
    <el-cascader filterable ref="topSiteCascader" v-if="this.$store.state.common.selectSiteDisplay" placeholder="请选择站点" style="margin-top:16px;width: 400px;"
                 :options="stationGroupList" v-model="stationGroupTreePosition" @change="siteChange" size="small">
    </el-cascader><!--&& this.stationGroupList.length > 1-->
</template>

<script>
    import {
        getLoginUserStationCascader
    } from '@/api/resource/stationGroup';
    import {mapState} from "vuex";

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
                getLoginUserStationCascader().then(response => {
                    this.stationGroupList = response.data;
                    if(this.stationGroupList.length > 0){
                        let v = [];
                        this.getDefault(v, this.stationGroupList);
                        this.stationGroupTreePosition = v;
                        if (v.length > 0) {
                            this.$store.state.common.siteId = v[v.length - 1];
                            this.$store.state.common.siteName = this.currentLabels(v);
                            this.reloadMainView();
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
                if (v.length > 0) {
                    this.$store.state.common.siteId = v[v.length - 1];
                    this.$store.state.common.siteName = this.currentLabels(v);
                    this.reloadMainView();
                }
                // this.$router.go(0);siteName
                // this.$router.history.current.meta.keepAlive = false
            },
            currentLabels(v) {
                let options = this.stationGroupList;
                let labels = [];
                v.forEach(value => {
                    const targetOption = options && options.filter(option => option['value'] === value)[0];
                    if (targetOption) {
                        labels.push(targetOption['label']);
                        options = targetOption['children'];
                    }
                });
                //labels[labels.length - 1]
                return labels.join('/');
            }
        }
    };
</script>
