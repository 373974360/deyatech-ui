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
export function recycleByIds(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/template/recycleByIds',
        method: 'post',
        data
    })
}
export function cancelByIds(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/template/cancelByIds',
        method: 'post',
        data
    })
}
export function updateSortNoById(query) {
    return request({
        url: '/manage/station/template/updateSortNoById',
        method: 'get',
        params: query
    });
}
export function updateFlagTopById(query) {
    return request({
        url: '/manage/station/template/updateFlagTopById',
        method: 'get',
        params: query
    });
}
export function keyword(submit) {
    const data = submit;
    return request({
        url: '/manage/station/template/keyword',
        method: 'post',
        data
    });
}
export function summary(submit) {
    const data = submit;
    return request({
        url: '/manage/station/template/summary',
        method: 'post',
        data
    });
}
export function getDynamicForm(query) {
    return request({
        url: '/manage/station/template/getDynamicForm',
        method: 'get',
        params: query
    });
}
export function getBaseAndMetaField(query) {
    return request({
        url: '/manage/station/template/getBaseAndMetaField',
        method: 'get',
        params: query
    });
}
