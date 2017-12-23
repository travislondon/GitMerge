#!/usr/bin/env node
// requirements
var nodeRepository = require('../modules/noderepository')
// Initialize required arguments
var repositoryPath, destination, left, right

function checkArguments() {
    var argv = require('optimist')
        .usage('Usage: $0 --repository [path] --destination [path] --left [identifier] --right [identifier]')
        .demand(['repository', 'destination', 'left', 'right'])
        .describe('repository', 'Path to remote or local repository.')
        .describe('destination', 'Local destination for repository clone')
        .describe('left', 'The destination branch for the merge')
        .describe('right', 'The source branch for the merge')
        .argv

    repositoryPath = argv.repository
    destination = argv.destination
    left = argv.left
    right = argv.right
}

var nodemerge = function NodeMerge(repository, left, right) {
    var git = require('nodegit')

    // define any filesets to exclude from a merge
    var excludedFilesForMerge = [
        ['*.exc', 'merge=ours']
        // add other extensions or file names
        // here
    ]

    // configure the global setting to allow keeping local changes
    // therefore preventing a merge of remote changes
    git.Config.openDefault().then(function (config) {
        config.setString('merge.ours.driver', 'true')
    })
    // configure git to allow unicode characters
    git.Config.openDefault().then(function (config) {
        config.setString('core.quotepath', 'off')
    })

    console.log('Merging Left: ' + left + ' Right: ' + right)

    // merge the given right branch into the given left branch (note this will clone or open
    // the desired repository)
    // Note here we return the promise for further processing
    return nodeRepository.mergeBranches(repository, left, right)
}

var Merger = {
    merge(repository, left, right) {
        return nodemerge(repository, left, right)
    }
}

// if called as a script directly, execute the Merge function
if (require.main === module) {
    checkArguments()
    nodeRepository.cloneRepository(repositoryPath, destination).then(function (repository) {
        nodemerge(repository, left, right)
    })
}

// exported for testing
exports.merge = Merger.merge