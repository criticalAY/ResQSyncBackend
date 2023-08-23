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
exports.me = exports.login = exports.signup = void 0;
const UserModel_1 = __importDefault(require("../model/UserModel"));
const passwordHashing_1 = require("../utils/passwordHashing");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ZodTypes_1 = require("../types/ZodTypes");
// @desc save use to the database if not already present
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // input validation
            const parsedResponse = ZodTypes_1.signupInput.safeParse(req.body);
            if (!parsedResponse.success) {
                return res.status(401).json({
                    status: false,
                    msg: 'Invalid Input',
                });
            }
            // Check if username is already present, else save
            const { username, password } = req.body;
            const isUser = yield UserModel_1.default.findOne({ username });
            if (isUser) {
                return res.status(401).json({ status: false, msg: 'User already exits!!' });
            }
            else {
                const securePassword = (0, passwordHashing_1.hashPassword)(password);
                yield UserModel_1.default.create({ username, securePassword });
            }
            if (!process.env.SECRET)
                return res.status(500);
            const token = jsonwebtoken_1.default.sign({ username }, process.env.SECRET);
            return res.status(200).json({ status: true, token });
        }
        catch (ex) {
            console.log(ex);
            return res.status(500).json({ status: false, msg: 'Internal Server Error!!' });
        }
    });
}
exports.signup = signup;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parsedResponse = ZodTypes_1.loginInput.safeParse(req.body);
            if (!parsedResponse.success) {
                return res.status(401).json({
                    status: false,
                    msg: 'Invalid Input',
                });
            }
            // Check if username is present, else invalid
            const { username, password } = req.body;
            const user = yield UserModel_1.default.findOne({ username });
            if (!user) {
                return res.status(401).json({ status: false, msg: 'Invalid Username Or Password' });
            }
            // Verify the provided password against the hashed password
            const isPasswordValid = (0, passwordHashing_1.verifyPassword)(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ status: false, msg: 'Invalid Username Or Password' });
            }
            if (!process.env.SECRET) {
                return res.status(500);
            }
            const token = jsonwebtoken_1.default.sign({ username }, process.env.SECRET);
            return res.status(200).json({ status: true, token });
        }
        catch (ex) {
            console.log(ex);
            return res.status(500).json({ status: false, msg: 'Internal Server Error!!' });
        }
    });
}
exports.login = login;
function me(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = req.headers.username;
            return res.status(200).json({ status: true, username });
        }
        catch (ex) {
            console.log(ex);
            return res.status(500).json({ status: false, msg: 'Internal Server Error!!' });
        }
    });
}
exports.me = me;
