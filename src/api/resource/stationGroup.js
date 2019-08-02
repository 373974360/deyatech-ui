import request from '@/router/axios';
export function getStationGroup(id) {
    return request({
        url: '/manage/resource/stationGroup/getByStationGroup',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateStationGroup(stationGroupVo){
    const data = stationGroupVo;
    return request({
        url: '/manage/resource/stationGroup/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delStationGroup(id) {
    const data = {id};
    return request({
        url: '/manage/resource/stationGroup/removeByStationGroup',
        method: 'post',
        data
    })
}
export function delStationGroups(ids) {
    const data = {ids};
    return request({
        url: '/manage/resource/stationGroup/removeByIds',
        method: 'post',
        data
    })
}
export function getStationGroupList(query) {
    return request({
        url: '/manage/resource/stationGroup/pageByStationGroup',
        method: 'get',
        params: query
    });
}

export function getAllStationGroup(query) {
    return request({
        url: '/manage/resource/stationGroup/listByStationGroup',
        method: 'get',
        params: query
    });
}

