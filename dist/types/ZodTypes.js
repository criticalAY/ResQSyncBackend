"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginInput = exports.signupInput = void 0;
const zod_1 = require("zod");
exports.signupInput = zod_1.z.object({
    email: zod_1.z.string().max(20).min(3),
    password: zod_1.z.string().max(30).min(8),
});
exports.loginInput = zod_1.z.object({
    email: zod_1.z.string().max(20).min(3),
    password: zod_1.z.string()
});
