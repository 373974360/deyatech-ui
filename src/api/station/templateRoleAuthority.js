import request from '@/router/axios';
export function getTemplateRoleAuthority(id) {
    return request({
        url: '/manage/station/templateRoleAuthority/getByTemplateRoleAuthority',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateTemplateRoleAuthority(templateRoleAuthorityVo){
    const data = templateRoleAuthorityVo;
    return request({
        url: '/manage/station/templateRoleAuthority/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delTemplateRoleAuthority(id) {
    const data = {id};
    return request({
        url: '/manage/station/templateRoleAuthority/removeByTemplateRoleAuthority',
        method: 'post',
        data
    })
}
export function delTemplateRoleAuthoritys(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/templateRoleAuthority/removeByIds',
        method: 'post',
        data
    })
}
export function getTemplateRoleAuthorityList(query) {
    return request({
        url: '/manage/station/templateRoleAuthority/pageByTemplateRoleAuthority',
        method: 'get',
        params: query
    });
}
export function getRoleAuthority(query) {
    return request({
        url: '/manage/station/templateRoleAuthority/getRoleAuthority',
        method: 'get',
        params: query
    });
}
export function setRoleAuthority(query) {
    return request({
        url: '/manage/station/templateRoleAuthority/setRoleAuthority',
        method: 'get',
        params: query
    })
}

export function getRoleViewCount(roleIds) {
    const data = {roleIds};
    return request({
        url: '/manage/station/templateRoleAuthority/getRoleViewCount',
        method: 'post',
        data
    });
}
export function delTemplateRoleAuthorityByRoleIds(roleIds) {
    const data = {roleIds};
    return request({
        url: '/manage/station/templateRoleAuthority/removeByRoleIds',
        method: 'post',
        data
    })
}
