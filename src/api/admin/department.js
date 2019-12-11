import request from '@/router/axios';

export function getDepartment(id) {
    return request({
        url: '/manage/admin/department/getByDepartment',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateDepartment(departmentVo) {
    const data = departmentVo;
    return request({
        url: '/manage/admin/department/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delDepartment(id) {
    const data = {id};
    return request({
        url: '/manage/admin/department/removeByDepartment',
        method: 'post',
        data
    })
}

export function delDepartments(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/department/removeByIds',
        method: 'post',
        data
    })
}

export function getDepartmentTree(query) {
    return request({
        url: '/manage/admin/department/getTree',
        method: 'get',
        params: query
    });
}

export function getDepartmentCascader(query) {
    return request({
        url: '/manage/admin/department/getCascader',
        method: 'get',
        params: query
    });
}

export function getAllDepartments(query) {
    return request({
        url: '/manage/admin/department/listByDepartment',
        method: 'get',
        params: query
    });
}

export function findDepartmentByIds(ids) {
    return request({
        url: '/manage/admin/department/findByIds',
        method: 'get',
        params: {ids}
    })
}

export function getNextSortNo(id) {
    return request({
        url: '/manage/admin/department/getNextSortNo',
        method: 'get',
        params: {id}
    });
}
