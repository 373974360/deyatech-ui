import request from '@/router/axios';
export function getApplyOpenRecord(id) {
    return request({
        url: '/manage/assembly/applyOpenRecord/getByApplyOpenRecord',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateApplyOpenRecord(applyOpenRecordVo){
    const data = applyOpenRecordVo;
    return request({
        url: '/manage/assembly/applyOpenRecord/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delApplyOpenRecord(id) {
    const data = {id};
    return request({
        url: '/manage/assembly/applyOpenRecord/removeByApplyOpenRecord',
        method: 'post',
        data
    })
}
export function delApplyOpenRecords(ids) {
    const data = {ids};
    return request({
        url: '/manage/assembly/applyOpenRecord/removeByIds',
        method: 'post',
        data
    })
}
export function getApplyOpenRecordList(query) {
    return request({
        url: '/manage/assembly/applyOpenRecord/pageByApplyOpenRecord',
        method: 'get',
        params: query
    });
}
export function getCompetentDept(query) {
    return request({
        url: '/manage/assembly/applyOpenRecord/getCompetentDept',
        method: 'get',
        params: query
    });
}


