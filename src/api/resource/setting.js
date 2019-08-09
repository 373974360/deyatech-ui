import request from '@/router/axios';
export function getSetting(id) {
    return request({
        url: '/manage/resource/setting/getBySetting',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateSetting(settingVo){
    const data = settingVo;
    return request({
        url: '/manage/resource/setting/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delSetting(id) {
    const data = {id};
    return request({
        url: '/manage/resource/setting/removeBySetting',
        method: 'post',
        data
    })
}
export function delSettings(ids) {
    const data = {ids};
    return request({
        url: '/manage/resource/setting/removeByIds',
        method: 'post',
        data
    })
}
export function getSettingList(query) {
    return request({
        url: '/manage/resource/setting/pageBySetting',
        method: 'get',
        params: query
    });
}
export function getSettingByStationGroupId(query) {
    return request({
        url: '/manage/resource/setting/getSettingByStationGroupId',
        method: 'get',
        params: query
    });
}
