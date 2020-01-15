import request from '@/router/axios';
export function getCatalogTemplate(id) {
    return request({
        url: '/manage/station/catalogTemplate/getByCatalogTemplate',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateCatalogTemplate(catalogTemplateVo){
    const data = catalogTemplateVo;
    return request({
        url: '/manage/station/catalogTemplate/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delCatalogTemplate(id) {
    const data = {id};
    return request({
        url: '/manage/station/catalogTemplate/removeByCatalogTemplate',
        method: 'post',
        data
    })
}
export function delCatalogTemplates(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/catalogTemplate/removeByIds',
        method: 'post',
        data
    })
}
export function getCatalogTemplateList(query) {
    return request({
        url: '/manage/station/catalogTemplate/pageByCatalogTemplate',
        method: 'get',
        params: query
    });
}


