var koa = require('koa');
var serve = require('koa-static');
var app = koa();

app.outputErrors = true
app.use(serve('.'));

app.listen(3000);
console.log('Server started.')