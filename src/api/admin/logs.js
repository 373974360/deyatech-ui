import request from '@/router/axios';

export function getLogs(id) {
    return request({
        url: '/manage/admin/logs/getByLogs',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateLogs(logsVo) {
    const data = logsVo;
    return request({
        url: '/manage/admin/logs/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delLogs(id) {
    const data = {id};
    return request({
        url: '/manage/admin/logs/removeByLogs',
        method: 'post',
        data
    })
}

export function delLogss(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/logs/removeByIds',
        method: 'post',
        data
    })
}

export function getLogsList(query) {
    return request({
        url: '/manage/admin/logs/pageByLogs',
        method: 'get',
        params: query
    });
}



export function getUserList(query) {
    return request({
        url: '/manage/admin/user/listByUser',
        method: 'get',
        params: query
    });
}


