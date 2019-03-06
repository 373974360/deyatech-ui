import request from '@/router/axios';
export function getDict(id) {
    return request({
        url: '/manage/admin/dict/getByDict',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateDict(dictVo){
    const data = dictVo;
    return request({
        url: '/manage/admin/dict/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delDict(id) {
    const data = {id};
    return request({
        url: '/manage/admin/dict/removeByDict',
        method: 'post',
        data
    })
}
export function delDicts(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/dict/removeByIds',
        method: 'post',
        data
    })
}
export function getDictList(query) {
    return request({
        url: '/manage/admin/dict/pageByDict',
        method: 'get',
        params: query
    });
}


