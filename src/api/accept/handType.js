import request from '@/router/axios';

export function findToReceiveList(query) {
    return request({
        url: '/manage/accept/handType/toReceiveList',
        method: 'get',
        params: query
    })
}

export function complete(workNo) {
    const data = {workNo};
    return request({
        url: '/manage/accept/handType/complete',
        method: 'post',
        data
    })
}

export function queryLogistics(company, number) {
    return request({
        url: '/manage/accept/handType/queryLogistics',
        method: 'get',
        params: {company, number}
    })
}

export function getHandMailboxOpenCode(workNo) {
    return request({
        url: '/manage/accept/handType/getOpenCode',
        method: 'get',
        params: {workNo}
    })
}

export function mailboxPostMailRequest(workNo) {
    const data = {workNo};
    return request({
        url: '/manage/accept/handType/mailboxPostMailRequest',
        method: 'post',
        data
    })
}
