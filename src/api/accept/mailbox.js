import request from '@/router/axios';
export function getMailbox(id) {
    return request({
        url: '/manage/accept/mailbox/getByMailbox',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateMailbox(mailboxVo){
    const data = mailboxVo;
    return request({
        url: '/manage/accept/mailbox/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delMailbox(id) {
    const data = {id};
    return request({
        url: '/manage/accept/mailbox/removeByMailbox',
        method: 'post',
        data
    })
}
export function delMailboxes(ids) {
    const data = {ids};
    return request({
        url: '/manage/accept/mailbox/removeByIds',
        method: 'post',
        data
    })
}
export function getMailboxList(query) {
    return request({
        url: '/manage/accept/mailbox/pageByMailbox',
        method: 'get',
        params: query
    });
}

export function getAllMailbox(query) {
    return request({
        url: '/manage/accept/mailbox/listByMailbox',
        method: 'get',
        params: query
    })
}
