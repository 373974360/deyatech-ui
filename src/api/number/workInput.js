import request from '@/router/axios';
export function getWorkInput(id) {
    return request({
        url: '/manage/number/workInput/getByWorkInput',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateWorkInput(workInputVo){
    const data = workInputVo;
    return request({
        url: '/manage/number/workInput/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delWorkInput(id) {
    const data = {id};
    return request({
        url: '/manage/number/workInput/removeByWorkInput',
        method: 'post',
        data
    })
}
export function delWorkInputs(ids) {
    const data = {ids};
    return request({
        url: '/manage/number/workInput/removeByIds',
        method: 'post',
        data
    })
}
export function getWorkInputList(query) {
    return request({
        url: '/manage/number/workInput/pageByWorkInput',
        method: 'get',
        params: query
    });
}


