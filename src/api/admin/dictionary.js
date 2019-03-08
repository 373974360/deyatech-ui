import request from '@/router/axios';

export function getDictionary(id) {
    return request({
        url: '/manage/admin/dictionary/getByDictionary',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateDictionary(dictionaryVo) {
    const data = dictionaryVo;
    return request({
        url: '/manage/admin/dictionary/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delDictionary(id) {
    const data = {id};
    return request({
        url: '/manage/admin/dictionary/removeByDictionary',
        method: 'post',
        data
    })
}

export function delDictionarys(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/dictionary/removeByIds',
        method: 'post',
        data
    })
}

export function getDictionaryList(query) {
    return request({
        url: '/manage/admin/dictionary/pageByDictionary',
        method: 'get',
        params: query
    });
}


