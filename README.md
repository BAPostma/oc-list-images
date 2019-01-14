# OpenShift list-container-images

Simple command line tool that lists all the base-images of the containers that are running inside your pods. This enables quick security reviews by deciding if images need to be updated.

The configuration is taken from the normal oc command line tool configuration. This in turn, relies on the `~/.kube/config` file.

# Usage
## Installation
``` bash
~$ npm install
```

## Run
```
~$ ./src/index.js
```

or using node
```
~$ npm start
```

appned `--json` to receive a JSON output at the end.