import request from '@/router/axios';
export function getTemplateFormOrder(id) {
    return request({
        url: '/manage/station/templateFormOrder/getByTemplateFormOrder',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateTemplateFormOrder(templateFormOrderVo){
    const data = templateFormOrderVo;
    return request({
        url: '/manage/station/templateFormOrder/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delTemplateFormOrder(id) {
    const data = {id};
    return request({
        url: '/manage/station/templateFormOrder/removeByTemplateFormOrder',
        method: 'post',
        data
    })
}
export function delTemplateFormOrders(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/templateFormOrder/removeByIds',
        method: 'post',
        data
    })
}
export function getTemplateFormOrderList(query) {
    return request({
        url: '/manage/station/templateFormOrder/pageByTemplateFormOrder',
        method: 'get',
        params: query
    });
}
export function getSortDataByCollectionId(query) {
    return request({
        url: '/manage/station/templateFormOrder/getSortDataByCollectionId',
        method: 'get',
        params: query
    });
}

export function saveOrUpdateByJson(json) {
    const data = {json};
    return request({
        url: '/manage/station/templateFormOrder/saveOrUpdateByJson',
        method: 'post',
        data
    })
}

export function getCollectionList(query) {
    return request({
        url: '/manage/station/templateFormOrder/getCollectionList',
        method: 'get',
        params: query
    });
}
