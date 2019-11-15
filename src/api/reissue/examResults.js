import request from '@/router/axios';
export function getExamResults(query) {
    return request({
        url: '/manage/reissue/examResults/getByExamResults',
        method: 'get',
        params: query
    })
}

export function createOrUpdateExamResults(examResultsVo){
    const data = examResultsVo;
    return request({
        url: '/manage/reissue/examResults/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delExamResults(id) {
    const data = {id};
    return request({
        url: '/manage/reissue/examResults/removeByExamResults',
        method: 'post',
        data
    })
}
export function delExamResultss(ids) {
    const data = {ids};
    return request({
        url: '/manage/reissue/examResults/removeByIds',
        method: 'post',
        data
    })
}
export function getExamResultsList(query) {
    return request({
        url: '/manage/reissue/examResults/pageByExamResults',
        method: 'get',
        params: query
    });
}


