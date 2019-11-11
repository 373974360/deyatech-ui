import request from '@/router/axios';
export function getAgriculturalProductsUpDown(id) {
    return request({
        url: '/manage/zsds/agriculturalProductsUpDown/getByAgriculturalProductsUpDown',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateAgriculturalProductsUpDown(agriculturalProductsUpDownVo){
    const data = agriculturalProductsUpDownVo;
    return request({
        url: '/manage/zsds/agriculturalProductsUpDown/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delAgriculturalProductsUpDown(id) {
    const data = {id};
    return request({
        url: '/manage/zsds/agriculturalProductsUpDown/removeByAgriculturalProductsUpDown',
        method: 'post',
        data
    })
}
export function delAgriculturalProductsUpDowns(ids) {
    const data = {ids};
    return request({
        url: '/manage/zsds/agriculturalProductsUpDown/removeByIds',
        method: 'post',
        data
    })
}
export function getAgriculturalProductsUpDownList(query) {
    return request({
        url: '/manage/zsds/agriculturalProductsUpDown/pageByAgriculturalProductsUpDown',
        method: 'get',
        params: query
    });
}


