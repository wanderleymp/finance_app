export type ContractStatus = 'ATIVO' | 'CANCELADO' | 'SUSPENSO' | 'EXPIRADO';
export type RecurrencePeriod = 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';

export interface ContractAdjustment {
  adjustment_id: number;
  contract_id: number;
  adjustment_type: 'REAJUSTE' | 'DESCONTO' | 'ACRESCIMO';
  previous_value: number;
  new_value: number;
  adjustment_date: string;
  reason: string;
  user_id: number;
  created_at: string;
}

export interface ExtraService {
  service_id: number;
  contract_id: number;
  description: string;
  value: number;
  service_date: string;
  status: 'PENDENTE' | 'FATURADO' | 'CANCELADO';
  created_at: string;
}

export interface Contract {
  contract_id: number;
  contract_name: string;
  contract_value: number;
  start_date: string;
  end_date: string;
  status: ContractStatus;
  next_billing_date: string;
  due_day: number;
  recurrence_period: RecurrencePeriod;
  contract_group_id: number;
  person_id: number;
  created_at: string;
  updated_at: string;
  adjustments: ContractAdjustment[];
  extra_services: ExtraService[];
  billing_logs: {
    log_id: number;
    contract_id: number;
    movement_id: number;
    billing_date: string;
    amount: number;
    status: 'SUCESSO' | 'ERRO' | 'PENDENTE';
    error_message?: string;
    created_at: string;
  }[];
}