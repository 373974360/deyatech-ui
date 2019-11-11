import request from '@/router/axios';
export function getLogisticsDistribution(id) {
    return request({
        url: '/manage/zsds/logisticsDistribution/getByLogisticsDistribution',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateLogisticsDistribution(logisticsDistributionVo){
    const data = logisticsDistributionVo;
    return request({
        url: '/manage/zsds/logisticsDistribution/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delLogisticsDistribution(id) {
    const data = {id};
    return request({
        url: '/manage/zsds/logisticsDistribution/removeByLogisticsDistribution',
        method: 'post',
        data
    })
}
export function delLogisticsDistributions(ids) {
    const data = {ids};
    return request({
        url: '/manage/zsds/logisticsDistribution/removeByIds',
        method: 'post',
        data
    })
}
export function getLogisticsDistributionList(query) {
    return request({
        url: '/manage/zsds/logisticsDistribution/pageByLogisticsDistribution',
        method: 'get',
        params: query
    });
}


