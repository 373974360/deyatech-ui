import request from '@/router/axios';
export function getSatisfaction(id) {
    return request({
        url: '/manage/appeal/satisfaction/getBySatisfaction',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateSatisfaction(satisfactionVo){
    const data = satisfactionVo;
    return request({
        url: '/manage/appeal/satisfaction/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delSatisfaction(id) {
    const data = {id};
    return request({
        url: '/manage/appeal/satisfaction/removeBySatisfaction',
        method: 'post',
        data
    })
}
export function delSatisfactions(ids) {
    const data = {ids};
    return request({
        url: '/manage/appeal/satisfaction/removeByIds',
        method: 'post',
        data
    })
}
export function getSatisfactionList(query) {
    return request({
        url: '/manage/appeal/satisfaction/pageBySatisfaction',
        method: 'get',
        params: query
    });
}


