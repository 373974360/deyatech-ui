import request from '@/router/axios';
export function getPreorderConfig(id) {
    return request({
        url: '/manage/number/preorderConfig/getByPreorderConfig',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdatePreorderConfig(preorderConfigVo){
    const data = preorderConfigVo;
    return request({
        url: '/manage/number/preorderConfig/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delPreorderConfig(id) {
    const data = {id};
    return request({
        url: '/manage/number/preorderConfig/removeByPreorderConfig',
        method: 'post',
        data
    })
}
export function delPreorderConfigs(ids) {
    const data = {ids};
    return request({
        url: '/manage/number/preorderConfig/removeByIds',
        method: 'post',
        data
    })
}
export function getPreorderConfigList(query) {
    return request({
        url: '/manage/number/preorderConfig/pageByPreorderConfig',
        method: 'get',
        params: query
    });
}

export function listByPreorderConfig(query) {
    return request({
        url: '/manage/number/preorderConfig/listByPreorderConfig',
        method: 'get',
        params: query
    });
}

export function getByPreorderConfig(query) {
    return request({
        url: '/manage/number/preorderConfig/getByPreorderConfig',
        method: 'get',
        params: query
    });
}

export function saveOrUpdateBatchPreorderConfig(itemIds, preorderConfigListStr){
    const data = {itemIds, preorderConfigListStr};
    return request({
        url: '/manage/number/preorderConfig/saveOrUpdateBatch',
        method: 'post',
        data
    })
}

export function saveOrUpdate(preorderConfigVo){
    const data = preorderConfigVo;
    return request({
        url: '/manage/number/preorderConfig/saveOrUpdateBatch',
        method: 'post',
        data
    })
}
