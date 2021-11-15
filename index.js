"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const port = 80;
const express_1 = __importDefault(require("express"));
const i18n_1 = __importDefault(require("i18n"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs/yargs"));
const helpers_1 = require("yargs/helpers");
let app = (0, express_1.default)();
let jobData = require(path_1.default.join(path_1.default.resolve('.'), 'jobinfo.json'));
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
i18n_1.default.configure({
    locales: ['en-US', 'en-GB'],
    directory: path_1.default.join(path_1.default.resolve('.'), 'locales'),
    defaultLocale: 'en-US',
    retryInDefaultLocale: true,
});
app.use(express_1.default.static(path_1.default.join(path_1.default.resolve('.'), 'static')));
app.use((req, res, next) => {
    let host;
    if (JSON.parse(JSON.stringify((0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).argv)).prod && (req.hostname !== ('localhost' || '127.0.0.1')) && req.protocol == 'http') {
        res.redirect(`https://${req.hostname}${req.url}`);
        host = `https://${req.hostname}`;
    }
    else {
        host = `http://${req.hostname}`;
    }
    if (!JSON.parse(JSON.stringify((0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).argv)).prod && port !== 80) {
        host = `${host}:${port}`;
    }
    app.set('host', host);
    if (JSON.parse(JSON.stringify((0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).argv)).prod) {
        res.append('Strict-Transport-Security', 'max-age=300; includeSubDomains; preload');
    }
    res.append('Referrer-Policy', 'no-referrer');
    res.append('X-Frame-Options', 'SAMEORIGIN');
    res.append('X-Content-Type-Options', 'nosniff');
    res.append('Access-Control-Allow-Origin', host);
    res.append('Access-Control-Allow-Methods', 'GET');
    res.append('Access-Control-Allow-Headers', 'Permissions-Policy, Content-Type');
    res.append('Feature-Policy', 'accelerometer \'none\'; camera \'none\'; geolocation \'none\'; gyroscope \'none\'; magnetometer \'none\'; microphone \'none\'; payment \'none\'; usb \'none\'');
    res.append('Permissions-Policy', 'accelerometer=(),camera=(),geolocation=(),gyroscope=(),magnetometer=(),microphone=(),payment=(),usb=(),interest-cohort=()');
    res.append('Content-Security-Policy-Report-Only', 'default-src \'none\';script-src \'unsafe-inline\';connect-src \'none\';media-src \'none\';font-src \'none\';img-src \'self\';style-src \'unsafe-inline\';object-src \'none\';worker-src \'none\';child-src \'none\';manifest-src \'self\';frame-src \'none\';form-action \'none\';frame-ancestors \'none\';base-uri \'self\';block-all-mixed-content;');
    res.append('Content-Security-Policy', 'default-src \'none\';script-src \'unsafe-inline\';connect-src \'none\';media-src \'none\';;font-src \'self\'img-src \'self\';style-src \'unsafe-inline\';object-src \'none\';worker-src \'none\';child-src \'none\';manifest-src \'self\';frame-src \'none\';form-action \'none\';frame-ancestors \'none\';base-uri \'self\';block-all-mixed-content;');
    res.append('X-XSS-Protection', '1; mode=block');
    res.append('Expect-CT', 'max-age=0');
    res.removeHeader('X-Powered-By');
    next();
});

app.get('/robots.txt', (req, res) => {
    res.status(200).type('text/plain').render('../other/robots', { host: app.get('host') });
});
app.get('/sitemap.xml', (req, res) => {
    res.status(200).type('application/xml').render('../other/sitemap', { host: app.get('host') });
});

app.get('/join/:job', (req, res) => {
    let file = fs_1.default.readFileSync(path_1.default.join(path_1.default.resolve('.'), 'job.html'), 'utf-8');
    let url = req.path.toString();
    if (!jobData[req.params.job])
        return res.status(404).render('../other/404');
    file = file
        .replace('[[[NAVBAR]]]', '<p>navbar</p>')
        .replace('[[[WHAT_WE_WANT]]]', jobData[req.params.job].want)
        .replace('[[[WHAT_YOU_WILL_BE_DOING]]]', jobData[req.params.job].doing)
        .replace('[[[WHAT_TO_EXPECT]]]', jobData[req.params.job].expect)
        .replace('[[[ADDITIONAL_REQUIREMENTS]]]', jobData[req.params.job].additonal ? jobData[req.params.job].additonal : '');
    res.status(200).send(file);
});
app.get('*', (req, res) => {
    res.status(200).render(`${req.path.split('/')[1]}`, { host: app.get('host') }, function (err, data) {
        if (err) {
            console.log(err);
            res.status(404).render('../other/404');
        }
        else
            res.send(data);
    });
    return;
});
app.all('*', (req, res) => {
    res.status(405).send('405 Method Not Allowed\n\nSorry, you can\'t access our website with that method.\n\nPlease use GET to access our website, and it\'s information.\n\nWhat were you even trying to do, anyways? Come work with us and help us out: https://definityteam.com/join\n');
    return;
});
switch (JSON.parse(JSON.stringify((0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).argv)).prod) {
    case true:
        app.listen(80, () => { console.log(`Online on HTTP, root directory "${path_1.default.resolve('.')}"`); });
        const server = https_1.default.createServer({
            key: fs_1.default.readFileSync(`${__dirname}/localhost-key.pem`, 'utf8'),
            cert: fs_1.default.readFileSync(`${__dirname}/localhost.pem`, 'utf8')
        }, app);
        server.listen(443, () => { console.log(`Online on HTTPS, root directory "${path_1.default.resolve('.')}"`); });
        break;
    case undefined:
        app.listen(port, () => { console.log(`Online on port ${port}, root directory "${path_1.default.resolve('.')}"`); });
}
;
//# sourceMappingURL=index.js.map