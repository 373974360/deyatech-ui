/**
 * 根据指定属性的值从树结构中查找
 *
 * @param treeData
 * @param key
 * @param value
 * @returns {*}
 */
export function getNodeData(treeData, key, value) {
    if (treeData && treeData.length > 0) {
        for (let item of treeData) {
            if (value === item[key]) {
                return item
            }
            let nodeData = getNodeData(item.children, key, value)
            if (nodeData) {
                return nodeData
            }
        }
    }
    return null
}

/**
 * 获取节点的所有上级节点
 *
 * @param node
 * @param treeData
 * @returns {Array}
 */
export function getParentKeys(node, treeData) {
    let keys = [];
    if (node && node.parentId !== '0') {
        keys.push(node.parentId);
        let pNode = getNodeData(treeData, 'id', node.parentId);
        keys.push.apply(keys, getParentKeys(pNode, treeData));
    }
    return keys;
}

/**
 * 获取节点的所有子级节点
 *
 * @param children
 * @returns {Array}
 */
export function getChildrenKeys(node) {
    let keys = [];
    if (node.children && node.children.length > 0) {
        for (let child of node.children) {
            keys.push(child.id);
            keys.push.apply(keys, getChildrenKeys(child));
        }
    }
    return keys;
}
