import request from '@/router/axios';

export function getProcessTaskSetting(processTaskSetting) {
    return request({
        url: '/manage/workflow/processTaskSetting/getByProcessTaskSetting',
        method: 'get',
        params: processTaskSetting
    })
}

export function createOrUpdateProcessTaskSetting(processTaskSettingVo){
    const data = processTaskSettingVo;
    return request({
        url: '/manage/workflow/processTaskSetting/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delProcessTaskSetting(id) {
    const data = {id};
    return request({
        url: '/manage/workflow/processTaskSetting/removeByProcessTaskSetting',
        method: 'post',
        data
    })
}
export function delProcessTaskSettings(ids) {
    const data = {ids};
    return request({
        url: '/manage/workflow/processTaskSetting/removeByIds',
        method: 'post',
        data
    })
}
export function getProcessTaskSettingList(query) {
    return request({
        url: '/manage/workflow/processTaskSetting/pageByProcessTaskSetting',
        method: 'get',
        params: query
    });
}

