import request from '@/router/axios';
export function getMemberCategory(id) {
    return request({
        url: '/manage/market/memberCategory/getByMemberCategory',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateMemberCategory(memberCategoryVo){
    const data = memberCategoryVo;
    return request({
        url: '/manage/market/memberCategory/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delMemberCategory(id) {
    const data = {id};
    return request({
        url: '/manage/market/memberCategory/removeByMemberCategory',
        method: 'post',
        data
    })
}
export function delMemberCategorys(ids) {
    const data = {ids};
    return request({
        url: '/manage/market/memberCategory/removeByIds',
        method: 'post',
        data
    })
}
export function getMemberCategoryList(query) {
    return request({
        url: '/manage/market/memberCategory/pageByMemberCategory',
        method: 'get',
        params: query
    });
}


export function isExistName(query) {
    return request({
        url: '/manage/market/memberCategory/isExistName',
        method: 'get',
        params: query
    })
}

