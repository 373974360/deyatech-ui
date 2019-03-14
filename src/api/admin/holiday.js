import request from '@/router/axios';

export function getHoliday(id) {
    return request({
        url: '/manage/admin/holiday/getByHoliday',
        method: 'get',
        params: {id}
    })
}

export function saveOrUpdateBatch(holidayVo) {
    const data = holidayVo;
    return request({
        url: '/manage/admin/holiday/saveOrUpdateBatch',
        method: 'post',
        data
    })
}

export function delHoliday(id) {
    const data = {id};
    return request({
        url: '/manage/admin/holiday/removeByHoliday',
        method: 'post',
        data
    })
}

export function delHolidays(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/holiday/removeByIds',
        method: 'post',
        data
    })
}

export function getHolidayList(query) {
    return request({
        url: '/manage/admin/holiday/listByHoliday',
        method: 'get',
        params: query
    });
}


