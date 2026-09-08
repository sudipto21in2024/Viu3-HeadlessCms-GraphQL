const query = `
  mutation TestVIPBooking($input: VIPViewingInput!) {
    requestPrivateViewing(input: $input) {
      id
      status
      message
      client_name
      preferred_salon
      preferred_date
    }
  }
`;

const variables = {
  input: {
    client_name: 'Lady Vivienne Westwood',
    client_email: 'vivienne@couture.com',
    preferred_salon: 'Paris Vendôme',
    preferred_date: '2026-09-18',
    interest_category: 'Haute Couture Outerwear',
    special_requests: 'Private fitting for Look N°01 and Look N°02'
  }
};

fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables })
})
  .then(res => res.json())
  .then(data => {
    console.log('GraphQL VIP Mutation Response:', JSON.stringify(data, null, 2));
  })
  .catch(err => console.error('Error:', err));
