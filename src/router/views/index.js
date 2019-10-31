import Layout from '@/page/index/'

export default [
    {
        path: '/evaluate',
        component: Layout,
        redirect: '/evaluate/config',
        children: [
            {
                path: 'config',
                name: '等级指标配置',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/config')
            },
            {
                path: 'reform',
                name: '评价整改管理',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/reform')
            },
            {
                path: 'detail',
                name: '评价查询管理',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/detail')
            },
            {
                path: 'statistics',
                name: '评价汇总统计',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/statistics')
            },
            {
                path: 'statistics2',
                name: ' 按部门统计评价数据',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/statistics2')
            }
        ]
    }
]
    /*{
        path: '/wel',
        component: Layout,
        redirect: '/wel/index',
        children: [{
            path: 'index',
            name: '首页',
            meta: {
                i18n: 'dashboard'
            },
            component: () =>
                import( /!* webpackChunkName: "views" *!/ '@/views/wel')
        }]
    },*/
