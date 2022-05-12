const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('../service/mail-service');
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto');

class UserService {
    async registration(email, password) {
        let user = await userModel.findOne({email});
        if (user) {
            throw new Error('User with this email already exists');
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = `${process.env.API_URL}/api/activate/${uuid.v4()}`;
        user = await userModel.create({email, password: hashPassword, activationLink});
        await mailService.sendActivationLink(email, activationLink);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        
        return { ...tokens, user: userDto }
    }
}

module.exports = new UserService();