import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
    const transport = nodemailer.createTransport({
        host: "smtp.ukr.net",
        port: 465,
        secure: true,
        auth: {
            user: "no-reply.contacts@ukr.net",     // твоє ім'я пошти
            pass: "g3KEnDal2igKQCRU", // пароль застосунку
        },
    });

    await transport.sendMail({
        from: "no-reply.contacts@ukr.net",
        to,
        subject,
        html,
    });
};
