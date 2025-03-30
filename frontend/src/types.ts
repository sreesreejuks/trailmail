export interface EmailTemplate {
  id: string;
  name: string;
  content: string;
}

export interface EmailFormData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  companyName: string;
  hiringPosition: string;
  hiringManager: string;
  jobSource: string;
  template: string;
  greeting: string;
  attachments: File[];
}