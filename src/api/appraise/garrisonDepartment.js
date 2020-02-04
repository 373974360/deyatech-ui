import request from '@/router/axios';
export function getGarrisonDepartment(id) {
    return request({
        url: '/manage/appraise/garrisonDepartment/getByGarrisonDepartment',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateGarrisonDepartment(garrisonDepartmentVo){
    const data = garrisonDepartmentVo;
    return request({
        url: '/manage/appraise/garrisonDepartment/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delGarrisonDepartment(id) {
    const data = {id};
    return request({
        url: '/manage/appraise/garrisonDepartment/removeByGarrisonDepartment',
        method: 'post',
        data
    })
}
export function delGarrisonDepartments(ids) {
    const data = {ids};
    return request({
        url: '/manage/appraise/garrisonDepartment/removeByIds',
        method: 'post',
        data
    })
}
export function getGarrisonDepartmentTree(query) {
    return request({
        url: '/manage/appraise/garrisonDepartment/getTree',
        method: 'get',
        params: query
    });
}

export function getGarrisonDepartmentCascader(query) {
    return request({
        url: '/manage/appraise/garrisonDepartment/getCascader',
        method: 'get',
        params: query
    });
}



