import { handleLogin, handleNonce, handleValidateToken } from '@gaiaprotocol/worker-common';
import { intro } from "./pages/intro";
import { myGods } from './pages/my-gods';

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/nonce' && request.method === 'POST') return handleNonce(request, env);
    if (url.pathname === '/api/login' && request.method === 'POST') return handleLogin(request, 1, env);
    if (url.pathname === '/api/validate-token' && request.method === 'GET') return handleValidateToken(request, env);

    if (url.pathname === '/') {
      return new Response(intro(), { headers: { 'Content-Type': 'text/html' } });
    } else if (url.pathname === '/my-gods') {
      return new Response(myGods(), { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
