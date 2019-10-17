import request from '@/router/axios';
export function getApplyOpenModel(id) {
    return request({
        url: '/manage/assembly/applyOpenModel/getByApplyOpenModel',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateApplyOpenModel(applyOpenModelVo){
    const data = applyOpenModelVo;
    return request({
        url: '/manage/assembly/applyOpenModel/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delApplyOpenModel(id) {
    const data = {id};
    return request({
        url: '/manage/assembly/applyOpenModel/removeByApplyOpenModel',
        method: 'post',
        data
    })
}
export function delApplyOpenModels(ids) {
    const data = {ids};
    return request({
        url: '/manage/assembly/applyOpenModel/removeByIds',
        method: 'post',
        data
    })
}
export function getApplyOpenModelList(query) {
    return request({
        url: '/manage/assembly/applyOpenModel/pageByApplyOpenModel',
        method: 'get',
        params: query
    });
}
export function getAllApplyOpenModelList(query) {
    return request({
        url: '/manage/assembly/applyOpenModel/listByApplyOpenModel',
        method: 'get',
        params: query
    });
}


