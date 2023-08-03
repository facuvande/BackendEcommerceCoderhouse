import axios from "axios";


export default class PaymentService{
    async createPayment(itemsToPurchase, email){
        const url = "https://api.mercadopago.com/checkout/preferences";
        
        const body = {
            payer_email: email,
            items: [
                ...itemsToPurchase
            ],
            back_urls: {
                failure: 'http://localhost:8080/payment/failure',
                pending: 'http://localhost:8080/payment/pending',
                success: 'http://localhost:8080/payment/success',
            }
        }

        const payment = await axios.post(url, body, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
            }
        })
        return payment.data
    }
}