import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAILUSER,
      pass: process.env.GMAILPASSWORD,
    },
  });

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

  transporter.sendMail(msgToManager, function (err: any, info: any) {
    if(err) console.log(err);
    else console.log(info);
  })

  transporter.sendMail(msgToUser, function (err: any, info: any) {
    if(err) console.log(err);
    else console.log(info);
  })

  res.status(200).json({
    success: true,
  });
};

export default handler;