import { Router } from "express";
import { authorized, authenticated } from "../middlewares/auth.js";

export function authRoute(){
    const router = Router();

    router.authGet = (path, roles = [] ,...handlers) => router.get(path,authenticated(), authorized(roles), ...handlers)
    router.authPost = (path, roles = [] ,...handlers) => router.post(path, authenticated(), authorized(roles), ...handlers)
    router.authPut = (path, roles = [] ,...handlers) => router.put(path, authenticated(), authorized(roles), ...handlers)
    router.authDelete = (path, roles = [] ,...handlers) => router.delete(path, authenticated(), authorized(roles), ...handlers)

    return router
}