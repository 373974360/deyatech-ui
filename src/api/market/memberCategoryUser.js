import request from '@/router/axios';
export function getMemberCategoryUser(id) {
    return request({
        url: '/manage/market/memberCategoryUser/getByMemberCategoryUser',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateMemberCategoryUser(memberCategoryUserVo){
    const data = memberCategoryUserVo;
    return request({
        url: '/manage/market/memberCategoryUser/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delMemberCategoryUser(id) {
    const data = {id};
    return request({
        url: '/manage/market/memberCategoryUser/removeByMemberCategoryUser',
        method: 'post',
        data
    })
}
export function delMemberCategoryUsers(ids) {
    const data = {ids};
    return request({
        url: '/manage/market/memberCategoryUser/removeByIds',
        method: 'post',
        data
    })
}
export function getMemberCategoryUserList(query) {
    return request({
        url: '/manage/market/memberCategoryUser/pageByMemberCategoryUser',
        method: 'get',
        params: query
    });
}


export function getAllMemberCategoryUser(query) {
    return request({
        url: '/manage/market/memberCategoryUser/listByMemberCategoryUser',
        method: 'get',
        params: query
    })
}
export function saveMemberCategoryUsers(categoryId, userIds) {
    return request({
        url: '/manage/market/memberCategoryUser/saveMemberCategoryUsers',
        method: 'post',
        data: {categoryId, userIds}
    })
}
export function getAllMemberCategoryUserByUserId(query) {
    return request({
        url: '/manage/market/memberCategoryUser/listByUserId',
        method: 'get',
        params: query
    })
}
