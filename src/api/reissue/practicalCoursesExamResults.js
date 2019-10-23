import request from '@/router/axios';
export function getPracticalCoursesExamResults(id) {
    return request({
        url: '/manage/reissue/practicalCoursesExamResults/getByPracticalCoursesExamResults',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdatePracticalCoursesExamResults(practicalCoursesExamResultsVo){
    const data = practicalCoursesExamResultsVo;
    return request({
        url: '/manage/reissue/practicalCoursesExamResults/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delPracticalCoursesExamResults(id) {
    const data = {id};
    return request({
        url: '/manage/reissue/practicalCoursesExamResults/removeByPracticalCoursesExamResults',
        method: 'post',
        data
    })
}
export function delPracticalCoursesExamResultss(ids) {
    const data = {ids};
    return request({
        url: '/manage/reissue/practicalCoursesExamResults/removeByIds',
        method: 'post',
        data
    })
}
export function getPracticalCoursesExamResultsList(query) {
    return request({
        url: '/manage/reissue/practicalCoursesExamResults/pageByPracticalCoursesExamResults',
        method: 'get',
        params: query
    });
}


