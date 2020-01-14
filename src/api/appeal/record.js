import request from '@/router/axios';
export function getRecord(id) {
    return request({
        url: '/manage/appeal/record/getByRecord',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateRecord(recordVo){
    const data = recordVo;
    return request({
        url: '/manage/appeal/record/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delRecord(id) {
    const data = {id};
    return request({
        url: '/manage/appeal/record/removeByRecord',
        method: 'post',
        data
    })
}
export function delRecords(ids) {
    const data = {ids};
    return request({
        url: '/manage/appeal/record/removeByIds',
        method: 'post',
        data
    })
}
export function getRecordList(query) {
    return request({
        url: '/manage/appeal/record/pageByRecord',
        method: 'get',
        params: query
    });
}
export function getCompetentDept(query) {
    return request({
        url: '/manage/appeal/record/getCompetentDept',
        method: 'get',
        params: query
    });
}
export function listRepeatByRecord(query) {
    return request({
        url: '/manage/appeal/record/listRepeatByRecord',
        method: 'get',
        params: query
    });
}
export function reloadTreeData(query) {
    return request({
        url: '/manage/appeal/record/reloadTreeData',
        method: 'get',
        params: query
    });
}



