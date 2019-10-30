import request from '@/router/axios';

export function listTemplateAllFiles(siteId,type) {
    const query = {siteId:siteId,type:type};
    return request({
        url: '/manage/template/stationGit/listTemplateAllFiles',
        method: 'get',
        params: query
    });
}


