/**
 * csm 2019-05-16
 */
import request from '@/router/axios';

/**
 * 五星级服务员
 * @param query
 */
export function getPlotFiveStarByUser(query) {
    return request({
            url: '/manage/statistics/staffSatisfaction/plotFiveStarByUser',
        method: 'get',
        params: query
    })
}
