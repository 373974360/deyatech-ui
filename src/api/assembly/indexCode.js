import request from '@/router/axios';
export function createOrUpdateIndexCode(indexCodeVo){
    const data = indexCodeVo;
    return request({
        url: '/manage/assembly/indexCode/saveOrUpdate',
        method: 'post',
        data
    })
}
export function getIndexCodeBySiteId(siteId) {
    return request({
        url: '/manage/assembly/indexCode/getIndexCodeBySiteId',
        method: 'get',
        params: {siteId}
    });
}
