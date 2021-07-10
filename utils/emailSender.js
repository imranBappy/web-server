const nodemailer = require('nodemailer');

const emailSender = (name)=>{
    const transporter = nodemailer.createTransport({
        server:'gmail',
        auth:{
            user:'bdwins65@gmail.com',
            pass:'1bd@game0'
        }
    });
    const mailOption = {
        from:'bdwins65@gmail.com',
        to:'mdi330129@gmail.com',
        subject:'Wins65.com',
        text: `Thank you ${name} for created account our website.`
    }
    transporter.sendMail(mailOption ,(error, info)=>{
        console.log({error, info});
    })
}

module.exports = emailSender