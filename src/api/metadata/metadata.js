import request from '@/router/axios';

export function getMetadata(id) {
    return request({
        url: '/manage/admin/metadata/getByMetadata',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateMetadata(metadataVo){
    const data = metadataVo;
    return request({
        url: '/manage/admin/metadata/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delMetadata(id) {
    const data = {id};
    return request({
        url: '/manage/admin/metadata/removeByMetadata',
        method: 'post',
        data
    })
}
export function delMetadatas(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/metadata/removeByIds',
        method: 'post',
        data
    })
}
export function getMetadataList(query) {
    return request({
        url: '/manage/admin/metadata/pageByMetadata',
        method: 'get',
        params: query
    });
}

export function getAllMetadata(query) {
    return request({
        url: '/manage/admin/metadata/listByMetadata',
        method: 'get',
        params: query
    })
}

export function findDataType() {
    return request({
        url: '/manage/admin/metadata/dataType',
        method: 'get'
    })
}
export function findControlType() {
    return request({
        url: '/manage/admin/metadata/controlType',
        method: 'get'
    })
}
export function findCandidateRelation(id, categoryId) {
    return request({
        url: '/manage/admin/metadata/findCandidateRelation',
        method: 'get',
        params: {id, categoryId}
    })
}

export function checkNameExist(id, name) {
    return request({
        url: '/manage/admin/metadata/checkNameExist',
        method: 'get',
        params: {id, name}
    })
}

export function checkBriefNameExist(id, briefName) {
    return request({
        url: '/manage/admin/metadata/checkBriefNameExist',
        method: 'get',
        params: {id, briefName}
    })
}

export function checkEnNameExist(id, enName) {
    return request({
        url: '/manage/admin/metadata/checkEnNameExist',
        method: 'get',
        params: {id, enName}
    })
}
