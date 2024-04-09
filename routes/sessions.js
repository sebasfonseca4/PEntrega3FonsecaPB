import Router from "express";
import UsersDAO from "../daos/users.dao.js";
import SessionsController from "../controllers/sessions.controller.js";
import passport from "passport";

const router = Router()

router.post("/register", SessionsController.RegisterUser);

router.post("/login", SessionsController.LoginUser);

router.get("/logout", SessionsController.LogoutUser);

router.post("/login", passport.authenticate("local", {
    successRedirect: "/store/products",
    failureRedirect: "/login", 
    failureFlash: true
}));

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }, 
    async(req, res)=>{
    }
));

router.get(
    "/github/callback",
    passport.authenticate("github", {
        failureRedirect: "/login",
    }),
    async(req, res)=>{
        req.session.user = req.user;
        res.redirect("/store/products")
    }
);

router.get("/current", SessionsController.CurrentUser);

export default router;