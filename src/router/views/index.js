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
                path: 'allEvaluateStatistics',
                name: '总体评价统计',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/allEvaluateStatistics')
            },
            {
                path: 'badEvaluateDeptStatistics',
                name: '部门差评事项统计',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/badEvaluateDeptStatistics')
            },
            {
                path: 'badEvaluateDetailStatistics',
                name: '差评分项统计',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/badEvaluateDetailStatistics')
            },
            {
                path: 'badEvaluateRateSort',
                name: '按差评率统计',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/badEvaluateRateSort')
            },
            {
                path: 'badEvaluateReformStatistics',
                name: '按差评整改率统计',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/badEvaluateReformStatistics')
            },
            {
                path: 'channelStatistics',
                name: '按评价渠道统计',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/channelStatistics')
            },
            {
                path: 'evaluateRateSort',
                name: '按评价率统计',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/evaluateRateSort')
            },
            {
                path: 'evaluatesSort',
                name: '按评价总数统计',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/evaluatesSort')
            },
            {
                path: 'scoreSort',
                name: '按评价得分统计',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/scoreSort')
            },
            {
                path: 'sortComposite',
                name: '考核得分',
                meta: {
                    keepAlive: true,
                    isTab: false,
                    isAuth: true
                },
                component: () => import( /* webpackChunkName: "views" */ '@/views/evaluate/sortComposite')
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
