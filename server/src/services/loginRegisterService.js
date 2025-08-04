const prisma = require('../models/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');    

const register = async (email, password, firstName, lastName, role) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existingUser) {
            return {
                success: false,
                message: 'Email already exists',
                error: 'DUPLICATE_EMAIL'
            };
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: email,
                    password: hashedPassword,
                    firstName: firstName,
                    lastName: lastName
                }
            });

            let roletype = await tx.role.findFirst({
                where: {
                    type: role
                }
            });

            if(!roletype){
                return {
                    success: false,
                    message: 'Role Does not Exist',
                    error: 'INCORRECT_ROLE'
                };
            }

            await tx.userRole.create({
                data: {
                    userId: user.id,
                    roleId: role.id,
                    status: true
                }
            });

            if (roletype === 'Customer') {
                const customerPermissions = await tx.permission.findFirst({
                    where: {
                        desc: 'Order'
                    }
                });

                await tx.userPermission.create({
                    data: {
                        userId: user.id,
                        permissionId: customerPermissions.id,
                        status: true
                    }
                });
            }

            if (roletype === 'SuperAdmin') {
                const SuperAdminPermissions = await tx.Permission.findFirst({
                    where: {
                        desc: 'View Merchants'
                    }
                })

                await tx.userPermission.create({
                    data: {
                        userId: user.id,
                        permissionId: SuperAdminPermissions.id,
                        status: true
                    }
                })
            }

            if (roletype === 'Merchant') {
                const merchantPermissions = await tx.Permission.findFirst({
                    where: {
                        desc: 'Add Menu/Create Restaurant'
                    }
                })

                await tx.userPermission.create({
                    data: {
                        userId: user.id,
                        permissionId: merchantPermissions.id,
                        status: true
                    }
                })
            }

            return user;
        });

        return {
            success: true,
            date: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: role
            },
            message: 'User Registered Successfully'
        }
        
    } catch (error) {
        console.error(`Error registering merchant: ${error.message}`);
        return {
            success: false,
            message: 'Failed to register merchant',
            error: error.message
        };
    }
}

const login = async (email, password) => {
    try {
        const validate = await pool.query(
            'SELECT * FROM merchant WHERE merchant_email = $1', 
            [email]
        );

        if (validate.rows.length === 0) {
            const err = new Error('Merchant Not Found!');
            err.status = 400;
            throw err;
        }

        const merchant = validate.rows[0];

        if (await bcrypt.compare(password, merchant.merchant_password)) {
            const tokenPayload = {
                merchantId: merchant.merchant_id,
                email: merchant.merchant_email,
                username: merchant.merchant_username,
                restaurantName: merchant.restaurant_name
            };

            const accessToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET);

            return {
                status: 'success',
                message: 'Merchant Logged In!',
                data: {
                    accessToken,
                    merchant: {
                        id: merchant.merchant_id,
                        username: merchant.merchant_username,
                        email: merchant.merchant_email,
                        restaurantName: merchant.restaurant_name,
                        location: merchant.merchant_location
                    }
                }
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

module.exports = register;