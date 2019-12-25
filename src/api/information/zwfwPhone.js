import request from '@/router/axios';
export function getZwfwPhone(id) {
    return request({
        url: '/manage/information/zwfwPhone/getByZwfwPhone',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateZwfwPhone(zwfwPhoneVo){
    const data = zwfwPhoneVo;
    return request({
        url: '/manage/information/zwfwPhone/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delZwfwPhone(id) {
    const data = {id};
    return request({
        url: '/manage/information/zwfwPhone/removeByZwfwPhone',
        method: 'post',
        data
    })
}
export function delZwfwPhones(ids) {
    const data = {ids};
    return request({
        url: '/manage/information/zwfwPhone/removeByIds',
        method: 'post',
        data
    })
}
export function getZwfwPhoneList(query) {
    return request({
        url: '/manage/information/zwfwPhone/pageByZwfwPhone',
        method: 'get',
        params: query
    });
}

export function getZwfwPhoneCascader(query) {
    return request({
        url: '/manage/information/zwfwPhone/getCascader',
        method: 'get',
        params: query
    });
}

export function getZwfwPhoneTree(query) {
    return request({
        url: '/manage/information/zwfwPhone/getTree',
        method: 'get',
        params: query
    });
}


