export interface License {
  license_id: number;
  license_name: string;
  description?: string;
  price: number;
  status: 'active' | 'inactive';
  features: string[];
  max_users?: number;
  duration_months: number;
  created_at: string;
  updated_at: string;
}

export interface LicenseAssignment {
  assignment_id: number;
  license_id: number;
  person_id: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'expired' | 'cancelled';
  created_at: string;
}