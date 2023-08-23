"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = require("../controller/userController");
const middleware_1 = require("../utils/middleware");
router.post('/login', userController_1.login);
router.post('/signup', userController_1.signup);
router.get('/me', middleware_1.protect, userController_1.me);
exports.default = router;
