export const authConfig = {
    secret: process.env.JWT_SECRET || 'default_secret_key_change_me',
    expiresIn: '1d',
};
