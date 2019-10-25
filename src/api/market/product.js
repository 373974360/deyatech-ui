import request from '@/router/axios';
export function getProduct(id) {
    return request({
        url: '/manage/market/product/getByProduct',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateProduct(productVo){
    const data = productVo;
    return request({
        url: '/manage/market/product/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delProduct(id) {
    const data = {id};
    return request({
        url: '/manage/market/product/removeByProduct',
        method: 'post',
        data
    })
}
export function delProducts(ids) {
    const data = {ids};
    return request({
        url: '/manage/market/product/removeByIds',
        method: 'post',
        data
    })
}
export function getProductList(query) {
    return request({
        url: '/manage/market/product/pageByProduct',
        method: 'get',
        params: query
    });
}

export function getAllProduct(query) {
    return request({
        url: '/manage/market/product/listByProduct',
        method: 'get',
        params: query
    });
}


