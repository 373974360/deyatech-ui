import request from '@/router/axios';
export function getPageType(id) {
    return request({
        url: '/manage/generate/pageType/getByPageType',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdatePageType(pageTypeVo){
    const data = pageTypeVo;
    return request({
        url: '/manage/generate/pageType/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delPageType(id) {
    const data = {id};
    return request({
        url: '/manage/generate/pageType/removeByPageType',
        method: 'post',
        data
    })
}
export function delPageTypes(ids) {
    const data = {ids};
    return request({
        url: '/manage/generate/pageType/removeByIds',
        method: 'post',
        data
    })
}
export function getPageTypeTree(query) {
    return request({
        url: '/manage/generate/pageType/getTree',
        method: 'get',
        params: query
    });
}

export function getPageTypeCascader(query) {
    return request({
        url: '/manage/generate/pageType/getCascader',
        method: 'get',
        params: query
    });
}

export function checkPageExist(id) {
    return request({
        url: '/manage/generate/pageType/checkPageExist',
        method: 'get',
        params: {id}
    })
}

export function getNextSortNo(id) {
    return request({
        url: '/manage/generate/pageType/getNextSortNo',
        method: 'get',
        params: {id}
    });
}



