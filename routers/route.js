import { Router } from "express"
import * as controller from "../controller/appcontrollor.js";
import Auth,{ localVariable} from "../middleware/auth.js";
import { registerMail } from "../controller/sendEmail.js";
import { product } from "../controller/appcontrollor.js";
const router = Router()

//post method
router.route("/register").post(controller.register) // register user
router.route('/registerMail').post(registerMail)     // send the email
router.route('/authenticate').post(controller.userverfy,(req, res) => { res.end() }); // authenticate user
router.route("/login").post(controller.userverfy, controller.login)// login in app

//get method
router.route("/product").get(controller.userverfy,product)  // get the product 
router.route("/user/:username").get(controller.getuser)// user with emil and password
router.route("/generateOTP").get(controller.userverfy,localVariable ,controller.generateOTP)    // generate random OTP
router.route("/verifyOTP").get(controller.userverfy,controller.verifyOTP)      // verify generated OTP
router.route("/createResetSession").get(controller.createResetSession) // reset all the variables     


// put method
router.route("/updateuser").put(Auth, controller.updateuser)        // is use to update the user profile
router.route("/resetpassword").put(controller.userverfy,controller.resetpassword)     // use to reset password



export default router;