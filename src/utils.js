const bash = (x) => {
    try {
        return require('child_process').execSync(x).toString().trim();
    } catch (error) {
        console.error('Error: ' , error.toString());
    }
};

function terminate (message) {
    console.log('--------------------------------------------'.red);
    console.log(message.bgMagenta);
    console.log('--------------------------------------------'.red);
    process.exit(100);
}

function successResult (message) {
    console.log('.......................................'.green);
    console.log(message.bgCyan);
    console.log('.......................................'.green);
    const {bot} = require('./slack');
    bot.postMessageToChannel(process.env.SLACK_CHANNEL, message).then(function () {
        console.log('Message sent successfully.');
        process.exit(0);
    }).catch(error => {
        console.log('Error'.bgRed , error);
        process.exit(0);
    });
}


function commitRelease (repositoryPath, version) {
    console.log('-------------> ' , bash (`cd ${repositoryPath} && git tag release-${version} && git push origin release-${version}`));
}

function getRepoTags (repositoryPath)  {
    let tagsBash = bash(`cd ${repositoryPath} && git show-ref --tags`);
    if (!tagsBash || tagsBash.trim() == '') return [];
    return tagsBash.split('\n').map(tag => tag.split(' ')[1].replace('refs/tags/' , ''));
}

function getReleaseTags (tags)  {
    return tags.filter(tag => tag.substr(0,8) == 'release-');
}

function cloneRepository (gitinfo , destinationPath) {
    console.log('Started to clone repository, into',destinationPath,' be patient....');
    bash(`rm ${destinationPath} -R`);
    let url = `git clone https://${gitinfo.username}:${gitinfo.password}@github.com/${gitinfo.owner}/${gitinfo.repo} ${destinationPath}`;
    bash(url);
    return true;
}

function publishReleaseNote (body , version, gitconfig) {
    let data= {
        'tag_name': 'release-' + version,
        'target_commitish': 'master',
        'name': 'Release ' + version,
        'body':  body.trim().replace(/"/g , '').replace(/'/g , ''),
        'draft': false,
        'prerelease': false
    };
    let json = null;
    let context= bash(`curl --data '${JSON.stringify(data)}' https://api.github.com/repos/${gitconfig.owner}/${gitconfig.repo}/releases?access_token=${gitconfig.password}`);
    try {
        json = JSON.parse(context.trim());
    } catch (error) {
        return false;
    }
    return json;
}

function findCommitsDifference (compare, repodir, base = 'master') {
    bash(`cd ${repodir} && git checkout ${base}`);
    let diff = bash(`cd ${repodir} && git shortlog ${compare}...`);

    diff = diff.replace(/ {6}Merge (pull|branch) (.)*\s/g , '');
    diff = diff.replace(/(.)*\([\w]+\):/g , '');
    diff = diff.replace(/ {6}/g , '');
    diff = diff.replace(/\s\s/g , '');

    if (!diff.trim().length) {
        terminate(`
        We could not find any difference between ${base} and latest release: ${compare}.
        Nothing to tag, nothing to put in release notes.
        `);
    }
    return diff;
}

module.exports = {
    terminate,
    successResult,
    commitRelease,
    getRepoTags,
    getReleaseTags,
    cloneRepository,
    publishReleaseNote,
    findCommitsDifference
};
