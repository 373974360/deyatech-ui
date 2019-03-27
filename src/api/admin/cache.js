import request from '@/router/axios';

export function getCacheList(query) {
    return request({
        url: '/manage/admin/cache/list',
        method: 'get',
        params: query
    });
}

export function delCacheKeys(keys) {
    const data = {keys};
    return request({
        url: '/manage/admin/cache/del',
        method: 'post',
        data
    })
}

export function flushCache() {
    return request({
        url: '/manage/admin/cache/flush',
        method: 'post'
    })
}

