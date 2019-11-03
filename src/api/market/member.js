import request from '@/router/axios';
export function getMember(id) {
    return request({
        url: '/manage/market/member/getByMember',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateMember(memberVo){
    const data = memberVo;
    return request({
        url: '/manage/market/member/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delMember(id) {
    const data = {id};
    return request({
        url: '/manage/market/member/removeByMember',
        method: 'post',
        data
    })
}
export function delMembers(ids) {
    const data = {ids};
    return request({
        url: '/manage/market/member/removeByIds',
        method: 'post',
        data
    })
}
export function getMemberList(query) {
    return request({
        url: '/manage/market/member/pageByMember',
        method: 'get',
        params: query
    });
}


export function isExistAccount(query) {
    return request({
        url: '/manage/market/member/isExistAccount',
        method: 'get',
        params: query
    })
}

