import request from '@/router/axios';
export function getOpenModel(id) {
    return request({
        url: '/manage/apply/openModel/getByOpenModel',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateOpenModel(modelVo){
    const data = modelVo;
    return request({
        url: '/manage/apply/openModel/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delOpenModel(id) {
    const data = {id};
    return request({
        url: '/manage/apply/openModel/removeByOpenModel',
        method: 'post',
        data
    })
}
export function delOpenModels(ids) {
    const data = {ids};
    return request({
        url: '/manage/apply/openModel/removeByIds',
        method: 'post',
        data
    })
}
export function getOpenModelList(query) {
    return request({
        url: '/manage/apply/openModel/pageByOpenModel',
        method: 'get',
        params: query
    });
}
export function getOpenModeAllList(query) {
    return request({
        url: '/manage/apply/openModel/listByOpenModel',
        method: 'get',
        params: query
    });
}
export function getOpenModelByCompetentDeptId(query) {
    return request({
        url: '/manage/apply/openModel/listModelByCompetentDeptId',
        method: 'get',
        params: query
    });
}
export function getDepartmentTreeBySiteId(query) {
    return request({
        url: '/manage/apply/openModel/getDepartmentTreeBySiteId',
        method: 'get',
        params: query
    });
}
