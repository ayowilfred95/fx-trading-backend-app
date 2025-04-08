export interface CreateEmailDto {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}