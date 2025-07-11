import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import * as puppeteer from 'puppeteer';

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

    // Create HTML content
    const htmlContent = this.generateHtmlContent(user);
    
    // Generate PDF from HTML using Puppeteer
    const pdfBuffer = await this.compileToPdf(htmlContent);
    
    return pdfBuffer;
  }

  private generateHtmlContent(user: any): string {
    const { firstName, lastName, application } = user;
    const applicationId = application.id;
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Convocation FMA</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            margin: 0;
            padding: 0;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3cm;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 1cm;
        }
        
        .title {
            font-size: 24pt;
            font-weight: bold;
            color: #0066cc;
            margin: 0.5cm 0;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .subtitle {
            font-size: 16pt;
            color: #666;
            margin: 0;
        }
        
        .content {
            margin: 2cm 0;
            text-align: justify;
        }
        
        .greeting {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 1cm;
        }
        
        .body-text {
            font-size: 12pt;
            margin-bottom: 1cm;
            text-indent: 1cm;
        }
        
        .highlight {
            font-weight: bold;
            color: #0066cc;
        }
        
        .info-box {
            background-color: #f8f9fa;
            border: 1px solid #0066cc;
            border-radius: 8px;
            padding: 1cm;
            margin: 1cm 0;
        }
        
        .signature {
            margin-top: 3cm;
            text-align: right;
        }
        
        .signature-title {
            font-weight: bold;
            margin-bottom: 0.5cm;
        }
        
        .signature-name {
            margin-top: 2cm;
            border-top: 1px solid #000;
            width: 200px;
            margin-left: auto;
            padding-top: 0.5cm;
            text-align: center;
        }
        
        .footer {
            position: fixed;
            bottom: 1cm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10pt;
            color: #666;
            border-top: 1px solid #0066cc;
            padding-top: 0.5cm;
        }
        
        .date {
            text-align: right;
            margin-bottom: 2cm;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Convocation Officielle</div>
        <div class="subtitle">Formation Marocaine d'Astronomie</div>
    </div>
    
    <div class="date">
        Rabat, le ${currentDate}
    </div>
    
    <div class="content">
        <div class="greeting">
            Madame/Monsieur <span class="highlight">${firstName} ${lastName}</span>,
        </div>
        
        <div class="body-text">
            Nous avons l'honneur de vous informer que votre candidature à la <span class="highlight">Formation Marocaine d'Astronomie</span> a été retenue.
        </div>
        
        <div class="body-text">
            Par la présente, nous vous convoquons officiellement à participer à cette formation exceptionnelle qui se déroulera prochainement. Votre engagement et votre passion pour l'astronomie seront des atouts précieux pour le succès de cette formation.
        </div>
        
        <div class="info-box">
            <strong>Informations importantes :</strong><br><br>
            • <strong>Numéro de candidature :</strong> FMA-2025-${applicationId}<br>
            • <strong>Statut :</strong> ACCEPTÉ<br>
            • <strong>Date de convocation :</strong> ${currentDate}<br>
            • Veuillez conserver cette convocation comme justificatif officiel
        </div>
        
        <div class="body-text">
            Nous vous prions de bien vouloir confirmer votre présence dans les plus brefs délais et de vous munir de cette convocation le jour de l'événement.
        </div>
        
        <div class="body-text">
            En vous remerciant de votre engagement, nous vous prions d'agréer, Madame/Monsieur, l'expression de nos salutations distinguées.
        </div>
    </div>
    
    <div class="signature">
        <div class="signature-title">
            L'Organisation de la Formation Marocaine d'Astronomie
        </div>
        <div class="signature-name">
            Direction Pédagogique
        </div>
    </div>
    
    <div class="footer">
        Formation Marocaine d'Astronomie - Document officiel généré le ${currentDate}
    </div>
</body>
</html>
`;
  }

  private async compileToPdf(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      // Set the HTML content
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF with proper options
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '2cm',
          right: '2cm',
          bottom: '2cm',
          left: '2cm'
        },
        printBackground: true,
        preferCSSPageSize: true
      });

      await browser.close();
      return Buffer.from(pdfBuffer);
    } catch (error) {
      await browser.close();
      throw new Error(`PDF generation failed: ${error.message}`);
    }
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
