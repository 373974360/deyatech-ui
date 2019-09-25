import request from '@/router/axios';
export function getPurpose(id) {
    return request({
        url: '/manage/appeal/purpose/getByPurpose',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdatePurpose(purposeVo){
    const data = purposeVo;
    return request({
        url: '/manage/appeal/purpose/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delPurpose(id) {
    const data = {id};
    return request({
        url: '/manage/appeal/purpose/removeByPurpose',
        method: 'post',
        data
    })
}
export function delPurposes(ids) {
    const data = {ids};
    return request({
        url: '/manage/appeal/purpose/removeByIds',
        method: 'post',
        data
    })
}
export function getPurposeList(query) {
    return request({
        url: '/manage/appeal/purpose/pageByPurpose',
        method: 'get',
        params: query
    });
}
export function getPurposeAllList(query) {
    return request({
        url: '/manage/appeal/purpose/listByPurpose',
        method: 'get',
        params: query
    });
}


