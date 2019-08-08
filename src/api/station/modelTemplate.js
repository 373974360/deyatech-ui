import request from '@/router/axios';
export function getModelTemplate(id) {
    return request({
        url: '/manage/station/modelTemplate/getByModelTemplate',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateModelTemplate(modelTemplateVo){
    const data = modelTemplateVo;
    return request({
        url: '/manage/station/modelTemplate/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delModelTemplate(id) {
    const data = {id};
    return request({
        url: '/manage/station/modelTemplate/removeByModelTemplate',
        method: 'post',
        data
    })
}
export function delModelTemplates(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/modelTemplate/removeByIds',
        method: 'post',
        data
    })
}
export function getModelTemplateList(query) {
    return request({
        url: '/manage/station/modelTemplate/pageByModelTemplate',
        method: 'get',
        params: query
    });
}

export function getAllModelTemplate(query) {
    return request({
        url: '/manage/station/modelTemplate/listByModelTemplate',
        method: 'get',
        params: query
    })
}

export function createOrUpdateModelTemplateBatch(modelTemplates){
    const data = {modelTemplates};
    return request({
        url: '/manage/station/modelTemplate/saveOrUpdateBatch',
        method: 'post',
        data
    })
}

export function pageByModelTemplateGroupBySite(query) {
    return request({
        url: '/manage/station/modelTemplate/pageByModelTemplateGroupBySite',
        method: 'get',
        params: query
    });
}

export function checkSiteContentModelExist(query) {
    return request({
        url: '/manage/station/modelTemplate/checkSiteContentModelExist',
        method: 'get',
        params: query
    })
}

export function removeByModelTemplateVo(modelTemplateVo) {
    const data = {modelTemplateVo};
    return request({
        url: '/manage/station/modelTemplate/removeByModelTemplateVo',
        method: 'post',
        data
    })
}
