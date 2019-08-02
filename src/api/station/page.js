import request from '@/router/axios';
export function getPage(id) {
    return request({
        url: '/manage/station/page/getByPage',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdatePage(pageVo){
    const data = pageVo;
    return request({
        url: '/manage/station/page/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delPage(id) {
    const data = {id};
    return request({
        url: '/manage/station/page/removeByPage',
        method: 'post',
        data
    })
}
export function delPages(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/page/removeByIds',
        method: 'post',
        data
    })
}
export function getPageList(query) {
    return request({
        url: '/manage/station/page/pageByPage',
        method: 'get',
        params: query
    });
}
export function existsPagePath(query) {
    return request({
        url: '/manage/station/page/existsPagePath',
        method: 'get',
        params: query
    })
}

