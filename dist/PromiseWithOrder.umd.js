!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.promiseWithOrder=t()}(this,function(){var e=function(){this.promises=[]};return e.prototype.wrap=function(e,t){var o=this.promises,n=e;t.allowReject&&(n=new Promise(function(t){e.then(t,t)}));var i=Promise.all(o.concat([e])).then(function(e){return e.pop()});return o.push(n),i},e.prototype.reset=function(){this.promise=[]},e});
//# sourceMappingURL=PromiseWithOrder.umd.js.map