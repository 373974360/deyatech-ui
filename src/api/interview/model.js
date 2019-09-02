import request from '@/router/axios';
export function getModel(id) {
    return request({
        url: '/manage/interview/model/getByModel',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateModel(modelVo){
    const data = modelVo;
    return request({
        url: '/manage/interview/model/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delModel(id) {
    const data = {id};
    return request({
        url: '/manage/interview/model/removeByModel',
        method: 'post',
        data
    })
}
export function delModels(ids) {
    const data = {ids};
    return request({
        url: '/manage/interview/model/removeByIds',
        method: 'post',
        data
    })
}
export function getModelList(query) {
    return request({
        url: '/manage/interview/model/pageByModel',
        method: 'get',
        params: query
    });
}
export function getAllModelList(query) {
    return request({
        url: '/manage/interview/model/listByModel',
        method: 'get',
        params: query
    });
}
export function getModelListByCategoryAndName(query) {
    return request({
        url: '/manage/interview/model/pageByCategoryAndName',
        method: 'get',
        params: query
    });
}
export function operateLiveMessage(query) {
    return request({
        url: '/manage/interview/model/operateLiveMessage',
        method: 'get',
        params: query
    });
}
export function operateLiveImage(query) {
    return request({
        url: '/manage/interview/model/operateLiveImage',
        method: 'get',
        params: query
    });
}
