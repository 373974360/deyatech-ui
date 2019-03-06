import request from '@/router/axios';
export function getDept(id) {
    return request({
        url: '/manage/admin/dept/getByDept',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateDept(deptVo){
    const data = deptVo;
    return request({
        url: '/manage/admin/dept/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delDept(id) {
    const data = {id};
    return request({
        url: '/manage/admin/dept/removeByDept',
        method: 'post',
        data
    })
}
export function delDepts(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/dept/removeByIds',
        method: 'post',
        data
    })
}
export function getDeptTree(query) {
    return request({
        url: '/manage/admin/dept/getTree',
        method: 'get',
        params: query
    });
}

export function getDeptCascader(query) {
    return request({
        url: '/manage/admin/dept/getCascader',
        method: 'get',
        params: query
    });
}



