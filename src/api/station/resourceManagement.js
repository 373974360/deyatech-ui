import request from '@/router/axios';

export function getResourceManagementList(query) {
    return request({
        url: '/manage/station/resourceManagement/pageByResourceManagement',
        method: 'get',
        params: query
    });
}


