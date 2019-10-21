import request from '@/router/axios';
export function getZwfwInformation(id) {
    return request({
        url: '/manage/information/zwfwInformation/getByZwfwInformation',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateZwfwInformation(zwfwInformationVo){
    const data = zwfwInformationVo;
    return request({
        url: '/manage/information/zwfwInformation/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delZwfwInformation(id) {
    const data = {id};
    return request({
        url: '/manage/information/zwfwInformation/removeByZwfwInformation',
        method: 'post',
        data
    })
}
export function delZwfwInformations(ids) {
    const data = {ids};
    return request({
        url: '/manage/information/zwfwInformation/removeByIds',
        method: 'post',
        data
    })
}
export function getZwfwInformationList(query) {
    return request({
        url: '/manage/information/zwfwInformation/pageByZwfwInformation',
        method: 'get',
        params: query
    });
}


