import request from '@/router/axios';
export function getOnlineTraining(id) {
    return request({
        url: '/manage/zsds/onlineTraining/getByOnlineTraining',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateOnlineTraining(onlineTrainingVo){
    const data = onlineTrainingVo;
    return request({
        url: '/manage/zsds/onlineTraining/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delOnlineTraining(id) {
    const data = {id};
    return request({
        url: '/manage/zsds/onlineTraining/removeByOnlineTraining',
        method: 'post',
        data
    })
}
export function delOnlineTrainings(ids) {
    const data = {ids};
    return request({
        url: '/manage/zsds/onlineTraining/removeByIds',
        method: 'post',
        data
    })
}
export function getOnlineTrainingList(query) {
    return request({
        url: '/manage/zsds/onlineTraining/pageByOnlineTraining',
        method: 'get',
        params: query
    });
}


