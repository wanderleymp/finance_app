export const mockAuthResponse = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  userDetails: {
    user_id: 6,
    username: "Wanderley Pinheiro",
    person: {
      person_id: 2,
      full_name: "Wanderley Macedo",
      fantasy_name: "Wanderley Macedo Pinheiro Junior",
      contacts: [
        {
          contact_name: null,
          contact_value: "wanderley@agilegestao.com",
          contact_type: "E-Mail"
        }
      ]
    },
    permissions: {
      profile_id: 1,
      permissions: [
        {
          can_access: true,
          feature_name: "view_dashboard",
          permission_id: 1
        }
      ]
    },
    licenses: {
      licenses: [
        {
          status: "Ativa",
          license_id: 1,
          start_date: "2024-09-10",
          license_name: "AGILE"
        }
      ]
    }
  }
};