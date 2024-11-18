export interface Contact {
  contact_id: number;
  contact_type: string;
  contact_value: string;
  contact_name: string | null;
}

export interface Document {
  person_document_id: number;
  document_type: string;
  document_value: string;
}

export interface PixKey {
  pix_key_id: number;
  pix_key_type: string;
  pix_key_value: string;
  is_preferred: boolean;
  created_at: string;
}

export interface TaxRegime {
  tax_regime_id: number;
  tax_regime_description: string;
  start_date: string;
}

export interface License {
  license_id: number;
  license_name: string;
  start_date: string;
  end_date: string | null;
  status: string;
  timezone: string | null;
}

export interface QSA {
  juridical_person_id: number;
  juridical_person_name: string;
  physical_person_id: number;
  physical_person_name: string;
  participation: number;
  administrator: boolean;
}

export interface CNAE {
  cnae_id: number;
  cnae_code: string;
  cnae_description: string;
  is_primary: boolean;
}

export interface Person {
  person_id: number;
  full_name: string;
  birth_date: string | null;
  created_at: string;
  fantasy_name: string | null;
  social_capital: number | null;
  person_type_description: string;
  contacts: Contact[];
  documents: Document[];
  pix_keys: PixKey[];
  tax_regimes: TaxRegime[];
  licenses: License[];
  qsa: QSA[];
  cnae: CNAE[];
}