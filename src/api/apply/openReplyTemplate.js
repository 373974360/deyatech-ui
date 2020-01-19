import request from '@/router/axios';
export function getOpenReplyTemplate(id) {
    return request({
        url: '/manage/apply/openReplyTemplate/getByOpenReplyTemplate',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateOpenReplyTemplate(openReplyTemplateVo){
    const data = openReplyTemplateVo;
    return request({
        url: '/manage/apply/openReplyTemplate/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delOpenReplyTemplate(id) {
    const data = {id};
    return request({
        url: '/manage/apply/openReplyTemplate/removeByOpenReplyTemplate',
        method: 'post',
        data
    })
}
export function delOpenReplyTemplates(ids) {
    const data = {ids};
    return request({
        url: '/manage/apply/openReplyTemplate/removeByIds',
        method: 'post',
        data
    })
}
export function getOpenReplyTemplateList(query) {
    return request({
        url: '/manage/apply/openReplyTemplate/pageByOpenReplyTemplate',
        method: 'get',
        params: query
    });
}
export function getOpenReplyTemplateAllList(query) {
    return request({
        url: '/manage/apply/openReplyTemplate/listByOpenReplyTemplate',
        method: 'get',
        params: query
    });
}


