import {getStore} from '@/util/store'
import moment from 'moment';

export function date(value, format) {
    if (value) {
        return moment(value).format(format);
    } else {
        return '';
    }
}

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

export function deliveryStatusFilter(status) {
    const deliveryStatusMap = {
        0: '快递收件（揽件）',
        1: '在途中',
        2: '派件中',
        3: '已签收',
        4: '派送失败（拒签等）'
    };
    return deliveryStatusMap[status];
}

export function expressTypeFilter(type) {
    const expressTypeMap = {
        'EMS': '邮政EMS',
        'HTKY': '百世快递',
        'DEPPON': '德邦物流',
        'GTO': '国通快递',
        'KYEXPRESS': '跨越速运',
        'STO': '申通快递',
        'SFEXPRESS': '顺丰速运',
        'TTKDEX': '天天快递',
        'YTO': '圆通速递',
        'YUNDA': '韵达快递',
        'ZJS': '宅急送',
        'ZTO': '中通快递'
    };
    return expressTypeMap[type];
}

export function convertBlank(value) {
    return value.replace(/\s/g, '\xa0');
}
