const sleep = require('system-sleep');
const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const { title } = require('process');
// const config  = require('../data/subscriptions_worcap2022.json');
const { GMAIL_USER, GMAIL_PASS } = process.env;
const handle = fs.readFileSync('./data/test.json');//'./data/ST.json'
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

let sendEmail = function (from, to, bcc, cc, subject, replacements, filepath) {
    console.log('Sending email to ' + to);
    readHTMLFile(filepath, function(err, html) {
        let template = handlebars.compile(html);
        let htmlToSend = template(replacements);
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_PASS
            }
        });
        
        let mailOptions = {
            from: from,
            to: to,
            bcc: bcc,
            cc: cc,
            subject: subject,
            html : htmlToSend
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        // console.log('Email sent to ' + to);
    });
};

for(let row of rows){
    const { email, name, title } = row;
    console.log(email, name);
    sendEmail(
        from="Arturo - WorCAP 2022",
        to=email,
        bcc="uadrianoalmeida@gmail.com",
        cc="uadrianoalmeida@gmail.com",//"worcap@inpe.br",
        subject="WorCAP 2022 - Sessão Técnica",
        replacements={'name': name, 'title': title}, 
        filepath="./data/ST.html"
    );

    console.log("waiting...");
    sleep(30000); // sleep for 30 seconds
}