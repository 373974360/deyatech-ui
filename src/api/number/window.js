import request from '@/router/axios';
export function getWindow(id) {
    return request({
        url: '/manage/number/window/getByWindow',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateWindow(windowVo){
    const data = windowVo;
    return request({
        url: '/manage/number/window/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delWindow(id) {
    const data = {id};
    return request({
        url: '/manage/number/window/removeByWindow',
        method: 'post',
        data
    })
}
export function delWindows(ids) {
    const data = {ids};
    return request({
        url: '/manage/number/window/removeByIds',
        method: 'post',
        data
    })
}
export function getWindowList(query) {
    return request({
        url: '/manage/number/window/pageByWindow',
        method: 'get',
        params: query
    });
}
export function getAllWindows(query) {
    return request({
        url: '/manage/number/window/listByWindow',
        method: 'get',
        params: query
    });
}

