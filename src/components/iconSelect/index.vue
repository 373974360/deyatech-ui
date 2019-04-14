<template>
    <div>
        <el-input placeholder="请选择图标"
                  v-model="value"
                  @click.native="handleShow"
                  readonly>
            <template slot="prepend"><i :class="value"></i></template>
        </el-input>
        <el-dialog title="请选择图标"
                   :visible.sync="box" top="21vh"
                   width="40%" append-to-body>
            <ul class="icon-list">
                <li v-for="(item,index) in iconList" :key="index">
                    <i :class="item" @click="handleSubmit(item)"></i>
                </li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "icon-select",
        props: {
            value: {},
        },
        data() {
            return {
                box: false,
                iconList: []
            };
        },
        created() {
            const nodeArray = Array.from(document.querySelectorAll('symbol'));
            this.iconList = nodeArray.map(item => item.id);
        },
        methods: {
            handleSubmit(item) {
                this.box = false;
                this.$emit("input", item);
            },
            handleShow() {
                this.box = true;
            }
        }
    }
</script>

<style lang="scss">
    .icon-list {
        overflow: hidden;
        list-style: none;
        padding: 0;
        border-radius: 4px;
    }

    .icon-list li {
        float: left;
        width: 10%;
        text-align: center;
        height: 60px;
        line-height: 60px;
        color: #666;
        font-size: 13px;
        margin-right: -1px;
        margin-bottom: -1px
    }

    .icon-list li:after {
        content: "";
        height: 100%
    }

    .icon-list li:after, .icon-list li span {
        display: inline-block;
        vertical-align: middle
    }

    .icon-list li span {
        line-height: normal;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
        color: #99a9bf;
        transition: color .15s linear
    }

    .icon-list li i {
        display: block;
        font-size: 24px !important;
        margin-bottom: 15px;
        color: #606266;
        transition: color .15s linear;
        font-style: normal;
    }

    .icon-list li .icon-name {
        display: inline-block;
        padding: 0 3px;
        height: 1em
    }

    .icon-list li:hover i, .icon-list li:hover span {
        color: #409EFF
    }
</style>
