import request from '@/router/axios';
export function getApplyOpenProcess(id) {
    return request({
        url: '/manage/assembly/applyOpenProcess/getByApplyOpenProcess',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateApplyOpenProcess(applyOpenProcessVo){
    const data = applyOpenProcessVo;
    return request({
        url: '/manage/assembly/applyOpenProcess/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delApplyOpenProcess(id) {
    const data = {id};
    return request({
        url: '/manage/assembly/applyOpenProcess/removeByApplyOpenProcess',
        method: 'post',
        data
    })
}
export function delApplyOpenProcesss(ids) {
    const data = {ids};
    return request({
        url: '/manage/assembly/applyOpenProcess/removeByIds',
        method: 'post',
        data
    })
}
export function getApplyOpenProcessList(query) {
    return request({
        url: '/manage/assembly/applyOpenProcess/pageByApplyOpenProcess',
        method: 'get',
        params: query
    });
}
export function getProcessAllList(query) {
    return request({
        url: '/manage/assembly/applyOpenProcess/listByApplyOpenProcess',
        method: 'get',
        params: query
    });
}


