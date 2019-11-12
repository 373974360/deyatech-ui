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
                path: 'reformManage',
                name: '督办管理',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/reformManage')
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
                path: 'statisticsIndex',
                name: '评价统计',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/statisticsIndex')
            },
            {
                path: 'deptStatistics',
                name: '部门评价统计',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/deptStatistics')
            },
            {
                path: 'deptStatistics2',
                name: '部门评价统计2',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/deptStatistics2')
            },
            {
                path: 'deptSort',
                name: '部门评价排名',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/deptSort')
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
