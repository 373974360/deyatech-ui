import request from '@/router/axios';

export function createOrUpdateItemDelivery(data) {
    return request({
        url: '/manage/item/itemDelivery/saveOrUpdate',
        method: 'post',
        data
    })
}

export function getItemDelivery(query) {
    return request({
        url: '/manage/item/itemDelivery/getByItemDelivery',
        method: 'get',
        params: query
    })
}
