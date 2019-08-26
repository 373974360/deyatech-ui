import request from '@/router/axios';
export function getCategory(id) {
    return request({
        url: '/manage/interview/category/getByCategory',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateCategory(categoryVo){
    const data = categoryVo;
    return request({
        url: '/manage/interview/category/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delCategory(id) {
    const data = {id};
    return request({
        url: '/manage/interview/category/removeByCategory',
        method: 'post',
        data
    })
}
export function delCategorys(ids) {
    const data = {ids};
    return request({
        url: '/manage/interview/category/removeByIds',
        method: 'post',
        data
    })
}
export function getCategoryList(query) {
    return request({
        url: '/manage/interview/category/pageByCategory',
        method: 'get',
        params: query
    });
}
export function getCategoryListByNameAndSiteId(query) {
    return request({
        url: '/manage/interview/category/pageByNameAndSiteId',
        method: 'get',
        params: query
    });
}

