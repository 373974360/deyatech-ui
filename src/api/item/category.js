import request from '@/router/axios';
export function getCategory(id) {
    return request({
        url: '/manage/item/category/getByCategory',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateCategory(categoryVo){
    const data = categoryVo;
    return request({
        url: '/manage/item/category/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delCategory(id) {
    const data = {id};
    return request({
        url: '/manage/item/category/removeByCategory',
        method: 'post',
        data
    })
}
export function delCategorys(ids) {
    const data = {ids};
    return request({
        url: '/manage/item/category/removeByIds',
        method: 'post',
        data
    })
}
export function getCategoryTree(query) {
    return request({
        url: '/manage/item/category/getTree',
        method: 'get',
        params: query
    });
}

export function getCategoryCascader(query) {
    return request({
        url: '/manage/item/category/getCascader',
        method: 'get',
        params: query
    });
}

export function countCategory(query) {
    return request({
        url: '/manage/item/category/countCategory',
        method: 'get',
        params: query
    });
}


