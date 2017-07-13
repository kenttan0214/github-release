# Github Release
This repository is an unopinioned helper to make releases into github.
It will generate release notes and inform users with mail and slack.

## Usage
You can install this dependency globally:

```
$ npm install [repo uri] -g
```

then pass the environment variables.

## Required envinrmonet variables
In order to run this app, you need to specify some environment variables:

1. **GITUSER** Represents the github user.
2. **GITPASS** Represents the github password or token.
3. **VERSION** Version of your deploy. You can provide a number, or like TeamCity build number. It must be idential among all releases otherwise it will be rejected.
4. **TEMP** The temp directory, which we can clone repository and then destroy it. This path must be writable also.
5. **GITOWNER** the github account owner without slashes, for example in `https://github.com/owner/test-repo` the `owner` is the owner.
6. **GITREPO** the repository name for example in `https://github.com/owner/test-repo` the `test-repo` is the repository.
7. **SLACK_TOKEN** If you are using a slack alert, get a token and put it here
8. **SLACK_NAME** The slack bot name
9. **SLACK_CHANNEL** Name of the channel that you want to subscribe to.

Example:
```
GITUSER= GITPASS= VERSION= GITREPO= GITOWNER= TEMP=/tmp/ SLACK_CHANNEL= SLACKNAME= SLACK_TOKEN= npm start
```

## Running project
You can run the project with `npm start`.
