const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

module.exports = (context) => {
    //context = { ...headers }
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        //Bearer ...
        const token = authHeader.split('Bearer')[1];
        if (token) {
            try {
                const user = jwt.verify(token, "ACCESS_TOKEN_SECRET");
                return user;
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]");
    }
    throw new Error('Authorization header must be provided');
};

// module.exports = (context) => {
//     if (!context.user) {
//       throw new AuthenticationError('You need to be logged in');
//     }
//   };