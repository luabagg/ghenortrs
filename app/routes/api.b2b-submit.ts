import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';

import handler from '~/server/b2b-submit';

export async function loader({ request }: LoaderFunctionArgs) {
  return handler(request);
}

export async function action({ request }: ActionFunctionArgs) {
  return handler(request);
}
