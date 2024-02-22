
import UserModel from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import ENV from "../config.js"
import otpGenerator from "otp-generator"
import ProductModul from "../models/product.js"


//////// meddlwres ///////
//////   ?username=77mehdi ///
export async function userverfy(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;
        const exsist = await UserModel.findOne({ username });
        if (!exsist) {
            return res.status(404).send({ msg: "c'nt findUser" })
        };
        next();
    } catch (error) {
        return res.status(404).send({ msg: "authontuction error" })
    }
}









// http://localhost:3030/api/product?username=77mehdi
export async function product(req, res) {
    try {
        const prod = await ProductModul.find();
        res.json(prod)


    } catch (error) {
        return res.status(402).send({ msg: "canot get the product" })
    }
}



/** POST: http://localhost:3030/api/register 
 * @param : {
  "username" : "example123",
  "email": "example@gmail.com",
  "password" : "admin123"
  

}
*/

export async function register(req, res) {

    const { username, email, password } = req.body

    // Check if the email is in the database
    const userExists = UserModel.findOne({ username })
        .then(user => {
            if (user) {
                throw { error: "Please use a unique username" };
            }
        })
        .catch(error => {
            throw new Error("the  username  is alrdy existen: " + error.message);
        });



    // Check if the email is in the database
    const emailExists = UserModel.findOne({ email })
        .then(user => {
            if (user) {
                throw { error: "Please use a unique email" };
            }
        })
        .catch(error => {
            throw new Error("the email is alrdy  existen: " + error.message);
        });



    Promise.all([userExists, emailExists])
        .then(() => {
            if (password) {
                bcrypt.hash(password, 10)
                    .then(hashpassword => {
                        const user = new UserModel({
                            username: username,
                            email: email,
                            password: hashpassword
                        });

                        // Save the user and handle the result
                        return user.save();
                    })
                    .then(result => {
                        // Send a success response
                        res.status(201).send({ msg: "User Registered Successfully" });
                    })
                    .catch(error => {
                        // Handle errors during password hashing or user saving
                        res.status(501).send({ error: "Unable to register user", details: error.message });
                    });
            } else {
                // Handle the case where there is no password
                res.status(500).send({ error: "Password is required" });
            }
        })
        .catch(error => {
            // Handle errors during promise resolution
            res.status(503).send({ error: "Failed to check user or email existence", details: error.message });
        });

}


/** POST: http://localhost:3030/api/login 
 * @param : {
  
  "username" : "example123",
  "password" : "admin123"
  

}
*/
export async function login(req, res) {

    const { username, password } = req.body
    try {
        UserModel.findOne({ username }
        ).then(user => {
            bcrypt.compare(password, user.password)

                .then(passwordMatch => {
                    if (!passwordMatch) res.status(400).send({ error: "dont have password" })
                    // creat  jwt token
                    const token = jwt.sign({
                        userId: user._id,
                        username: user.username
                    }, ENV.JWT_SECRET, { expiresIn: "24h" })

                    return res.status(200).send({
                        msg: "login secses",
                        username: user.username,
                        token
                    })
                })
                .catch(error => {
                    return res.status(400).send({ error: " passsword  does not match" });
                })
        }
        ).catch(error => {
            return res.status(404).send({ error: "username not found" });
        })
    } catch (error) {
        res.status(500).send({ error: "Failed to check user or password ", details: error.message });
    }
}

/** GET: http://localhost:3030/api/user/:username*/
export async function getuser(req, res) {

    const { username } = req.params;

    try {
        if (!username) {
            return res.status(501).send({ msg: "Invalid username" });
        }

        UserModel.findOne({ username }).then((user) => {
            if (!user) {
                return res.status(501).send({ error: "Cannot find the user" });
            }

            // return res.status(200).send(user);  // show all info with the password


            const { password, ...resst } = Object.assign({}, user.toJSON())

            return res.status(201).send(resst); // remove password from the resolt

        }).catch((err) => {
            return res.status(500).send({ error: "Internal Server Error" });
        });

    } catch (error) {
        return res.status(404).send({ error: "Internal Server Error" });
    }
}


/** PUT: http://localhost:3030/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    "username" : "",
    "password" : "",
    
}
*/
export async function updateuser(req, res) {

    try {
        const { userId } = req.user;
        //updat data
        if (userId) {
            const body = req.body;

            UserModel.updateOne({ _id: userId }, body
            ).then(result => {

                // nModified property of result tells you how many documents were modified during the update.
                if (result.nModified === 0) {

                    return res.status(401).send({ msg: "User not found or data not modified" });
                }

                return res.status(201).send({ msg: "Update successful" });
            }
            ).catch(err => {

                return res.status(401).send({ error: "Internal Server Error" });
            })

        } else {
            return res.status(401).send({ msg: "Invalid ID" });
        }


    } catch (error) {
        res.status(401).send({ error: "fuck this " })
    }
}

/** GET: http://localhost:3030/api/generateOTP?username=mehdi2 */
export async function generateOTP(req, res) {
    // OTP (One-Time Password) generator is a tool or algorithm that generates a unique and temporary password for authentication purposes.

    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    res.status(201).send({ code: req.app.locals.OTP })
}

/** GET: http://localhost:3030/api/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;


        return res.status(201).send({ msg: "Veryfy Successfly" })

    }

    return res.status(400).send({ error: "Invalid OTP" })
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:3030/api/createResetSession */
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        return res.status(201).send({ msg: req.app.locals.resetSession })
    }
    return res.status(440).send({ error: "Session expired!" })
}


// update the password when we have valid session
/** GET: http://localhost:3030/api/resetpassword */
export async function resetpassword(req, res) {
    try {
        if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });


        const { username, password } = req.body;

        try {

            UserModel.findOne({ username }
            ).then(
                user => {
                    bcrypt.hash(password, 10
                    ).then(hashedPassword => {

                        UserModel.updateOne(
                            { username: user.username },
                            { password: hashedPassword },
                        ).then(() => {
                            req.app.locals.resetSession = false; // reset session
                            return res.status(201).send({ msg: "Record Updated...!" });
                        }
                        ).catch(err => {
                            return res.status(504).send({ msg: "fuck ...!" });
                        })


                    }

                    ).catch(e => {
                        return res.status(500).send({ msg: "Enabel to hash the password" })
                    })
                }

            ).catch(erro => {
                return res.status(404).send({ msg: "Username Not found" })
            })

        } catch (error) {
            return res.status(500).send({ error })
        }
    } catch (error) {
        return res.status(401).send({ error })
    }
}



