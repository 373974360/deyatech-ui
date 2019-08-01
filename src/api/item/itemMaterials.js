import request from '@/router/axios';
export function getItemMaterials(id) {
    return request({
        url: '/manage/item/itemMaterials/getByItemMaterials',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateItemMaterials(itemMaterialsVo){
    const data = itemMaterialsVo;
    return request({
        url: '/manage/item/itemMaterials/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delItemMaterials(id) {
    const data = {id};
    return request({
        url: '/manage/item/itemMaterials/removeByItemMaterials',
        method: 'post',
        data
    })
}
export function delItemMaterialss(ids) {
    const data = {ids};
    return request({
        url: '/manage/item/itemMaterials/removeByIds',
        method: 'post',
        data
    })
}
export function getItemMaterialsList(query) {
    return request({
        url: '/manage/item/itemMaterials/selectMaterialsByItemIdAndMaterialsName',
        method: 'get',
        params: query
    });
}
export function getAllItemMaterials(query) {
    return request({
        url: '/manage/item/itemMaterials/listByItemMaterials',
        method: 'get',
        params: query
    });
}
export function setItemMaterials(itemId, materialsIds) {
    return request({
        url: '/manage/item/itemMaterials/setItemMaterials',
        method: 'post',
        data: {itemId, materialsIds}
    });
}
export function getMaterialsVersion(query) {
    return request({
        url: '/manage/item/itemMaterials/selectMaterialsVersionByItemId',
        method: 'get',
        params: query
    });
}
export function getItemAndNewestMaterialsByItemId(query) {
    return request({
        url: '/manage/item/itemMaterials/selectItemAndNewestMaterialsByItemId',
        method: 'get',
        params: query
    });
}
