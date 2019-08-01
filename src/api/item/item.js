import request from '@/router/axios';
export function getItem(id) {
    return request({
        url: '/manage/item/item/getByItem',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateItem(itemVo){
    const data = itemVo;
    return request({
        url: '/manage/item/item/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delItem(id) {
    const data = {id};
    return request({
        url: '/manage/item/item/removeByItem',
        method: 'post',
        data
    })
}

export function delItems(ids) {
    const data = {ids};
    return request({
        url: '/manage/item/item/removeByIds',
        method: 'post',
        data
    })
}

export function getItemList(query) {
    return request({
        url: '/manage/item/item/pageByItem',
        method: 'get',
        params: query
    });
}

export function countItem(query) {
    return request({
        url: '/manage/item/item/countItem',
        method: 'get',
        params: query
    });
}

export function getItemsByWindowAndDepartment(query) {
    return request({
        url: '/manage/item/item/getItemsByWindowAndDepartment',
        method: 'get',
        params: query
    });
}
