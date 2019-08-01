// 基础路径 注意发布之前要先修改这里
let url = 'http://localhost:8765'
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/admin/'
        : '/',
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: (config) => {
        //忽略的打包文件
        config.externals({
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            'element-ui': 'ELEMENT',
        })
        const entry = config.entry('app')
        entry
            .add('babel-polyfill')
            .end()
        entry
            .add('classlist-polyfill')
            .end()
        entry
            .add('@/mock')
            .end()
    },
    devServer: {
        proxy: {
            '/manage': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/manage': '/manage'
                }
            },
            '/web': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/web': '/web'
                }
            }
        }
    }
}
