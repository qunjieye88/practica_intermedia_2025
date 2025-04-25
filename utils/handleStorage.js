const multer = require("multer")


const storage = multer.diskStorage({
    destination: function (req, file, callback) { //Pasan argumentos automáticamente
        const pathStorage = __dirname + "/../storage"
        callback(null, pathStorage) //error y destination
    },
    filename: function (req, file, callback) { //Sobreescribimos o renombramos
        //Tienen extensión jpg, pdf, mp4
        const ext = file.originalname.split(".").pop() //el último valor
        const filename = "file-" + Date.now() + "." + ext
        callback(null, filename)
    }
})

const memory = multer.memoryStorage()

const uploadMiddlewareMemory = multer({ 
    storage: memory, 
    limits: { fileSize: 1024*1024 } // 2MB
});


//errores

const handleHttpError = (res,message,code=403)=>{
    res.status(code).send({error: message}) 
}



module.exports = {uploadMiddlewareMemory,handleHttpError}