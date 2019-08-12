import request from '@/router/axios';
export function getGroup(id) {
    return request({
        url: '/manage/monitor/group/getByGroup',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateGroup(groupVo){
    const data = groupVo;
    return request({
        url: '/manage/monitor/group/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delGroup(id) {
    const data = {id};
    return request({
        url: '/manage/monitor/group/removeByGroup',
        method: 'post',
        data
    })
}
export function delGroups(ids) {
    const data = {ids};
    return request({
        url: '/manage/monitor/group/removeByIds',
        method: 'post',
        data
    })
}
export function getGroupList(query) {
    return request({
        url: '/manage/monitor/group/pageByGroup',
        method: 'get',
        params: query
    });
}


