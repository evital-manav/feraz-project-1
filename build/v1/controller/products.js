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
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const functions_1 = require("../library/functions");
const validations_1 = require("../library/validations");
const dbproducts_1 = require("../model/dbproducts");
const router = express_1.default.Router();
router.post('/', listSchema, list);
// router.post('/view', viewSchema, view);
module.exports = router;
/**
 * Validation function for list orders route
 */
function listSchema(req, res, next) {
    let schema = joi_1.default.object({
        seller_id: joi_1.default.number().integer().required()
    });
    let validationsObj = new validations_1.validations();
    if (!validationsObj.validateRequest(req, res, next, schema)) {
        return false;
    }
}
/**
 * Request for new medicine
 */
function list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let productsObj = new dbproducts_1.dbproducts();
        let seller_id = req.body.seller_id;
        let result = yield productsObj.getProducts(seller_id);
        var functionsObj = new functions_1.functions();
        res.send(functionsObj.output(1, 'SUCCESS', result));
        return false;
    });
}
//# sourceMappingURL=products.js.map