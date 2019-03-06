import request from '@/router/axios';
export function getDictIndex(id) {
    return request({
        url: '/manage/admin/dictIndex/getByDictIndex',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateDictIndex(dictIndexVo){
    const data = dictIndexVo;
    return request({
        url: '/manage/admin/dictIndex/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delDictIndex(id) {
    const data = {id};
    return request({
        url: '/manage/admin/dictIndex/removeByDictIndex',
        method: 'post',
        data
    })
}
export function delDictIndexs(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/dictIndex/removeByIds',
        method: 'post',
        data
    })
}
export function getDictIndexList(query) {
    return request({
        url: '/manage/admin/dictIndex/pageByDictIndex',
        method: 'get',
        params: query
    });
}


