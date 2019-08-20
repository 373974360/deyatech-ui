import request from '@/router/axios';

export function getProcessDefinition(id) {
    return request({
        url: '/manage/workflow/processDefinition/getByProcessDefinition',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateProcessDefinition(processDefinitionVo){
    const data = processDefinitionVo;
    return request({
        url: '/manage/workflow/processDefinition/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delProcessDefinition(id) {
    const data = {id};
    return request({
        url: '/manage/workflow/processDefinition/removeByProcessDefinition',
        method: 'post',
        data
    })
}
export function delProcessDefinitions(ids) {
    const data = {ids};
    return request({
        url: '/manage/workflow/processDefinition/removeByIds',
        method: 'post',
        data
    })
}
export function getProcessDefinitionList(query) {
    return request({
        url: '/manage/workflow/processDefinition/pageByProcessDefinition',
        method: 'get',
        params: query
    });
}


