const { PrismaClient } = require('@prisma/client');
const { response } = require('express');

const prisma = new PrismaClient();

module.exports = {
    registerUser: async(req, res) => {
        const user = await prisma.users.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                profile: {
                    create: {
                        identity_number: req.body.identity_number,
                        identity_type: req.body.identity_type,
                        address: req.body.address,
                    }
                }
            }
        });

        return res.json({
            data: user
        })
    },
    getUserdetail: async(req, res) => {
        const userId = parseInt(req.params.userId);
        const user = await prisma.users.findUnique({
            where: { id: userId },
            include: { profile: true }, // Meng-include profil dalam hasil
        });
        res.send(user)
    },
    editUser: async(req, res) => {
        const id = req.params.id;
        const userData = req.body;

        if (!(userData.email && userData.name && userData.password)) {
            res.status(400).send("Some field Missing");
            return
        }

        const users = await prisma.users.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: userData.name,
                email: userData.email,
                password: userData.password
            }
        })
        res.json({
            data: users,
            message: "edit user done"
        })
    },
    deleteUser: async(req, res) => {
        try {
            const profiles = await prisma.profiles.delete({
                where: {
                    id: Number(req.params.id),
                },

            });

            const user = await prisma.users.delete({
                where: {
                    id: Number(req.params.id),
                },
                include: {
                    profile: profiles
                }
            });
            return res.status(200).json({
                data: user,
                message: "user deleted"
            });

        } catch (error) {
            res.status(400).json({ msg: error.message });
        }

    }
}