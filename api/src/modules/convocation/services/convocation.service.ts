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

        // Colors
        const blueColor = '#0066CC';
        const grayColor = '#666666';

        // Header section
        doc
          .fontSize(24)
          .fillColor(blueColor)
          .text('CONVOCATION OFFICIELLE', 72, 100, {
            align: 'center',
            width: doc.page.width - 144,
          });

        doc
          .fontSize(16)
          .fillColor(grayColor)
          .text('Formation Marocaine d\'Astronomie', 72, 140, {
            align: 'center',
            width: doc.page.width - 144,
          });

        // Decorative line
        doc
          .strokeColor(blueColor)
          .lineWidth(2)
          .moveTo(72, 180)
          .lineTo(doc.page.width - 72, 180)
          .stroke();

        // Date
        doc
          .fontSize(12)
          .fillColor('black')
          .text(`Rabat, le ${currentDate}`, 72, 220, {
            align: 'right',
            width: doc.page.width - 144,
          });

        // Main content
        let yPosition = 280;

        // Greeting
        doc
          .fontSize(14)
          .fillColor('black')
          .text(`Madame/Monsieur `, 72, yPosition, { continued: true })
          .fillColor(blueColor)
          .text(`${firstName} ${lastName}`, { continued: true })
          .fillColor('black')
          .text(',');

        yPosition += 40;

        // Body text
        doc
          .fontSize(12)
          .fillColor('black')
          .text(
            'Nous avons l\'honneur de vous informer que votre candidature à la ',
            72,
            yPosition,
            { continued: true, width: doc.page.width - 144 }
          )
          .fillColor(blueColor)
          .text('Formation Marocaine d\'Astronomie', { continued: true })
          .fillColor('black')
          .text(' a été retenue.');

        yPosition += 60;

        doc
          .fontSize(12)
          .fillColor('black')
          .text(
            'Par la présente, nous vous convoquons officiellement à participer à cette formation exceptionnelle qui se déroulera prochainement. Votre engagement et votre passion pour l\'astronomie seront des atouts précieux pour le succès de cette formation.',
            72,
            yPosition,
            { width: doc.page.width - 144, align: 'justify' }
          );

        yPosition += 80;

        // Information box
        const boxY = yPosition;
        const boxHeight = 100;
        
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
          .text('Informations importantes :', 92, boxY + 15, { width: doc.page.width - 164 });

        doc
          .fontSize(11)
          .text(`• Numéro de candidature : FMA-2025-${applicationId}`, 92, boxY + 35)
          .text('• Statut : ACCEPTÉ', 92, boxY + 50)
          .text(`• Date de convocation : ${currentDate}`, 92, boxY + 65)
          .text('• Veuillez conserver cette convocation comme justificatif officiel', 92, boxY + 80);

        yPosition += 140;

        // Continuation text
        doc
          .fontSize(12)
          .fillColor('black')
          .text(
            'Nous vous prions de bien vouloir confirmer votre présence dans les plus brefs délais et de vous munir de cette convocation le jour de l\'événement.',
            72,
            yPosition,
            { width: doc.page.width - 144, align: 'justify' }
          );

        yPosition += 60;

        doc
          .fontSize(12)
          .fillColor('black')
          .text(
            'En vous remerciant de votre engagement, nous vous prions d\'agréer, Madame/Monsieur, l\'expression de nos salutations distinguées.',
            72,
            yPosition,
            { width: doc.page.width - 144, align: 'justify' }
          );

        // Signature section
        yPosition += 80;

        doc
          .fontSize(12)
          .fillColor('black')
          .text(
            'L\'Organisation de la Formation Marocaine d\'Astronomie',
            doc.page.width - 300,
            yPosition,
            { align: 'center', width: 200 }
          );

        yPosition += 60;

        // Signature line
        doc
          .strokeColor('black')
          .lineWidth(1)
          .moveTo(doc.page.width - 300, yPosition)
          .lineTo(doc.page.width - 100, yPosition)
          .stroke();

        doc
          .fontSize(10)
          .fillColor('black')
          .text('Direction Pédagogique', doc.page.width - 300, yPosition + 10, {
            align: 'center',
            width: 200,
          });

        // Footer
        doc
          .fontSize(10)
          .fillColor(grayColor)
          .text(
            `Formation Marocaine d'Astronomie - Document officiel généré le ${currentDate}`,
            72,
            doc.page.height - 50,
            { align: 'center', width: doc.page.width - 144 }
          );

        // Footer line
        doc
          .strokeColor(blueColor)
          .lineWidth(1)
          .moveTo(72, doc.page.height - 70)
          .lineTo(doc.page.width - 72, doc.page.height - 70)
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
