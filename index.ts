const port: number = 80;
import express from 'express';
import i18n from 'i18n';
import fs from "fs";
import path from "path";
import { kill } from 'process';
let app = express();

let jobData = require(path.join(path.resolve('.'), 'jobinfo.json'));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

i18n.configure({
    locales: ['en-US', 'en-GB'],
    directory: path.join(path.resolve('.'), 'locales'),
    defaultLocale: 'en-US',
    retryInDefaultLocale: true,

  })

app.use(express.static(path.join(path.resolve('.'), 'static')));

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

app.get('/join/:job', (req, res) => {
    let file: String = fs.readFileSync(path.join(path.resolve('.'), 'job.html'), 'utf-8');
    let url: string = req.path.toString()

    if (!jobData[req.params.job]) return res.status(404).render('404');

    file = file
    .replace('[[[NAVBAR]]]', '<p>navbar</p>')
    .replace('[[[WHAT_WE_WANT]]]', jobData[req.params.job].want)
    .replace('[[[WHAT_YOU_WILL_BE_DOING]]]', jobData[req.params.job].doing)
    .replace('[[[WHAT_TO_EXPECT]]]', jobData[req.params.job].expect)
    .replace('[[[ADDITIONAL_REQUIREMENTS]]]', jobData[req.params.job].additonal ? jobData[req.params.job].additonal : '');
    
    res.status(200).send(file);
    
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
    res.status(405).send('<center><h1>405 Method Not Allowed</h1><hr><p>Sorry, you can\'t access our website with that method.\n\nPlease use GET to access our website, and it\'s information.\n\nWhat were you even trying to do, anyways? Come work with us and help us out: https://definityteam.com/join\ndefinity-website</p></center>');
    return
});

app.listen(port, () => { console.log(`Online on port ${port}, root directory "${path.resolve('.')}"`) });