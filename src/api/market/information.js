import request from '@/router/axios';
export function getInformation(id) {
    return request({
        url: '/manage/market/information/getByInformation',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateInformation(informationVo){
    const data = informationVo;
    return request({
        url: '/manage/market/information/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delInformation(id) {
    const data = {id};
    return request({
        url: '/manage/market/information/removeByInformation',
        method: 'post',
        data
    })
}
export function delInformations(ids) {
    const data = {ids};
    return request({
        url: '/manage/market/information/removeByIds',
        method: 'post',
        data
    })
}
export function getInformationList(query) {
    return request({
        url: '/manage/market/information/pageByInformation',
        method: 'get',
        params: query
    });
}


export function doExamine(data) {
    return request({
        url: '/manage/market/information/doExamine',
        method: 'post',
        data
    })
}

