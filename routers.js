const express = require('express')
const router = express.Router()
const userController = require('./controllers/userControllers')

const { PrismaClient } = require("@prisma/client");
const accountControllers = require('./controllers/accountControllers');
const userControllers = require('./controllers/userControllers');
const transactionControllers = require('./controllers/transactionControllers');

const prisma = new PrismaClient();

router.get('/', (req, res) => {
    return res.json({
        message: "Hellow World"
    })
})

//POST USER
router.post('/users', userControllers.registerUser)
    //GET USER
router.get("/users", async(req, res) => {
        const user = await prisma.users.findMany();
        res.send(user);
    })
    // GET USER + DETAIL PROFIL
router.get('/users/:userId', userControllers.getUserdetail)
    // EDIT USER
router.put('/users/:id', userControllers.editUser)
    //DELETE USER
router.delete('/users/:id', userControllers.deleteUser)



//POST ACCOUNT BARU
router.post('/accounts', accountControllers.registerAccounts)
    //GET ACCOUNT
router.get('/accounts', accountControllers.getAccounts)
    //EDIT ACCOUNT
router.put('/accounts/:id', accountControllers.editAccount)
router.delete('/accounts/:id', accountControllers.deleteAccount)

//POST TRANSACTION 
router.post('/transactions', transactionControllers.createTransaction)
    //GET TRANSACTION
router.get('/transactions', transactionControllers.getTransactions)
    //GET TRANSACTION by id
router.get('/transactions/:id', transactionControllers.getTransactionsId)

module.exports = router