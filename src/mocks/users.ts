import { User } from '../services/userService';

export const mockUsers: User[] = [
  {
    id: 6,
    username: "Wanderley Pinheiro",
    profile_id: 1,
    person: {
      person_id: 2,
      full_name: "Wanderley Macedo",
      fantasy_name: "Wanderley Macedo Pinheiro Junior",
      created_at: "2024-09-10T20:55:05.073803",
      contacts: [
        {
          contact_id: 4,
          contact_type: "E-Mail",
          contact_value: "wanderley@agilegestao.com",
          contact_name: null
        },
        {
          contact_id: 24,
          contact_type: "Whatsapp",
          contact_value: "5569999768281",
          contact_name: "Wanderley Pinheiro"
        }
      ],
      documents: [
        {
          person_document_id: 4,
          document_type: "Cpf",
          document_value: "41915003253"
        }
      ],
      licenses: [
        {
          license_id: 1,
          license_name: "AGILE",
          start_date: "2024-09-10",
          end_date: null,
          status: "Ativa"
        }
      ]
    }
  },
  {
    id: 9,
    username: "Tamara",
    profile_id: 1,
    person: {
      person_id: 3,
      full_name: "Tamara Valadares Borges De Oliveira Pinheiro",
      fantasy_name: null,
      created_at: "2024-09-10T20:55:05.073803",
      contacts: [
        {
          contact_id: 204,
          contact_type: "E-Mail",
          contact_value: "tamara@agilegestao.com",
          contact_name: "Tamara"
        }
      ],
      documents: [
        {
          person_document_id: 5,
          document_type: "Cpf",
          document_value: "69893772249"
        }
      ],
      licenses: []
    }
  }
];