import request from '@/router/axios';

export function queryEvaluateCountByLevel() {
    return request({
        url: '/manage/evaluate/count/qryEvaluateCountByLevel',
        method: 'get'
    })
}

export function queryEvaluateCountByChannel() {
    return request({
        url: '/manage/evaluate/count/qryEvaluateCountByChannel',
        method: 'get'
    })
}

export function queryEvaluateCountByDept(detailVo) {
    return request({
        url: '/manage/evaluate/count/qryEvaluateCountByDept',
        method: 'get',
        data: detailVo
    })
}

export function qryCountByDeptChannel(detailVo) {
    return request({
        url: '/manage/evaluate/count/qryCountByDeptChannel',
        method: 'get',
        data: detailVo
    })
}

export function qryCountByDeptDimensionCode(detailVo) {
    return request({
        url: '/manage/evaluate/count/qryCountByDeptDimensionCode',
        method: 'get',
        data: detailVo
    })
}

export function qryCountByDeptItemLevel(detailVo) {
    return request({
        url: '/manage/evaluate/count/qryCountByDeptItemLevel',
        method: 'get',
        data: detailVo
    })
}

export function qryCountDeptReform(detailVo) {
    return request({
        url: '/manage/evaluate/count/qryCountDeptReform',
        method: 'get',
        data: detailVo
    })
}

export function qryDeptSortByScore() {
    return request({
        url: '/manage/evaluate/count/qryDeptSortByScore',
        method: 'get'
    })
}

export function qryDeptSortByCount() {
    return request({
        url: '/manage/evaluate/count/qryDeptSortByCount',
        method: 'get'
    })
}

export function qryDeptSortByRateEvaluate() {
    return request({
        url: '/manage/evaluate/count/qryDeptSortByRateEvaluate',
        method: 'get'
    })
}

export function qryDeptSortByRatePoor() {
    return request({
        url: '/manage/evaluate/count/qryDeptSortByRatePoor',
        method: 'get'
    })
}
