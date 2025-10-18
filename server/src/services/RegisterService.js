const prisma = require('../models/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');    

const register = async (email, password, firstName, lastName, role) => {
    try {

        const validateEmail = (email) => {
            return email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };

        if (!validateEmail(email)){
            return {
                success: false,
                message: 'Invalid email format',
                error: 'INVALID_EMAIL'
            }
        }

        if (!email || !password || !firstName) {
            return {
                success: false,
                message: 'All fields are necessary',
                error: 'MISSING_FIELDS'
            }
        }

        if (password.length < 6) {
            return {
                success: false,
                message: 'Password is too Short',
                error: 'Short password'
            }
        }

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
                    message: 'Role not found'
                };
            }

            await tx.userRole.create({
                data: {
                    userId: user.id,
                    roleId: roletype.id,
                    status: true
                }
            });

            if (role === 'Customer') {
                // Create Customer profile
                const customerProfile = await tx.customer.create({
                    data: {
                        userId: user.id
                    }
                });

                // Create empty cart for the customer
                await tx.cart.create({
                    data: {
                        customerId: customerProfile.id
                    }
                });

                const customerPermissions = await tx.permission.findFirst({
                    where: {
                        desc: 'Order'
                    }
                });

                if (customerPermissions) { 
                    await tx.userPermission.create({
                        data: {
                            userId: user.id,
                            permissionId: customerPermissions.id,
                            status: true
                        }
                    });
                }
            }

            if (role === 'SuperAdmin') {
                const SuperAdminPermissions = await tx.permission.findFirst({
                    where: {
                        desc: 'View Merchants'
                    }
                })

                if (SuperAdminPermissions) { 
                    await tx.userPermission.create({
                        data: {
                            userId: user.id,
                            permissionId: SuperAdminPermissions.id,
                            status: true
                        }
                    });
                }
            }

            if (role === 'Merchant') {
                const merchantPermissions = await tx.permission.findFirst({
                    where: {
                        desc: 'Add Menu/Create Restaurant'
                    }
                })

                if (merchantPermissions) { 
                    await tx.userPermission.create({
                        data: {
                            userId: user.id,
                            permissionId: merchantPermissions.id,
                            status: true
                        }
                    });
                }
            }

            return user;
        });

        return {
            success: true,
            data: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: role
            },
            message: 'User Registered Successfully'
        }
        
    } catch (error) {
        console.error(`Error registering User: ${error.message}`);
        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = {register};