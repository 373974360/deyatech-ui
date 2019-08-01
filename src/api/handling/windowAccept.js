import request from '@/router/axios';
export function getAcceptData(query) {
    return request({
        url: '/manage/handling/windowAccept/getAcceptData',
        method: 'get',
        params: query
    })
}

export function saveAcceptData(acceptData) {
    const data = acceptData;
    return request({
        url: '/manage/handling/windowAccept/saveAcceptData',
        method: 'post',
        data
    })
}

export function getRemoteItemAndMaterialsByRemoteId(query) {
    return request({
        url: '/manage/handling/windowAccept/getRemoteItemAndMaterialsByRemoteId',
        method: 'get',
        params: query
    });
}


