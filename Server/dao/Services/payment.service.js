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
                failure: 'https://backendecommercecoderhouse-production.up.railway.app/payment/failure',
                pending: 'https://backendecommercecoderhouse-production.up.railway.app/payment/pending',
                success: 'https://backendecommercecoderhouse-production.up.railway.app/payment/success',
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