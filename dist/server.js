"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./db");
const port = 4000;
async function main() {
    await (0, db_1.initDB)();
    app_1.default.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}
main();
