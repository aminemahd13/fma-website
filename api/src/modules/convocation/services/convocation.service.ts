import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

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

    // Create LaTeX content
    const latexContent = this.generateLatexContent(user);
    
    // Generate PDF from LaTeX
    const pdfBuffer = await this.compileToPdf(latexContent, user.id);
    
    return pdfBuffer;
  }

  private generateLatexContent(user: any): string {
    const { firstName, lastName, application } = user;
    const applicationId = application.id;
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
\\documentclass[a4paper,12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[french]{babel}
\\usepackage{geometry}
\\usepackage{graphicx}
\\usepackage{xcolor}
\\usepackage{fontspec}
\\usepackage{fancyhdr}
\\usepackage{tikz}

\\geometry{margin=2cm}

% Define colors
\\definecolor{fmaBlue}{RGB}{0, 102, 204}
\\definecolor{fmaGray}{RGB}{128, 128, 128}

% Page style
\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\begin{document}

% Header with logo and title
\\begin{center}
{\\Huge\\color{fmaBlue}\\textbf{CONVOCATION OFFICIELLE}}\\\\[0.5cm]
{\\Large\\textbf{Formation Marocaine d'Astronomie}}\\\\[0.2cm]
{\\large\\color{fmaGray}Moroccan Training for Astronomy}\\\\[1cm]
\\end{center}

% Decorative line
\\begin{center}
\\tikz\\draw[fmaBlue, line width=2pt] (0,0) -- (\\textwidth-2cm,0);
\\end{center}

\\vspace{1cm}

% Main content
\\begin{center}
{\\Large Nous avons l'honneur de vous informer que votre candidature a été}\\\\[0.3cm]
{\\LARGE\\color{fmaBlue}\\textbf{ACCEPTÉE}}\\\\[1cm]
\\end{center}

% Personal information box
\\begin{center}
\\fbox{\\begin{minipage}{0.8\\textwidth}
\\centering
\\vspace{0.5cm}
{\\Large\\textbf{${firstName} ${lastName}}}\\\\[0.3cm]
{\\large Numéro de candidature: \\textbf{\\#${applicationId}}}\\\\[0.5cm]
\\end{minipage}}
\\end{center}

\\vspace{1.5cm}

% Event details
\\section*{\\color{fmaBlue}Détails de la Formation}

\\begin{itemize}
\\item[\\textbullet] \\textbf{Programme:} Formation Marocaine d'Astronomie 2025
\\item[\\textbullet] \\textbf{Dates:} À confirmer prochainement
\\item[\\textbullet] \\textbf{Lieu:} À confirmer prochainement
\\item[\\textbullet] \\textbf{Statut:} Candidat(e) sélectionné(e)
\\end{itemize}

\\vspace{1cm}

\\section*{\\color{fmaBlue}Prochaines Étapes}

Félicitations pour votre sélection! Vous recevrez prochainement des informations détaillées concernant:

\\begin{itemize}
\\item Les modalités d'inscription définitive
\\item Le programme détaillé de la formation
\\item Les informations logistiques
\\item La liste du matériel requis
\\end{itemize}

\\vspace{1.5cm}

% Footer
\\begin{center}
\\small
Document généré le ${currentDate}\\\\[0.2cm]
\\color{fmaGray}Formation Marocaine d'Astronomie - www.fma.ma
\\end{center}

% Decorative footer line
\\vspace{0.5cm}
\\begin{center}
\\tikz\\draw[fmaBlue, line width=1pt] (0,0) -- (\\textwidth-2cm,0);
\\end{center}

\\end{document}
`;
  }

  private async compileToPdf(latexContent: string, userId: number): Promise<Buffer> {
    const tempDir = path.join(__dirname, '../../../../temp');
    const fileName = `convocation_${userId}_${Date.now()}`;
    const texFile = path.join(tempDir, `${fileName}.tex`);
    const pdfFile = path.join(tempDir, `${fileName}.pdf`);

    try {
      // Ensure temp directory exists
      await fs.mkdir(tempDir, { recursive: true });

      // Write LaTeX content to file
      await fs.writeFile(texFile, latexContent, 'utf8');

      // Compile LaTeX to PDF using pdflatex
      const command = `cd "${tempDir}" && pdflatex -interaction=nonstopmode "${fileName}.tex"`;
      
      try {
        await execAsync(command);
      } catch (error) {
        // pdflatex might exit with non-zero even on success, check if PDF was created
        const pdfExists = await fs.access(pdfFile).then(() => true).catch(() => false);
        if (!pdfExists) {
          throw new Error(`LaTeX compilation failed: ${error}`);
        }
      }

      // Read the generated PDF
      const pdfBuffer = await fs.readFile(pdfFile);

      // Clean up temporary files
      await this.cleanupTempFiles(tempDir, fileName);

      return pdfBuffer;
    } catch (error) {
      // Clean up on error
      await this.cleanupTempFiles(tempDir, fileName);
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }

  private async cleanupTempFiles(tempDir: string, fileName: string): Promise<void> {
    const extensions = ['.tex', '.pdf', '.aux', '.log', '.out'];
    
    for (const ext of extensions) {
      try {
        await fs.unlink(path.join(tempDir, `${fileName}${ext}`));
      } catch (error) {
        // Ignore errors during cleanup
      }
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
