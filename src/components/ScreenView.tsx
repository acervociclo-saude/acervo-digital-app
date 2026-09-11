import React from 'react';
import type { ScreenId, CollectionItem } from '../state/types';
import { Hotspot } from './Hotspot';

interface ScreenViewProps {
  currentScreen: ScreenId;
  selectedThemes: string[];
  selectedTopic: CollectionItem | null;
  topics: CollectionItem[];
  onOpenStateSelector: () => void;
  onSelectState: (stateCode: string) => void;
  onContinueFromState: () => void;
  onToggleTheme: (theme: string) => void;
  onContinueFromThemes: () => void;
  onSelectTopic: (topic: CollectionItem) => void;
  onOpenDriveLink: () => void;
  onBackToTopics: () => void;
  onContinueToClosing: () => void;
  onRestart: () => void;
}

const THEME_PILLS = [
  // Row 1 (top: ~68.08%, height: 4.2%)
  { name: 'Saúde', top: '68.08%', left: '13.5%', width: '21.5%', height: '4.2%' },
  { name: 'Campanha', top: '68.08%', left: '36.0%', width: '27.0%', height: '4.2%' },
  { name: 'CRAS', top: '68.08%', left: '64.0%', width: '25.7%', height: '4.2%' },
  // Row 2 (top: ~74.08%, height: 4.2%)
  { name: 'Proteção Social', top: '74.08%', left: '11.0%', width: '31.7%', height: '4.2%' },
  { name: 'Cuidado', top: '74.08%', left: '43.4%', width: '25.5%', height: '4.2%' },
  { name: 'SUS', top: '74.08%', left: '69.6%', width: '19.5%', height: '4.2%' },
  // Row 3 (top: ~80.00%, height: 4.2%)
  { name: 'UBS', top: '80.00%', left: '14.5%', width: '25.6%', height: '4.2%' },
  { name: 'Ass. Social', top: '80.00%', left: '40.8%', width: '25.5%', height: '4.2%' },
  { name: 'SUAS', top: '80.00%', left: '67.0%', width: '22.0%', height: '4.2%' },
];

const TOPIC_ROW_COORDS = [
  { numero: '01', top: '14.25%' },
  { numero: '02', top: '20.60%' },
  { numero: '03', top: '26.95%' },
  { numero: '04', top: '33.30%' },
  { numero: '05', top: '39.65%' },
  { numero: '06', top: '46.00%' },
  { numero: '07', top: '52.35%' },
  { numero: '08', top: '58.70%' },
  { numero: '09', top: '65.05%' },
  { numero: '10', top: '71.40%' },
  { numero: '11', top: '77.75%' },
  { numero: '12', top: '84.10%' },
  { numero: '13', top: '90.45%' },
];

