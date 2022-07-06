const nodemailer=require('nodemailer')

async function sendMail({from,to,subject,text,html}){
    let transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
    })

    return await transporter.sendMail({
        from:from,
        to:to,
        subject:`ShareNow<${subject}>`,
        text:text,
        html:html
    }).then((res)=>{
         return 200
    }).catch((err)=>{
        console.log(err)
        if(err){
            return 401
        }
    })
    
}

module.exports=sendMail