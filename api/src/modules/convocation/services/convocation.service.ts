import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ConvocationService {
  constructor(private readonly userService: UserService) {}

  async generateConvocation(userId: number): Promise<Buffer> {
    // Get user data with application
    const user = await this.userService.findOneById(userId);
    if (
      !user ||
      !user.application ||
      user.application.status?.status !== 'ACCEPTED'
    ) {
      throw new Error('User is not eligible for convocation');
    }

    // Generate PDF directly using PDFKit
    const pdfBuffer = await this.generatePdf(user);
    
    return pdfBuffer;
  }

  private async generatePdf(user: any): Promise<Buffer> {
    const { firstName, lastName, application } = user;
    const applicationId = application.id;
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: {
            top: 72,
            bottom: 72,
            left: 72,
            right: 72,
          },
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Simple color scheme
        const blueColor = '#0066CC';
        const grayColor = '#666666';

        // Simple header
        doc
          .fontSize(24)
          .fillColor(blueColor)
          .text('CONVOCATION OFFICIELLE', 72, 80, {
            align: 'center',
            width: doc.page.width - 144,
          });

        doc
          .fontSize(16)
          .fillColor(grayColor)
          .text('Feynman Moroccan Adventure', 72, 110, {
            align: 'center',
            width: doc.page.width - 144,
          });

        // Simple line
        doc
          .strokeColor(blueColor)
          .lineWidth(2)
          .moveTo(72, 140)
          .lineTo(doc.page.width - 72, 140)
          .stroke();

        // Date
        doc
          .fontSize(12)
          .fillColor('black')
          .text(`Rabat, le ${currentDate}`, 72, 170, {
            align: 'right',
            width: doc.page.width - 144,
          });

        // Main content
        let yPosition = 220;

        // Greeting
        doc
          .fontSize(14)
          .fillColor('black')
          .text(`Chère participante, Cher participant `, 72, yPosition, { continued: true })
          .fillColor(blueColor)
          .text(`${firstName} ${lastName}`, { continued: true })
          .fillColor('black')
          .text(',');

        yPosition += 30;

        // Body text
        doc
          .fontSize(12)
          .fillColor('black')
          .text(
            'Nous avons le plaisir de vous convoquer à la ',
            72,
            yPosition,
            { continued: true }
          )
          .fillColor(blueColor)
          .text('Feynman Moroccan Adventure (FMA)', { continued: true })
          .fillColor('black')
          .text(', une aventure scientifique immersive autour de la physique.');

        yPosition += 40;

        // Event details - compact version
        doc
          .fontSize(12)
          .fillColor('black')
          .text('Dates : ', 72, yPosition, { continued: true })
          .fillColor(blueColor)
          .text('du 14 juillet au 20 juillet 2025');

        yPosition += 20;

        doc
          .fontSize(12)
          .fillColor('black')
          .text('Heure d\'accueil : ', 72, yPosition, { continued: true })
          .fillColor(blueColor)
          .text('13h00 à 17h00');

        yPosition += 20;

        doc
          .fontSize(12)
          .fillColor('black')
          .text('Lieu : ', 72, yPosition, { continued: true })
          .fillColor(blueColor)
          .text('Campus du LM6E, Benguérir');

        yPosition += 40;

        // Simple information box
        const boxY = yPosition;
        const boxHeight = 80;
        
        doc
          .rect(72, boxY, doc.page.width - 144, boxHeight)
          .fillColor('#f8f9fa')
          .fill()
          .rect(72, boxY, doc.page.width - 144, boxHeight)
          .strokeColor(blueColor)
          .stroke();

        doc
          .fontSize(12)
          .fillColor('black')
          .text('Informations importantes :', 92, boxY + 15);

        doc
          .fontSize(11)
          .text(`• Numéro de candidature : FMA-2025-${applicationId}`, 92, boxY + 35)
          .text('• Statut : ACCEPTÉ', 92, boxY + 50)
          .text('• Veuillez conserver cette convocation', 92, boxY + 65);

        yPosition += boxHeight + 30;

        // Simple closing text
        doc
          .fontSize(12)
          .fillColor('black')
          .text(
            'Nous vous remercions et vous prions d\'agréer nos salutations distinguées.',
            72,
            yPosition,
            { width: doc.page.width - 144 }
          );

        yPosition += 60;

        // Simple signature
        doc
          .fontSize(12)
          .fillColor('black')
          .text(
            'L\'Organisation de la Feynman Moroccan Adventure',
            doc.page.width - 280,
            yPosition,
            { align: 'center', width: 200 }
          );

        yPosition += 40;

        // Signature line
        doc
          .strokeColor('black')
          .lineWidth(1)
          .moveTo(doc.page.width - 280, yPosition)
          .lineTo(doc.page.width - 80, yPosition)
          .stroke();

        // Simple footer
        doc
          .fontSize(10)
          .fillColor(grayColor)
          .text(
            `Feynman Moroccan Adventure - ${currentDate}`,
            72,
            doc.page.height - 50,
            { align: 'center', width: doc.page.width - 144 }
          );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async getUserForConvocation(userId: number): Promise<any> {
    try {
      const user = await this.userService.findOneById(userId);
      if (
        !user ||
        !user.application ||
        user.application.status?.status !== 'ACCEPTED'
      ) {
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error fetching user for convocation:', error);
      return null;
    }
  }
}
