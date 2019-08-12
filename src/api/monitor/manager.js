import request from '@/router/axios';
export function getManager(id) {
    return request({
        url: '/manage/monitor/manager/getByManager',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateManager(managerVo){
    const data = managerVo;
    return request({
        url: '/manage/monitor/manager/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delManager(id) {
    const data = {id};
    return request({
        url: '/manage/monitor/manager/removeByManager',
        method: 'post',
        data
    })
}
export function delManagers(ids) {
    const data = {ids};
    return request({
        url: '/manage/monitor/manager/removeByIds',
        method: 'post',
        data
    })
}
export function getManagerList(query) {
    return request({
        url: '/manage/monitor/manager/pageByManager',
        method: 'get',
        params: query
    });
}


