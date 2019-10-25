import request from '@/router/axios';
export function getMarketType(id) {
    return request({
        url: '/manage/market/marketType/getByMarketType',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateMarketType(marketTypeVo){
    const data = marketTypeVo;
    return request({
        url: '/manage/market/marketType/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delMarketType(id) {
    const data = {id};
    return request({
        url: '/manage/market/marketType/removeByMarketType',
        method: 'post',
        data
    })
}
export function delMarketTypes(ids) {
    const data = {ids};
    return request({
        url: '/manage/market/marketType/removeByIds',
        method: 'post',
        data
    })
}
export function getMarketTypeList(query) {
    return request({
        url: '/manage/market/marketType/pageByMarketType',
        method: 'get',
        params: query
    });
}

export function isExistMarketName(marketName) {
    return request({
        url: '/manage/market/marketType/isExistMarketName',
        method: 'get',
        params: {marketName}
    })
}
export function getAllMarketType(query) {
    return request({
        url: '/manage/market/marketType/listByMarketType',
        method: 'get',
        params: query
    });
}
