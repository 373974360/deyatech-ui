import request from '@/router/axios';
export function getProfessionalCourses(id) {
    return request({
        url: '/manage/reissue/professionalCourses/getByProfessionalCourses',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateProfessionalCourses(professionalCoursesVo){
    const data = professionalCoursesVo;
    return request({
        url: '/manage/reissue/professionalCourses/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delProfessionalCourses(id) {
    const data = {id};
    return request({
        url: '/manage/reissue/professionalCourses/removeByProfessionalCourses',
        method: 'post',
        data
    })
}
export function delProfessionalCoursess(ids) {
    const data = {ids};
    return request({
        url: '/manage/reissue/professionalCourses/removeByIds',
        method: 'post',
        data
    })
}
export function getProfessionalCoursesList(query) {
    return request({
        url: '/manage/reissue/professionalCourses/pageByProfessionalCourses',
        method: 'get',
        params: query
    });
}


