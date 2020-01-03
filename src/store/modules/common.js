import {getStore, removeStore, setStore} from '@/util/store'
import website from '@/config/website'
import {getDicts, getEnums} from '@/api/common';

const common = {

    state: {
        language: getStore({name: 'language'}) || 'zh',
        page: 1,
        size: 15,
        dialogRows: 10,
        pageSize: [10, 15, 20, 30, 40, 50, 100],
        pageLayout: 'total, sizes, prev, pager, next, jumper',
        titleMap: {
            create: '新增',
            update: '编辑',
            view: '查看',
            associateMenu: '关联权限',
            associateUser: '关联用户',
            associateItem: '关联事项',
            associateMaterials: '关联材料'
        },
        enums: getStore({name: 'enums'}) || [],
        dicts: getStore({name: 'dicts'}) || [],
        searchSize: 'small',
        btnSize: 'small',
        closeOnClickModal: false,
        uploadUrl: '/manage/common/upload',
        downloadUrl: '/manage/common/download?filePath=',
        showPicImgUrl: '/manage/common/showPicImg?filePath=',
        imageAccepts: 'image/jpg, image/jpeg, image/png, image/bmp, image/gif',
        fileAccepts: 'image/jpg,image/jpeg,image/png,image/bmp,image/gif,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,text/plain,application/zip,application/rar',
        isCollapse: false,
        isFullScren: false,
        isShade: false,
        screen: -1,
        isLock: getStore({name: 'isLock'}) || false,
        showTag: true,
        showDebug: true,
        showCollapse: true,
        showSearch: true,
        showLock: true,
        showFullScren: true,
        showTheme: true,
        showMenu: true,
        showColor: true,
        colorName: getStore({name: 'colorName'}) || '#409EFF',
        themeName: getStore({name: 'themeName'}) || 'theme-default',
        lockPasswd: getStore({name: 'lockPasswd'}) || '',
        website: website,
        callThirdPartyInterface: true, // 是否调用第三方接口
        areas: [
            {code: '610100000000', name: '西安市'},
            {code: '610102000000', name: '新城区'},
            {code: '610103000000', name: '碑林区'},
            {code: '610104000000', name: '莲湖区'},
            {code: '610113000000', name: '雁塔区'},
            {code: '610111000000', name: '灞桥区'},
            {code: '610112000000', name: '未央区'},
            {code: '610114000000', name: '阎良区'},
            {code: '610115000000', name: '临潼区'},
            {code: '610116000000', name: '长安区'},
            {code: '610117000000', name: '高陵区'},
            {code: '610118000000', name: '鄠邑区'},
            {code: '610122000000', name: '蓝田县'},
            {code: '610124000000', name: '周至县'},
            {code: '610135000000', name: '高新区'},
            {code: '610134000000', name: '经开区'},
            {code: '610133000000', name: '曲江新区'},
            {code: '610154000000', name: '浐灞生态区'},
            {code: '610156000000', name: '航空基地'},
            {code: '610157000000', name: '航天基地'},
            {code: '610155000000', name: '国际港务区'}
        ]
    },
    actions: {
        // 获取后台的所有枚举json数据
        SetEnums({commit}) {
            return new Promise((resolve, reject) => {
                getEnums().then(response => {
                    const enums = {};
                    const result = response.data;
                    if (result != null) {
                        for (const obj of result) {
                            enums[obj.name] = obj.value;
                        }
                    }
                    commit('SET_ENUMS', enums);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        // 获取后台字典项目json数据
        SetDicts({commit}) {
            return new Promise((resolve, reject) => {
                getDicts().then(response => {
                    let dicts = {};
                    let result = response.data;
                    if (result != null) {
                        for (let obj of result) {
                            dicts[obj.name] = obj.value;
                        }
                    }
                    commit('SET_DICTS', dicts);
                }).catch(error => {
                    reject(error);
                });
            });
        },
    },
    mutations: {
        SET_LANGUAGE: (state, language) => {
            state.language = language
            setStore({
                name: 'language',
                content: state.language
            })
        },
        SET_SHADE: (state, active) => {
            state.isShade = active;
        },
        SET_COLLAPSE: (state) => {
            state.isCollapse = !state.isCollapse;
        },
        SET_FULLSCREN: (state) => {
            state.isFullScren = !state.isFullScren;
        },
        SET_LOCK: (state) => {
            state.isLock = true;
            setStore({
                name: 'isLock',
                content: state.isLock,
                type: 'session'
            })
        },
        SET_SCREEN: (state, screen) => {
            state.screen = screen;
        },
        SET_COLOR_NAME: (state, colorName) => {
            state.colorName = colorName;
            setStore({
                name: 'colorName',
                content: state.colorName,
            })
        },
        SET_THEME_NAME: (state, themeName) => {
            state.themeName = themeName;
            setStore({
                name: 'themeName',
                content: state.themeName,
            })
        },
        SET_LOCK_PASSWD: (state, lockPasswd) => {
            state.lockPasswd = lockPasswd;
            setStore({
                name: 'lockPasswd',
                content: state.lockPasswd,
                type: 'session'
            })
        },
        CLEAR_LOCK: (state) => {
            state.isLock = false;
            state.lockPasswd = '';
            removeStore({
                name: 'lockPasswd',
                type: 'session'
            });
            removeStore({
                name: 'isLock',
                type: 'session'
            });
        },
        SET_ENUMS: (state, enums) => {
            state.enums = enums;
            setStore({name: 'enums', content: state.enums, type: 'session'})
        },
        SET_DICTS: (state, dicts) => {
            state.dicts = dicts;
            setStore({name: 'dicts', content: state.dicts, type: 'session'})
        }
    }
}
export default common
