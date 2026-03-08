import express from 'express';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { requireRole } from '../middleware/auth';

const router = express.Router();

// Extend jsPDF for autotable support in TypeScript
interface jsPDFWithPlugin extends jsPDF {
    autoTable: (options: any) => jsPDF;
}

router.post('/export', async (req: any, res) => {
    try {
        const { type, format, data, title } = req.body;
        console.log(`📊 Export Request: ${type} as ${format} (${title})`);

        if (format === 'pdf') {
            const doc = new jsPDF();

            // Header
            doc.setFontSize(20);
            doc.setTextColor(0, 255, 156);
            doc.text('SENTINEX Intelligence Report', 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
            doc.text(`Dashboard Type: ${type.toUpperCase()}`, 14, 35);
            doc.text(`Topic: ${title}`, 14, 40);

            // Draw a line
            doc.setDrawColor(0, 255, 156);
            doc.line(14, 45, 196, 45);

            if (data && Array.isArray(data) && data.length > 0) {
                const tableHeaders = Object.keys(data[0]).map(key => key.toUpperCase());
                const tableRows = data.map(item => Object.values(item));

                console.log('📝 Generating PDF Table...');
                autoTable(doc, {
                    head: [tableHeaders],
                    body: tableRows as any[][],
                    startY: 55,
                    theme: 'grid',
                    headStyles: { fillColor: [0, 255, 156], textColor: [0, 0, 0] },
                    styles: { fontSize: 8 }
                });
            } else if (data && typeof data === 'object') {
                const stats = Object.entries(data).map(([key, value]) => [key, String(value)]);
                autoTable(doc, {
                    head: [['Metric', 'Value']],
                    body: stats as any[][],
                    startY: 55,
                    theme: 'grid',
                    headStyles: { fillColor: [0, 255, 156], textColor: [0, 0, 0] }
                });
            }

            console.log('✅ PDF generated, converting to buffer...');
            const pdfArrayBuffer = doc.output('arraybuffer');
            const pdfBuffer = Buffer.from(pdfArrayBuffer);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=sentinex-report-${Date.now()}.pdf`);
            res.setHeader('Content-Length', pdfBuffer.length);
            return res.status(200).send(pdfBuffer);

        } else if (format === 'excel') {
            console.log('📝 Generating Excel Sheet...');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sentinex Report');

            if (data && Array.isArray(data) && data.length > 0) {
                const headers = Object.keys(data[0]);
                worksheet.columns = headers.map(h => ({ header: h.toUpperCase(), key: h, width: 20 }));
                worksheet.addRows(data);
            } else if (data && typeof data === 'object') {
                worksheet.columns = [
                    { header: 'METRIC', key: 'metric', width: 30 },
                    { header: 'VALUE', key: 'value', width: 20 }
                ];
                Object.entries(data).forEach(([key, value]) => {
                    worksheet.addRow({ metric: key, value: String(value) });
                });
            }

            // Styling
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF00FF9C' }
            };

            const buffer = await workbook.xlsx.writeBuffer();
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=sentinex-report-${Date.now()}.xlsx`);
            return res.send(buffer);
        }

        res.status(400).json({ message: 'Invalid format' });
    } catch (error: any) {
        console.error('❌ Export Error:', error);
        res.status(500).json({ message: 'Failed to generate report', error: error.message });
    }
});

export default router;
