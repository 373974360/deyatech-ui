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
        url: '/manage/admin/dictionary/listByDictionary',
        method: 'get',
        params: query
    });
}
export function getDictionaryListAlias(query) {
    return request({
        url: '/manage/admin/dictionary/aliasListByDictionary',
        method: 'get',
        params: query
    });
}
export function getNextSortNo(indexId) {
    return request({
        url: '/manage/admin/dictionary/getNextSortNo',
        method: 'get',
        params: {indexId}
    });
}

export function getDictionaryTree(query) {
    return request({
        url: '/manage/admin/dictionary/getTree',
        method: 'get',
        params: query
    });
}

export function getDictionaryCascader(query) {
    return request({
        url: '/manage/admin/dictionary/getCascader',
        method: 'get',
        params: query
    });
}
