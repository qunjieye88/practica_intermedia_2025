const DeliveryNoteModel = require("../models/deliveryNote.js");
const { matchedData } = require("express-validator")
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const { uploadToPinata } = require("../utils/handleUploadIPFS.js");
const { hola } = require("../utils/create.js");

const createDeliveryNote = async (req, res) => {
    try {
        const userId = req.user._id;
        req = matchedData(req)
        const projectId = req.projectId;
        const clientId = req.clientId;
        const deliveryNote = await DeliveryNoteModel.findOne({ userId: userId, projectId: projectId, clientId: clientId });
        if (deliveryNote) {
            return res.status(400).send({ error: "Albaran ya creado" });
        }
        const createDeliveryNote = await DeliveryNoteModel.create({ ...req, userId })
        res.status(201).json({ deliveryNote: createDeliveryNote });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el albarán", error: error.message });
    }
};

const getDeliveryNotes = async (req, res) => {
    try {
        const deliveryNotes = req.deliveryNotes;
        res.status(200).json({ deliveryNotes: deliveryNotes });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el albarán", error: error.message });
    }
};

const getDeliveryNote = async (req, res) => {
    try {
        const deliveryNote = req.deliveryNote;
        res.status(200).json({ deliveryNote: deliveryNote });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el albarán", error: error.message });
    }
};

const createPDF = async (req, res) => {

    const { id } = req.params;

    const deliveryNote = await DeliveryNoteModel.findById(id)
        .populate('userId', 'name email')
        .populate('clientId', 'name address')
        .populate('projectId', 'name description');

    let pdfPath;

    const ipfsHash = deliveryNote.sign;

    const storageDir = path.join(__dirname, '..', 'storage');
    if (ipfsHash) {
        const response = await fetch(ipfsHash);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const storageDir = path.join(__dirname, '..', 'storage');
        const filePath = path.join(storageDir, `albaran_${id}.pdf`);
        fs.writeFileSync(filePath, buffer);
        return res.status(200).json({ message: 'PDF descargado de pinata', path: ipfsHash });
    }

    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir);
    }

    pdfPath = path.join(storageDir, `albaran_${id}.pdf`);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);

    doc.pipe(writeStream);
    doc.fontSize(20).text('Albarán', { align: 'center' });

    doc.moveDown();
    doc.fontSize(14).text(`Usuario: ${deliveryNote.userId.name} (${deliveryNote.userId.email})`);
    doc.text(`Cliente: ${deliveryNote.clientId.name}`);
    doc.text(`Dirección Cliente: ${deliveryNote.clientId.address.street}, ${deliveryNote.clientId.address.city}`);
    doc.text(`Proyecto: ${deliveryNote.projectId.name}`);
    doc.text(`Descripción Proyecto: ${deliveryNote.projectId.description}`);

    doc.moveDown();
    doc.fontSize(16).text('Items:', { underline: true });
    deliveryNote.items.forEach((item, index) => {
        doc.moveDown(0.5);
        doc.fontSize(12).text(`${index + 1}. Tipo: ${item.type}`);
        if (item.type === 'hour') {
            doc.text(`Horas: ${item.hours}`);
        } else if (item.type === 'material') {
            doc.text(`Cantidad: ${item.quantity}`);
        }
        doc.text(`Descripción: ${item.description || 'No disponible'}`);
    });

    doc.moveDown();
    if (deliveryNote.sign) {
        doc.text('Albarán firmado', { align: 'right' });
    } else {
        doc.text('Albarán no firmado', { align: 'right' });
    }

    doc.end();

    writeStream.on('finish', async () => {
        res.status(200).json({ message: 'PDF generado y guardado', path: `./storage/albaran_${id}.pdf` });
    });

    writeStream.on('error', (err) => {
        res.status(500).json({ error: 'Error al guardar el PDF' });
    });
};


const createSinged = async (req, res) => {

    try {
        const deliveryNoteReq = req.deliveryNote;
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;

        const pinataResponse = await uploadToPinata(fileBuffer, fileName);
        const ipfsFile = pinataResponse.IpfsHash;
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`;

        deliveryNoteReq.set({ sign: ipfs });
        const updatedDeliveryNote = await deliveryNoteReq.save();

        const { id } = req.params;

        const deliveryNote = await DeliveryNoteModel.findById(id)
            .populate('userId', 'name email')
            .populate('clientId', 'name address')
            .populate('projectId', 'name description');

        const storageDir = path.join(__dirname, '..', 'storage');
        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir);
        }

        const pdfPath = path.join(storageDir, `albaran_${id}.pdf`);
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(pdfPath);

        doc.pipe(writeStream);

        doc.fontSize(20).text('Albarán', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Usuario: ${deliveryNote.userId.name} (${deliveryNote.userId.email})`);
        doc.text(`Cliente: ${deliveryNote.clientId.name}`);
        doc.text(`Dirección Cliente: ${deliveryNote.clientId.address.street}, ${deliveryNote.clientId.address.city}`);
        doc.text(`Proyecto: ${deliveryNote.projectId.name}`);
        doc.text(`Descripción Proyecto: ${deliveryNote.projectId.description}`);

        doc.moveDown();
        doc.fontSize(16).text('Items:', { underline: true });
        deliveryNote.items.forEach((item, index) => {
            doc.moveDown(0.5);
            doc.fontSize(12).text(`${index + 1}. Tipo: ${item.type}`);
            if (item.type === 'hour') {
                doc.text(`Horas: ${item.hours}`);
            } else if (item.type === 'material') {
                doc.text(`Cantidad: ${item.quantity}`);
            }
            doc.text(`Descripción: ${item.description || 'No disponible'}`);
        });

        doc.moveDown();
        doc.text('Albarán Firma');

        doc.image(fileBuffer, {
            fit: [250, 250],
            align: 'center',
            valign: 'center'
        });

        doc.end();

        writeStream.on('finish', async () => {
            const pdfBuffer = fs.readFileSync(pdfPath);
            try {
                const pinataResponse = await uploadToPinata(pdfBuffer, `albaran_${id}.pdf`);
                const ipfsFile = pinataResponse.IpfsHash;
                const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`;

                deliveryNoteReq.set({ sign: ipfs });
                const updatedDeliveryNote = await deliveryNoteReq.save();

                res.status(200).json({ message: 'PDF generado y subido correctamente', deliveryNote: updatedDeliveryNote });

            } catch (err) {
                res.status(500).json({ error: 'Error al subir a Pinata' });
            }
        });

        writeStream.on('error', (err) => {
            res.status(500).json({ error: 'Error al guardar el PDF' });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteDeliveryNote = async (req, res) => {
    try {
        const deliveryNote = req.deliveryNote;
        if (!deliveryNote.sign) {
            const deletedDeliveryNote = await DeliveryNoteModel.findByIdAndDelete(deliveryNote._id); // Hard delete
            res.status(200).json({ client: deletedDeliveryNote, message: 'Albaran eliminado permanentemente (hard delete)' });
        } else {

            res.status(400).json({ error: 'Albaran firmado, No se puede eliminar' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createDeliveryNote, getDeliveryNotes, getDeliveryNote,
    createPDF, createSinged, deleteDeliveryNote
}