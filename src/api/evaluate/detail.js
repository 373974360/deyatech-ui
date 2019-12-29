import request from '@/router/axios';
export function getDetail(id) {
    return request({
        url: '/manage/evaluate/detail/getByDetail',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateDetail(detailVo){
    const data = detailVo;
    return request({
        url: '/manage/evaluate/detail/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delDetail(id) {
    const data = {id};
    return request({
        url: '/manage/evaluate/detail/removeByDetail',
        method: 'post',
        data
    })
}
export function delDetails(ids) {
    const data = {ids};
    return request({
        url: '/manage/evaluate/detail/removeByIds',
        method: 'post',
        data
    })
}
export function getDetailList(query) {
    return request({
        url: '/manage/evaluate/detail/pageByDetail',
        method: 'get',
        params: query
    });
}

export function getReplyDetailList(query) {
    return request({
        url: '/manage/evaluate/detail/pageReplyByDetail',
        method: 'get',
        params: query
    });
}

export function saveReply(detailVo){
    const data = detailVo;
    return request({
        url: '/manage/evaluate/detail/saveReply',
        method: 'post',
        data
    })
}

export function getStatistics(query) {
    return request({
        url: '/manage/evaluate/detail/getStatistics',
        method: 'get',
        params: query
    });
}



export function poorInvalidAudit(detailVo) {
    return request({
        url: '/manage/evaluate/detail/poorInvalidAudit',
        method: 'post',
        data: detailVo
    })
}

export function reformChange(detailVo) {
    return request({
        url: '/manage/evaluate/detail/reformChange',
        method: 'post',
        data: detailVo
    })
}

export function unchangedAudit(detailVo) {
    return request({
        url: '/manage/evaluate/detail/unchangedAudit',
        method: 'post',
        data: detailVo
    })
}

export function reformDelay(detailVo) {
    return request({
        url: '/manage/evaluate/detail/reformDelay',
        method: 'post',
        data: detailVo
    })
}

export function reformDelayAudit(detailVo) {
    return request({
        url: '/manage/evaluate/detail/reformDelayAudit',
        method: 'post',
        data: detailVo
    })
}

export function queryEvaluateRecordList(detailId) {
    return request({
        url: '/manage/evaluate/detail/queryEvaluateRecordList',
        method: 'get',
        params: {detailId}
    })
}

export function reformRevisit(detailVo) {
    return request({
        url: '/manage/evaluate/detail/reformRevisit',
        method: 'post',
        data: detailVo
    })
}

