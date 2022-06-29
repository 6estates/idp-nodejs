var Client=require('idp_sdk')
var fs=require('fs')

var c=new Client({token:'your-token',region:'your-region'});
c.createTask({file:fs.createReadStream('path-to-the-file'),fileType:'file-type'})
.then((task)=>c.taskID(task))
.then((task_id)=>{
    return c.poll(task_id,0)
})
.then((result)=>{console.log(result)})