import request from '@/router/axios';
export function getPreauditRecord(id) {
    return request({
        url: '/manage/preaudit/preauditRecord/getByPreauditRecord',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdatePreauditRecord(preauditRecordVo){
    const data = preauditRecordVo;
    return request({
        url: '/manage/preaudit/preauditRecord/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delPreauditRecord(id) {
    const data = {id};
    return request({
        url: '/manage/preaudit/preauditRecord/removeByPreauditRecord',
        method: 'post',
        data
    })
}
export function delPreauditRecords(ids) {
    const data = {ids};
    return request({
        url: '/manage/preaudit/preauditRecord/removeByIds',
        method: 'post',
        data
    })
}
export function getPreauditRecordList(query) {
    return request({
        url: '/manage/preaudit/preauditRecord/pageByPreauditRecord',
        method: 'get',
        params: query
    });
}

export function getUserDetailsById(query) {
    return request({
        url: '/manage/preaudit/preauditRecord/getUserDetailsById',
        method: 'get',
        params: query
    });
}


