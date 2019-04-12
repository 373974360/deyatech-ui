// 配置编译环境和线上环境之间的切换

let baseUrl = '';
let iconfontVersion = ['font_1073104_2ff1pe4cdej'];
let iconfontCssUrl = `//at.alicdn.com/t/$key.css`;
let iconfontJsUrl = `//at.alicdn.com/t/$key.js`;
let codeUrl = `${baseUrl}/code`
const env = process.env
if (env.NODE_ENV == 'development') {
    baseUrl = ``; // 开发环境地址
} else if (env.NODE_ENV == 'production') {
    baseUrl = ``; //生产环境地址
} else if (env.NODE_ENV == 'test') {
    baseUrl = ``; //测试环境地址
}
export {
    baseUrl,
    iconfontCssUrl,
    iconfontJsUrl,
    iconfontVersion,
    codeUrl,
    env
}
