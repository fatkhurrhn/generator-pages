const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/convert', upload.array('files'), async (req, res) => {
    try {
        const pdfDoc = await PDFDocument.create();
        for (const file of req.files) {
            const pngImage = await pdfDoc.embedPng(fs.readFileSync(file.path));
            const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
            page.drawImage(pngImage, { x: 0, y: 0, width: pngImage.width, height: pngImage.height });
            fs.unlinkSync(file.path); // Delete temp file
        }
        const pdfBytes = await pdfDoc.save();
        const outputPath = `uploads/output-${Date.now()}.pdf`;
        fs.writeFileSync(outputPath, pdfBytes);
        res.download(outputPath, () => fs.unlinkSync(outputPath)); // Delete output after download
    } catch (err) {
        res.status(500).send('Error converting PNG to PDF');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
