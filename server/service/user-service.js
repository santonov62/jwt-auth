const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('../service/mail-service');

class UserService {
    async registration(email, password) {
        let user = await UserModel.findOne({email});
        if (user) {
            throw new Error('User with this email already exists');
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        user = await UserModel.create({email, password: hashPassword, activationLink});
        await mailService.sendActivationLink(emial, activationLink);
    }
}

module.exporst = new UserService();