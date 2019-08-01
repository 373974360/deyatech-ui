import request from '@/router/axios';
export function boxStatus(deviceId) {
    return request({
        url: '/manage/mailbox/request/boxStatus',
        method: 'get',
        params: {deviceId}
    })
}

export function getMailboxOrderDetail(mailboxOrderId) {
    return request({
        url: '/manage/mailbox/request/getOrderDetail',
        method: 'get',
        params: {mailboxOrderId}
    })
}

export function getMailboxOrderStatus(mailboxOrderId) {
    return request({
        url: '/manage/mailbox/request/getOrderStatus',
        method: 'get',
        params: {mailboxOrderId}
    })
}
