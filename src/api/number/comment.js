import request from '@/router/axios';
export function getComment(id) {
    return request({
        url: '/manage/number/comment/getByComment',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateComment(commentVo){
    const data = commentVo;
    return request({
        url: '/manage/number/comment/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delComment(id) {
    const data = {id};
    return request({
        url: '/manage/number/comment/removeByComment',
        method: 'post',
        data
    })
}
export function delComments(ids) {
    const data = {ids};
    return request({
        url: '/manage/number/comment/removeByIds',
        method: 'post',
        data
    })
}
export function getCommentList(query) {
    return request({
        url: '/manage/number/comment/pageByComment',
        method: 'get',
        params: query
    });
}


