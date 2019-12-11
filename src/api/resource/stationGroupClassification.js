import request from '@/router/axios';
export function getStationGroupClassification(id) {
    return request({
        url: '/manage/resource/stationGroupClassification/getByStationGroupClassification',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateStationGroupClassification(stationGroupClassificationVo){
    const data = stationGroupClassificationVo;
    return request({
        url: '/manage/resource/stationGroupClassification/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delStationGroupClassification(id) {
    const data = {id};
    return request({
        url: '/manage/resource/stationGroupClassification/removeByStationGroupClassification',
        method: 'post',
        data
    })
}
export function delStationGroupClassifications(ids) {
    const data = {ids};
    return request({
        url: '/manage/resource/stationGroupClassification/removeByIds',
        method: 'post',
        data
    })
}
export function getStationGroupClassificationTree(query) {
    return request({
        url: '/manage/resource/stationGroupClassification/getTree',
        method: 'get',
        params: query
    });
}

export function getStationGroupClassificationCascader(query) {
    return request({
        url: '/manage/resource/stationGroupClassification/getCascader',
        method: 'get',
        params: query
    });
}

export function isNameExist(query) {
    return request({
        url: '/manage/resource/stationGroupClassification/isNameExist',
        method: 'get',
        params: query
    });
}

export function isEnglishNameExist(query) {
    return request({
        url: '/manage/resource/stationGroupClassification/isEnglishNameExist',
        method: 'get',
        params: query
    });
}

export function hasStationOrClassification(ids) {
    const data = {ids};
    return request({
        url: '/manage/resource/stationGroupClassification/hasStationOrClassification',
        method: 'post',
        data
    })
}

export function hasStation(query) {
    return request({
        url: '/manage/resource/stationGroupClassification/hasStation',
        method: 'get',
        params: query
    });
}

export function getNextSortNo(id) {
    return request({
        url: '/manage/resource/stationGroupClassification/getNextSortNo',
        method: 'get',
        params: {id}
    });
}
