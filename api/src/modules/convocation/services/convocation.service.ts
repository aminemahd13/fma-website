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

        // Modern color palette
        const primaryBlue = '#2563EB';
        const accentGreen = '#059669';
        const darkGray = '#1F2937';
        const lightGray = '#F9FAFB';

        // Header with modern styling
        doc
          .fontSize(26)
          .fillColor(primaryBlue)
          .text('CONVOCATION OFFICIELLE', 0, 60, {
            align: 'center',
            width: doc.page.width,
          });

        doc
          .fontSize(18)
          .fillColor(accentGreen)
          .text('Feynman Moroccan Adventure', 0, 95, {
            align: 'center',
            width: doc.page.width,
          });

        // Stylish underline
        doc
          .rect(100, 125, doc.page.width - 200, 3)
          .fillColor(primaryBlue)
          .fill();

        // Date in top right
        doc
          .fontSize(11)
          .fillColor(darkGray)
          .text(`Rabat, le ${currentDate}`, doc.page.width - 200, 145, {
            width: 150,
            align: 'right',
          });

        // Content area starts
        let y = 180;

        // Personalized greeting with style
        doc
          .fontSize(14)
          .fillColor(darkGray)
          .text('Chère participante, Cher participant', 72, y);
        
        doc
          .fontSize(16)
          .fillColor(primaryBlue)
          .text(`${firstName} ${lastName}`, 72, y + 20);

        y += 60;

        // Main message
        doc
          .fontSize(12)
          .fillColor(darkGray)
          .text(
            'Nous avons le plaisir de vous convoquer à la Feynman Moroccan Adventure (FMA), une aventure scientifique immersive autour de la physique.',
            72,
            y,
            { width: doc.page.width - 144, align: 'justify' }
          );

        y += 50;

        // Event details in a styled box
        const boxWidth = doc.page.width - 144;
        const boxHeight = 120;
        
        // Box shadow effect
        doc
          .rect(75, y + 3, boxWidth, boxHeight)
          .fillColor('#E5E7EB')
          .fill();
        
        // Main box
        doc
          .rect(72, y, boxWidth, boxHeight)
          .fillColor(lightGray)
          .fill()
          .rect(72, y, boxWidth, boxHeight)
          .strokeColor(primaryBlue)
          .lineWidth(2)
          .stroke();

        // Box header
        doc
          .rect(72, y, boxWidth, 25)
          .fillColor(primaryBlue)
          .fill();

        doc
          .fontSize(13)
          .fillColor('white')
          .text('DÉTAILS DE L\'ÉVÉNEMENT', 72, y + 8, {
            align: 'center',
            width: boxWidth,
          });

        // Event details content
        y += 40;
        doc
          .fontSize(11)
          .fillColor(darkGray)
          .text('Dates :', 92, y, { continued: true })
          .fillColor(accentGreen)
          .text(' du 14 juillet au 20 juillet 2025');

        y += 20;
        doc
          .fontSize(11)
          .fillColor(darkGray)
          .text('Horaires :', 92, y, { continued: true })
          .fillColor(accentGreen)
          .text(' 13h00 à 17h00');

        y += 20;
        doc
          .fontSize(11)
          .fillColor(darkGray)
          .text('Lieu :', 92, y, { continued: true })
          .fillColor(accentGreen)
          .text(' Campus du LM6E, Benguérir');

        y += 60;

        // Candidate info box
        const infoBoxHeight = 70;
        
        doc
          .rect(72, y, boxWidth, infoBoxHeight)
          .fillColor('#FEF3C7')
          .fill()
          .rect(72, y, boxWidth, infoBoxHeight)
          .strokeColor('#F59E0B')
          .lineWidth(1)
          .stroke();

        doc
          .fontSize(12)
          .fillColor('#92400E')
          .text('INFORMATIONS CANDIDAT', 92, y + 12);

        doc
          .fontSize(10)
          .fillColor('#78350F')
          .text(`Numéro : FMA-2025-${applicationId}`, 92, y + 32)
          .text('Statut : ACCEPTÉ', 92, y + 47);

        y += 90;

        // Closing message
        doc
          .fontSize(11)
          .fillColor(darkGray)
          .text(
            'Veuillez conserver cette convocation et la présenter le jour de l\'événement.',
            72,
            y,
            { width: doc.page.width - 144, align: 'justify' }
          );

        y += 40;

        // Signature section
        const sigWidth = 200;
        const sigX = doc.page.width - sigWidth - 72;

        doc
          .fontSize(11)
          .fillColor(darkGray)
          .text('L\'Organisation', sigX, y, { align: 'center', width: sigWidth })
          .text('Feynman Moroccan Adventure', sigX, y + 15, { align: 'center', width: sigWidth });

        // Signature line
        doc
          .strokeColor(primaryBlue)
          .lineWidth(1)
          .moveTo(sigX + 20, y + 50)
          .lineTo(sigX + sigWidth - 20, y + 50)
          .stroke();

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
