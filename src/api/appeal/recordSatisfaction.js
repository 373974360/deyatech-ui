import request from '@/router/axios';
export function getRecordSatisfaction(id) {
    return request({
        url: '/manage/appeal/recordSatisfaction/getByRecordSatisfaction',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateRecordSatisfaction(recordSatisfactionVo){
    const data = recordSatisfactionVo;
    return request({
        url: '/manage/appeal/recordSatisfaction/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delRecordSatisfaction(id) {
    const data = {id};
    return request({
        url: '/manage/appeal/recordSatisfaction/removeByRecordSatisfaction',
        method: 'post',
        data
    })
}
export function delRecordSatisfactions(ids) {
    const data = {ids};
    return request({
        url: '/manage/appeal/recordSatisfaction/removeByIds',
        method: 'post',
        data
    })
}
export function getRecordSatisfactionList(query) {
    return request({
        url: '/manage/appeal/recordSatisfaction/pageByRecordSatisfaction',
        method: 'get',
        params: query
    });
}


