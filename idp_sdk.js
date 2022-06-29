// import fetch from 'node-fetch'
const fs = require('fs');
const FormData=require('form-data')
const fetch=require('node-fetch');
const { url } = require('inspector');
const { resolve } = require('path');
const { runInThisContext } = require('vm');

var file_type={bank_statement : 'CBKS',
    invoice : 'CINV',
    cheque : 'CHQ',
    credit_bureau_singapore : 'CBS',
    receipt : 'RCPT',
    payslip : 'PS',
    packing_list : 'PL',
    bill_of_lading : 'BL',
    air_waybill : 'AWBL',
    kartu_tanda_penduduk : 'KTP',
    hong_kong_annual_return : 'HKAR',
    purchase_order : 'PO',
    delivery_order : 'DO'};
var file_type_list=['CBKS','CINV','CHQ','CBS','RCPT','PS','PL','BL','AWBL','KTP','HKAR','PO','DO'];

function Client(data)
{
    
    if(typeof(data['token'])=="undefined") throw new Error('Token is required!')
    if(typeof(data['region'])=="undefined") throw new Error('Region is required!')
    this.token=data['token'];
    this.region=data['region'];
    if (this.region == 'test') this.region = '';
    else this.region = '-'+this.region;
    this.url_post = "https://idp"+this.region + 
        ".6estates.com/customer/extraction/fields/async"
    this.url_get = "https://idp"+this.region + 
        ".6estates.com/customer/extraction/field/async/result/"
};
// Client.prototype.test=function (data){}


Client.prototype.createTask=function (data){
    if(typeof(data['file'])=="undifiend") throw new Error('File is required!')
    if(file_type_list.indexOf(data['fileType'])==-1) throw new Error('File type is not valid!')
    var headers={"X-ACCESS-TOKEN": this.token};
    var url=this.url_post;
    // console.log(data['file']);
    var formData=new FormData();
    for(const [key,value] of Object.entries(data))
        formData.append(key,value)
    // console.log(formData);
    return new Promise(function(resolve,reject)
    {
        const response=fetch(url,{method:'post',body:formData,headers:headers});
        // console.log();
        response.then(function(a){return a.json()})
        .then(function(data)
        {
            // console.log(data);
            if(data['status']==200)
                resolve(data);
            else
                reject(data);
        })
    }).catch((data)=>{throw new Error(data['message'])})
};

Client.prototype.taskID=(task)=>task['data']
Client.prototype.taskResults=function (task_id){
    var url=this.url_get+task_id;
    // console.log(this)
    var headers={"X-ACCESS-TOKEN": this.token};
    return new Promise((resolve,reject)=>{
        // console.log(url);
        fetch(url,{method:'get',body:null,headers:headers}).then((response)=>response.json())
        .then((response)=>{
            console.log(response);
            if(response['status']==200)
                resolve(response)
            else
                reject(response)
        })
    }).catch((result)=>{throw new Error(result['message'])})
}
Client.prototype.sleep=(ms)=>{
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

//result
Client.prototype.resultStatus=(result)=>result['data']['taskStatus']
Client.prototype.resultFields=(result)=>result['data']['fields']
//fields
Client.prototype.fieldCode=(field)=>field['filed_code']
Client.prototype.fieldName=(field)=>field['filed_name']
Client.prototype.fieldValue=(field)=>field['value']
Client.prototype.fieldType=(field)=>field['type']

Client.prototype.poll=function (task_id,i){
    // console.log(task_id)
    var poll=this.poll.bind(this);
    var taskResults=this.taskResults.bind(this);
    var resultStatus=this.resultStatus.bind(this);
    return taskResults(task_id).then((result)=>{
        return new Promise (function (resolve,reject){
            if(resultStatus(result)=='Doing'||resultStatus(result)=='Init') reject();
            else resolve(result)
            }).then((result)=>result).catch(()=>{
                // console.log(task_id);
                if(i<200) 
                {
                    var result;
                    
                    return new Promise(function(resolve,reject){
                        setTimeout(()=>{poll(task_id,i+1).then(resolve,reject)},3000);
                    });
                }
                throw new Error('Time out!')
            })
        
    })
    
}

Client.prototype.runSimpleTask=function (data){
    var me=this;
    return me.createTask(data).then((task)=>me.taskID(task)).then((task_id)=>me.poll(task_id,0))
}



module.exports=Client