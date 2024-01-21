import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAILUSER,
      clientId: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      refreshToken: process.env.REFRESHTOKEN,
    },
  });

  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: process.env.GMAILUSER,
  //     pass: process.env.GMAILPASSWORD,
  //   },
  // });

  const msgToManager = {
    to: 'proengineer1stexam@gmail.com',
    from: req.body.email,
    subject: 'ポートフォリオサイトからの問い合わせ',
    text: req.body.name +'様からお問合せがありました。' + 'メッセージ：' + req.body.message + 'アドレス：' + req.body.email,
    html: `
      <p>【名前】</p>
      <p>${req.body.name}</p>
      <p>【メールアドレス】</p>
      <p>${req.body.email}</p>
      <p>【メッセージ内容】</p>
      <p>${req.body.message}</p>
    `,
  };

  const msgToUser = {
    to: req.body.email,
    from: 'proengineer1stexam@gmail.com',
    subject: 'お問合せありがとうございました。',
    text: 'お問合せを受け付けました。回答をお待ちください。' + req.body.message,
    html: `
      <p>${req.body.name}様</p>
      <p>お問合せを受け付けました。回答をお待ちください。</p><br/>

      <p>【問い合わせ内容】</p>
      <p>${req.body.message}</p>
    `,
  };

  Promise.all([
    transporter.sendMail(msgToManager),
    transporter.sendMail(msgToUser)
  ]).then(() => {
    res.status(200).json({ message: 'Success' });
  }).catch((err) => {
    console.error("Error occurred: ", err);
    res.status(500).json({ message: 'Error sending mail' });
  });
}

export default handler;