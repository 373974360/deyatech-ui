import request from '@/router/axios';
export function getBranchSchool(id) {
    return request({
        url: '/manage/reissue/branchSchool/getByBranchSchool',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateBranchSchool(branchSchoolVo){
    const data = branchSchoolVo;
    return request({
        url: '/manage/reissue/branchSchool/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delBranchSchool(id) {
    const data = {id};
    return request({
        url: '/manage/reissue/branchSchool/removeByBranchSchool',
        method: 'post',
        data
    })
}
export function delBranchSchools(ids) {
    const data = {ids};
    return request({
        url: '/manage/reissue/branchSchool/removeByIds',
        method: 'post',
        data
    })
}
export function getBranchSchoolList(query) {
    return request({
        url: '/manage/reissue/branchSchool/pageByBranchSchool',
        method: 'get',
        params: query
    });
}

export function isExistName(query) {
    return request({
        url: '/manage/reissue/branchSchool/isExistName',
        method: 'get',
        params: query
    })
}
