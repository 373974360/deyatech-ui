import request from '@/router/axios';

export function getRole(id) {
    return request({
        url: '/manage/admin/role/getByRole',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateRole(roleVo) {
    const data = roleVo;
    return request({
        url: '/manage/admin/role/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delRole(id) {
    const data = {id};
    return request({
        url: '/manage/admin/role/removeByRole',
        method: 'post',
        data
    })
}

export function delRoles(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/role/removeByIds',
        method: 'post',
        data
    })
}

export function getRoleList(query) {
    return request({
        url: '/manage/admin/role/pageByRole',
        method: 'get',
        params: query
    });
}


