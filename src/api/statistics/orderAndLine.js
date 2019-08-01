/**
 * csm 2019-05-16
 */
import request from '@/router/axios';
import moment from 'moment';

export function date(value, format) {
    if (value) {
        return moment(value).format(format);
    } else {
        return '';
    }
}

/**
 * 查询当天排队人数、当前排队人数及平均等待时长
 * @param query
 */
export function dataPlotQueueCount(query) {
    return request({
        url: '/manage/statistics/orderAndLine/dataPlotQueueCount',
        method: 'get',
        params: query
    });
}

/**
 * 查询不同时间段排队信息
 * @param query
 */
export function dataPlotCount(query) {
    return request({
        url: '/manage/statistics/orderAndLine/dataPlotCount',
        method: 'get',
        params: query
    });
}

/**
 * 查询窗口等待事件排行
 * @param query
 */
export function dataPlotTopWaitWindow(query) {
    return request({
        url: '/manage/statistics/orderAndLine/dataPlotTopWaitWindow',
        method: 'get',
        params: query
    });
}

/**
 * 查询事项等待事件排行
 * @param query
 */
export function dataPlotTopWaitItem(query) {
    return request({
        url: '/manage/statistics/orderAndLine/dataPlotTopWaitItem',
        method: 'get',
        params: query
    });
}
