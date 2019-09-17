import request from '@/router/axios';
export function getModel(id) {
    return request({
        url: '/manage/station/model/getByModel',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateModel(modelVo){
    const data = modelVo;
    return request({
        url: '/manage/station/model/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delModel(id) {
    const data = {id};
    return request({
        url: '/manage/station/model/removeByModel',
        method: 'post',
        data
    })
}
export function delModels(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/model/removeByIds',
        method: 'post',
        data
    })
}
export function getAllModel(query) {
    return request({
        url: '/manage/station/model/listByModel',
        method: 'get',
        params: query
    });
}
export function getModelList(query) {
    return request({
        url: '/manage/station/model/pageByModel',
        method: 'get',
        params: query
    });
}

export function checkNameExist(query) {
    return request({
        url: '/manage/station/model/checkNameExist',
        method: 'get',
        params: query
    });
}

export function checkEnglishNameExist(query) {
    return request({
        url: '/manage/station/model/checkEnglishNameExist',
        method: 'get',
        params: query
    });
}

export function getAllModelBySiteId(query) {
    return request({
        url: '/manage/station/model/getAllModelBySiteId',
        method: 'get',
        params: query
    });
}

export function getAllIndexName(query) {
    return request({
        url: '/manage/station/model/getAllIndexName',
        method: 'get',
        params: query
    });
}
