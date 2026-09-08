import { ref } from 'vue';

const GRAPHQL_ENDPOINT = '/graphql';

// In-memory cache for fast repeated navigation
const cache = new Map();

export async function executeGraphQL(query, variables = {}, { bypassCache = false } = {}) {
  const cacheKey = JSON.stringify({ query, variables });

  if (!bypassCache && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error(`Network response error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors.map(e => e.message).join(', '));
  }

  if (!bypassCache) {
    cache.set(cacheKey, result.data);
  }

  return result.data;
}

export function useQuery(query, variables = {}, options = {}) {
  const data = ref(null);
  const loading = ref(true);
  const error = ref(null);

  const fetchQuery = async (vars = variables) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await executeGraphQL(query, vars, options);
      data.value = res;
    } catch (err) {
      console.error('GraphQL Query Error:', err);
      error.value = err.message || 'An error occurred while fetching editorial content.';
    } finally {
      loading.value = false;
    }
  };

  fetchQuery();

  return {
    data,
    loading,
    error,
    refetch: (vars) => fetchQuery(vars)
  };
}

export function useMutation(mutation) {
  const loading = ref(false);
  const error = ref(null);

  const mutate = async (variables = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await executeGraphQL(mutation, variables, { bypassCache: true });
      return res;
    } catch (err) {
      console.error('GraphQL Mutation Error:', err);
      error.value = err.message || 'An error occurred during submission.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    mutate,
    loading,
    error
  };
}
