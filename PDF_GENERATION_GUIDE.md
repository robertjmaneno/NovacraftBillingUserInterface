# Invoice Template PDF Generation Guide

## Backend Implementation Required

Your backend needs to implement a new endpoint: `GET /api/invoice-template/preview-pdf`

This endpoint should:

1. **Fetch Current Template Settings**
   ```csharp
   var template = await _invoiceTemplateService.GetInvoiceTemplateAsync();
   ```

2. **Generate PDF with Template Styling**
   - Use the same layout as the HTML preview
   - Apply all design settings (colors, fonts, logo positioning)
   - Include company info, layout settings, and design preferences

3. **For Invoice PDFs** (`GET /api/invoice/{id}/pdf`):
   - Always fetch the current invoice template settings
   - Apply template styling to invoice data
   - Ensure logo positioning matches template (centered)

## Key Template Properties to Use:

### Design Settings:
- `primaryColor`, `secondaryColor`, `accentColor`
- `fontFamily`, `fontSize` (heading, subheading, body, small)
- `logoUrl`, `logoSize`
- `borderStyle`, `borderColor`, `borderRadius`

### Layout Settings:
- `headerHeight`, `footerHeight`
- `marginTop`, `marginBottom`, `marginLeft`, `marginRight`
- `showWatermark`, `watermarkText`, `watermarkOpacity`

### Company Info:
- All company details for the header

## PDF Generation Libraries:
- **Puppeteer** (Node.js) - Convert HTML to PDF
- **iTextSharp/PDFSharp** (.NET) - Programmatic PDF generation
- **wkhtmltopdf** - HTML to PDF conversion

## Implementation Steps:

1. Create HTML template with dynamic styling
2. Apply CSS variables based on template settings
3. Use Puppeteer/iText to convert to PDF
4. Ensure logo is centered in header layout
5. Apply watermark if enabled

The PDF should look identical to your HTML preview!</content>
<parameter name="filePath">c:\Users\rober\Documents\personal_projects\NovacraftBillingUserInterface\PDF_GENERATION_GUIDE.md