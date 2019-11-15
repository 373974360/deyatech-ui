import request from '@/router/axios';
export function getRegistrationData(id) {
    return request({
        url: '/manage/reissue/registrationData/getByRegistrationData',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateRegistrationData(registrationDataVo){
    const data = registrationDataVo;
    return request({
        url: '/manage/reissue/registrationData/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delRegistrationData(id) {
    const data = {id};
    return request({
        url: '/manage/reissue/registrationData/removeByRegistrationData',
        method: 'post',
        data
    })
}
export function delRegistrationDatas(ids) {
    const data = {ids};
    return request({
        url: '/manage/reissue/registrationData/removeByIds',
        method: 'post',
        data
    })
}
export function getRegistrationDataList(query) {
    return request({
        url: '/manage/reissue/registrationData/pageByRegistrationData',
        method: 'get',
        params: query
    });
}


