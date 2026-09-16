/// <reference types="node" />

import crypto from 'node:crypto';

export interface DriveApiFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  modifiedTime?: string;
}

export function extractFolderId(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return match[1];
  if (/^[a-zA-Z0-9_-]{15,}$/.test(trimmed)) return trimmed;
  return null;
}

export async function getGoogleOAuthToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claim = Buffer.from(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  ).toString('base64url');

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(header + '.' + claim);
  const signature = sign.sign(privateKey, 'base64url');
  const assertion = header + '.' + claim + '.' + signature;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    throw new Error('Falha ao autenticar Service Account no Google Cloud: ' + errorText);
  }

  const tokenData = (await tokenRes.json()) as { access_token: string };
  return tokenData.access_token;
}

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const rawTarget = url.searchParams.get('folderId') || url.searchParams.get('url') || '';
  const folderId = extractFolderId(rawTarget);

  if (!folderId) {
    return new Response(
      JSON.stringify({
        success: false,
        configured: false,
        error: 'Parâmetro folderId ou url ausente ou inválido.',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return new Response(
      JSON.stringify({
        success: false,
        configured: false,
        folderId,
        message: 'Google Cloud Service Account não configurada nas variáveis de ambiente da Vercel.',
        help: 'Para ativar a integração direta, defina GOOGLE_SERVICE_ACCOUNT_EMAIL e GOOGLE_PRIVATE_KEY no painel da Vercel (Settings > Environment Variables).',
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

  try {
    privateKey = privateKey.replace(/\\n/g, '\n');
    const accessToken = await getGoogleOAuthToken(clientEmail, privateKey);

    const query = "'" + folderId + "' in parents and trashed = false";
    const fields = 'files(id, name, mimeType, size, iconLink, thumbnailLink, webViewLink, webContentLink, createdTime, modifiedTime)';
    const driveEndpoint = 'https://www.googleapis.com/drive/v3/files?q=' + encodeURIComponent(query) + '&fields=' + encodeURIComponent(fields) + '&orderBy=name';

    const driveRes = await fetch(driveEndpoint, {
      headers: { Authorization: 'Bearer ' + accessToken },
    });

    if (!driveRes.ok) {
      const errBody = await driveRes.text();
      return new Response(
        JSON.stringify({
          success: false,
          configured: true,
          folderId,
          error: 'Erro ao consultar pasta no Google Drive: ' + errBody,
        }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const driveData = (await driveRes.json()) as { files?: DriveApiFile[] };
    const files = driveData.files || [];

    return new Response(
      JSON.stringify({
        success: true,
        configured: true,
        folderId,
        totalFiles: files.length,
        files,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        configured: true,
        folderId,
        error: err instanceof Error ? err.message : 'Erro interno ao processar requisição.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
