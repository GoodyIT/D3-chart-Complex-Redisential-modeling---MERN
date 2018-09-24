const express = require('express')
const app = express()
var methodOverride = require('method-override')
var bodyParser = require('body-parser');
var readdirp = require('readdirp');
var probe = require('probe-image-size');
// var fs = require('fs');
var path = require('path');
const jsonfile = require('jsonfile')
const file = path.join(__dirname, './data.json');

const port = 8000;

const isDevMode = process.env.NODE_ENV === 'development' || false;
const isProdMode = process.env.NODE_ENV === 'production' || false;

// Run Webpack dev server in development mode
if (isDevMode) {
  // Webpack Requirements
  // eslint-disable-next-line global-require
  const webpack = require('webpack');
  // eslint-disable-next-line global-require
  const config = require('../webpack.config.dev');
  // eslint-disable-next-line global-require
  const webpackDevMiddleware = require('webpack-dev-middleware');
  // eslint-disable-next-line global-require
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    watchOptions: {
      poll: 1000,
    },
  }));
  app.use(webpackHotMiddleware(compiler));
}


const DATA_PATH = path.join(__dirname, './test_dataset/');
// console.log(DATA_PATH)

function logErrors (err, req, res, next) {
    console.error(err.stack)
    next(err)
}

function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' })
    } else {
      next(err)
    }
  }

function errorHandler (err, req, res, next) {
    res.status(500)
    res.render('error', { error: err })
}

var settings = {
    root: DATA_PATH,
    entryType: 'all',
    // Filter files with js and json extension
    fileFilter: [ '*.jpg', '*.png', '*.jpeg' ],
    // Filter by directory
    directoryFilter: [ '!.git', '!*modules' ],
    // Work with files up to 1 subdirectory deep
    depth: 1
};

// In this example, this variable will store all the paths of the files and directories inside the providen path
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
  });
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(methodOverride())
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

app.get('/api/dir', (req, res) => {
    var lastParentDir = "";
    var parentDir = [];
    var allFilePaths = [];
    readdirp(settings)
            .on('data', function (entry) {
                if ( entry.parentDir != "" ) {
                    var data = require('fs').readFileSync(DATA_PATH + entry.path);
                    var info = probe.sync(data);
                    if (lastParentDir == "") {
                        lastParentDir = entry.parentDir;
                    } 
                    
                    if (lastParentDir != entry.parentDir) {
                        allFilePaths.push(
                            parentDir
                        );
                        parentDir = [];
                        lastParentDir = entry.parentDir;
                    } 

                    parentDir.push({
                        dir: entry.parentDir,
                        name: entry.name,
                        path: entry.path,
                        width: info.width,
                        height: info.height,
                    })
                }
               
            })
            .on('warn', function(warn){
                console.log("Warn: ", warn);
            })
            .on('error', function(err){
                console.log("Error: ", err);
            })
            .on('end', function(){
                res.send(JSON.stringify(allFilePaths))
                // ["c:/file.txt","c:/other-file.txt" ...]
            });
})

app.get('/api/get', (req, res1) => {
    jsonfile.readFile(file)
    .then(obj => {
        res1.send(JSON.stringify(obj))
    })
    .catch(error => console.error(error))
})

app.post('/api/save', (req, res1) => {
    jsonfile.writeFile(file, req.body)
        .then(res => {
            res1.send('success ', res);
        })
        .catch(error => console.error(error))
})

app.listen(port, () => console.log(`server is listening on port ${port}!`))



