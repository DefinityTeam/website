import express = require('express');
const I18n = require('i18n');
import fs from "fs";
import path from "path";
let app = express();

console.log(path.join(__dirname))
let jobData = require(path.join(__dirname, '../jobinfo.json'));
const port: number = 80;
let host = 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'static')));

app.use((req, res, next) => {
    let host = `${req.protocol}://${req.hostname}`
    if (port !== 80) {
        host = `${host}:${port}`
     }
    res.append('Strict-Transport-Security', 'max-age=300; includeSubDomains; preload');
    res.append('Referrer-Policy', 'no-referrer');
    res.append('X-Frame-Options', 'SAMEORIGIN');
    res.append('X-Content-Type-Options', 'nosniff');
    res.append('Access-Control-Allow-Origin', host);
    res.append('Access-Control-Allow-Methods', 'GET');
    res.append('Access-Control-Allow-Headers', 'Permissions-Policy, Content-Type');
    res.append('Feature-Policy', 'accelerometer \'none\'; camera \'none\'; geolocation \'none\'; gyroscope \'none\'; magnetometer \'none\'; microphone \'none\'; payment \'none\'; usb \'none\'')
    res.append('Permissions-Policy', 'accelerometer=(),camera=(),geolocation=(),gyroscope=(),magnetometer=(),microphone=(),payment=(),usb=(),interest-cohort=()');
    res.append('Content-Security-Policy-Report-Only', 'default-src \'none\';script-src \'unsafe-inline\';connect-src \'none\';media-src \'none\';font-src \'self\';img-src \'self\';style-src \'unsafe-inline\';object-src \'none\';worker-src \'none\';child-src \'none\';frame-src \'none\';form-action \'none\';frame-ancestors \'none\';base-uri \'self\';block-all-mixed-content;');
    res.append('Content-Security-Policy', 'default-src \'none\';script-src \'unsafe-inline\';connect-src \'none\';media-src \'none\';font-src \'self\';img-src \'self\';style-src \'unsafe-inline\';object-src \'none\';worker-src \'none\';child-src \'none\';frame-src \'none\';form-action \'none\';frame-ancestors \'none\';base-uri \'self\';block-all-mixed-content;');
    res.append('X-XSS-Protection', '1; mode=block');
    res.append('Expect-CT', 'max-age=0');
    res.removeHeader('X-Powered-By');
    next();
  });

app.get('/join/*', (req, res) => {
    let file: String = fs.readFileSync(path.join(__dirname, 'job.html'), 'utf-8');
    let url: string = req.path.toString()

    if (!jobData[url.split('/')[2]]) return res.status(404).send('<center><h1>404 Not Found</h1><hr><p>definity-website</p></center>');

    //console.log(jobData[req.url.split('/')[2]]);
    file = file
    .replace('[[[NAVBAR]]]', '<p>navbar</p>')
    .replace('[[[WHAT_WE_WANT]]]', jobData[url.split('/')[2]].want)
    .replace('[[[WHAT_YOU_WILL_BE_DOING]]]', jobData[url.split('/')[2]].doing)
    .replace('[[[WHAT_TO_EXPECT]]]', jobData[url.split('/')[2]].expect)
    .replace('[[[ADDITIONAL_REQUIREMENTS]]]', jobData[url.split('/')[2]].additonal ? jobData[url.split('/')[2]].additonal : '');

    //console.log(file);

    res
    .status(200)
    .send(file);
    
});

app.get('*', (req, res) => {
    res.status(200).render(`.${req.path}`, function (err: string[], data: string[]) {
        if(err) {
            res.status(404).send('<center><h1>404 Not Found</h1><hr><p>definity-website</p></center>'); 
        }
        else res.send(data)
    });
    return;
});

app.all('*', (req, res) => {
    res.status(405).send('<center><h1>405 Method Not Allowed</h1><hr><p>definity-website</p></center>');
    return
});

app.listen(port, () => { console.log(`online at ${port}`) });