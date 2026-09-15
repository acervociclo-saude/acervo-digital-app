import React from 'react';
import type { ScreenId, CollectionItem } from '../state/types';
import { Hotspot } from './Hotspot';

interface ScreenViewProps {
  currentScreen: ScreenId;
  selectedState?: string;
  selectedThemes: string[];
  selectedTopic: CollectionItem | null;
  topics: CollectionItem[];
  isProtecaoSocial?: boolean;
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

const TOPIC_ROW_COORDS_SAUDE = [
  { numero: '01', top: '14.25%', height: '5.4%' },
  { numero: '02', top: '20.60%', height: '5.4%' },
  { numero: '03', top: '26.95%', height: '5.4%' },
  { numero: '04', top: '33.30%', height: '5.4%' },
  { numero: '05', top: '39.65%', height: '5.4%' },
  { numero: '06', top: '46.00%', height: '5.4%' },
  { numero: '07', top: '52.35%', height: '5.4%' },
  { numero: '08', top: '58.70%', height: '5.4%' },
  { numero: '09', top: '65.05%', height: '5.4%' },
  { numero: '10', top: '71.40%', height: '5.4%' },
  { numero: '11', top: '77.75%', height: '5.4%' },
  { numero: '12', top: '84.10%', height: '5.4%' },
  { numero: '13', top: '90.45%', height: '5.4%' },
];

const TOPIC_ROW_COORDS_PROT_SOCIAL = [
  { numero: '01', top: '29.87%', height: '5.52%' },
  { numero: '02', top: '36.50%', height: '7.70%' },
  { numero: '03', top: '45.32%', height: '7.70%' },
  { numero: '04', top: '54.13%', height: '5.52%' },
  { numero: '05', top: '60.77%', height: '7.70%' },
  { numero: '06', top: '69.58%', height: '5.52%' },
  { numero: '07', top: '76.23%', height: '5.52%' },
];

export const ScreenView: React.FC<ScreenViewProps> = ({
  currentScreen,
  selectedState = 'MA',
  selectedThemes,
  selectedTopic,
  topics,
  isProtecaoSocial = false,
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
  let bgSrc = `/assets/${currentScreen}.png`;

  if (currentScreen === 'tela-1' || currentScreen === 'tela-2') {
    bgSrc = `/assets/${currentScreen}.png`;
  } else if (currentScreen === 'tela-3' || currentScreen === 'tela-4' || currentScreen === 'tela-5') {
    if (selectedState === 'PA') {
      bgSrc = `/assets/pa/pa-${currentScreen}.png`;
    } else if (selectedState === 'MG') {
      bgSrc = `/assets/mg/mg-${currentScreen}.png`;
    } else {
      bgSrc = `/assets/${currentScreen}.png`;
    }
  } else if (currentScreen === 'tela-6' || currentScreen === 'tela-7' || currentScreen === 'tela-8') {
    if (isProtecaoSocial) {
      if (selectedState === 'PA') {
        bgSrc = `/assets/pa-ps/pa-ps-${currentScreen}.png`;
      } else if (selectedState === 'MG') {
        bgSrc = `/assets/mg-ps/mg-ps-${currentScreen}.png`;
      } else {
        bgSrc = `/assets/ma-ps/ma-ps-${currentScreen}.png`;
      }
    } else {
      if (selectedState === 'PA') {
        bgSrc = `/assets/pa/pa-${currentScreen}.png`;
      } else if (selectedState === 'MG') {
        bgSrc = `/assets/mg/mg-${currentScreen}.png`;
      } else {
        bgSrc = `/assets/${currentScreen}.png`;
      }
    }
  } else if (currentScreen === 'tela-9') {
    if (selectedState === 'PA') {
      bgSrc = `/assets/pa/pa-tela-9.png`;
    } else if (selectedState === 'MG') {
      bgSrc = `/assets/mg/mg-tela-9.png`;
    } else {
      bgSrc = `/assets/tela-9.png`;
    }
  }

  return (
    <div className="screen-view">
      {/* Background Screen PNG Asset */}
      <img
        src={bgSrc}
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

      {/* Screen 2: Dropdown options (3 states: MA, PA, MG) */}
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
            label="Minas Gerais (MG)"
            onClick={() => onSelectState('MG')}
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

      {/* Screen 6: Topics list */}
      {currentScreen === 'tela-6' && (
        <>
          {isProtecaoSocial ? (
            TOPIC_ROW_COORDS_PROT_SOCIAL.map((coord) => {
              const topic = topics.find((t) => t.numero === coord.numero);
              if (!topic) return null;
              return (
                <Hotspot
                  key={coord.numero}
                  top={coord.top}
                  left="10.22%"
                  width="79.29%"
                  height={coord.height}
                  rounded="full"
                  label={`Tópico ${topic.numero} - ${topic.tema}`}
                  onClick={() => onSelectTopic(topic)}
                />
              );
            })
          ) : (
            TOPIC_ROW_COORDS_SAUDE.map((coord) => {
              const topic = topics.find((t) => t.numero === coord.numero);
              if (!topic) return null;
              return (
                <Hotspot
                  key={coord.numero}
                  top={coord.top}
                  left="10.2%"
                  width="79.8%"
                  height={coord.height}
                  rounded="full"
                  label={`Tópico ${topic.numero} - ${topic.tema}`}
                  onClick={() => onSelectTopic(topic)}
                />
              );
            })
          )}
        </>
      )}

      {/* Screen 7: Topic selection feedback */}
      {currentScreen === 'tela-7' && (
        <>
          {selectedTopic && (
            <div
              style={
                isProtecaoSocial
                  ? {
                      position: 'absolute',
                      top: TOPIC_ROW_COORDS_PROT_SOCIAL.find((c) => c.numero === selectedTopic.numero)?.top || '29.87%',
                      left: '10.22%',
                      width: '79.29%',
                      height: TOPIC_ROW_COORDS_PROT_SOCIAL.find((c) => c.numero === selectedTopic.numero)?.height || '5.52%',
                      backgroundColor: '#f29900',
                      borderRadius: '9999px',
                      zIndex: 10,
                      opacity: 0.9,
                      boxShadow: '0 4px 12px rgba(242, 153, 0, 0.4)',
                      pointerEvents: 'none',
                    }
                  : {
                      position: 'absolute',
                      top: TOPIC_ROW_COORDS_SAUDE.find((c) => c.numero === selectedTopic.numero)?.top || '14.25%',
                      left: '10.2%',
                      width: '79.8%',
                      height: TOPIC_ROW_COORDS_SAUDE.find((c) => c.numero === selectedTopic.numero)?.height || '5.4%',
                      backgroundColor: '#f29900',
                      borderRadius: '9999px',
                      zIndex: 10,
                      opacity: 0.9,
                      boxShadow: '0 4px 12px rgba(242, 153, 0, 0.4)',
                      pointerEvents: 'none',
                    }
              }
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
