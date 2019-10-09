var net = require('net');
var fs = require('fs');


var server = net.createServer(function(socket){
    socket.setEncoding();
    socket.on('data',function(data){
        //console.log(data);
        var url = (""+data).split('/')[1].split(' ')[0];
        if(url==''){
            socket.write('HTTP/1.1 200 OK;\n');
            socket.write('Content-type: text/html;charset=utf-8\n\n');
        
            socket.write('<h1>welcome</h1><a href="http://localhost:8001/admin">进入管理后台</a>');
            socket.end();
        }else if(url=='admin'){
            var cookieArr = (""+data).split('=');
            var cookieV = cookieArr[cookieArr.length-1].split('\r\n\r\n')[0];
            var cookieKArr = cookieArr[cookieArr.length-2].split(' ');
            var cookieK = cookieKArr[cookieKArr.length-1];
            fs.exists('./'+cookieV+'.txt',function(exists){
                
                if(exists){
                    
                    fs.readFile('./'+cookieV+'.txt','utf-8',function(err,data){
                        if(err){
                            console.error(err);
                        }
                        else{
                            console.log(data+'登录了');
                        }
                    });
                    socket.write('HTTP/1.1 200 OK;\n');
                    socket.write('Content-type: text/html;charset=utf-8\n\n');
    

                    socket.write('登录成功');
                    socket.end();
                }else{
                    socket.write('HTTP/1.1 302 Moved Temporarily;\n');
                    socket.write("Location: http://localhost:8001/login\n");
                    socket.write('Content-type: text/html;charset=utf-8\n\n');
        
                    socket.end();
                }
            });

        }else if(url=='login'){
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
            }else{
                var strArr = (""+data).split('=');
                var username = strArr[strArr.length-2].split('&')[0];
                var password = strArr[strArr.length-1];
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