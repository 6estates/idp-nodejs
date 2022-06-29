var Client=require('idp_sdk')
var fs=require('fs')

var c=new Client({token:'your-token',region:'your-region'});
c.runSimpleTask({file:fs.createReadStream('path-to-the-file'),fileType:'file-type'})
.then((result)=>{console.log(result)})