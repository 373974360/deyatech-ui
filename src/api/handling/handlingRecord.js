import request from '@/router/axios';
export function getHandlingRecord(query) {
    return request({
        url: '/manage/handling/handlingRecord/getByHandlingRecord',
        method: 'get',
        params: query
    })
}

export function createOrUpdateHandlingRecord(handlingRecordVo){
    const data = handlingRecordVo;
    return request({
        url: '/manage/handling/handlingRecord/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delHandlingRecord(id) {
    const data = {id};
    return request({
        url: '/manage/handling/handlingRecord/removeByHandlingRecord',
        method: 'post',
        data
    })
}
export function delHandlingRecords(ids) {
    const data = {ids};
    return request({
        url: '/manage/handling/handlingRecord/removeByIds',
        method: 'post',
        data
    })
}
export function getHandlingRecordList(query) {
    return request({
        url: '/manage/handling/handlingRecord/pageByHandlingRecord',
        method: 'get',
        params: query
    });
}

export function markFinish(data) {
    return request({
        url: '/manage/handling/handlingRecord/markFinish',
        method: 'post',
        data
    })
}

export function getTakeUserInfo(query) {
    return request({
        url: '/manage/handling/handlingRecord/getTakeUserInfo',
        method: 'get',
        params: query
    });
}
