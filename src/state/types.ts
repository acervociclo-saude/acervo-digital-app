export type ScreenId = 
  | 'tela-1'
  | 'tela-2'
  | 'tela-3'
  | 'tela-4'
  | 'tela-5'
  | 'tela-6'
  | 'tela-7'
  | 'tela-8'
  | 'tela-9';

export type InteractionStatus = 
  | 'idle'
  | 'selecting'
  | 'validating'
  | 'resolving'
  | 'ready'
  | 'error';

export interface RouteEntry {
  estado: string;
  themes: string[];
  routeCode: string;
  destinationSheet: string;
}

export interface CollectionItem {
  numero: string;
  tema: string;
  linkDrive: string;
}

export interface AppState {
  screen: ScreenId;
  selectedState: string | null;
  selectedThemes: string[];
  routeCode: string | null;
  destinationSheet: string | null;
  selectedCollectionTopic: CollectionItem | null;
  destinationDriveUrl: string | null;
  interactionStatus: InteractionStatus;
  errorMessage: string | null;
}

export const APPROVED_MESSAGES = {
  COUNT_LIMIT: 'Selecione entre 1 e 3 opções',
  NO_ROUTE: 'A combinação selecionada não possui rota disponível.',
} as const;