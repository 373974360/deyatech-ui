import request from '@/router/axios';

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
