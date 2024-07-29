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
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
class filefunctions {
    /**
     * Upload file to AWS S3 bucket
     * @param file req.files[filename] object
     */
    uploadFileToS3(file, folder, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file || !Buffer.isBuffer(file))
                return false;
            try {
                let s3 = new s3_1.default({
                    accessKeyId: "",
                    secretAccessKey: "",
                });
                var s3UploadPromise = yield new Promise(function (resolve, reject) {
                    s3.createBucket(function () {
                        var params = {
                            Bucket: "Bucket Name",
                            Key: filename,
                            Body: file,
                            ACL: "private"
                        };
                        s3.upload(params, function (err, data) {
                            if (err) {
                                reject(err);
                                // insert error log if any
                                return false;
                            }
                            else {
                                resolve(data);
                            }
                        });
                    });
                });
                return s3UploadPromise;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
}
exports.filefunctions = filefunctions;
//# sourceMappingURL=filefunctions.js.map