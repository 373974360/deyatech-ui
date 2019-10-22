/**
 * 全局配置文件
 */
export default {
    title: "deyatech",
    logo: "S",
    key: 'deyatech',//配置主键,目前用于存储
    indexTitle: 'Deyatech Admin',
    lockPage: '/lock',
    tokenTime: 6000,
    //http的status默认放行不才用统一处理的,
    statusWhiteList: [],
    //配置首页不可关闭
    isFirstPage: false,
    fistPage: {
        label: "首页",
        value: "/evaluate/config",
        params: {},
        query: {},
        group: [],
        close: false
    },
    //配置菜单的属性
    menu: {
        props: {
            label: 'name',
            path: 'path',
            icon: 'icon',
            children: 'children'
        }
    }
}
