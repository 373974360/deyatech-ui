import request from '@/router/axios';

export function getCustomizationFunctionCatalog() {
    return request({
        url: '/manage/assembly/customizationFunction/getCustomizationFunctionCatalog',
        method: 'get',
        params: {}
    });
}
export function getCustomizationFunctionContent() {
    return request({
        url: '/manage/assembly/customizationFunction/getCustomizationFunctionContent',
        method: 'get',
        params: {}
    });
}
export function getTableHeadCatalogData() {
    return request({
        url: '/manage/assembly/customizationFunction/getTableHeadCatalogData',
        method: 'get',
        params: {}
    });
}
export function getTableHeadContentData() {
    return request({
        url: '/manage/assembly/customizationFunction/getTableHeadContentData',
        method: 'get',
        params: {}
    });
}
export function getAllCustomizationFunction() {
    return request({
        url: '/manage/assembly/customizationFunction/getAllCustomizationFunction',
        method: 'get',
        params: {}
    });
}

export function saveOrUpdateBatch(json) {
    const data = {customizationFunctions: json};
    return request({
        url: '/manage/assembly/customizationFunction/saveOrUpdateBatch',
        method: 'post',
        data
    });
}

export function saveOrUpdate(customizationFunction) {
    const data = customizationFunction;
    return request({
        url: '/manage/assembly/customizationFunction/saveOrUpdate',
        method: 'post',
        data
    });
}
