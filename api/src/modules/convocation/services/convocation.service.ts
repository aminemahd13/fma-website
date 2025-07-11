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
        const primaryColor = '#1E40AF'; // Deep blue
        const accentColor = '#10B981'; // Green
        const grayColor = '#6B7280';
        const lightGray = '#F3F4F6';
        const darkGray = '#374151';

        // Background gradient effect
        doc
          .rect(0, 0, doc.page.width, 200)
          .fillColor('#F8FAFC')
          .fill();

        // Header section with enhanced styling
        doc
          .fontSize(28)
          .fillColor(primaryColor)
          .font('Helvetica-Bold')
          .text('CONVOCATION OFFICIELLE', 72, 80, {
            align: 'center',
            width: doc.page.width - 144,
          });

        // Subtitle with better spacing
        doc
          .fontSize(18)
          .fillColor(accentColor)
          .font('Helvetica-Bold')
          .text('Feynman Moroccan Adventure', 72, 120, {
            align: 'center',
            width: doc.page.width - 144,
          });

        doc
          .fontSize(14)
          .fillColor(grayColor)
          .font('Helvetica')
          .text('Une aventure scientifique immersive', 72, 145, {
            align: 'center',
            width: doc.page.width - 144,
          });

        // Decorative elements
        doc
          .strokeColor(primaryColor)
          .lineWidth(3)
          .moveTo(72, 180)
          .lineTo(doc.page.width - 72, 180)
          .stroke();

        // Add decorative dots
        const dotSize = 4;
        for (let i = 0; i < 5; i++) {
          doc
            .circle(doc.page.width / 2 - 40 + i * 20, 190, dotSize)
            .fillColor(accentColor)
            .fill();
        }

        // Date with elegant styling
        doc
          .fontSize(12)
          .fillColor(grayColor)
          .font('Helvetica')
          .text(`Rabat, le ${currentDate}`, 72, 230, {
            align: 'right',
            width: doc.page.width - 144,
          });

        // Main content area with better spacing
        let yPosition = 290;

        // Elegant greeting with enhanced typography
        doc
          .fontSize(16)
          .fillColor(darkGray)
          .font('Helvetica')
          .text('Chère participante, Cher participant ', 72, yPosition, { 
            continued: true 
          })
          .fillColor(primaryColor)
          .font('Helvetica-Bold')
          .text(`${firstName} ${lastName}`, { continued: true })
          .fillColor(darkGray)
          .font('Helvetica')
          .text(',');

        yPosition += 50;

        // Enhanced body text with better typography
        doc
          .fontSize(13)
          .fillColor(darkGray)
          .font('Helvetica')
          .text(
            'Nous avons le plaisir de vous convoquer à la ',
            72,
            yPosition,
            { continued: true, width: doc.page.width - 144 }
          )
          .fillColor(primaryColor)
          .font('Helvetica-Bold')
          .text('Feynman Moroccan Adventure (FMA)', { continued: true })
          .fillColor(darkGray)
          .font('Helvetica')
          .text(', une aventure scientifique immersive autour de la physique, qui se déroulera comme suit :');

        yPosition += 70;

        // Event details section with enhanced design
        const detailsBoxY = yPosition;
        const detailsBoxHeight = 140;
        
        // Create a beautiful gradient box for event details
        doc
          .rect(72, detailsBoxY, doc.page.width - 144, detailsBoxHeight)
          .fillColor('#F0F9FF')
          .fill()
          .rect(72, detailsBoxY, doc.page.width - 144, detailsBoxHeight)
          .strokeColor(primaryColor)
          .lineWidth(2)
          .stroke();

        // Add a subtle accent line at the top
        doc
          .rect(72, detailsBoxY, doc.page.width - 144, 8)
          .fillColor(accentColor)
          .fill();

        // Event details title
        doc
          .fontSize(14)
          .fillColor(primaryColor)
          .font('Helvetica-Bold')
          .text('📅 DÉTAILS DE L\'ÉVÉNEMENT', 92, detailsBoxY + 25);

        let detailY = detailsBoxY + 55;

        // Date with icon
        doc
          .fontSize(12)
          .fillColor(darkGray)
          .font('Helvetica-Bold')
          .text('🗓️  Dates : ', 92, detailY, { continued: true })
          .fillColor(primaryColor)
          .font('Helvetica')
          .text('du 14 juillet au 20 juillet 2025');

        detailY += 25;

        // Time with icon
        doc
          .fontSize(12)
          .fillColor(darkGray)
          .font('Helvetica-Bold')
          .text('🕐  Heure d\'accueil : ', 92, detailY, { continued: true })
          .fillColor(primaryColor)
          .font('Helvetica')
          .text('13h00 à 17h00');

        detailY += 25;

        // Location with icon
        doc
          .fontSize(12)
          .fillColor(darkGray)
          .font('Helvetica-Bold')
          .text('📍  Lieu : ', 92, detailY, { continued: true })
          .fillColor(primaryColor)
          .font('Helvetica')
          .text('Campus du LM6E, Benguérir');

        yPosition += detailsBoxHeight + 40;

        // Enhanced Information box with modern design
        const infoBoxY = yPosition;
        const infoBoxHeight = 120;
        
        // Create gradient background
        doc
          .rect(72, infoBoxY, doc.page.width - 144, infoBoxHeight)
          .fillColor('#FEF3C7')
          .fill()
          .rect(72, infoBoxY, doc.page.width - 144, infoBoxHeight)
          .strokeColor('#F59E0B')
          .lineWidth(2)
          .stroke();

        // Add accent border
        doc
          .rect(72, infoBoxY, doc.page.width - 144, 6)
          .fillColor('#F59E0B')
          .fill();

        // Title with icon
        doc
          .fontSize(13)
          .fillColor('#92400E')
          .font('Helvetica-Bold')
          .text('ℹ️ INFORMATIONS IMPORTANTES', 92, infoBoxY + 20);

        // Information items with better spacing
        doc
          .fontSize(11)
          .fillColor('#78350F')
          .font('Helvetica')
          .text(`• Numéro de candidature : FMA-2025-${applicationId}`, 92, infoBoxY + 45)
          .text('• Statut : ACCEPTÉ ✅', 92, infoBoxY + 62)
          .text(`• Date de convocation : ${currentDate}`, 92, infoBoxY + 79)
          .text('• Veuillez conserver cette convocation comme justificatif officiel', 92, infoBoxY + 96);

        yPosition += infoBoxHeight + 50;

        // Continuation text
        doc
          .fontSize(12)
          .fillColor('black')
          .text(
            'Nous vous prions de vous munir de cette convocation le jour de l\'événement.',
            72,
            yPosition,
            { width: doc.page.width - 144, align: 'justify' }
          );

        yPosition += 60;

        doc
          .fontSize(12)
          .fillColor('black')
          .text(
            'En vous remerciant de votre engagement, nous vous prions d\'agréer l\'expression de nos salutations distinguées.',
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
            'L\'Organisation de la Feynman Moroccan Adventure',
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

        // Enhanced footer with modern design
        const footerY = doc.page.height - 80;
        
        // Footer background
        doc
          .rect(0, footerY - 20, doc.page.width, 100)
          .fillColor('#F8FAFC')
          .fill();

        // Footer decorative line
        doc
          .strokeColor(primaryColor)
          .lineWidth(2)
          .moveTo(72, footerY - 10)
          .lineTo(doc.page.width - 72, footerY - 10)
          .stroke();

        doc
          .fontSize(10)
          .fillColor(grayColor)
          .font('Helvetica-Bold')
          .text(
            `Feynman Moroccan Adventure - Document officiel généré le ${currentDate}`,
            72,
            footerY + 10,
            { align: 'center', width: doc.page.width - 144 }
          );

        // Add small decorative elements
        doc
          .fontSize(8)
          .fillColor(accentColor)
          .text('🔬 ⚛️ 🧪', 72, footerY + 25, {
            align: 'center',
            width: doc.page.width - 144,
          });

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
