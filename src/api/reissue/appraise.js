import request from '@/router/axios';
export function getAppraise(id) {
    return request({
        url: '/manage/reissue/appraise/getByAppraise',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateAppraise(appraiseVo){
    const data = appraiseVo;
    return request({
        url: '/manage/reissue/appraise/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delAppraise(id) {
    const data = {id};
    return request({
        url: '/manage/reissue/appraise/removeByAppraise',
        method: 'post',
        data
    })
}
export function delAppraises(ids) {
    const data = {ids};
    return request({
        url: '/manage/reissue/appraise/removeByIds',
        method: 'post',
        data
    })
}
export function getAppraiseList(query) {
    return request({
        url: '/manage/reissue/appraise/pageByAppraise',
        method: 'get',
        params: query
    });
}
export function doExamine(appraiseVo){
    const data = appraiseVo;
    return request({
        url: '/manage/reissue/appraise/doExamine',
        method: 'post',
        data
    })
}

