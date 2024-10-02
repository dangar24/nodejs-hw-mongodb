import User from '../db/models/User.js';
import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import Session from '../db/models/Session.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendMail.js';
import 'dotenv/config';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';
import { randomBytes } from 'crypto';
import { accessTokenLifetime, refreshTokenLifetime } from '../constants/user.js';

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
    const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
    const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil
    };
};

export const signup = async (payload) => {
    const { email, password } = payload;
    const user = await User.findOne({ email });
    if (user) {
        throw createHttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const data = await User.create({...payload, password: hashPassword});
    delete data._doc.password;

    return data;
};

export const login = async (payload) => {
    const { email, password } = payload;

    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(401, 'Email or password invalid');
    };

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw createHttpError(401, 'Email or password invalid');
    };

    await Session.deleteOne({ userId: user._id });
    
    const sessionData = createSession();    

    const userSession = await Session.create({
        userId: user._id,
        ...sessionData,
    });
    
    return userSession;
};

export const findSessionByAccessToken = (accessToken) => Session.findOne({ accessToken });

export const findUser = _id => User.findOne({ _id });

export const refreshSession = async ({ refreshToken, sessionId }) => {
    
    const oldSession = await Session.findOne({ _id: sessionId, refreshToken });
    if (!oldSession) {
        throw createHttpError(401, 'Session not found');
    };

    if (new Date() > oldSession.refreshTokenValidUntil) {
        throw createHttpError(401, 'Session token expired');
    };

    await Session.deleteOne({ _id: sessionId });

    const sessionData = createSession();    

    const userSession = await Session.create({
        userId: oldSession._id,
        ...sessionData,
    });
    
    return userSession;
};

export const logout = async (sessionId) => await Session.deleteOne({ _id: sessionId });

export const requestResetToken = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
    );

    const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
    
//   await sendEmail({
//     from: env(SMTP.SMTP_FROM),
//     to: email,
//     subject: 'Reset your password',
//     html,
//   });
    
    try {
        await sendEmail({
            from: env(SMTP.SMTP_FROM),
            to: email,
            subject: 'Reset your password',
            html,
        });
    } catch (e) {
        if (e instanceof Error) throw createHttpError(401, 'Failed to send the email, please try again later.');
        throw e;
    };
};

export const resetPassword = async (payload) => {
    let entries;

    try {
        entries = jwt.verify(payload.token, env('JWT_SECRET'));        
    } catch (e) {
        if (e instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
        throw e;
    };

    const user = await User.findOne({
        email: entries.email,
        _id: entries.sub,
    });

    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await User.updateOne(
        { _id: user._id },
        { password: encryptedPassword },
    );
    
    await Session.findOneAndDelete({ userId: user._id });
};