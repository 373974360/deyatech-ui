import request from '@/router/axios';

export function getProcessModel(id) {
    return request({
        url: '/manage/workflow/processModel/getByProcessModel',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateProcessModel(processModelVo){
    const data = processModelVo;
    return request({
        url: '/manage/workflow/processModel/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delProcessModel(id) {
    const data = {id};
    return request({
        url: '/manage/workflow/processModel/removeByProcessModel',
        method: 'post',
        data
    })
}
export function delProcessModels(ids) {
    const data = {ids};
    return request({
        url: '/manage/workflow/processModel/removeByIds',
        method: 'post',
        data
    })
}
export function getProcessModelList(query) {
    return request({
        url: '/manage/workflow/processModel/pageByProcessModel',
        method: 'get',
        params: query
    });
}

export function modelDeploy(actModelIds) {
    return request({
        url: '/manage/workflow/processModel/deploy',
        method: 'post',
        data: {actModelIds}
    })
}
