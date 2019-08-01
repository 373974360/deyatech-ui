import request from '@/router/axios';
export function getItemPreaudit(id) {
    return request({
        url: '/manage/item/itemPreaudit/getByItemPreaudit',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateItemPreaudit(itemPreauditVo){
    const data = itemPreauditVo;
    return request({
        url: '/manage/item/itemPreaudit/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delItemPreaudit(id) {
    const data = {id};
    return request({
        url: '/manage/item/itemPreaudit/removeByItemPreaudit',
        method: 'post',
        data
    })
}
export function delItemPreaudits(ids) {
    const data = {ids};
    return request({
        url: '/manage/item/itemPreaudit/removeByIds',
        method: 'post',
        data
    })
}
export function getItemPreauditList(query) {
    return request({
        url: '/manage/item/itemPreaudit/pageByItemPreaudit',
        method: 'get',
        params: query
    });
}

export function getAllItemPreaudit(query) {
    return request({
        url: '/manage/item/itemPreaudit/listByItemPreaudit',
        method: 'get',
        params: query
    });
}
export function createItemPreaudit(itemPreauditVo){
    const data = itemPreauditVo;
    return request({
        url: '/manage/item/itemPreaudit/saveItemPreaudit',
        method: 'post',
        data
    })
}

