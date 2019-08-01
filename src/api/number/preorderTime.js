import request from '@/router/axios';
export function getPreorderTime(id) {
    return request({
        url: '/manage/number/preorderTime/getByPreorderTime',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdatePreorderTime(preorderTimeVo){
    const data = preorderTimeVo;
    return request({
        url: '/manage/number/preorderTime/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delPreorderTime(id) {
    const data = {id};
    return request({
        url: '/manage/number/preorderTime/removeByPreorderTime',
        method: 'post',
        data
    })
}
export function delPreorderTimes(ids) {
    const data = {ids};
    return request({
        url: '/manage/number/preorderTime/removeByIds',
        method: 'post',
        data
    })
}
export function getPreorderTimeList(query) {
    return request({
        url: '/manage/number/preorderTime/pageByPreorderTime',
        method: 'get',
        params: query
    });
}
export function getListByPreorderTime(query) {
    return request({
        url: '/manage/number/preorderTime/listByPreorderTime',
        method: 'get',
        params: query
    });
}

