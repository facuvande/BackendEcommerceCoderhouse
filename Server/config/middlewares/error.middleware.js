export default (error, req, res, next) =>{
    console.log({error})
    switch(Math.floor(error.code / 100)){
        case 1: // Errores de entrada
            res.userErrorResponse(JSON.parse(error.message));
            break;
        case 2:  // Errores logicos
            res.userErrorResponse({
                message: "Error logico",
                error: JSON.parse(error.message)
            })
            break;
        case 3: // Errores irrecuperables
            res.serverErrorResponse('UnhandledError');
            break;
        default:
            res.serverErrorResponse(error.message);
    }
}