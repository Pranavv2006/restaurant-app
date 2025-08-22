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

        if (!email || !password) {
            return {
                success: false,
                message: 'Email and password are required',
                error: 'MISSING_CREDENTIALS'
            }
        }

        if (!validate) {
            return {
                success: false,
                message: 'Email not Found'
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
                success: true,
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
                }
            };
        } else {
            return {
                success: false,
                message: 'Invalid password'
            };
        }
    } catch (error) {
        console.error(`Error during login: ${error.message}`);
        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = {login}