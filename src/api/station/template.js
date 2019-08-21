import request from '@/router/axios';
export function getTemplate(id) {
    return request({
        url: '/manage/station/template/getByTemplate',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateTemplate(templateVo){
    const data = templateVo;
    return request({
        url: '/manage/station/template/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delTemplate(id) {
    const data = {id};
    return request({
        url: '/manage/station/template/removeByTemplate',
        method: 'post',
        data
    })
}
export function delTemplates(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/template/removeByIds',
        method: 'post',
        data
    })
}
export function getTemplateList(query) {
    return request({
        url: '/manage/station/template/pageByTemplate',
        method: 'get',
        params: query
    });
}

export function checkTitleExist(query) {
    return request({
        url: '/manage/station/template/checkTitleExist',
        method: 'get',
        params: query
    });
}

export function genStaticPage(params) {
    return request({
        url: '/manage/station/template/genStaticPage',
        method: 'get',
        params: params
    });
}

export function reindex(params) {
    return request({
        url: '/manage/station/template/reindex',
        method: 'get',
        params: params
    });
}

export function updateContentStatus(id){
    const data = {id};
    return request({
        url: '/manage/station/template/updateContentStatus',
        method: 'post',
        data
    })
}
