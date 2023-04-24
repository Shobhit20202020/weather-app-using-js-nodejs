// const http=require('http');
// const fs=require("fs");
// var requests=require("requests");


// const homeFile=fs.readFileSync("home.html","utf-8");
// const replacceVal=(tempval,orgval)=>{
//     let temperature=tempval.replace("{%tempval%}",orgval.main.temp);
//      temperature=temperature.replace("{%tempMin%}",orgval.main.temp_min);
//      temperature=temperature.replace("{%tempMax%}",orgval.main.temp_max);
//      temperature=temperature.replace("{%location%}",orgval.name);
//      temperature=temperature.replace("{%country%}",orgval.sys.country);
//      return temperature;



// }

// const server=http.createServer((req,res)=>{
//     if(req.url="/"){
//         requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=c8f74b700f7e8c6e80c9ae53276d7e07",
        
//         )
//         .on("data",(chunk)=>{
//             const objdata=JSON.parse(chunk);
//             const arrdata=[objdata]
//             // console.log(arrdata[0].main.temp);
//             const realTimeDate=arrdata.map((val)=> replacceVal(homeFile,val))
//                 res.write(realTimeDate)
//                 console.log(realTimeDate);


//             })
        
//         .on("end",(err)=>{
//             if(err) return console.log("connection closed due to errors",err);
//             res.end();
//         })
//     }

// })
// server.listen(4343,"127.0.0.1")
const http = require('http');
const fs = require('fs');
const request = require('request');

const homeFile = fs.readFileSync('home.html', 'utf-8');

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace('{%tempval%}', Math.round(orgVal.main.temp - 273.15));
temperature = temperature.replace('{%tempMin%}', Math.round(orgVal.main.temp_min - 273.15));
temperature = temperature.replace('{%tempMax%}', Math.round(orgVal.main.temp_max - 273.15));

  // let temperature = tempVal.replace('{%tempval%}', orgVal.main.temp);
  // temperature = temperature.replace('{%tempMin%}', orgVal.main.temp_min);
  // temperature = temperature.replace('{%tempMax%}', orgVal.main.temp_max);
  temperature = temperature.replace('{%location%}', orgVal.name);
  temperature = temperature.replace('{%country%}', orgVal.sys.country);
  temperature = temperature.replace('{%tempstatus%}', orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    request(
      'https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=c8f74b700f7e8c6e80c9ae53276d7e07',
      (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const objData = JSON.parse(body);
          const arrData = [objData];
          const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join('');
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write(realTimeData);
          res.end();
        } else {
          console.log('connection closed due to errors', error);
        }
      }
    );
  }
});

server.listen(4343, '127.0.0.1');
