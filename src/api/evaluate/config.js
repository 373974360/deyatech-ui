import request from '@/router/axios';
export function getConfig(id) {
    return request({
        url: '/manage/evaluate/config/getByConfig',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateConfig(configVo){
    const data = configVo;
    return request({
        url: '/manage/evaluate/config/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delConfig(id) {
    const data = {id};
    return request({
        url: '/manage/evaluate/config/removeByConfig',
        method: 'post',
        data
    })
}
export function delConfigs(ids) {
    const data = {ids};
    return request({
        url: '/manage/evaluate/config/removeByIds',
        method: 'post',
        data
    })
}
export function getConfigList(query) {
    return request({
        url: '/manage/evaluate/config/pageByConfig',
        method: 'get',
        params: query
    });
}

export function getEvaluateConfig(query) {
    return request({
        url: '/manage/evaluate/config/getEvaluateConfig',
        method: 'get',
        params: query
    });
}

export function delConfigsByLevel(levels) {
    const data = {levels};
    return request({
        url: '/manage/evaluate/config/removeByLevels',
        method: 'post',
        data
    })
}
