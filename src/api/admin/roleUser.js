import request from '@/router/axios';

export function getRoleUser(id) {
    return request({
        url: '/manage/admin/roleUser/getByRoleUser',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateRoleUser(roleUserVo) {
    const data = roleUserVo;
    return request({
        url: '/manage/admin/roleUser/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delRoleUser(id) {
    const data = {id};
    return request({
        url: '/manage/admin/roleUser/removeByRoleUser',
        method: 'post',
        data
    })
}

export function delRoleUsers(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/roleUser/removeByIds',
        method: 'post',
        data
    })
}

export function getRoleUserList(query) {
    return request({
        url: '/manage/admin/roleUser/pageByRoleUser',
        method: 'get',
        params: query
    });
}

export function setRoleUsers(roleId, userIds) {
    return request({
        url: '/manage/admin/roleUser/setRoleUsers',
        method: 'post',
        data: {roleId, userIds}
    })
}
