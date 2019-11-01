import request from '@/router/axios';
export function getInformationCategory(id) {
    return request({
        url: '/manage/market/informationCategory/getByInformationCategory',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateInformationCategory(informationCategoryVo){
    const data = informationCategoryVo;
    return request({
        url: '/manage/market/informationCategory/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delInformationCategory(id) {
    const data = {id};
    return request({
        url: '/manage/market/informationCategory/removeByInformationCategory',
        method: 'post',
        data
    })
}
export function delInformationCategorys(ids) {
    const data = {ids};
    return request({
        url: '/manage/market/informationCategory/removeByIds',
        method: 'post',
        data
    })
}
export function getInformationCategoryList(query) {
    return request({
        url: '/manage/market/informationCategory/pageByInformationCategory',
        method: 'get',
        params: query
    });
}

export function isExistName(query) {
    return request({
        url: '/manage/market/informationCategory/isExistName',
        method: 'get',
        params: query
    })
}
export function getAllCategory(query) {
    return request({
        url: '/manage/market/informationCategory/listByInformationCategory',
        method: 'get',
        params: query
    });
}

