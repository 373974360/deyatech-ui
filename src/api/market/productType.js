import request from '@/router/axios';
export function getProductType(id) {
    return request({
        url: '/manage/market/productType/getByProductType',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateProductType(productTypeVo){
    const data = productTypeVo;
    return request({
        url: '/manage/market/productType/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delProductType(id) {
    const data = {id};
    return request({
        url: '/manage/market/productType/removeByProductType',
        method: 'post',
        data
    })
}
export function delProductTypes(ids) {
    const data = {ids};
    return request({
        url: '/manage/market/productType/removeByIds',
        method: 'post',
        data
    })
}
export function getProductTypeList(query) {
    return request({
        url: '/manage/market/productType/pageByProductType',
        method: 'get',
        params: query
    });
}

export function getAllProductType(query) {
    return request({
        url: '/manage/market/productType/listByProductType',
        method: 'get',
        params: query
    });
}

