/**
 * csm 2019-05-16
 */
import request from '@/router/axios';

/**
 * 窗口满意度
 * @param query
 */
export function dataPlotSatisfactionLevelByWindow(query) {
    return request({
        url: '/manage/statistics/windowSatisfaction/dataPlotSatisfactionLevelByWindow',
        method: 'get',
        params: query
    })
}
