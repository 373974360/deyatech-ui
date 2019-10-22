import request from '@/router/axios';

export function getMetadataCollection(id) {
    return request({
        url: '/manage/admin/metadataCollection/getByMetadataCollection',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateMetadataCollection(metadataCollectionVo){
    const data = metadataCollectionVo;
    return request({
        url: '/manage/admin/metadataCollection/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delMetadataCollection(id) {
    const data = {id};
    return request({
        url: '/manage/admin/metadataCollection/removeByMetadataCollection',
        method: 'post',
        data
    })
}
export function delMetadataCollections(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/metadataCollection/removeByIds',
        method: 'post',
        data
    })
}
export function getMetadataCollectionList(query) {
    return request({
        url: '/manage/admin/metadataCollection/pageByMetadataCollection',
        method: 'get',
        params: query
    });
}

export function findMetadataCollectionAllData(query) {
    return request({
        url: '/manage/admin/metadataCollection/findAllData',
        method: 'get',
        params: query
    })
}

export function setMainVersion(id) {
    return request({
        url: '/manage/admin/metadataCollection/setMainVersion',
        method: 'post',
        data: {id}
    })
}

export function checkNameExist(enName, name) {
    return request({
        url: '/manage/admin/metadataCollection/checkNameExist',
        method: 'get',
        params: {enName, name}
    })
}

export function checkEnNameExist(id, name, enName) {
    return request({
        url: '/manage/admin/metadataCollection/checkEnNameExist',
        method: 'get',
        params: {id, name, enName}
    })
}

export function checkVersionExist(id, enName, version) {
    return request({
        url: '/manage/admin/metadataCollection/checkVersionExist',
        method: 'get',
        params: {id, enName, version}
    })
}

export function getAllMetadataCollection(query) {
    return request({
        url: '/manage/admin/metadataCollection/listByMetadataCollection',
        method: 'get',
        params: query
    })
}
