export type MovementType = 'ENTRADA' | 'SAIDA';
export type MovementStatus = 'PENDENTE' | 'PROCESSANDO' | 'CONCLUIDO' | 'CANCELADO';

export interface MovementItem {
  item_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface MovementPayment {
  payment_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
}

export interface MovementInstallment {
  installment_id: number;
  due_date: string;
  amount: number;
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO' | 'CANCELADO';
  payment_date?: string;
}

export interface MovementInvoice {
  invoice_id: number;
  invoice_number: string;
  issue_date: string;
  status: 'PENDENTE' | 'EMITIDA' | 'CANCELADA';
  pdf_url?: string;
}

export interface MovementBankSlip {
  bank_slip_id: number;
  barcode: string;
  due_date: string;
  amount: number;
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO' | 'CANCELADO';
  pdf_url?: string;
}

export interface Movement {
  movement_id: number;
  type: MovementType;
  date: string;
  total_amount: number;
  interest: number;
  discount: number;
  net_amount: number;
  status: MovementStatus;
  person_id: number;
  description?: string;
  items: MovementItem[];
  payments: MovementPayment[];
  installments: MovementInstallment[];
  invoice?: MovementInvoice;
  bank_slip?: MovementBankSlip;
  created_at: string;
  updated_at: string;
}