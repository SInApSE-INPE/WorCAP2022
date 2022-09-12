const sleep = require('system-sleep');
const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const { USER, PASS, HOST } = process.env;

const handle = fs.readFileSync('../data/subscriptions_worcap2022.json');
const rows = JSON.parse(handle);

let readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            callback(err);
            throw err;
        }
        else {
            callback(null, html);
        }
    });
};

let sendEmail = function (from, to, bcc, cc, subject, replacements, attachments, filepath) {
    readHTMLFile(filepath, function(err, html) {
        let template = handlebars.compile(html);
        let htmlToSend = template(replacements);
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: USER,
                pass: PASS
            }
        });
        let mailOptions = {
            from: from,
            to: to,
            bcc: bcc,
            cc: cc,
            subject: subject,
            html : htmlToSend,
            attachments: attachments
        };
        // console.log(mailOptions);
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
};

for(let row of rows){
    const { email, name } = row;
    console.log(email, name);
    sendEmail(
        from="Adriano - WorCAP 2022",
        to=email,
        bcc="arturo66cta@gmail.com,uadrianoalmeida@gmail.com",
        cc="worcap@inpe.br",
        subject="WorCAP 2022 - Boas vindas e orientações",
        replacements={'name': name}, 
        attachments = [{
            filename: "WorCAP2022_Webex_links.pdf",
            path: "/home/adrianoalmeida/WorCAP2022/email/src/WorCAP2022_Webex_links.pdf",
        }],
        filepath="./welcome.html"
    );

    console.log("waiting...");
    sleep(30000); // sleep for 30 seconds
}