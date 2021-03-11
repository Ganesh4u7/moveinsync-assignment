const express = require('express')
var path = require('path');

const app = express();
const port = normalizePort(process.env.PORT || '3000');


let app_init = async () => {

      



        

        const app = express();

        app.use(express.static(path.join(__dirname, './dist/moveinsync')));
        app.get('/',function(req,res){
           res.sendFile(path.join(__dirname,"./dist/moveinsync/index.html"));
        });
        app.all('*', function(req, res) {
            res.redirect("/");
          });

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}!`)
        });

}

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }

}   

app_init();