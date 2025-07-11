# Convocation Module

This module handles the generation and download of personalized convocations for accepted candidates.

## Features

- **LaTeX-based PDF Generation**: Uses LaTeX to create professional-looking convocation documents
- **Personalization**: Each convocation includes the candidate's name and application number
- **Access Control**: Only authenticated users with ACCEPTED status can download their convocation
- **French Language Support**: Documents are generated in French with proper typography

## API Endpoints

### GET `/mtym-api/convocation/download`

Downloads the personalized convocation PDF for the authenticated user.

**Authentication**: Required (USER role)
**Authorization**: Only users with ACCEPTED application status can download

**Response**: 
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="convocation_{userId}.pdf"`

**Error Cases**:
- 401: User not authenticated
- 404: User not eligible for convocation (not accepted or no application)

## Technical Implementation

### LaTeX Template

The convocation uses a LaTeX template with the following features:
- Professional FMA branding with colors and logos
- Personalized content with candidate name and application ID
- French typography and formatting
- Modern design with decorative elements

### PDF Generation Process

1. **User Validation**: Check if user exists and has ACCEPTED status
2. **LaTeX Generation**: Create LaTeX content with user data
3. **PDF Compilation**: Use `pdflatex` to compile LaTeX to PDF
4. **Cleanup**: Remove temporary files after generation
5. **Response**: Stream PDF as download

### Dependencies

The module requires the following LaTeX packages to be installed on the server:
- `texlive-latex-base`
- `texlive-latex-extra` 
- `texlive-fonts-recommended`
- `texlive-fonts-extra`
- `texlive-lang-french`
- `texlive-xetex`

These are automatically installed in the Docker container.

## Usage in Frontend

The frontend provides a download button for accepted candidates in their profile page:

```typescript
// Call the API to download convocation
const response = await downloadConvocation();

// Create downloadable link
const url = window.URL.createObjectURL(response.data);
const a = document.createElement('a');
a.href = url;
a.download = `convocation_${firstName}_${lastName}.pdf`;
a.click();
```

## File Structure

```
convocation/
├── README.md                          # This documentation
├── convocation.module.ts              # Module definition
├── controllers/
│   └── convocation.controller.ts      # API endpoints
├── services/
│   └── convocation.service.ts         # Business logic and PDF generation
└── templates/                         # Future: LaTeX template files
```

## Security Considerations

- Authentication is required for all endpoints
- Only users with ACCEPTED status can download convocations
- Temporary files are automatically cleaned up after PDF generation
- File paths are validated to prevent directory traversal attacks

## Error Handling

The module provides comprehensive error handling:
- LaTeX compilation errors are caught and reported
- Temporary file cleanup is performed even on errors
- User eligibility is validated before PDF generation
- Proper HTTP status codes are returned for all scenarios
