import request from '@/router/axios';
export function getCompanyInfo(id) {
    return request({
        url: '/manage/visitors/companyInfo/getByCompanyInfo',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateCompanyInfo(companyInfoVo){
    const data = companyInfoVo;
    return request({
        url: '/manage/visitors/companyInfo/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delCompanyInfo(id) {
    const data = {id};
    return request({
        url: '/manage/visitors/companyInfo/removeByCompanyInfo',
        method: 'post',
        data
    })
}
export function delCompanyInfos(ids) {
    const data = {ids};
    return request({
        url: '/manage/visitors/companyInfo/removeByIds',
        method: 'post',
        data
    })
}
export function getCompanyInfoList(query) {
    return request({
        url: '/manage/visitors/companyInfo/pageByCompanyInfo',
        method: 'get',
        params: query
    });
}

export function importExcel(file){
    const data = file;
    return request({
        url: '/manage/visitors/companyInfo/importExcel',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

