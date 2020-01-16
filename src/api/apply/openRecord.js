import request from '@/router/axios';
export function getOpenRecord(id) {
    return request({
        url: '/manage/apply/openRecord/getByOpenRecord',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateOpenRecord(openRecordVo){
    const data = openRecordVo;
    return request({
        url: '/manage/apply/openRecord/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delOpenRecord(id) {
    const data = {id};
    return request({
        url: '/manage/apply/openRecord/removeByOpenRecord',
        method: 'post',
        data
    })
}
export function delOpenRecords(ids) {
    const data = {ids};
    return request({
        url: '/manage/apply/openRecord/removeByIds',
        method: 'post',
        data
    })
}
export function getOpenRecordList(query) {
    return request({
        url: '/manage/apply/openRecord/pageByOpenRecord',
        method: 'get',
        params: query
    });
}
export function getCompetentDept(query) {
    return request({
        url: '/manage/apply/openRecord/getCompetentDept',
        method: 'get',
        params: query
    });
}
export function reloadTreeData(query) {
    return request({
        url: '/manage/apply/openRecord/reloadTreeData',
        method: 'get',
        params: query
    });
}


