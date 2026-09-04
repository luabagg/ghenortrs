import type { LoaderFunctionArgs } from '@remix-run/node';

import handler from '~/server/b2b-product-image';

export async function loader({ params, request }: LoaderFunctionArgs) {
  return handler(request, params.id);
}
