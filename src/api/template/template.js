import request from '@/router/axios';

export function listTemplateAllFiles(siteId) {
    const query = {siteId:siteId};
    return request({
        url: '/manage/template/stationGit/listTemplateAllFiles',
        method: 'get',
        params: query
    });
}


