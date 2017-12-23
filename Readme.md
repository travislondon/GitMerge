Installation
============
Run the install.sh script as your local user.  This will install any required node libraries.

Running
=======
Run merge/nodemerge.js to execute the merge tool.  The available options are described below:

Usage: /usr/local/bin/node ./merge/nodemerge.js --repository [path] --destination [path] --left [identifier] --right [identifier]

Options:
  --repository   Path to remote or local repository.     [required]
  --destination  Local destination for repository clone  [required]
  --left         The destination branch for the merge    [required]
  --right        The source branch for the merge         [required]

You can use remote repositories like, github.org.  It should support all expected protocols.  Or you can use local repositories, that will be cloned to the destination location.

Testing
=======
There are two test classes, testMergeConflicts and testMergeNoConflicts.  These live under the root test folder and can be executed with no arguments.

test/testMergeConflicts.js
test/testMergeNoConflicts.js

Results are output in the console.  The tests use a local repository with test files provided under test/repositories.

Performance matches that seen with the git command line tool.  One difference to note is that currently conflicts are ignored rather than leaving the repository in a conflicting state.

All characters supported by UTF-8 in filenames are also supported with the merge.