import request from '@/router/axios';
export function getReceiveAdress(id) {
    return request({
        url: '/manage/accept/receiveAdress/getByReceiveAdress',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateReceiveAdress(receiveAdressVo){
    const data = receiveAdressVo;
    return request({
        url: '/manage/accept/receiveAdress/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delReceiveAdress(id) {
    const data = {id};
    return request({
        url: '/manage/accept/receiveAdress/removeByReceiveAdress',
        method: 'post',
        data
    })
}
export function delReceiveAdresss(ids) {
    const data = {ids};
    return request({
        url: '/manage/accept/receiveAdress/removeByIds',
        method: 'post',
        data
    })
}
export function getReceiveAdressList(query) {
    return request({
        url: '/manage/accept/receiveAdress/pageByReceiveAdress',
        method: 'get',
        params: query
    });
}

export function getAllReceiveAdress(query) {
    return request({
        url: '/manage/accept/receiveAdress/listByReceiveAdress',
        method: 'get',
        params: query
    })
}
