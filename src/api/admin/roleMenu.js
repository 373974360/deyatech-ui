import request from '@/router/axios';

export function getRoleMenu(id) {
    return request({
        url: '/manage/admin/roleMenu/getByRoleMenu',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateRoleMenu(roleMenuVo) {
    const data = roleMenuVo;
    return request({
        url: '/manage/admin/roleMenu/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delRoleMenu(id) {
    const data = {id};
    return request({
        url: '/manage/admin/roleMenu/removeByRoleMenu',
        method: 'post',
        data
    })
}

export function delRoleMenus(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/roleMenu/removeByIds',
        method: 'post',
        data
    })
}

export function getRoleMenuList(query) {
    return request({
        url: '/manage/admin/roleMenu/pageByRoleMenu',
        method: 'get',
        params: query
    });
}


