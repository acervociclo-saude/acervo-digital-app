import { describe, it, expect, vi } from 'vitest';
import { extractFolderId, fetchFolderFiles } from './driveService';

describe('driveService - Google Drive Integration Helper', () => {
  describe('extractFolderId', () => {
    it('extracts ID from standard Google Drive folder URL', () => {
      const url = 'https://drive.google.com/drive/folders/1eYOrjAcimwSNRz-AKvghse1P-idFniOj';
      expect(extractFolderId(url)).toBe('1eYOrjAcimwSNRz-AKvghse1P-idFniOj');
    });

    it('extracts ID from multi-account Google Drive folder URL with query params', () => {
      const url = 'https://drive.google.com/drive/u/0/folders/19Q_QbmLIfwQy4IL7kjSOgoeodE55_QHS?usp=sharing';
      expect(extractFolderId(url)).toBe('19Q_QbmLIfwQy4IL7kjSOgoeodE55_QHS');
    });

    it('preserves valid raw alphanumeric folder IDs', () => {
      const rawId = '1IijtLTVaRl_RsPMm8R6vYXqg4XngY-2a';
      expect(extractFolderId(rawId)).toBe('1IijtLTVaRl_RsPMm8R6vYXqg4XngY-2a');
    });

    it('returns null for invalid inputs or non-drive URLs', () => {
      expect(extractFolderId('')).toBeNull();
      expect(extractFolderId('https://example.com/not-drive')).toBeNull();
      expect(extractFolderId('short')).toBeNull();
    });
  });

  describe('fetchFolderFiles', () => {
    it('returns error when folderId is invalid', async () => {
      const res = await fetchFolderFiles('invalid');
      expect(res.success).toBe(false);
      expect(res.configured).toBe(false);
      expect(res.error).toBe('ID ou URL da pasta do Google Drive inválido.');
    });

    it('parses successful API response from /api/drive', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          configured: true,
          folderId: '1eYOrjAcimwSNRz-AKvghse1P-idFniOj',
          totalFiles: 2,
          files: [
            { id: 'f1', name: 'Guia_UBS.pdf', mimeType: 'application/pdf' },
            { id: 'f2', name: 'Apresentacao.pptx', mimeType: 'application/vnd.ms-powerpoint' },
          ],
        }),
      });

      const res = await fetchFolderFiles(
        'https://drive.google.com/drive/folders/1eYOrjAcimwSNRz-AKvghse1P-idFniOj',
        mockFetch as unknown as typeof fetch
      );

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/drive?folderId=1eYOrjAcimwSNRz-AKvghse1P-idFniOj'
      );
      expect(res.success).toBe(true);
      expect(res.configured).toBe(true);
      expect(res.totalFiles).toBe(2);
      expect(res.files?.[0].name).toBe('Guia_UBS.pdf');
    });

    it('handles not configured response gracefully', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: false,
          configured: false,
          folderId: '1eYOrjAcimwSNRz-AKvghse1P-idFniOj',
          message: 'Google Cloud Service Account não configurada nas variáveis de ambiente da Vercel.',
        }),
      });

      const res = await fetchFolderFiles(
        'https://drive.google.com/drive/folders/1eYOrjAcimwSNRz-AKvghse1P-idFniOj',
        mockFetch as unknown as typeof fetch
      );

      expect(res.success).toBe(false);
      expect(res.configured).toBe(false);
      expect(res.message).toContain('Google Cloud Service Account não configurada');
    });

    it('handles network or server errors gracefully', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const res = await fetchFolderFiles(
        'https://drive.google.com/drive/folders/1eYOrjAcimwSNRz-AKvghse1P-idFniOj',
        mockFetch as unknown as typeof fetch
      );

      expect(res.success).toBe(false);
      expect(res.error).toBe('Network error');
    });
  });
});
