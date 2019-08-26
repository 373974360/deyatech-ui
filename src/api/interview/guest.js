import request from '@/router/axios';
export function getGuest(id) {
    return request({
        url: '/manage/interview/guest/getByGuest',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateGuest(guestVo){
    const data = guestVo;
    return request({
        url: '/manage/interview/guest/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delGuest(id) {
    const data = {id};
    return request({
        url: '/manage/interview/guest/removeByGuest',
        method: 'post',
        data
    })
}
export function delGuests(ids) {
    const data = {ids};
    return request({
        url: '/manage/interview/guest/removeByIds',
        method: 'post',
        data
    })
}
export function getGuestList(query) {
    return request({
        url: '/manage/interview/guest/pageByGuest',
        method: 'get',
        params: query
    });
}


