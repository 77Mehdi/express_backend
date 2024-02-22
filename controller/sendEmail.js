import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import ENV from "../config.js"




let nodeconfig = {
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
        user: ENV.EMAIL,
        pass: ENV.PASSWORD
    }
};


let transporter = nodemailer.createTransport(nodeconfig);

let maileGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://Mailgen.js/'
    }
})
  

/** POST: http://localhost:3030/api/registerMail 
 * @param : {
  "username" : "example123",
  "userEmal": "example@gmail.com",
  "text" : "",
  "subject" : ""

}
*/


export const registerMail = async (req, res) => {
    const { username, userEmal, text, subject } = req.body;

    //body of the email

    var email = {
        body: {
            name: username,
            intro: text || 'Welcome to my new testing app my name is Elmehdi Elgheryb! We\'re very excited to have you her.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
    var emailbody = maileGenerator.generate(email);

    let message = {
        from: ENV.EMAIL,
        to: userEmal,
        subject: subject  || "Signup Successfl" ,
    
        html: emailbody,
    }

    // $$$$ sende email

    transporter.sendMail(message
        ).then( ()=>{
            return res.status(200).send({msg:"you should receive an email from us"})
        }

        ).catch(error =>res.status(500).send({error}))
} 