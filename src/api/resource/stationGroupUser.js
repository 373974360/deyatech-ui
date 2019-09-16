import request from '@/router/axios';
export function getStationGroupUser(id) {
    return request({
        url: '/manage/resource/stationGroupUser/getByStationGroupUser',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateStationGroupUser(stationGroupUserVo){
    const data = stationGroupUserVo;
    return request({
        url: '/manage/resource/stationGroupUser/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delStationGroupUser(id) {
    const data = {id};
    return request({
        url: '/manage/resource/stationGroupUser/removeByStationGroupUser',
        method: 'post',
        data
    })
}
export function delStationGroupUsers(ids) {
    const data = {ids};
    return request({
        url: '/manage/resource/stationGroupUser/removeByIds',
        method: 'post',
        data
    })
}
export function getAllStationGroupUser(query) {
    return request({
        url: '/manage/resource/stationGroupUser/listByStationGroupUser',
        method: 'get',
        params: query
    });
}
export function getStationGroupUserList(query) {
    return request({
        url: '/manage/resource/stationGroupUser/pageByStationGroupUser',
        method: 'get',
        params: query
    });
}
export function setStationGroupUsers(stationGroupId, userIds){
    return request({
        url: '/manage/resource/stationGroupUser/setStationGroupUsers',
        method: 'post',
        data: {stationGroupId, userIds}
    })
}
export function getAllUserByStationGroupUserVo(query) {
    return request({
        url: '/manage/resource/stationGroupUser/pageAllUserByStationGroupUserVo',
        method: 'get',
        params: query
    });
}
