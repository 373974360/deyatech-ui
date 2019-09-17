import request from '@/router/axios';
export function removeIndexData(params) {
    return request({
        url: '/manage/station/template/removeIndexData',
        method: 'get',
        params: params
    });
}


