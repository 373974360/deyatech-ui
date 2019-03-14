import {getStore} from '@/util/store'

export function enums(value, type) {
    if (type == 'Enable' && value == -1) {
        return '已删除';
    }
    const array = getStore({name: 'enums'})[type] || [];
    if (!array) {
        console.warn('没有枚举类型' + type);
        return value;
    }
    const result = array.filter(function (item) {
        return item.code === value;
    });
    if (result[0]) {
        return result[0].value || value;
    } else {
        return value;
    }
}

export function dicts(value, type) {
    const array = getStore({name: 'dicts'})[type] || [];
    let result = array.filter(function (item) {
        return item.code === value;
    });
    if (result[0]) {
        return result[0].value || value;
    } else {
        result = array.filter(function (item) {
            return item.code === value;
        });
        if (result[0]) {
            return result[0].value || value;
        } else {
            return value;
        }
    }
}

export function statusFilter(status) {
    const statusMap = {
        '启用': 'success',
        '停用': 'gray',
        '已删除': 'danger'
    };
    return statusMap[status]
}
