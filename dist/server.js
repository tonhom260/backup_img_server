"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('uploads'));
app.post('/upload', (req, res) => {
    const { imgcat } = req.query;
    console.log(imgcat);
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${imgcat}`);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = imgcat + '-' + Math.round(Math.random() * 1000) + '-' + new Date().toISOString().slice(0, 10);
            cb(null, uniqueSuffix + '.' + file.mimetype.slice(file.mimetype.indexOf('/') + 1));
        }
    });
    const options = { storage: storage };
    const upload = (0, multer_1.default)(options).single('upload');
    upload(req, res, function (err) {
        var _a;
        if (err instanceof multer_1.default.MulterError) {
            res.status(500).json({ error: err.message });
        }
        else if (!err && !!req.file) {
            console.log((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename, req.file);
            res.status(201).json({ path: req.file.path });
        }
        else {
            console.log(err);
        }
    });
});
app.get('/', (req, res) => {
    res.status(200).send('use post method to active service in "/upload", => key = "upload" , set header to =>  multipart/form-data; boundary=<calculated when request is sent> ');
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${process.env.EXTERNALPORT}`);
});
