import request from '@/router/axios';
import {export2Excel} from "../../excel/Export2excel";
export function getAppraiseInfo(id) {
    return request({
        url: '/manage/appraise/appraiseInfo/getByAppraiseInfo',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateAppraiseInfo(appraiseInfoVo){
    const data = appraiseInfoVo;
    return request({
        url: '/manage/appraise/appraiseInfo/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delAppraiseInfo(id) {
    const data = {id};
    return request({
        url: '/manage/appraise/appraiseInfo/removeByAppraiseInfo',
        method: 'post',
        data
    })
}
export function delAppraiseInfos(ids) {
    const data = {ids};
    return request({
        url: '/manage/appraise/appraiseInfo/removeByIds',
        method: 'post',
        data
    })
}
export function getAppraiseInfoList(query) {
    return request({
        url: '/manage/appraise/appraiseInfo/pageByAppraiseInfo',
        method: 'get',
        params: query
    });
}

export function queryEvaluateCountByTime(query) {
    return request({
        url: '/manage/appraise/appraiseInfo/queryEvaluateCountByTime',
        method: 'get',
        params: query
    });
}

export function queryEvaluateLevelCountByUser(query) {
    return request({
        url: '/manage/appraise/appraiseInfo/queryEvaluateLevelCountByUser',
        method: 'get',
        params: query
    });
}
