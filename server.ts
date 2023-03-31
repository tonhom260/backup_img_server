import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import multer, { diskStorage, DiskStorageOptions } from 'multer'
import cors from 'cors'

dotenv.config();
const app: Express = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use(express.static('uploads',{setHeaders:(res,path,stat)=>{
  // console.log(path,'path?',stat)
}}))

app.post('/upload', (req: Request, res: Response) => {
  const { imgcat } = req.query
  console.log(imgcat)
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${imgcat}`)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = imgcat + '-' + Math.round(Math.random() * 1000) + '-' + new Date().toISOString().slice(0, 10)
      cb(null, uniqueSuffix + '.' + file.mimetype.slice(file.mimetype.indexOf('/') + 1))
    }
  })

  const options: multer.Options = { storage: storage }
  const upload = multer(options).single('upload')

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ error: err.message })
    } else if (!err && !!req.file) {
      console.log(req.file?.filename, req.file)
      res.status(201).json({ path: req.file.path })
    } else {
      console.log(err)
    }
  }
  )
})

app.get('/', (req, res) => {
  res.status(200).send('use post method to active service in "/upload", => key = "upload" , set header to =>  multipart/form-data; boundary=<calculated when request is sent> ')
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${process.env.EXTERNALPORT}`);
});
