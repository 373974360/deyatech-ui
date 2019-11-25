import request from '@/router/axios';
export function getAdmissionTemplate(id) {
    return request({
        url: '/manage/reissue/admissionTemplate/getByAdmissionTemplate',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateAdmissionTemplate(admissionTemplateVo){
    const data = admissionTemplateVo;
    return request({
        url: '/manage/reissue/admissionTemplate/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delAdmissionTemplate(id) {
    const data = {id};
    return request({
        url: '/manage/reissue/admissionTemplate/removeByAdmissionTemplate',
        method: 'post',
        data
    })
}
export function delAdmissionTemplates(ids) {
    const data = {ids};
    return request({
        url: '/manage/reissue/admissionTemplate/removeByIds',
        method: 'post',
        data
    })
}
export function getAdmissionTemplateList(query) {
    return request({
        url: '/manage/reissue/admissionTemplate/pageByAdmissionTemplate',
        method: 'get',
        params: query
    });
}