export const ScreenView: React.FC<ScreenViewProps> = ({
  currentScreen,
  selectedThemes,
  selectedTopic,
  topics,
  onOpenStateSelector,
  onSelectState,
  onContinueFromState,
  onToggleTheme,
  onContinueFromThemes,
  onSelectTopic,
  onOpenDriveLink,
  onBackToTopics,
  onContinueToClosing,
  onRestart,
}) => {
  return (
    <div className="screen-view">
      {/* Background Screen PNG Asset */}
      <img
        src={`/assets/${currentScreen}.png`}
        alt={`Tela ${currentScreen}`}
        className="screen-bg-img"
        draggable={false}
      />

      {/* Screen 1: Initial state - Dropdown button */}
      {currentScreen === 'tela-1' && (
        <Hotspot
          top="68.25%"
          left="12.92%"
          width="74.13%"
          height="4.2%"
          rounded="full"
          label="Selecione o seu estado para acessar os arquivos personalizados da sua região"
          onClick={onOpenStateSelector}
        />
      )}

      {/* Screen 2: Dropdown options */}
      {currentScreen === 'tela-2' && (
        <>
          <Hotspot
            top="68.25%"
            left="12.92%"
            width="74.13%"
            height="4.2%"
            rounded="full"
            label="Maranhão (MA)"
            onClick={() => onSelectState('MA')}
          />
          <Hotspot
            top="74.33%"
            left="12.92%"
            width="74.13%"
            height="4.2%"
            rounded="full"
            label="Pará (PA)"
            onClick={() => onSelectState('PA')}
          />
          <Hotspot
            top="80.33%"
            left="12.92%"
            width="74.13%"
            height="4.2%"
            rounded="full"
            label="Rio de Janeiro (RJ)"
            onClick={() => onSelectState('RJ')}
          />
          <Hotspot
            top="86.42%"
            left="12.92%"
            width="74.13%"
            height="4.2%"
            rounded="full"
            label="Minas Gerais (MG)"
            onClick={() => onSelectState('MG')}
          />
          <Hotspot
            top="92.42%"
            left="12.92%"
            width="74.13%"
            height="4.2%"
            rounded="full"
            label="Espírito Santo (ES)"
            onClick={() => onSelectState('ES')}
          />
        </>
      )}

      {/* Screen 3: Selected State feedback - instant tap through */}
      {currentScreen === 'tela-3' && (
        <Hotspot
          top="0%"
          left="0%"
          width="100%"
          height="100%"
          label="Avançar para seleção de temas"
          onClick={onContinueFromState}
        />
      )}

      {/* Screen 4: State selected, ready to advance */}
      {currentScreen === 'tela-4' && (
        <>
          <Hotspot
            top="68.25%"
            left="12.92%"
            width="74.13%"
            height="4.2%"
            rounded="full"
            label="Alterar estado selecionado"
            onClick={onOpenStateSelector}
          />
          <Hotspot
            top="87.93%"
            left="12.92%"
            width="74.13%"
            height="4.73%"
            rounded="full"
            label="Continuar para seleção de temas"
            onClick={onContinueFromState}
          />
        </>
      )}

      {/* Screen 5: Theme selection with 9 pills */}
      {currentScreen === 'tela-5' && (
        <>
          {selectedThemes.length > 0 && (
            <div className="selection-counter-badge">
              {selectedThemes.length} / 3 selecionados
            </div>
          )}

          {THEME_PILLS.map((pill) => {
            const isSelected = selectedThemes.includes(pill.name);
            return (
              <Hotspot
                key={pill.name}
                top={pill.top}
                left={pill.left}
                width={pill.width}
                height={pill.height}
                label={`Tema ${pill.name}`}
                active={isSelected}
                activeStyle="border"
                rounded="full"
                onClick={() => onToggleTheme(pill.name)}
              >
                {isSelected && (
                  <span className="hotspot-check-badge">
                    ✓
                  </span>
                )}
              </Hotspot>
            );
          })}

          <Hotspot
            top="87.93%"
            left="12.92%"
            width="74.13%"
            height="4.73%"
            rounded="full"
            label="Continuar para os materiais do acervo"
            onClick={onContinueFromThemes}
          />
        </>
      )}

      {/* Screen 6: 13 Topics list */}
      {currentScreen === 'tela-6' && (
        <>
          {TOPIC_ROW_COORDS.map((coord) => {
            const topic = topics.find((t) => t.numero === coord.numero);
            if (!topic) return null;
            return (
              <Hotspot
                key={coord.numero}
                top={coord.top}
                left="10.2%"
                width="79.8%"
                height="5.4%"
                rounded="full"
                label={`Tópico ${topic.numero} - ${topic.tema}`}
                onClick={() => onSelectTopic(topic)}
              />
            );
          })}
        </>
      )}

      {/* Screen 7: Topic selection feedback */}
      {currentScreen === 'tela-7' && (
        <>
          {selectedTopic && (
            <div
              style={{
                position: 'absolute',
                top: TOPIC_ROW_COORDS.find((c) => c.numero === selectedTopic.numero)?.top || '14.25%',
                left: '10.2%',
                width: '79.8%',
                height: '5.4%',
                backgroundColor: '#f29900',
                borderRadius: '9999px',
                zIndex: 10,
                opacity: 0.9,
                boxShadow: '0 4px 12px rgba(242, 153, 0, 0.4)',
                pointerEvents: 'none',
              }}
            />
          )}
          <Hotspot
            top="0%"
            left="0%"
            width="100%"
            height="100%"
            label="Avançar para abrir acervo"
            onClick={() => onSelectTopic(selectedTopic || topics[0])}
          />
        </>
      )}

      {/* Screen 8: Launcher Card */}
      {currentScreen === 'tela-8' && (
        <>
          {selectedTopic && (
            <div className="topic-title-card">
              <span className="topic-title-badge">
                {selectedTopic.numero} - {selectedTopic.tema}
              </span>
            </div>
          )}

          {/* "Clique aqui" Teal Button */}
          <Hotspot
            top="52.25%"
            left="35.0%"
            width="52.36%"
            height="8.40%"
            rounded="lg"
            label={`Abrir pasta no Google Drive: ${selectedTopic ? `${selectedTopic.numero} - ${selectedTopic.tema}` : 'Material escolhido'}`}
            onClick={onOpenDriveLink}
          />

          {/* "<< Voltar pra seleção" Link */}
          <Hotspot
            top="82.2%"
            left="24.0%"
            width="50.0%"
            height="4.0%"
            rounded="md"
            label="Voltar para a seleção de tópicos"
            onClick={onBackToTopics}
          />

          {/* Bottom "CONTINUAR >" Button */}
          <Hotspot
            top="87.93%"
            left="12.92%"
            width="74.13%"
            height="4.73%"
            rounded="full"
            label="Continuar para tela final"
            onClick={onContinueToClosing}
          />
        </>
      )}

      {/* Screen 9: Closing / Partners */}
      {currentScreen === 'tela-9' && (
        <>
          <Hotspot
            top="87.93%"
            left="12.92%"
            width="74.13%"
            height="4.73%"
            rounded="full"
            label="Reiniciar navegação no Acervo Digital"
            onClick={onRestart}
          />
          <div className="restart-container">
            <button
              type="button"
              onClick={onRestart}
              className="restart-btn"
            >
              <span style={{ fontSize: '15px' }}>↺</span> Fazer nova consulta
            </button>
          </div>
        </>
      )}
    </div>
  );
};
