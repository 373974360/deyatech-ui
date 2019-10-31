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

export function queryEvaluateCountByDept() {
    return request({
        url: '/manage/evaluate/count/qryEvaluateCountByDept',
        method: 'get'
    })
}
