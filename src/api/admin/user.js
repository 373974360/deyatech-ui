import request from '@/router/axios';

export function getUser(id) {
    return request({
        url: '/manage/admin/user/getByUser',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateUser(userVo) {
    const data = userVo;
    return request({
        url: '/manage/admin/user/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delUser(id) {
    const data = {id};
    return request({
        url: '/manage/admin/user/removeByUser',
        method: 'post',
        data
    })
}

export function delUsers(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/user/removeByIds',
        method: 'post',
        data
    })
}

export function getUserList(query) {
    return request({
        url: '/manage/admin/user/pageByUser',
        method: 'get',
        params: query
    });
}

export function checkAccountExist(id, account) {
    return request({
        url: '/manage/admin/user/checkAccountExist',
        method: 'get',
        params: {id, account}
    })
}

export function getUsersByWindowAndDepartment(query) {
    return request({
        url: '/manage/admin/user/getUsersByWindowAndDepartment',
        method: 'get',
        params: query
    });
}

export function getAllUser(query) {
    return request({
        url: '/manage/admin/user/listByUser',
        method: 'get',
        params: query
    });
}

export function findUserByIds(ids) {
    return request({
        url: '/manage/admin/user/findUserByIds',
        method: 'get',
        params: {ids}
    })
}
