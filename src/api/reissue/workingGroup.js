import request from '@/router/axios';
export function getWorkingGroup(id) {
    return request({
        url: '/manage/reissue/workingGroup/getByWorkingGroup',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateWorkingGroup(workingGroupVo){
    const data = workingGroupVo;
    return request({
        url: '/manage/reissue/workingGroup/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delWorkingGroup(id) {
    const data = {id};
    return request({
        url: '/manage/reissue/workingGroup/removeByWorkingGroup',
        method: 'post',
        data
    })
}
export function delWorkingGroups(ids) {
    const data = {ids};
    return request({
        url: '/manage/reissue/workingGroup/removeByIds',
        method: 'post',
        data
    })
}
export function getWorkingGroupList(query) {
    return request({
        url: '/manage/reissue/workingGroup/pageByWorkingGroup',
        method: 'get',
        params: query
    });
}


