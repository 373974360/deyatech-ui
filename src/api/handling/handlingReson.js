import request from '@/router/axios';
export function getHandlingReson(id) {
    return request({
        url: '/manage/handling/handlingReson/getByHandlingReson',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateHandlingReson(handlingResonVo){
    const data = handlingResonVo;
    return request({
        url: '/manage/handling/handlingReson/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delHandlingReson(id) {
    const data = {id};
    return request({
        url: '/manage/handling/handlingReson/removeByHandlingReson',
        method: 'post',
        data
    })
}
export function delHandlingResons(ids) {
    const data = {ids};
    return request({
        url: '/manage/handling/handlingReson/removeByIds',
        method: 'post',
        data
    })
}
export function getHandlingResonList(query) {
    return request({
        url: '/manage/handling/handlingReson/pageByHandlingReson',
        method: 'get',
        params: query
    });
}


