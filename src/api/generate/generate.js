import request from '@/router/axios';

export function createHtml(data) {
    return request({
        url: '/manage/generate/createHtml/createHtml',
        method: 'post',
        data
    });
}

