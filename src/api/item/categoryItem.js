import request from '@/router/axios';
export function getCategoryItem(id) {
    return request({
        url: '/manage/item/categoryItem/getByCategoryItem',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateCategoryItem(categoryItemVo){
    const data = categoryItemVo;
    return request({
        url: '/manage/item/categoryItem/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delCategoryItem(id) {
    const data = {id};
    return request({
        url: '/manage/item/categoryItem/removeByCategoryItem',
        method: 'post',
        data
    })
}
export function delCategoryItems(ids) {
    const data = {ids};
    return request({
        url: '/manage/item/categoryItem/removeByIds',
        method: 'post',
        data
    })
}
export function getCategoryItemList(query) {
    return request({
        url: '/manage/item/categoryItem/pageByCategoryItem',
        method: 'get',
        params: query
    });
}

export function getAllCategoryItem(query) {
    return request({
        url: '/manage/item/categoryItem/listByCategoryItem',
        method: 'get',
        params: query
    })
}

export function setCategoryItems(categoryId, itemIds) {
    return request({
        url: '/manage/item/categoryItem/setCategoryItems',
        method: 'post',
        data: {categoryId, itemIds}
    })
}

export function pageItemsByItemNameAndCategoryIds(query) {
    return request({
        url: '/manage/item/categoryItem/pageItemsByItemNameAndCategoryIds',
        method: 'get',
        params: query
    });
}

export function listItemsByCategoryId(query) {
    return request({
        url: '/manage/item/categoryItem/listItemsByCategoryId',
        method: 'get',
        params: query
    });
}
