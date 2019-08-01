import request from '@/router/axios';
export function getWindowItem(id) {
    return request({
        url: '/manage/number/windowItem/getByWindowItem',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateWindowItem(windowItemVo){
    const data = windowItemVo;
    return request({
        url: '/manage/number/windowItem/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delWindowItem(id) {
    const data = {id};
    return request({
        url: '/manage/number/windowItem/removeByWindowItem',
        method: 'post',
        data
    })
}
export function delWindowItems(ids) {
    const data = {ids};
    return request({
        url: '/manage/number/windowItem/removeByIds',
        method: 'post',
        data
    })
}
export function getWindowItemList(query) {
    return request({
        url: '/manage/number/windowItem/pageByWindowItem',
        method: 'get',
        params: query
    });
}

export function getAllWindowItem(query) {
    return request({
        url: '/manage/number/windowItem/listByWindowItem',
        method: 'get',
        params: query
    })
}

export function setWindowItems(windowId, itemIds) {
    return request({
        url: '/manage/number/windowItem/setWindowItems',
        method: 'post',
        data: {windowId, itemIds}
    })
}

export function getItemList(query) {
    return request({
        url: '/manage/number/windowItem/getWindowItemList',
        method: 'get',
        params: query
    })
}
