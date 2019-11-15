import request from '@/router/axios';
export function getWorkingGroupUser(id) {
    return request({
        url: '/manage/reissue/workingGroupUser/getByWorkingGroupUser',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateWorkingGroupUser(workingGroupUserVo){
    const data = workingGroupUserVo;
    return request({
        url: '/manage/reissue/workingGroupUser/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delWorkingGroupUser(id) {
    const data = {id};
    return request({
        url: '/manage/reissue/workingGroupUser/removeByWorkingGroupUser',
        method: 'post',
        data
    })
}
export function delWorkingGroupUsers(ids) {
    const data = {ids};
    return request({
        url: '/manage/reissue/workingGroupUser/removeByIds',
        method: 'post',
        data
    })
}
export function getWorkingGroupUserList(query) {
    return request({
        url: '/manage/reissue/workingGroupUser/pageByWorkingGroupUser',
        method: 'get',
        params: query
    });
}


export function getAllWorkingGroupUser(query) {
    return request({
        url: '/manage/reissue/workingGroupUser/listByWorkingGroupUser',
        method: 'get',
        params: query
    })
}
export function saveWorkingGroupUsers(groupId, userIds) {
    return request({
        url: '/manage/reissue/workingGroupUser/saveWorkingGroupUsers',
        method: 'post',
        data: {groupId, userIds}
    })
}
export function getAllWorkingGroupUserByUserId(query) {
    return request({
        url: '/manage/reissue/workingGroupUser/listByUserId',
        method: 'get',
        params: query
    })
}
