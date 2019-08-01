import request from '@/router/axios';
export function getCall(id) {
    return request({
        url: '/manage/number/call/getByCall',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateCall(callVo){
    const data = callVo;
    return request({
        url: '/manage/number/call/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delCall(id) {
    const data = {id};
    return request({
        url: '/manage/number/call/removeByCall',
        method: 'post',
        data
    })
}
export function delCalls(ids) {
    const data = {ids};
    return request({
        url: '/manage/number/call/removeByIds',
        method: 'post',
        data
    })
}
export function getCallList(query) {
    return request({
        url: '/manage/number/call/pageByCall',
        method: 'get',
        params: query
    });
}


