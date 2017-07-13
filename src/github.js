const {
    terminate,
    successResult,
    cloneRepository,
    getReleaseTags,
    getRepoTags,
    findCommitsDifference,
    publishReleaseNote,
    commitRelease
} = require('./utils');
const { build, gitconfig } = require('./info');

function buildConfigPrevalidate () {
    if (!build.version) {
        terminate('Please specifiy this build version as environment. If not we can not proceed because we need to tag it later.');
    }
    if (!build.tempdirectory) {
        terminate('Temporary directory is not correct or not accessible. Please check \'TEMP\' environment variable correctly.');
    }
}

function gitConfigPrevalidate () {
    if (!gitconfig.password) {
        terminate('Please add your github token as \'GITPASS\' environment variable.');
    }
    if (!gitconfig.repo) {
        terminate('Please add your github repo name as \'GITREPO\' environment variable.');
    }
    if (!gitconfig.owner) {
        terminate('Please add your github owner as \'GITOWNER\' environment variable.');
    }
    if (!gitconfig.username) {
        terminate('Please define your github username as \'GITUSER\' environment variable.');
    }
}

function prevalidate () {
    gitConfigPrevalidate();
    buildConfigPrevalidate();
}

function getValidReleases () {
    let tags = getRepoTags(build.repopath);
    let releases = getReleaseTags(tags);

    // Kill process if user tries to release with version number which is smaller than the
    // largest existing number.
    let x = releases.map(t => parseInt(t.substr(8),0));
    if (Math.max(...x) > build.version) {
        terminate(`
        The version you provided in environment variable (${build.version}) is less than ${Math.max(...x)} which already exists
        in git tags. Please check if somebody made a release at the same time with you or you are providing version number incorrectly.
        If you running this on a teamcity.
        `);
    }

    if (releases.length == 0) {
        terminate(`
            There is no 'release-*' tag in this repository.
            We calculate the releases by detecting latest release and retrieve the messages between.
            In this case, if this is the first time you run this script, please go and a tag like:
            release-1, from your latest release then we can detect the difference with master branch.
        `);
    }

    if ( releases.indexOf('release-' + build.version) >= 0) {
        terminate(`
            We cannot accept vesion you passed (${build.version}), since we found in git tags there is a
            release-${build.version}, so we won't be able to do that. You may change your configuration in teamcity,
            or pass the correct environment variable VERSION.
        `);
    }
    return releases;
}

function gitWorkFlow () {
    cloneRepository(gitconfig, build.repopath);
    let releases = getValidReleases();
    let commits = findCommitsDifference(releases.pop(), build.repopath);
    commitRelease(build.repopath , build.version);
    console.log('We\'re done, this tagged.'.bgGreen);
    publishReleaseNote (commits , build.version, gitconfig);
    let content = `Build number ${build.version} is successfully released.`;
    successResult(content);
}

module.exports = {
    gitWorkFlow,
    prevalidate
};
