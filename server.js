let express = require('express')
let path = require('path')
let bodyParser = require('body-parser')
let methodOverride = require('method-override')
let redis = require('redis')
let client = redis.createClient()
const cron = require('node-cron');
var mysql = require('mysql');

// define routes
let routes = require('./Routes/api')

// Set Port
let PORT = 4040

// Init app
let app = express()


// cron.schedule('*/60 * * * * *', function() { ini 60 detik
cron.schedule('*/2 * * * *', function() {
  console.log('Process running every 2 minutes');

  client.keys('*', (err, key) => {
    if (key != '') {

      var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "redistest"
      });

      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected to MySQL!");
      });

      // redis isi
    let return_dataset = []
    let multi = client.multi()
    let keys = Object.keys(key)
    let i = 0

    keys.forEach( (l) => {
      client.hgetall(key[l], (e, o) => {
        // i++
        if (e) {console.log(e)} else {
          temp_data = Object.values(o);
          
          var sql = "INSERT INTO `desc` (first_name, last_name, email, phone) VALUES (?)";

          con.query(sql, [temp_data], function (err) {
            if (err) throw err;
            console.log("record inserted");

          client.flushdb( function (err, succeeded) {
            console.log(succeeded + ' flush redis'); // will be true if successfull
        });
          });

        }

      })
    })
    // redis end

    } else {
      // kalo redis kosong
    }
  })
  
 });


// body-parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// methodOverride
app.use(methodOverride('_method'))

// Routes Middleware
app.use(routes)

// 404 handler
app.use((req, res) => {
  res.status(404)
  res.send('endpoint not found')
})

// serve application on specified port
app.listen(PORT, () => {
  // console.log('Server started on port ' + PORT)
});

module.exports = app
