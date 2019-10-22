import request from '@/router/axios';
export function getStudentCardReissueInfo(id) {
    return request({
        url: '/manage/reissue/studentCardReissueInfo/getByStudentCardReissueInfo',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateStudentCardReissueInfo(studentCardReissueInfoVo){
    const data = studentCardReissueInfoVo;
    return request({
        url: '/manage/reissue/studentCardReissueInfo/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delStudentCardReissueInfo(id) {
    const data = {id};
    return request({
        url: '/manage/reissue/studentCardReissueInfo/removeByStudentCardReissueInfo',
        method: 'post',
        data
    })
}
export function delStudentCardReissueInfos(ids) {
    const data = {ids};
    return request({
        url: '/manage/reissue/studentCardReissueInfo/removeByIds',
        method: 'post',
        data
    })
}
export function getStudentCardReissueInfoList(query) {
    return request({
        url: '/manage/reissue/studentCardReissueInfo/pageByStudentCardReissueInfo',
        method: 'get',
        params: query
    });
}


