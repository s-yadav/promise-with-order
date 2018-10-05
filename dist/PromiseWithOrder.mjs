var t=function(){this.promises=[]};t.prototype.wrap=function(t,e){var o=this.promises,r=t;e.allowReject&&(r=new Promise(function(e){t.then(e,e)}));var n=Promise.all(o.concat([t])).then(function(t){return t.pop()});return o.push(r),n},t.prototype.reset=function(){this.promise=[]};export default t;
//# sourceMappingURL=PromiseWithOrder.mjs.map
