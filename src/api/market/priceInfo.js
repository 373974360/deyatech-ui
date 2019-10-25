import request from '@/router/axios';
export function getPriceInfo(id) {
    return request({
        url: '/manage/market/priceInfo/getByPriceInfo',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdatePriceInfo(priceInfoVo){
    const data = priceInfoVo;
    return request({
        url: '/manage/market/priceInfo/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delPriceInfo(id) {
    const data = {id};
    return request({
        url: '/manage/market/priceInfo/removeByPriceInfo',
        method: 'post',
        data
    })
}
export function delPriceInfos(ids) {
    const data = {ids};
    return request({
        url: '/manage/market/priceInfo/removeByIds',
        method: 'post',
        data
    })
}
export function getPriceInfoList(query) {
    return request({
        url: '/manage/market/priceInfo/pageByPriceInfo',
        method: 'get',
        params: query
    });
}


