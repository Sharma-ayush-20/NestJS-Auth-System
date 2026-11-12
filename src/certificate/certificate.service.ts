import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

export interface CertificateData {
  studentName: string;
  courseName: string;
  certificateId: string;
  completionDate: string;
}

@Injectable()
export class CertificateService {
  /**
   * Generates a high-resolution, vector-based PDF certificate in-memory
   * and returns a raw Node.js Buffer.
   */

  async generateCertificateBuffer(data: CertificateData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      //1. Create a landscape A4 PDF Document
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margins: { top: 40, bottom: 40, left: 40, right: 40 },
      });

      const buffers: Buffer[] = [];

      // Collect data chunks in memory
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const width = doc.page.width;
      const height = doc.page.height;

      // Draw Borders (Navy & Gold Elegance)

      // Outer Navy Border
      doc
        .lineWidth(4)
        .strokeColor('#1e3a8a') // Deep Royal Navy Blue
        .rect(20, 20, width - 40, height - 40)
        .stroke();

      // Inner Golden Border
      doc
        .lineWidth(2)
        .strokeColor('#d97706') // Gold / Amber
        .rect(26, 26, width - 52, height - 52)
        .stroke();

      // Header & Brand
      doc.moveDown(2);

      doc
        .font('Helvetica-Bold')
        .fontSize(28)
        .fillColor('#1e3a8a')
        .text('LMS ACADEMY', { align: 'center', characterSpacing: 3 });

      doc.moveDown(0.5);

      doc
        .font('Helvetica')
        .fontSize(14)
        .fillColor('#64748b')
        .text('OFFICIAL CERTIFICATE OF COMPLETION', {
          align: 'center',
          characterSpacing: 2,
        });

      // 4. Recipient Section

      doc.moveDown(1.5);

      doc
        .font('Helvetica-Oblique')
        .fontSize(13)
        .fillColor('#475569')
        .text('This is proudly presented to', { align: 'center' });
      doc.moveDown(0.8);

      // Student Name (Large & Prominent)
      doc
        .font('Helvetica-Bold')
        .fontSize(32)
        .fillColor('#0f172a')
        .text(data.studentName.toUpperCase(), { align: 'center' });

      // Decorative line under student name

      const textWidth = doc.widthOfString(data.studentName.toUpperCase());
      const lineStartX = (width - textWidth) / 2 - 20;
      const lineEndX = (width + textWidth) / 2 + 20;
      doc
        .strokeColor('#d97706')
        .lineWidth(1.5)
        .moveTo(lineStartX, doc.y + 4)
        .lineTo(lineEndX, doc.y + 4)
        .stroke();

      // 5. Course Details

      doc.moveDown(1.5);
      doc
        .font('Helvetica')
        .fontSize(13)
        .fillColor('#475569')
        .text('for successfully completing the comprehensive curriculum for', {
          align: 'center',
        });
      doc.moveDown(0.6);
      doc
        .font('Helvetica-Bold')
        .fontSize(22)
        .fillColor('#1e3a8a')
        .text(data.courseName, { align: 'center' });

      // 6. Footer (Date, Signature line & Unique Verification ID)

      const footerY = height - 100;
      // Left: Date of Completion
      doc
        .font('Helvetica')
        .fontSize(11)
        .fillColor('#64748b')
        .text(`Date of Issue: ${data.completionDate}`, 60, footerY);
      // Right: Authorized Signature Line
      doc
        .strokeColor('#94a3b8')
        .lineWidth(1)
        .moveTo(width - 240, footerY)
        .lineTo(width - 60, footerY)
        .stroke();
      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .fillColor('#1e3a8a')
        .text('Authorized Instructor', width - 240, footerY + 8, {
          width: 180,
          align: 'center',
        });

      // Bottom Center: Unique Verification Code
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#94a3b8')
        .text(
          `VERIFICATION ID: ${data.certificateId}  •  VERIFIED BY LMS ACADEMY`,
          0,
          height - 48,
          { align: 'center', characterSpacing: 1 },
        );
      // 7. Finalize the PDF stream
      doc.end();
    });
  }
}
