import request from '@/router/axios';
export function getSubject(id) {
    return request({
        url: '/manage/reissue/subject/getBySubject',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateSubject(subjectVo){
    const data = subjectVo;
    return request({
        url: '/manage/reissue/subject/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delSubject(id) {
    const data = {id};
    return request({
        url: '/manage/reissue/subject/removeBySubject',
        method: 'post',
        data
    })
}
export function delSubjects(ids) {
    const data = {ids};
    return request({
        url: '/manage/reissue/subject/removeByIds',
        method: 'post',
        data
    })
}
export function getSubjectList(query) {
    return request({
        url: '/manage/reissue/subject/pageBySubject',
        method: 'get',
        params: query
    });
}


