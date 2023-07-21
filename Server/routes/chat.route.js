import { Router } from "express";
import roles from "../config/roles.js";
import { authRoute } from "../config/helpers/auth.route.js";

const route = authRoute();

route.authGet('/', [roles.USER], (req, res) =>{
    res.render('chat')
});


export default route
