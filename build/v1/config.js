"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env = process.env.APP_ENV;
const localhost = {
    SITE_URL: 'http://localhost:4300/',
};
const development = {
    SITE_URL: 'https://dev.evitalrx.in/',
};
const production = {
    SITE_URL: 'https://www.evitalrx.in/',
};
const environments = {
    localhost,
    development,
    production
};
exports.config = environments[env];
//# sourceMappingURL=config.js.map