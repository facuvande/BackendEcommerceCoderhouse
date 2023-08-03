import UsersFactory from "../dao/Factorys/users.factory.js";

const User = await UsersFactory.getDao();
const UsersService = new User();

export default class PaymentController {
    constructor(purchaseService){
        this.purchaseService = purchaseService;
    }

    async getPaymentLink(req, res){
        try {
            const { email } = req.user;

            const itemsToPurchase = req.itemsToPurchase;
            const payment = await this.purchaseService.createPayment(itemsToPurchase, email);

            // Guarda el payment_id en la base de datos
            await UsersService.savePaymentId(email, { id: payment.id, status: 'Pending', items: itemsToPurchase } )

            return res.redirect(payment.init_point);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: true, msg: 'Failed to create payment' })
        }
    }
}