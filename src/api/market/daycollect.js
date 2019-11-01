import request from '@/router/axios';
export function getDaycollect(id) {
    return request({
        url: '/manage/market/daycollect/getByDaycollect',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateDaycollect(daycollectVo){
    const data = daycollectVo;
    return request({
        url: '/manage/market/daycollect/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delDaycollect(id) {
    const data = {id};
    return request({
        url: '/manage/market/daycollect/removeByDaycollect',
        method: 'post',
        data
    })
}
export function delDaycollects(ids) {
    const data = {ids};
    return request({
        url: '/manage/market/daycollect/removeByIds',
        method: 'post',
        data
    })
}
export function getDaycollectList(query) {
    return request({
        url: '/manage/market/daycollect/pageByDaycollect',
        method: 'get',
        params: query
    });
}


export function getDailyPriceSurveyData(query) {
    return request({
        url: '/manage/market/daycollect/getDailyPriceSurveyData',
        method: 'get',
        params: query
    });
}
export function getTenDayPriceSurveyData(query) {
    return request({
        url: '/manage/market/daycollect/getTenDayPriceSurveyData',
        method: 'get',
        params: query
    });
}
export function getWeeklyPriceSurveyData(query) {
    return request({
        url: '/manage/market/daycollect/getWeeklyPriceSurveyData',
        method: 'get',
        params: query
    });
}

