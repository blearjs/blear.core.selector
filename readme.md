# blear.core.selector

[![npm module][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![coverage][coveralls-img]][coveralls-url]

[travis-img]: https://img.shields.io/travis/blearjs/blear.core.selector/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/blearjs/blear.core.selector

[npm-img]: https://img.shields.io/npm/v/blear.core.selector.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/blear.core.selector

[coveralls-img]: https://img.shields.io/coveralls/blearjs/blear.core.selector/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/blearjs/blear.core.selector?branch=master



## `.query(selector<String,Node>, [context<Node>])`
在上下文里根据元素选择器查找元素，返回数组。


## `.contains(childEl, parentEl)`
判断 childEl 是否被 parentEl 包含。


## `.siblings(el)`
返回 el 元素的兄弟元素数组。


## `.index(el)`
返回 el 元素在兄弟元素中的索引值。


## `.prev(el)`
返回 el 元素的前面的一个元素数组。


## `.next(el)`
返回 el 元素的后面的一个元素数组。


## `.prevAll(el)`
返回 el 元素的前面的所有元素数组。


## `.nextAll(el)`
返回 el 元素的后面的所有元素数组。



## `.closest(el, selector)`
从 el 元素本身开始获得最近匹配的祖先元素数组。


## `.parent(el)`
返回 el 元素的父级元素数组。


## `.children(el)`
返回 el 元素的子级元素数组。


## `.contents(el)`
返回 el 元素的子节点数组。



## `.isMatched(el, sel)`
判断元素是否匹配选择器。


## `.filter(nodeList, filter)`
根据 filter 函数过滤 nodeList （类）数组



