import request from '@/router/axios';

export function getMemberAddress(id) {
    return request({
        url: '/manage/accept/memberAddress/getByMemberAddress',
        method: 'get',
        params: {id}
    })
}

export function getAllMemberAddress(query) {
    return request({
        url: '/manage/accept/memberAddress/listByMemberAddress',
        method: 'get',
        params: query
    })
}
