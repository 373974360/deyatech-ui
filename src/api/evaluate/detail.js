import request from '@/router/axios';
export function getDetail(id) {
    return request({
        url: '/manage/evaluate/detail/getByDetail',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateDetail(detailVo){
    const data = detailVo;
    return request({
        url: '/manage/evaluate/detail/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delDetail(id) {
    const data = {id};
    return request({
        url: '/manage/evaluate/detail/removeByDetail',
        method: 'post',
        data
    })
}
export function delDetails(ids) {
    const data = {ids};
    return request({
        url: '/manage/evaluate/detail/removeByIds',
        method: 'post',
        data
    })
}
export function getDetailList(query) {
    return request({
        url: '/manage/evaluate/detail/pageByDetail',
        method: 'get',
        params: query
    });
}

export function getReplyDetailList(query) {
    return request({
        url: '/manage/evaluate/detail/pageReplyByDetail',
        method: 'get',
        params: query
    });
}

export function saveReply(detailVo){
    const data = detailVo;
    return request({
        url: '/manage/evaluate/detail/saveReply',
        method: 'post',
        data
    })
}
