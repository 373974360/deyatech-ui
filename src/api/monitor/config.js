import request from '@/router/axios';
export function getConfig(id) {
    return request({
        url: '/manage/monitor/config/getByConfig',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateConfig(configVo){
    const data = configVo;
    return request({
        url: '/manage/monitor/config/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delConfig(id) {
    const data = {id};
    return request({
        url: '/manage/monitor/config/removeByConfig',
        method: 'post',
        data
    })
}
export function delConfigs(ids) {
    const data = {ids};
    return request({
        url: '/manage/monitor/config/removeByIds',
        method: 'post',
        data
    })
}
export function getConfigList(query) {
    return request({
        url: '/manage/monitor/config/pageByConfig',
        method: 'get',
        params: query
    });
}


