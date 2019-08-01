import request from '@/router/axios';
export function getPreorder(id) {
    return request({
        url: '/manage/number/preorder/getByPreorder',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdatePreorder(preorderVo){
    const data = preorderVo;
    return request({
        url: '/manage/number/preorder/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delPreorder(id) {
    const data = {id};
    return request({
        url: '/manage/number/preorder/removeByPreorder',
        method: 'post',
        data
    })
}
export function delPreorders(ids) {
    const data = {ids};
    return request({
        url: '/manage/number/preorder/removeByIds',
        method: 'post',
        data
    })
}
export function getPreorderList(query) {
    return request({
        url: '/manage/number/preorder/pageByPreorder',
        method: 'get',
        params: query
    });
}


