import passport from "passport";

export function authenticated(){
    return passport.authenticate('current')
}

export function authorized(roles = []){
    return (req, res, next) =>{
        if(!roles || roles.length === 0 || roles.includes(req.user.role)){
            next();
        }else{
            res.status(403).send({message: `You do not have any of the required roles(${roles})`})
        }
    }
}
