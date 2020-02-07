import request from '@/router/axios';
export function getStationGroupDepartmentAdmin(id) {
    return request({
        url: '/manage/resource/stationGroupDepartmentAdmin/getByStationGroupDepartmentAdmin',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateStationGroupDepartmentAdmin(stationGroupDepartmentAdminVo){
    const data = stationGroupDepartmentAdminVo;
    return request({
        url: '/manage/resource/stationGroupDepartmentAdmin/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delStationGroupDepartmentAdmin(id) {
    const data = {id};
    return request({
        url: '/manage/resource/stationGroupDepartmentAdmin/removeByStationGroupDepartmentAdmin',
        method: 'post',
        data
    })
}
export function delStationGroupDepartmentAdmins(ids) {
    const data = {ids};
    return request({
        url: '/manage/resource/stationGroupDepartmentAdmin/removeByIds',
        method: 'post',
        data
    })
}
export function getStationGroupDepartmentAdminList(query) {
    return request({
        url: '/manage/resource/stationGroupDepartmentAdmin/pageByStationGroupDepartmentAdmin',
        method: 'get',
        params: query
    });
}


