var spawn = require('child_process').spawn;
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile(__dirname + "/" + "index.html");
})

app.get('/process_get', function (req, res) {
   remote = req.query.remote
   if(remote=='no'){
      address = req.query.address
      console.log('querying gpu', address)
      // 输出 JSON 格式
      gpuinfo = spawn('ssh', ['lxc@' + address, 'gpustat']);
   }
   
   else{
      port = req.query.port
      console.log('querying gpu: ali.prince2015.club:', port)
      // 输出 JSON 格式
      gpuinfo = spawn('ssh', ['-p', port, 'lxc@ali.prince2015.club', 'gpustat']);
   }
   gpuinfo.stdout.on('data', function (data) {
      var response = {
         'data': data.toString(),
      };
      res.writeHead(200, "OK", {
         'Content-Type':'text/html;charset=utf-8',
         "Access-Control-Allow-Origin": 'http://192.168.0.75:8081',
      })
      res.end(JSON.stringify(response));
   })
   gpuinfo.stderr.on('data', function (data) {
      console.log("query error", data)
   })
})

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("应用实例，访问地址为 http://%s:%s", host, port)

})