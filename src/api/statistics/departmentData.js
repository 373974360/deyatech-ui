import request from '@/router/axios';
export function getUserDepartmentGraphicData(query) {
    return request({
        url: '/manage/statistics/userData/getUserDepartmentGraphicData',
        method: 'get',
        params: query
    })
}
