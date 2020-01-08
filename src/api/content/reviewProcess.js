import request from '@/router/axios';
export function getReviewProcess(id) {
    return request({
        url: '/manage/content/reviewProcess/getByReviewProcess',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateReviewProcess(reviewProcessVo){
    const data = reviewProcessVo;
    return request({
        url: '/manage/content/reviewProcess/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delReviewProcess(id) {
    const data = {id};
    return request({
        url: '/manage/content/reviewProcess/removeByReviewProcess',
        method: 'post',
        data
    })
}
export function delReviewProcesss(ids) {
    const data = {ids};
    return request({
        url: '/manage/content/reviewProcess/removeByIds',
        method: 'post',
        data
    })
}
export function getReviewProcessList(query) {
    return request({
        url: '/manage/content/reviewProcess/pageByReviewProcess',
        method: 'get',
        params: query
    });
}



export function completeTask(actTaskId) {
    const data = {taskId: actTaskId}
    return request({
        url: '/manage/workflow/processTask/completeTask',
        method: 'post',
        data
    })
}

export function rollBackTask(actTaskId) {
    const data = {taskId: actTaskId}
    return request({
        url: '/manage/workflow/processTask/rollBackTask',
        method: 'post',
        data
    })
}

export function rejectTask(actTaskId, reason) {
    const data = {taskId: actTaskId, reason: reason}
    return request({
        url: '/manage/workflow/processTask/rejectTask',
        method: 'post',
        data
    })
}
