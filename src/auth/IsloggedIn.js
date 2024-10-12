export const  isLoggedIn = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1];
        const decode = jwt.decode(token);
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        res.status(404).send('Error: ' + 'Jwt Authentication Required ');
    }
};
