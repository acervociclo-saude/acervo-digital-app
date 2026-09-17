/// <reference types="node" />

export default async function handler(_req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const gcpConfigured = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
  );

  return res.status(200).json({
    status: 'ok',
    service: 'acervo-digital-serverless-api',
    gcpConfigured,
    timestamp: new Date().toISOString(),
  });
}
