import { login, logout, refreshSession, signup } from "../services/auth.js";

const setupSettion = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, { httpOnly: true, expire: new Date(Date.now() + session.refreshTokenValidUntil) });

    res.cookie('sessionId', session._id, { httpOnly: true });
};

export const signupController = async (req, res) => {
    const newUser = await signup(req.body);
    

    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data: newUser,
    });
};

export const loginController = async (req, res) => {
    const userSession = await login(req.body);

    setupSettion(res, userSession);
    
    res.status(200).json({
        status: 200,
        message: "Successfully logged in an user!",
        data: {
            accessToken: userSession.accessToken,
        }
    });
};

export const refreshController = async (req, res) => {
    const { refreshToken, sessionId } = req.cookies;
    const session = await refreshSession({ refreshToken, sessionId });

    setupSettion(res, session);

    res.status(200).json({
        status: 200,
        message: "Successfully refreshed a session!",
        data: {
            accessToken: session.accessToken,
        }
    });
};

export const logoutController = async (req, res) => {
    const { sessionId } = req.cookies;
    if (sessionId) {
        await logout(sessionId);
    };

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).send();
};