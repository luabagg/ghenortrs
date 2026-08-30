import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';

import {
  fetchB2BCatalog,
  fetchB2BSession,
  registerSeller,
  submitB2BQuote,
} from '@/b2b/api';
import { isB2BAuthConfigured } from '@/b2b/config';
import type {
  B2BSessionResponse,
  QuoteSelectionItem,
  SellerTier,
} from '@/b2b/types';

export const b2bKeys = {
  session: ['b2b', 'session'] as const,
  catalog: (query: string, tier: SellerTier) =>
    ['b2b', 'catalog', query, tier] as const,
};

export function useB2BSessionQuery(): UseQueryResult<B2BSessionResponse> {
  return useQuery({
    queryKey: b2bKeys.session,
    queryFn: fetchB2BSession,
    enabled: isB2BAuthConfigured(),
  });
}

export function useB2BCatalogQuery(
  query: string,
  enabled: boolean,
  tier: SellerTier = 'start',
) {
  return useQuery({
    queryKey: b2bKeys.catalog(query, tier),
    queryFn: () => fetchB2BCatalog(query, tier),
    enabled,
  });
}

export function useRegisterSellerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerSeller,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: b2bKeys.session });
    },
  });
}

export function useSubmitB2BQuoteMutation() {
  return useMutation({
    mutationFn: (input: {
      items: QuoteSelectionItem[];
      notes: string;
      tier: SellerTier;
    }) => submitB2BQuote(input),
  });
}
