import request from '@/router/axios';

export function findDeliveryList(query) {
    return request({
        url: '/manage/accept/takeType/deliveryList',
        method: 'get',
        params: query
    })
}

export function saveTakeType(data) {
    return request({
        url: '/manage/accept/takeType/saveTakeType',
        method: 'post',
        data
    })
}

export function saveExpressInfo(data) {
    return request({
        url: '/manage/accept/takeType/saveExpressInfo',
        method: 'post',
        data
    })
}

export function complete(workNo) {
    const data = {workNo};
    return request({
        url: '/manage/accept/takeType/complete',
        method: 'post',
        data
    })
}

export function mailboxReserve(workNo) {
    const data = {workNo};
    return request({
        url: '/manage/accept/takeType/mailboxReserve',
        method: 'post',
        data
    })
}

export function mailboxReserveCancel(workNo) {
    const data = {workNo};
    return request({
        url: '/manage/accept/takeType/mailboxReserveCancel',
        method: 'post',
        data
    })
}
