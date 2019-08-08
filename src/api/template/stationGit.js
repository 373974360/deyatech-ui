import request from '@/router/axios';
export function getStationGit(id) {
    return request({
        url: '/manage/template/stationGit/getByStationGit',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateStationGit(stationGitVo){
    const data = stationGitVo;
    return request({
        url: '/manage/template/stationGit/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delStationGit(id) {
    const data = {id};
    return request({
        url: '/manage/template/stationGit/removeByStationGit',
        method: 'post',
        data
    })
}
export function delStationGits(ids) {
    const data = {ids};
    return request({
        url: '/manage/template/stationGit/removeByIds',
        method: 'post',
        data
    })
}
export function getStationGitList(query) {
    return request({
        url: '/manage/template/stationGit/pageByStationGit',
        method: 'get',
        params: query
    });
}
export function listByStationGroupAndStationGit() {
    return request({
        url: '/manage/template/stationGit/listByStationGroupAndStationGit',
        method: 'get'
    });
}
export function doSync(siteId,gitUrl,userName,password) {
    const data = {siteId:siteId,gitUrl:gitUrl,userName:userName,password:password};
    return request({
        url: '/manage/template/stationGit/sync',
        method: 'post',
        data
    });
}
export function listTemplateFiles(siteId,path) {
    const query = {siteId:siteId,path:path};
    return request({
        url: '/manage/template/stationGit/listTemplateFiles',
        method: 'get',
        params: query
    });
}
export function getFileContent(path) {
    const query = {path:path};
    return request({
        url: '/manage/template/stationGit/getFileContent',
        method: 'get',
        params: query
    });
}
export function unzip(filePath,siteId) {
    const query = {filePath:filePath,siteId:siteId};
    return request({
        url: '/manage/template/stationGit/unzip',
        method: 'get',
        params: query
    });
}
export function getStationGitBySiteId(siteId) {
    const query = {siteId};
    return request({
        url: '/manage/template/stationGit/getStationGitBySiteId',
        method: 'get',
        params: query
    });
}


