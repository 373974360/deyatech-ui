import request from '@/router/axios';

export function getStationGroupUser(stationGroupId) {
    return request({
        url: '/manage/resource/stationGroupUser/getStationGroupUser',
        method: 'get',
        params: {stationGroupId}
    })
}
export function setStationGroupUsers(stationGroupId, userIds){
    return request({
        url: '/manage/resource/stationGroupUser/setStationGroupUsers',
        method: 'post',
        data: {stationGroupId, userIds}
    })
}
