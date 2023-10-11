const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
    registerAccounts: async(req, res) => {
        const { bank_name, bank_account_number, balance, user_id } = req.body;

        try {
            const existingUser = await prisma.users.findUnique({
                where: { id: parseInt(user_id) },
            });

            if (!existingUser) {
                return res.status(404).json({ error: true, message: "User Not Found" });
            }

            const response = await prisma.bank_accounts.create({
                data: {
                    bank_name: bank_name,
                    bank_account_number: bank_account_number,
                    balance: BigInt(balance),
                    user: {
                        connect: { id: parseInt(user_id) },
                    },
                },
            });

            const balanceInt = parseInt(balance);

            return res.status(201).json({
                error: false,
                message: "Create account Successfully",
                data: {
                    ...response,
                    balance: balanceInt,
                },
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ error: true, message: "Internal Server Error" });
        }
    },
    getAccounts: async(req, res) => {
        try {
            const accounts = await prisma.bank_accounts.findMany();

            const response = accounts.map((account) => {
                return {
                    ...account,
                    balance: parseInt(account.balance),
                };
            });

            return res.status(201).json({
                error: false,
                message: "Fetched data bank account successfully",
                data: response,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ error: true, message: "Internal Server Error" });
        }
    },
    getAccountById: async(req, res) => {
        try {
            const accounts = await prisma.bank_accounts.findUnique({
                where: {
                    id: Number(req.params.accountId)
                },
                include: {
                    user: true,
                },
            });
            res.status(201).json({
                ...accounts,
                balance: parseInt(accounts.balance)
            })
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
    editAccount: async(req, res) => {
        const id = req.params.id;
        const accounData = req.body;

        if (!(accounData.bank_name && accounData.bank_account_number && accounData.balance)) {
            res.status(400).send("Some field Missing");
            return
        }
        const accounts = await prisma.bank_accounts.update({
            where: {
                id: parseInt(id)
            },
            data: {
                bank_name: accounData.bank_name,
                bank_account_number: accounData.bank_account_number,
                balance: parseInt(accounData.balance)
            }
        })
        res.json({
            data: accounts,
            message: "edit account done"
        })
    },
    deleteAccount: async(req, res) => {
        const id = req.params.id;

        try {
            await prisma.bank_accounts.delete({
                where: {
                    id: parseInt(id),
                },
            });

            return res.json({
                message: 'Bank account deleted',
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error deleting bank account!' });
        }
    },
}