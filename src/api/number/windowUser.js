import request from '@/router/axios';
export function getWindowUser(id) {
    return request({
        url: '/manage/number/windowUser/getByWindowUser',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateWindowUser(windowUserVo){
    const data = windowUserVo;
    return request({
        url: '/manage/number/windowUser/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delWindowUser(id) {
    const data = {id};
    return request({
        url: '/manage/number/windowUser/removeByWindowUser',
        method: 'post',
        data
    })
}
export function delWindowUsers(ids) {
    const data = {ids};
    return request({
        url: '/manage/number/windowUser/removeByIds',
        method: 'post',
        data
    })
}
export function getWindowUserList(query) {
    return request({
        url: '/manage/number/windowUser/pageByWindowUser',
        method: 'get',
        params: query
    });
}

export function getAllWindowUser(query) {
    return request({
        url: '/manage/number/windowUser/listByWindowUser',
        method: 'get',
        params: query
    })
}

export function setWindowUsers(windowId, userIds) {
    return request({
        url: '/manage/number/windowUser/setWindowUsers',
        method: 'post',
        data: {windowId, userIds}
    })
}

export function getUserList(query) {
    return request({
        url: '/manage/number/windowUser/getWindowUserList',
        method: 'get',
        params: query
    })
}
