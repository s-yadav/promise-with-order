var t=function(){this.promises=[]};t.prototype.wrap=function(t,o){var e=this.promises,r=t;o.allowReject&&(r=new Promise(function(o){t.then(o,o)}));var n=Promise.all(e.concat([t])).then(function(t){return t.pop()});return e.push(r),n},t.prototype.reset=function(){this.promise=[]},module.exports=t;
//# sourceMappingURL=PromiseWithOrder.js.map
