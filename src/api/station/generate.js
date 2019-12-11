import request from '@/router/axios';

export function createHtml(data) {
    return request({
        url: '/manage/station/createHtml/createHtml',
        method: 'post',
        data
    });
}

