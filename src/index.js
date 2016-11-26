/**
 * 核心 dom 选择器
 * 选择器返回结果全部都是数组
 * @author zcl
 * 2016-04-12 09:35
 */



'use strict';

require('blear.polyfills.string');
var selector = require('blear.polyfills.selector');
var array = require('blear.utils.array');
var typeis = require('blear.utils.typeis');
var compatible = require('blear.utils.compatible');
var debug = require('blear.utils.debug');

var win = window;
var doc = win.document;
var matchesSelector = compatible.js('matchesSelector', doc.body);

/**
 * 在上下文中查找DOM元素，永远返回一个数组
 * @param {String|Object}  selector  选择器
 * @param {Object|String} [context=document] 上下文
 * @return {Array}
 *
 * @example
 * selector.query('body');
 * // => [HTMLBODYElement]
 * selector.query('div');
 * // => [div, div, ...]
 */
var query = exports.query = function (selector, context) {
    context = context || doc;
    var selectorType = typeis(selector);

    switch (selectorType) {
        case 'window':
        case 'document':
            return [selector];
    }

    //判断context的类型
    //返回一个数组
    //context也可以是一个字符串，类似jQuery选择器
    var contextType = typeis(context);
    var ret = [];
    var contextRet;
    var push = ret.push;

    switch (contextType) {
        case 'string':
            context = context.trim();
            contextRet = doc.querySelectorAll(context);
            break;

        case 'element':
            contextRet = [context];
            break;

        default:
            contextRet = [doc];
    }

    array.each(contextRet, function (i, context) {
        switch (selectorType) {
            case 'string':
                selector = selector.trim();
                if (selector) {
                    try {
                        push.apply(ret, array.from(context.querySelectorAll(selector)));
                    } catch (err) {
                        // ignore
                    }
                }
                break;

            case 'element':
                if (contains(selector, context)) {
                    push.call(ret, selector);
                }
                break;
        }
    });

    return ret;
};

/**
 * 判断元素是否包含关系
 * @param childEl {Object} 子元素
 * @param parentEl {Object} 父元素
 * @returns {Boolean}
 */
var contains = exports.contains = function (childEl, parentEl) {
    if (parentEl === doc) {
        return true;
    }

    return parentEl.contains(childEl);
};


/**
 * 获取当前元素的其他兄弟元素
 * @param {Object} el 元素
 * @returns {Array}
 *
 * @example
 * selector.siblings(ele);
 * // => [div, div, ...];
 */
exports.siblings = function (el) {
    if (!el || !el.nodeType) {
        return [];
    }

    return array.filter(el.parentNode.children, function (child) {
        return child !== el;
    });
};


/**
 * 获取当前元素的索引值
 * @param {Object} el 元素
 * @returns {number} 未匹配到位-1，匹配到为[0,+∞)
 *
 * @example
 * selector.index(ele);
 * // find => [0,+∞)
 * // unfind => -1
 */
exports.index = function (el) {
    if (!el || !el.nodeType) {
        return -1;
    }

    var ret = -1;
    var parent = el.parentNode;

    array.each(parent.children, function (index, child) {
        if (child === el) {
            ret = index;
            return false;
        }
    });

    return ret;
};


/**
 * 获取元素的上一个兄弟元素
 * @param {Object} el 元素
 * @returns {Array}
 *
 * @example
 * selector.prev(ele);
 * // => [div];
 */
exports.prev = function (el) {
    if (!el || !el.nodeType) {
        return [];
    }

    return [el.previousElementSibling];
};


/**
 * 获取元素的下一个兄弟元素
 * @param {Object} el 元素
 * @returns {Array}
 *
 * @example
 * selector.next(ele);
 * // => [div];
 */
exports.next = function (el) {
    if (!el || !el.nodeType) {
        return [];
    }

    return [el.nextElementSibling];
};


/**
 * 获取元素的上面全部兄弟元素
 * @param {Object} el 元素
 * @returns {Array}
 *
 * @example
 * selector.next(ele);
 * // => [div];
 */
