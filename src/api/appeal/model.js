import request from '@/router/axios';
export function getModel(id) {
    return request({
        url: '/manage/appeal/model/getByModel',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateModel(modelVo){
    const data = modelVo;
    return request({
        url: '/manage/appeal/model/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delModel(id) {
    const data = {id};
    return request({
        url: '/manage/appeal/model/removeByModel',
        method: 'post',
        data
    })
}
export function delModels(ids) {
    const data = {ids};
    return request({
        url: '/manage/appeal/model/removeByIds',
        method: 'post',
        data
    })
}
export function getModelList(query) {
    return request({
        url: '/manage/appeal/model/pageByModel',
        method: 'get',
        params: query
    });
}
export function getModeAllList(query) {
    return request({
        url: '/manage/appeal/model/listByModel',
        method: 'get',
        params: query
    });
}

export function getModelByCompetentDeptId(query) {
    return request({
        url: '/manage/appeal/model/listModelByCompetentDeptId',
        method: 'get',
        params: query
    });
}
export function countModelByDepartmentId(departmentIds) {
    const data = {departmentIds};
    return request({
        url: '/manage/appeal/model/countModelByDepartmentId',
        method: 'post',
        data
    });
}
export function getDepartmentTreeBySiteId(query) {
    return request({
        url: '/manage/appeal/model/getDepartmentTreeBySiteId',
        method: 'get',
        params: query
    });
}
