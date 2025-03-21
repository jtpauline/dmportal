import { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  // Basic worker handler to prevent 404
  return new Response(null, { 
    status: 200,
    headers: {
      'Content-Type': 'application/javascript'
    }
  });
}
