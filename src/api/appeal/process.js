import request from '@/router/axios';
export function getProcess(id) {
    return request({
        url: '/manage/appeal/process/getByProcess',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateProcess(processVo){
    const data = processVo;
    return request({
        url: '/manage/appeal/process/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delProcess(id) {
    const data = {id};
    return request({
        url: '/manage/appeal/process/removeByProcess',
        method: 'post',
        data
    })
}
export function delProcesss(ids) {
    const data = {ids};
    return request({
        url: '/manage/appeal/process/removeByIds',
        method: 'post',
        data
    })
}
export function getProcessList(query) {
    return request({
        url: '/manage/appeal/process/pageByProcess',
        method: 'get',
        params: query
    });
}
export function getProcessAllList(query) {
    return request({
        url: '/manage/appeal/process/listByProcess',
        method: 'get',
        params: query
    });
}
export function setRepeatProcess(ids) {
    const data = {ids};
    return request({
        url: '/manage/appeal/process/setRepeatProcess',
        method: 'post',
        data
    })
}