exports.prevAll = function (el) {
    if (!el || !el.nodeType) {
        return [];
    }

    var ret = [];
    var parent = el.parentNode;
    var childrens = array.from(parent.children);

    array.each(childrens, function (index, child) {
        if (child !== el) {
            ret.push(child);
        } else {
            return false;
        }
    });

    return ret;
};


/**
 * 获取元素的下面全部兄弟元素
 * @param {Object} el 元素
 * @returns {Array}
 *
 * @example
 * selector.next(ele);
 * // => [div];
 */
exports.nextAll = function (el) {
    if (!el || !el.nodeType) {
        return [];
    }

    var ret = [];
    var parent = el.parentNode;
    var childrens = array.from(parent.children);

    array.each(childrens.reverse(), function (index, child) {
        if (child !== el) {
            ret.push(child);
        } else {
            return false;
        }
    });

    return ret;
};


/**
 * 从元素本身开始获得最近匹配的祖先元素
 * @param {Object} el 元素
 * @param {String|Object} sel 选择器
 * @param {HTMLElement} [rootEl] 根元素，默认是 document
 * @returns {Array}
 *
 * @example
 * selector.closest(ele, 'div');
 * // => [div];
 */
exports.closest = function (el, sel, rootEl) {
    if (!el || !el.nodeType) {
        return [];
    }

    rootEl = rootEl || doc;

    if (typeis.String(sel)) {
        while (el !== rootEl && typeis.Element(el)) {
            if (matches(el, sel)) {
                return [el];
            }

            el = getParent(el)[0];
        }
    } else if (typeis.Element(sel)) {
        while (el && el !== rootEl) {
            if (el === sel) {
                return [el];
            }

            el = getParent(el)[0];
        }
    } else if (typeis.Window(sel) || typeis.Document(sel)) {
        return [sel];
    }

    return [];
};


/**
 * 获得父级元素
 * @param {Object} el 元素
 * @returns {Array}
 *
 * @example
 * selector.parent(ele);
 * // => [div];
 */
var getParent = exports.parent = function (el) {
    if (!el || !el.nodeType) {
        return [];
    }

    return [el.parentNode || el.parentElement];
};


/**
 * 获取子元素
 * @param {Object} el 元素
 * @returns {Array}
 *
 * @example
 * selector.children(ele);
 * // => [div, div, ...];
 */
exports.children = function (el) {
    if (!el || !el.nodeType) {
        return [];
    }

    return array.from(el.children);
};


/**
 * 获取子节点
 * @param {Object} el 元素
 * @returns {Array}
 *
 * @example
 * selector.contents(ele);
 * // => [div, div, ...];
 */
exports.contents = function (el) {
    if (!el || !el.nodeType) {
        return [];
    }

    return el.contentDocument ? [el.contentDocument] : array.from(el.childNodes);
};


/**
 * 元素与选择器是否匹配
 * @param {Object} el 元素
 * @param {String} sel 选择器
 * @returns {Boolean}
 *
 * @example
 * selector.matches(ele, 'div');
 * // => true OR false
 */
var matches = exports.matches = function (el, sel) {
    return el[matchesSelector](sel);
};


exports.isMatched = debug.deprecate(matches, '请使用`selector.matches(el, sel)`代替');


/**
 * 过滤节点集合
 * @param {Array|NodeList} nodeList 节点集合
 * @param {Function} filter 过滤方法，返回true选择该节点
 * @returns {Array} 过滤后的节点集合
 *
 * @example
 * selector.filter(ele, function(){
     *     return this.nodeName === 'DIV';
     * });
 * // => [div, div, ...]
 */
exports.filter = function (nodeList, filter) {
    return array.filter(nodeList, filter);
};


// /**
//  * 判断上下文是否存在某元素
//  * @param el {Element} 元素
//  * @param context {Object|String} 上下文
//  * @returns {boolean}
//  */
// exports.has = function (el, context) {
//     context = context || doc;
//
//     if (el === context) {
//         return true;
//     }
//
//     var className = 'q' + random.guid();
//
//     classList.add(el, className);
//
//     var list = query('.' + className, context);
//
//     classList.remove(el, className);
//
//     return list.length > 0;
// };
