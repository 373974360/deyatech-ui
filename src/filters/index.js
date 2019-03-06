import common from '@/store/modules/common';
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}
/**
 * 日期格式化
 */
export function dateFormat(date) {
  let format = 'yyyy-MM-dd hh:mm:ss';
  if (date != 'Invalid Date') {
    var o = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "h+": date.getHours(), //hour
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      "S": date.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }
  return '';

}
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(parseInt(time))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function enums(value, type) {

  if(type == 'Enable' && value==-1) {
    return '已删除';
  }
  var array = common.state.enums[type];
  if(!array) {
    console.warn('没有枚举类型' + type);
    return value;
  }
  var result = array.filter(function (item) {
    return item.code === value;
  });
  if (result[0]) {
    return result[0].value || value;
  } else {
    return value;
  }
}
export function dicts(value, type) {
  var array = common.state.dicts[type];
  var result = array.filter(function (item) {
    return item.code === value;
  });
  if (result[0]) {
    return result[0].value || value;
  } else {
    result = array.filter(function (item) {
      return item.code === type + '_' + value;
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
    '已删除': 'danger',
    '菜单': 'success',
    '按钮': 'primary'
  };
  return statusMap[status]
}

export function stringToJson(value){
  if(value){
    return JSON.stringify(JSON.parse(value), null, 2)
  }
}


