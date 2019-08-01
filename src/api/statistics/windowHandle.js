import request from '@/router/axios';

export function getWindowData(query) {
    return request({
        url: '/manage/statistics/windowHandle/getWindowData',
        method: 'get',
        params: query
    })
}
