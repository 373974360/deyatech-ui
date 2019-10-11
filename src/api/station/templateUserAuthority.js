import request from '@/router/axios';
export function getTemplateUserAuthority(id) {
    return request({
        url: '/manage/station/templateUserAuthority/getByTemplateUserAuthority',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateTemplateUserAuthority(templateUserAuthorityVo){
    const data = templateUserAuthorityVo;
    return request({
        url: '/manage/station/templateUserAuthority/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delTemplateUserAuthority(id) {
    const data = {id};
    return request({
        url: '/manage/station/templateUserAuthority/removeByTemplateUserAuthority',
        method: 'post',
        data
    })
}
export function delTemplateUserAuthoritys(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/templateUserAuthority/removeByIds',
        method: 'post',
        data
    })
}
export function getTemplateUserAuthorityList(query) {
    return request({
        url: '/manage/station/templateUserAuthority/pageByTemplateUserAuthority',
        method: 'get',
        params: query
    });
}
export function getUserAuthority(query) {
    return request({
        url: '/manage/station/templateUserAuthority/getUserAuthority',
        method: 'get',
        params: query
    });
}
export function setUserAuthority(query) {
    return request({
        url: '/manage/station/templateUserAuthority/setUserAuthority',
        method: 'get',
        params: query
    })
}
