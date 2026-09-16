/// <reference types="node" />

export default async function handler(): Promise<Response> {
  const gcpConfigured = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
  );

  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'acervo-digital-serverless-api',
      gcpConfigured,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
