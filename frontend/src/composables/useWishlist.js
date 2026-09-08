import { ref } from 'vue';
import { useMutation } from './useGraphQL.js';
import { TOGGLE_LOOK_WISHLIST } from '../graphql/mutations.js';

const SESSION_KEY = 'maison_aura_client_session';
const savedIds = ref(new Set());

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'client_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useWishlist() {
  const { mutate, loading } = useMutation(TOGGLE_LOOK_WISHLIST);

  const isSaved = (lookId) => savedIds.value.has(lookId);

  const toggleWishlist = async (lookId, currentLikes = 0) => {
    const sessionId = getSessionId();
    
    // Optimistic toggle
    const currentlySaved = savedIds.value.has(lookId);
    if (currentlySaved) {
      savedIds.value.delete(lookId);
    } else {
      savedIds.value.add(lookId);
    }

    try {
      const res = await mutate({ lookId, sessionId });
      const result = res.toggleLookWishlist;
      if (result.is_saved) {
        savedIds.value.add(lookId);
      } else {
        savedIds.value.delete(lookId);
      }
      return result;
    } catch (err) {
      // Revert optimistic update on failure
      if (currentlySaved) {
        savedIds.value.add(lookId);
      } else {
        savedIds.value.delete(lookId);
      }
      throw err;
    }
  };

  return {
    savedIds,
    isSaved,
    toggleWishlist,
    loading
  };
}
