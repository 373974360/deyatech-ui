import request from '@/router/axios';

export function getDictionaryIndex(id) {
    return request({
        url: '/manage/admin/dictionaryIndex/getByDictionaryIndex',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateDictionaryIndex(dictionaryIndexVo) {
    const data = dictionaryIndexVo;
    return request({
        url: '/manage/admin/dictionaryIndex/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delDictionaryIndex(id) {
    const data = {id};
    return request({
        url: '/manage/admin/dictionaryIndex/removeByDictionaryIndex',
        method: 'post',
        data
    })
}

export function delDictionaryIndexs(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/dictionaryIndex/removeByIds',
        method: 'post',
        data
    })
}

export function getDictionaryIndexList(query) {
    return request({
        url: '/manage/admin/dictionaryIndex/pageByDictionaryIndex',
        method: 'get',
        params: query
    });
}

export function getAllDictionaryIndex(query) {
    return request({
        url: '/manage/admin/dictionaryIndex/listByDictionaryIndex',
        method: 'get',
        params: query
    })
}
