import request from '@/router/axios';
export function getProfessionalCoursesUser(id) {
    return request({
        url: '/manage/reissue/professionalCoursesUser/getByProfessionalCoursesUser',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateProfessionalCoursesUser(professionalCoursesUserVo){
    const data = professionalCoursesUserVo;
    return request({
        url: '/manage/reissue/professionalCoursesUser/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delProfessionalCoursesUser(id) {
    const data = {id};
    return request({
        url: '/manage/reissue/professionalCoursesUser/removeByProfessionalCoursesUser',
        method: 'post',
        data
    })
}
export function delProfessionalCoursesUsers(ids) {
    const data = {ids};
    return request({
        url: '/manage/reissue/professionalCoursesUser/removeByIds',
        method: 'post',
        data
    })
}
export function getProfessionalCoursesUserList(query) {
    return request({
        url: '/manage/reissue/professionalCoursesUser/pageByProfessionalCoursesUser',
        method: 'get',
        params: query
    });
}


export function getAllProfessionalCoursesUser(query) {
    return request({
        url: '/manage/reissue/professionalCoursesUser/listByProfessionalCoursesUser',
        method: 'get',
        params: query
    });
}
export function saveProfessionalCoursesUsers(coursesId, userIds) {
    return request({
        url: '/manage/reissue/professionalCoursesUser/saveProfessionalCoursesUsers',
        method: 'post',
        data: {coursesId, userIds}
    })
}


