import request from '@/router/axios';
export function getUserRole(id) {
    return request({
        url: '/manage/admin/userRole/getByUserRole',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateUserRole(userRoleVo){
    const data = userRoleVo;
    return request({
        url: '/manage/admin/userRole/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delUserRole(id) {
    const data = {id};
    return request({
        url: '/manage/admin/userRole/removeByUserRole',
        method: 'post',
        data
    })
}
export function delUserRoles(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/userRole/removeByIds',
        method: 'post',
        data
    })
}
export function getUserRoleList(query) {
    return request({
        url: '/manage/admin/userRole/pageByUserRole',
        method: 'get',
        params: query
    });
}


