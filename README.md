# 6Estates idp-node.js
A node.js SDK for communicating with the 6Estates Intelligent Document Processing(IDP) Platform.

## Documentation
The documentation for the 6Estates IDP API can be found via https://idp-sea.6estates.com/docs

The node.js library documentation can be found via https://idp-sdk-doc.6estates.com/python/.

## Setup
$ npm install idp_sdk
## Usage
### 1. To Extract Fields in Synchronous Way
If you just need to do one file at a time

    var Client=require('idp_sdk')
    var fs=require('fs')

    var c=new Client({token:'your-token',region:'your-region'});
    c.createTask({file:fs.createReadStream('path-to-the-file'),fileType:'file-type'})
    .then((task)=>c.taskID(task))
    .then((task_id)=>{
        return c.poll(task_id,0)
    })
    .then((result)=>{console.log(result)})

### 2. To Extract Fields in Asynchronous Way
If you need to do a batch of files

    var Client=require('idp_sdk')
    var fs=require('fs')

    var c=new Client({token:'your-token',region:'your-region'});
    c.runSimpleTask({file:fs.createReadStream('path-to-the-file'),fileType:'file-type'})
    .then((result)=>{console.log(result)})
