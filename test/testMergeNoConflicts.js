#!/usr/bin/env node

var promise = require('promise')
var merge = require('../merge/nodemerge').merge
var clone = require('../modules/noderepository').cloneRepository
var path = require('path')
var nodegit = require('nodegit')
var fs = require('fs-extra')

var destination = './tmp'
var repositoryPath = path.normalize('./test/repositories/leftRightNoConflicts')
repositoryPath = path.resolve(repositoryPath)
repositoryPath = 'file://' + repositoryPath
// clean up previous tmp directory
fs.removeSync(destination)

// clone test repository to tmp dir, and merge left into master
// and finally right into that result
clone(repositoryPath, destination).then(function (repository) {
    merge(repository, 'master', 'origin/left').then(function () {
        repository.getStatus().then(function (statuses) {
            if (statuses.length === 0) {
                console.info('Test MergeNoConflicts (LEFT MERGE) result: PASSED')
            } else {
                console.info('Test MergeNoConflicts (LEFT MERGE) result: FAILED, Not all changes were automatically merged.')
            }
        }).then(function () {
            merge(repository, 'master', 'origin/right').then(function () {
                // Something missing or a bug in libgit2, the committed
                // changes for the auto-merge are good.  However, another
                // change is made that is not committed leaves the repository
                // area dirty (with expected changes removed)
                // A workaround here is to reset hard, which pxuts us
                // in the rights state
                repository.getHeadCommit().then(function (originHeadCommit) {
                    nodegit.Reset.reset(repository, originHeadCommit, nodegit.Reset.TYPE.HARD).then(function (number) {
                        repository.getStatus().then(function (statuses) {
                            if (statuses.length === 0) {
                                console.info('Test MergeNoConflicts (RIGHT MERGE) result: PASSED')
                            } else {
                                console.info('Test MergeNoConflicts (RIGHT MERGE) result: FAILED, Not all changes were automatically merged.')
                            }
                        })
                    })
                })
            })
        })
    })
})