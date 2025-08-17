const jwt = require('jsonwebtoken');  
const prisma = require('../models/prismaClient');
const bcrypt = require('bcrypt');

const login = async (email, password) => {
    try {
        const validate = await prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                userRoles: {
                    where: {status: true},
                    include: {
                        role: true
                    }
                }
            }
        })

        if (!validate) {
            return {
                success: false,
                message: 'Email not Found',
                error: 'EMAIL_DOES_NOT_EXIST'
            }
        }

        const user = validate;

        if (await bcrypt.compare(password, user.password)) {

            const roles = user.userRoles.map(ur => ({
                id: ur.role.id,
                type: ur.role.type
            }));

            const userType = roles.length > 0 ? roles[0].type : 'Customer';

            const tokenPayload = {
                userId: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: roles
            };

            const accessToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '1h'
            });

            let welcomeMessage = '';

            switch (userType) {
                case 'Customer':
                    welcomeMessage = 'Wecome Customer';
                    break;
                
                case 'Merchant':
                    welcomeMessage = 'Welcome Merchant';
                    break;

                case 'SuperAdmin':
                    welcomeMessage = 'Welcome SuperAdmin'
                default:
                    break;
            }

            return {
                status: 'success',
                message: `${userType} Logged In Successfully!`,
                welcomeMessage: welcomeMessage,
                data: {
                    accessToken,
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        roleType: userType
                    }
                },
                statusCode: 200
            };
        } else {
            const err = new Error('Wrong Password!');
            err.status = 400;
            throw err;
        }
    } catch (err) {
        return {
            status: 'fail',
            message: err.message,
            statusCode: err.status || 500
        };
    }
}

module.exports = {login}