export const REQUEST_PRIVATE_VIEWING = `
  mutation RequestPrivateViewing($input: VIPViewingInput!) {
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

export const TOGGLE_LOOK_WISHLIST = `
  mutation ToggleLookWishlist($lookId: ID!, $sessionId: String!) {
    toggleLookWishlist(lookId: $lookId, sessionId: $sessionId) {
      look_id
      is_saved
      total_likes
    }
  }
`;

export const SUBSCRIBE_EDITORIAL = `
  mutation SubscribeEditorial($email: String!) {
    subscribeEditorial(email: $email)
  }
`;
