'use strict';

require('zone.js/dist/zone-node');
require('reflect-metadata');

const express = require('express');
const ngUniversal = require('@nguniversal/express-engine');
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.bundle');

const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = `${process.cwd()}/dist`;

app.engine('html', ngUniversal.ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));

app.set('view engine', 'html');
app.set('views', `${DIST_FOLDER}/browser`);

function angularRouter(req, res) {
    //res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req, res });
    res.render('index', { req, res });
}

app.get('/', angularRouter);

app.use(express.static(`${DIST_FOLDER}/browser`));

app.get('*', angularRouter);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});