import request from '@/router/axios';
export function resetIndex(query) {
    return request({
        url: '/manage/assembly/indexCode/reset',
        method: 'get',
        params: query
    });
}
