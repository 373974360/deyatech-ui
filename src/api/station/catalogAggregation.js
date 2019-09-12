import request from '@/router/axios';
export function getCatalogAggregation(id) {
    return request({
        url: '/manage/station/catalogAggregation/getByCatalogAggregation',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateCatalogAggregation(catalogAggregationVo){
    const data = catalogAggregationVo;
    return request({
        url: '/manage/station/catalogAggregation/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delCatalogAggregation(id) {
    const data = {id};
    return request({
        url: '/manage/station/catalogAggregation/removeByCatalogAggregation',
        method: 'post',
        data
    })
}
export function delCatalogAggregations(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/catalogAggregation/removeByIds',
        method: 'post',
        data
    })
}
export function getCatalogAggregationList(query) {
    return request({
        url: '/manage/station/catalogAggregation/pageByCatalogAggregation',
        method: 'get',
        params: query
    });
}


