const Message = require('../../models/Message');

const resolvers = {
    Query: {
        message: async (_, { id }) => await Message.findById(id)
    },
    Mutation: {
        createMessage: async (_, {messageInput: {text, username}}) => {
            const message = new Message({
                text: text,
                createdBy: username,
                createdAt: new Date().toISOString()
            });

            const res = await message.save();
            console.log(res);
            return {
                id: res.id,
                ...res._doc
            }

        }
    }
}

module.exports = resolvers; 

