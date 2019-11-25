import request from '@/router/axios';
export function getBranchSchoolUser(id) {
    return request({
        url: '/manage/reissue/branchSchoolUser/getByBranchSchoolUser',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateBranchSchoolUser(branchSchoolUserVo){
    const data = branchSchoolUserVo;
    return request({
        url: '/manage/reissue/branchSchoolUser/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delBranchSchoolUser(id) {
    const data = {id};
    return request({
        url: '/manage/reissue/branchSchoolUser/removeByBranchSchoolUser',
        method: 'post',
        data
    })
}
export function delBranchSchoolUsers(ids) {
    const data = {ids};
    return request({
        url: '/manage/reissue/branchSchoolUser/removeByIds',
        method: 'post',
        data
    })
}
export function getBranchSchoolUserList(query) {
    return request({
        url: '/manage/reissue/branchSchoolUser/pageByBranchSchoolUser',
        method: 'get',
        params: query
    });
}

export function getAllBranchSchoolUser(query) {
    return request({
        url: '/manage/reissue/branchSchoolUser/listByBranchSchoolUser',
        method: 'get',
        params: query
    })
}
export function saveBranchSchoolUsers(schoolId, userIds) {
    return request({
        url: '/manage/reissue/branchSchoolUser/saveBranchSchoolUsers',
        method: 'post',
        data: {schoolId, userIds}
    })
}
export function getAllBranchSchoolUserByUserId(query) {
    return request({
        url: '/manage/reissue/branchSchoolUser/listByUserId',
        method: 'get',
        params: query
    })
}
