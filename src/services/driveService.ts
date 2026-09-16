export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  modifiedTime?: string;
}

export interface DriveApiResponse {
  success: boolean;
  configured: boolean;
  folderId?: string;
  totalFiles?: number;
  files?: DriveFileItem[];
  message?: string;
  help?: string;
  error?: string;
}

/**
 * Extracts a Google Drive folder ID from a raw ID or full Google Drive URL.
 */
export function extractFolderId(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const trimmed = input.trim();

  // Pattern for Google Drive folder URLs
  const urlMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }

  // Raw alphanumeric folder ID (standard Drive ID length is usually 15-50 chars)
  if (/^[a-zA-Z0-9_-]{15,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Calls the serverless /api/drive endpoint to retrieve the list of files in a folder.
 */
export async function fetchFolderFiles(
  folderIdOrUrl: string,
  fetchFn: typeof fetch = fetch
): Promise<DriveApiResponse> {
  const folderId = extractFolderId(folderIdOrUrl);
  if (!folderId) {
    return {
      success: false,
      configured: false,
      error: 'ID ou URL da pasta do Google Drive inválido.',
    };
  }

  try {
    const url = '/api/drive?folderId=' + encodeURIComponent(folderId);
    const res = await fetchFn(url);
    if (!res.ok) {
      return {
        success: false,
        configured: false,
        folderId,
        error: 'Falha ao consultar API do Drive: status ' + res.status,
      };
    }
    const data: DriveApiResponse = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      configured: false,
      folderId,
      error: err instanceof Error ? err.message : 'Erro inesperado na chamada da API do Drive.',
    };
  }
}
