var net = require('net');
var fs = require('fs');


var server = net.createServer(function(socket){
    socket.setEncoding();//设置data的形式
    socket.on('data',function(data){
        console.log(data);
        //处理data获取路径
        var url = (""+data).split('/')[1].split(' ')[0];
        //主页
        if(url==''){
            socket.write('HTTP/1.1 200 OK;\n');
            socket.write('Content-type: text/html;charset=utf-8\n\n');
        
            socket.write('<h1>welcome</h1><a href="http://localhost:8001/admin">进入管理后台</a>');
            socket.end();
        //管理后台页面
        }else if(url=='admin'){
            if(/.*Cookie:.*/.test(''+data)){
                var cookieV = (''+data).split('Cookie:')[1].split('SESSID=')[1].split(';')[0].split('\r\n\r\n')[0];
            }else{
                var cookieV = 'sajdhfuewalhaadfirield//()ff';
            }
            
            //判断Cookie是否存在
            fs.exists('./'+cookieV+'.txt',function(exists){
                //Cookie存在
                if(exists){
                    //读取文件内容
                    fs.readFile('./'+cookieV+'.txt','utf-8',function(err,data){
                        if(err){
                            console.error(err);
                        }
                        else{
                            socket.write('HTTP/1.1 200 OK;\n');
                            socket.write('Content-type: text/html;charset=utf-8\n\n');
            
        
                            socket.write(data+'登录成功');
                            socket.end();
                        }
                    });
                //Cookie不存在则跳转至登录页面
                }else{
                    socket.write('HTTP/1.1 302 Moved Temporarily;\n');
                    socket.write("Location: http://localhost:8001/login\n");
                    socket.write('Content-type: text/html;charset=utf-8\n\n');
        
                    socket.end();
                }
            });
        //登录页面
        }else if(url=='login'){
            //登录页面
            if(/^GET.*/.test(""+data)){
                socket.write('HTTP/1.1 200 OK;\n');
                socket.write('Content-type: text/html;charset=utf-8\n\n');
    
                socket.write('<form method="post" action="http://localhost:8001/login">');
                socket.write('username<input type="text" name ="username">');
                socket.write('password<input type="text" name ="password">');
                socket.write('<button type = "submit">登录</button>');
                socket.write('</form>');
                socket.end('\n');
                socket.end();
            //处理表单
            }else{
                var strArr = (""+data).split('=');
                var username = strArr[strArr.length-2].split('&')[0];
                var password = strArr[strArr.length-1];
                //密码正确
                if(username=='admin'&&password=='123456'){
                    var newCookie = '';
                    for(var i = 0;i<15;i++){
                        var a = Math.floor(Math.random()*36).toString(36);
                        newCookie += a;
                    }
                    fs.writeFile('./'+newCookie+'.txt', username, function(err) {
                        if(err) {
                            return console.log(err);
                        }
                    });

                    socket.write('HTTP/1.1 302 Moved Temporarily;\n');
                    socket.write("Location: http://localhost:8001/admin\n");
                    socket.write('Set-Cookie:SESSID='+newCookie+';\n')
                    socket.write('Content-type: text/html;charset=utf-8\n\n');
                
                    socket.end();
                //密码错误
                }else{
                    socket.write('HTTP/1.1 302 Moved Temporarily;\n');
                    socket.write("Location: http://localhost:8001/login\n");
                    socket.write('Content-type: text/html;charset=utf-8\n\n');

                    
                    socket.end();
                }
            }




        }

    });

});
server.listen(8001,'localhost');