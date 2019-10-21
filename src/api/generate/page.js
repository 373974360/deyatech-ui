import request from '@/router/axios';
export function getPage(id) {
    return request({
        url: '/manage/generate/page/getByPage',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdatePage(pageVo){
    const data = pageVo;
    return request({
        url: '/manage/generate/page/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delPage(id) {
    const data = {id};
    return request({
        url: '/manage/generate/page/removeByPage',
        method: 'post',
        data
    })
}
export function delPages(ids) {
    const data = {ids};
    return request({
        url: '/manage/generate/page/removeByIds',
        method: 'post',
        data
    })
}
export function getPageList(query) {
    return request({
        url: '/manage/generate/page/pageByPage',
        method: 'get',
        params: query
    });
}
export function existsPagePath(query) {
    return request({
        url: '/manage/generate/page/existsPagePath',
        method: 'get',
        params: query
    })
}
export function existsTemplatePath(query) {
    return request({
        url: '/manage/generate/page/existsTemplatePath',
        method: 'get',
        params: query
    })
}
export function replay(pageVo){
    const data = pageVo;
    return request({
        url: '/manage/generate/page/replay',
        method: 'post',
        data
    })
}

