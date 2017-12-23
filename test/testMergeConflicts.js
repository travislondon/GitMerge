#!/usr/bin/env node

var promise = require('promise')
var merge = require('../merge/nodemerge').merge
var clone = require('../modules/noderepository').cloneRepository
var path = require('path')
var nodegit = require('nodegit')
var fs = require('fs-extra')

var destination = './tmp'
var repositoryPath = path.normalize('./test/repositories/leftRightConflicts')
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
                console.error('Test MergeNoConflicts (LEFT MERGE) result: FAILED, Not all changes were automatically merged.')
            }
        }).then(function () {
            merge(repository, 'master', 'origin/right').then(function () {
                repository.getStatus().then(function (statuses) {
                    if (statuses.length === 0) {
                        console.error('Test MergeNoConflicts (RIGHT MERGE) result: FAILED, Changes were automatically merged with conflicts.\n' +
                            'Note this will fail until the TODO in noderepository.js:55 is handled')
                    } else {
                        console.info('Test MergeNoConflicts (RIGHT MERGE) result: PASSED, Conflicting changes were not automatically merged.')
                    }
                })
            })
        })
    })
})