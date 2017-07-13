const path = require('path');

module.exports.gitconfig = {
    password: process.env.GITPASS,
    username: process.env.GITUSER,
    owner: process.env.GITOWNER,
    repo: process.env.GITREPO
};

module.exports.build = {
    version: process.env.VERSION,
    tempdirectory: process.env.TEMP,
    repopath: path.resolve(process.env.TEMP + '/' + process.env.GITREPO)
};
