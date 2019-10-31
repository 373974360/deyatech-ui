import request from '@/router/axios';
export function getStationGroupRole(id) {
    return request({
        url: '/manage/resource/stationGroupRole/getByStationGroupRole',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateStationGroupRole(stationGroupRoleVo){
    const data = stationGroupRoleVo;
    return request({
        url: '/manage/resource/stationGroupRole/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delStationGroupRole(id) {
    const data = {id};
    return request({
        url: '/manage/resource/stationGroupRole/removeByStationGroupRole',
        method: 'post',
        data
    })
}
export function delStationGroupRoles(ids) {
    const data = {ids};
    return request({
        url: '/manage/resource/stationGroupRole/removeByIds',
        method: 'post',
        data
    })
}
export function getStationGroupRoleList(query) {
    return request({
        url: '/manage/resource/stationGroupRole/pageByStationGroupRole',
        method: 'get',
        params: query
    });
}
export function getAllRoleStationGroup(query) {
    return request({
        url: '/manage/resource/stationGroupRole/listByStationGroupRole',
        method: 'get',
        params: query
    });
}
export function setRoleStationGroups(roleId, stationGroupIds){
    return request({
        url: '/manage/resource/stationGroupRole/setRoleStationGroups',
        method: 'post',
        data: {roleId, stationGroupIds}
    })
}

