const express=require('express')
const router=express.Router()
const multer=require('multer')
const path=require('path')
const File=require('../models/file')
const {v4:uuid4}=require('uuid')
//setup of storage for file
let storage= multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName)
    }
})

//uploading file
let upload=multer({
    storage:storage,
    limit:{fileSize:100000000},
}).single('myfile')

router.post('/upload',(req,res)=>{
    
    
     upload(req,res,async (err)=>{

        if(!req.file){
            res.json({error:"There is no file"})
        }

         if(err){
             res.status(500).send({error:err.message})
         }

         const file=new File({
             filename:req.file.filename,
             size:req.file.size,
             path:req.file.path,
             uuid:uuid4()
         })
          const response= await file.save()
          res.json({fileURL:`${process.env.APP_BASE_URL}/file/${response.uuid}`})
     })

})

router.get('/download/:uuid',async(req,res)=>{
    const file= await File.findOne({uuid:req.params.uuid})
    if(!file){
         res.render('download',{error:'Link has been expires.'})
    }

    const path= `${__dirname}/../${file.path}`
    res.download(path)
})

router.post('/send',async(req,res)=>{
    const{uuid,emailTo,emailFrom}=req.body
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error:'All field are required'})
    }
    const file= await File.findOne({uuid:uuid})

    // if(file.sender){
    //      return res.status(422).send({error:'Email already sent'})
    // }

    file.sender=emailFrom
    file.receiver=emailTo
    const response= await file.save()

    const sendMail=require('../services/email-service')
   await sendMail({
        from: emailFrom,
        to:emailTo,
        subject: 'ShareNow file sharing',
        text: `${emailFrom} has shared a file with you.`,
        html: require('../services/email-template')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/file/${file.uuid}`,
            size: parseInt(file.size/1000)+'KB',
            expires: '24 hours'

        })

    }).then((result)=>{
        if(result===200)return res.send({success:true})
        else return res.send({error:"Something Went Wrong"})
    })
    
})






module.exports=router