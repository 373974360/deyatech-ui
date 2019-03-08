import request from '@/router/axios';

export function getMenu(id) {
    return request({
        url: '/manage/admin/menu/getByMenu',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateMenu(menuVo) {
    const data = menuVo;
    return request({
        url: '/manage/admin/menu/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delMenu(id) {
    const data = {id};
    return request({
        url: '/manage/admin/menu/removeByMenu',
        method: 'post',
        data
    })
}

export function delMenus(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/menu/removeByIds',
        method: 'post',
        data
    })
}

export function getMenuTree(query) {
    return request({
        url: '/manage/admin/menu/getTree',
        method: 'get',
        params: query
    });
}

export function getMenuCascader(query) {
    return request({
        url: '/manage/admin/menu/getCascader',
        method: 'get',
        params: query
    });
}



