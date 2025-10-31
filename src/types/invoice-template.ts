export interface FontSizeSettings {
  heading: string;
  subheading: string;
  body: string;
  small: string;
}

export interface DesignSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: FontSizeSettings;
  logoUrl?: string;
  logoPosition?: 'left' | 'center' | 'right'; // Optional - logo is now always centered
  logoSize: 'small' | 'medium' | 'large';
  backgroundImage?: string;
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'none';
  borderColor: string;
  borderRadius: string;
}

export interface CompanyInfoDto {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  registrationNumber: string;
}

export interface LayoutSettings {
  headerHeight: string;
  footerHeight: string;
  marginTop: string;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;
  showWatermark: boolean;
  watermarkText: string;
  watermarkOpacity: number;
}

export interface ContentSettings {
  showInvoiceNumber: boolean;
  invoiceNumberPrefix: string;
  showDate: boolean;
  showDueDate: boolean;
  showPurchaseOrder: boolean;
  showPaymentTerms: boolean;
  defaultPaymentTerms: string;
  showNotes: boolean;
  defaultNotes: string;
  showSignature: boolean;
  signatureImageUrl?: string;
}

export interface TableSettings {
  showItemNumber: boolean;
  showDescription: boolean;
  showQuantity: boolean;
  showRate: boolean;
  showAmount: boolean;
  showDiscount: boolean;
  showTax: boolean;
  alternateRowColors: boolean;
  headerBackgroundColor: string;
  headerTextColor: string;
  rowBackgroundColor: string;
  alternateRowBackgroundColor: string;
}

export interface LocalizationSettings {
  currency: string;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
  dateFormat: string;
  language: string;
  timezone: string;
}

export interface TaxSettings {
  defaultTaxRate: number;
  taxLabel: string;
  showTaxNumber: boolean;
  taxCalculation: 'inclusive' | 'exclusive';
  multiTaxSupport: boolean;
}

export interface BankDetails {
  showBankDetails: boolean;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
}

export interface FooterSettings {
  showFooter: boolean;
  footerText: string;
  termsAndConditions: string;
  bankDetails: BankDetails;
}

export interface EmailSettings {
  subjectTemplate: string;
  bodyTemplate: string;
  attachPdf: boolean;
  sendCopyToSender: boolean;
}

export interface InvoiceTemplateDto {
  id?: string;
  name: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  design: DesignSettings;
  companyInfo: CompanyInfoDto;
  layout: LayoutSettings;
  content: ContentSettings;
  table: TableSettings;
  localization: LocalizationSettings;
  tax: TaxSettings;
  footer: FooterSettings;
  email: EmailSettings;
}

export interface InvoiceTemplateResponse {
  success: boolean;
  data?: InvoiceTemplateDto;
  message?: string;
}

export interface LogoUploadResponse {
  success: boolean;
  data?: {
    url: string;
    filename: string;
  };
  message?: string;
}

// Mock invoice data interface for preview
export interface MockInvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  client: {
    name: string;
    address: string;
    city: string;
    email: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
}