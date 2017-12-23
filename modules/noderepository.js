/**
 * This module will clone or open the given repository
 * url, if a repository exists at the destination it
 * will be opened.  In otherwords there is no clearing
 * of existing data done.
 */
var NodeGit = require('nodegit')

var clone = function RepositoryPromise(url, destination) {
    var path = require('path')
    var repositoryPath = path.normalize(url)
    var localPath = path.normalize(destination)
    var cloneOptions = {}

    // This is a required callback for OS X machines.  There is a known issue
    // with libgit2 being able to verify certificates from GitHub.
    cloneOptions.fetchOpts = {
        callbacks: {
            certificateCheck: function () {
                return 1
            }
        }

    }

    var errorHandler = function handleError(error, repositoryPath) {
        result = attemptOpen(error)
        if (error && !result) {
            console.error('Unable to clone repository at: ' +
                repositoryPath +
                '\nException: ' +
                error.message)
        }
        return result
    }

    // If the repository already exists, the clone above will fail.  You can simply
    // open the repository in this case to continue execution.
    var attemptOpen = function (error) {
        if (error.message.indexOf("not an empty directory") !== -1) {
            return NodeGit.Repository.open(localPath)
        }
    }

    // Invoke the clone operation and store the returned Promise.
    return NodeGit.Clone(url, localPath, cloneOptions).catch(errorHandler)
}

var merge = function BranchMerge(repository, left, right) {
    var _repository = repository
    return repository.mergeBranches(left, right).catch(function (index) {
        if (index.hasConflicts()) {
            // expected, leave the repository in a conflicting state
            // for manual resolution
            // TODO: This needs work as in the case of libgit2
            //        we are not getting a conflicting/merge
            //        state in the repository
            console.info('Could not automatically merge ' + right + ' into ' + left)
        }
    })
}

var NodeRepositoryPromise = {
    cloneRepository(url, destination) {
        return clone(url, destination)
    }
}

var NodeBranchMerger = {
    mergeBranches(repository, left, right) {
        return merge(repository, left, right)
    }
}

// exports for use outside of this module
exports.cloneRepository = NodeRepositoryPromise.cloneRepository
exports.mergeBranches = NodeBranchMerger.mergeBranches