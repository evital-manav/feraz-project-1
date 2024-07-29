"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../helper.ts/schema");
const validation_1 = require("../helper.ts/validation");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const helpfn_1 = require("../helper.ts/helpfn");
const dbusers_1 = __importDefault(require("../model/dbusers"));
const html_1 = __importDefault(require("../helper.ts/html"));
const helpfn_2 = require("../helper.ts/helpfn");
const crypto_1 = __importDefault(require("crypto"));
const signToken = (id) => jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || "90d", {
    expiresIn: process.env.JWT_EXPIRES_IN,
});
// export const signup = async (req: Request, res: Response) => {
//   try {
//     const validate = await applyValidation(signupSchema, req.body);
//     console.log("ffffffff", validate);
//     const { firstName, lastName, email, mobile, password } = req.body;
//     const signupBody = { firstName, lastName, email, mobile, password };
//     const hashedPasssword = await bcrypt.hash(password, 12);
//     signupBody.password = hashedPasssword;
//     const id = await user.insertUser(signupBody);
//     if (!id) {
//       throw { message: "this email already exist" };
//     }
//     console.log(id);
//     const token = signToken(id);
//     res.status(200).json({
//       error: false,
//       message: "signup successfull",
//       data: { token },
//     });
//   } catch (err) {
//     const error = err as any;
//     console.log(err);
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
exports.signup_test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        res.status(200).json({
            error: false,
            message: "you have signup successfully",
            data: req.body,
        });
    }
    catch (error) { }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email = null, password: login_password = null } = req.body;
        const login_body = { email: req.body.email, password: req.body.password };
        const validate = yield validation_1.applyValidation(schema_1.login_schema, login_body);
        const db_user = yield dbusers_1.default.getUser({ email });
        if (db_user.length === 0) {
            throw { message: "This email is not registed" };
        }
        const { password: db_password, id } = db_user[0];
        const validate_password = yield bcrypt_1.default.compare(login_password, db_password);
        if (!validate_password) {
            throw { message: "email or password is wrong" };
        }
        const token = signToken(id);
        res.status(200).json({
            error: false,
            message: "login successfull",
            data: { token },
        });
    }
    catch (err) {
        const error = err;
        res.status(400).json({
            error: true,
            message: error.message,
            data: {},
        });
    }
});
exports.update_role = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = { role: "agent" };
        const response = yield dbusers_1.default.update_user(req.user.id, data);
        if (response !== 1) {
            throw {
                message: "Internal server error",
            };
        }
        const data_to_send = Object.assign(Object.assign({}, req.user), { role: "agent", reset_password_token: undefined, change_password_at: undefined, password: undefined });
        res.status(200).json({
            error: false,
            message: "you are now agent",
            data_to_send,
        });
        console.log("update response", response);
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            error: true,
            message: err.message,
            data: {},
        });
    }
});
exports.forgot_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validate = yield validation_1.applyValidation(schema_1.forgot_password_schema, req.body);
        const response = yield dbusers_1.default.getUser({ email: validate.email });
        if (response.length === 0) {
            throw {
                message: "this email does not exist with us",
            };
        }
        const [random_token, hashed_token] = helpfn_1.create_random_token();
        yield dbusers_1.default.update_user(response[0].id, {
            reset_password_token: hashed_token,
        });
        const reset_link = `${req.protocol}://${req.get("host")}/v1/user/resetpassword/${random_token}`;
        let html = html_1.default.replace("REPLACE_WITH_HTML_CONTENT", "<p>To reset password please click on below tab</p>");
        html = html.replace("REPLACE_WITH_LINK", reset_link);
        html = html.replace("REPLACE_WITH_TAB", "reset password");
        const subject = "reset your password";
        const sender = "feraz@gmail.com";
        const mail_response = yield helpfn_2.send_mail({
            html,
            sender,
            subject,
            reciever: validate.email,
        });
        res.status(200).json({
            reset_link,
        });
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            error: true,
            message: err.message,
            data: {},
        });
    }
});
exports.reset_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        const password = req.body.password;
        const validate = yield validation_1.applyValidation(schema_1.reset_password_schema, req.body);
        if (!token) {
            throw {
                message: "you are not autorize to perform this action ",
            };
        }
        const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
        const query_find_user = `select * from users where reset_password_token = '${hashedToken}'`;
        const requested_user = yield dbusers_1.default.executeQuery(query_find_user);
        if (!requested_user) {
            throw {
                message: "Invalid user",
            };
        }
        const hashed_password = yield bcrypt_1.default.hash(password, 12);
        const query_update_password = yield dbusers_1.default.update_user(requested_user[0].id, {
            password: hashed_password,
        });
        if (!query_update_password) {
            throw {
                errorCode: 500,
                message: "internal server error",
            };
        }
        res.status(200).json({
            error: false,
            message: "your password has been change successfully",
            data: {},
        });
    }
    catch (error) {
        const err = error;
        res.status(err.errorCode || 401).json({
            error: true,
            message: err.message,
            data: {},
        });
    }
});
//# sourceMappingURL=users.js.map