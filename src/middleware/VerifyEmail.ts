import jwt from "jsonwebtoken";
import {Request, Response} from "express";
import userModel from "../model/UserModel";
require('dotenv').config();

const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(process.env.OAUTH_CLIENTID,process.env.OAUTH_CLIENT_SECRET);
OAuth2_client.setCredentials({refresh_token  : process.env.OAUTH_REFRESH_TOKEN});

export async function sendVerificationMail(email:string, token : string, password:string){
    const accessToken = OAuth2_client.getAccessToken()
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type : 'OAuth2',
            user: process.env.MAIL_USERNAME,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            accessToken : accessToken
        }
    })
    const mailOptions = {
        from: 'ResQSync <$mailtoashish693@gmail.com>',
        to: email,
        subject: 'Verify your email to start using ResQSync',
        mimetype : 'text/html',
        html : htmlVerificationMessage(email,token,password),
    };

    try {
        const result = await transport.sendMail(mailOptions);
        console.log(result);
    } catch (err) {
        console.error(err);
    } finally {
        transport.close();
    }
}

export async function verifyEmail(req: Request, res: Response): Promise<Response> {
    try {
        const token = req.query.token;
        const email = req.query.email;
        const password = req.query.password
        if (!token) {
            return res.status(400).json({ status: false, msg: 'Token is missing.' });
        }
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ status: false, msg: 'Already verified' });
        }
        if (!process.env.SECRET) return res.status(500);
        jwt.verify(token as string, process.env.SECRET, (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({ status: false, msg: 'Invalid token.' });
            }
        });
        await userModel.create({ email, password });
        return res.status(200).send(htmlRegistrationMessage());
    }
    catch (ex) {
        console.log(ex);
        return res.status(500).json({ status: false, msg: 'Internal Server Error!!' });
    }
}

function htmlRegistrationMessage(){
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Successful</title>
    <style>
        body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f4f4f4;
        }
        .button {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
        }

        .card {
            background-color: #f0f0f0;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
    </style>
</head>
<body>
<div class="card">
    <h2>Registration Successful</h2>
    <p>You have successfully verified your email.</p>
    <p>You can close this page</p>
    <button class="button" id="closeButton">Close Page</button>
    <script>
        const closeButton = document.getElementById('closeButton');
        closeButton.addEventListener('click', () => {
            window.close();
        });
    </script>
</div>
</body>
</html>`;
}

function htmlVerificationMessage(email:string, token : string, password:string) {
    return `
    <html>
      <head>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
          }

          .card {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
          }

          .card-heading {
            font-size: 16px;
            margin-bottom: 20px;
          }
          
          .card-subheading {
            font-size: 12px;
            margin-bottom: 20px;
          }

          .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="card">
         <img src='https://drive.google.com/uc?export=view&id=1OMJy9o-JebDhCxQIWynMRoA5_inCKIg0' alt="Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h2 class="card-heading">Verify your email to start using ResQSync</h2>
          <h4 class="card-subheading">Hello! To finish setting up your account, please verify your email address</h4>
          <a class="button"href="${process.env.BASE_URL}/api/auth/verifyEmail?token=${token}&email=${email}&password=${password}">Verify Account</a>
        </div>
      </body>
    </html>
  `;
}
