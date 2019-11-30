import request from '@/router/axios';
export function getModel(id) {
    return request({
        url: '/manage/assembly/applyOpenModel/getByApplyOpenModel',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateModel(modelVo){
    const data = modelVo;
    return request({
        url: '/manage/assembly/applyOpenModel/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delModel(id) {
    const data = {id};
    return request({
        url: '/manage/assembly/applyOpenModel/removeByApplyOpenModel',
        method: 'post',
        data
    })
}
export function delModels(ids) {
    const data = {ids};
    return request({
        url: '/manage/assembly/applyOpenModel/removeByIds',
        method: 'post',
        data
    })
}
export function getModelList(query) {
    return request({
        url: '/manage/assembly/applyOpenModel/pageByApplyOpenModel',
        method: 'get',
        params: query
    });
}
export function getModeAllList(query) {
    return request({
        url: '/manage/assembly/applyOpenModel/listByApplyOpenModel',
        method: 'get',
        params: query
    });
}

export function getModelByCompetentDeptId(query) {
    return request({
        url: '/manage/assembly/applyOpenModel/listModelByCompetentDeptId',
        method: 'get',
        params: query
    });
}

