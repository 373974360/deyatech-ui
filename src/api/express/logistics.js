import request from '@/router/axios';

export function queryLogisticsRemote(company, number, remote) {
    return request({
        url: '/manage/express/logistics/queryLogistics',
        method: 'get',
        params: {company, number, remote}
    })
}
