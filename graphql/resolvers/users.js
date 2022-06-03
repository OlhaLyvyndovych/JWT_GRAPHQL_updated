require('dotenv').config();
const User = require('../../models/User');
const { ApolloError, UserInputError } = require('apollo-server-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const resolvers = {
    Query: {
        user: async (_, { id }) => await User.findById(id)
    },
    Mutation: {
        registerUser: async (_, {registerInput: {username, email, password }}, context, info) => {

            //See if the user exists with email attempting to register
            const oldUser = await User.findOne({ email });  

            //Throw an error if the user exists
            if (oldUser) {
                throw new ApolloError('A user is already registered with the email' + email, 'USER_ALREADY_EXISTS');
            }

            // Encrypt password
            try {
                //const encryptedPassword = await bcrypt.hash(password, 10);

                const user = new User({ username, email, password });

                const token = jwt.sign(
                    { user_id: user._id, email },
                    "ACCESS_TOKEN_SECRET",
                    {
                        expiresIn: "2h"
                    }
                );
                    console.log(process.env);
                user.token = token;
                await user.save();
                return user; 
    
            } catch (err) {
                console.log(err);
            }
        },
        /*
        registerUser: async (_, { username, email, password }) => {
            //See if the user exists with email attempting to register
            const oldUser = await User.findOne({ email });

            //Throw an error if the user exists
            if (oldUser) {
                throw new ApolloError('A user is already registered with the email' + email, 'USER_ALREADY_EXISTS');
            }

            // Encrypt password
            var encryptedPassword = bcrypt.hash(password, 10);
            //Build out mongoose model (User)
            const newUser = new User({
                username: username,
                email: email,
                password: encryptedPassword
            });

            //Create our JWT (attach to our User model)
            const token = jwt.sign(
                { user_id: newUser._id, email },
                "UNSAFE_STRING",
                {
                    expiresIn: "2h"
                }
            );

            newUser.token = token;
            //Save our user in MongoDB
            const res = await newUser.save();
            return res;

            // return {
            //     id: res.id,
            //     ...res._doc
            // };

        },
        */
        loginUser: async (_, { loginInput: { email, password } }) => {
            //See if the user exists with the email
            const user = await User.findOne({ email });
            //Check if the entered password equals the encrypted password
            if (user && (await bcrypt.compare(password, user.password))) {
                // Create a NEW token
                const token = jwt.sign(
                    { user_id: user._id, email },
                    "ACCESS_TOKEN_SECRET",
                    {
                        expiresIn: "2h"
                    }
                );
                //Attach token to the user model that we found above
                user.token = token;

                return {
                    id: user.id,
                    ...user._doc
                }

            } else {
                //If user doens't exist - return error
                throw new ApolloError('Incorrect password', 'INCORRECT_PASSWORD')
            }
        }
    }
}

module.exports = resolvers; 
