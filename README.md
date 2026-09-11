# Acervo Digital - Ciclo Saúde Proteção Social

Aplicação web interativa para navegação simplificada sobre o repositório de conteúdos do **Ciclo Saúde Proteção Social** no Google Drive.

🔗 **Link Oficial no Ar:** [https://acervo-digital-app.vercel.app](https://acervo-digital-app.vercel.app)

---

## 🎯 Princípio Central do Produto

O **Acervo Digital Ciclo Saúde Proteção Social** não é um novo repositório de arquivos. Ele funciona como uma **camada de experiência, navegação e arquitetura da informação sobre o repositório já existente no Google Drive**.

O usuário não precisa conhecer a estrutura de pastas nem nomenclaturas técnicas. Ele apenas reconhece seu contexto e faz escolhas simples e progressivas:
> **Maranhão** -> **Saúde + SUS** -> **Saúde da Mulher** -> **Material correspondente no Google Drive**.

---

## 📱 Estrutura das 9 Telas Oficiais

O projeto utiliza o layout oficial em alta fidelidade (`3375x6000`, proporção 9:16 mobile-first):

| Tela | Nome | Função |
|:---:|---|---|
| **Tela 1** | Início / Dropdown Fechado | Apresentação do produto e botão de seleção de estado. |
| **Tela 2** | Dropdown Aberto | Seleção do estado (Maranhão ativo; outros estados exibem aviso de indisponibilidade). |
| **Tela 3** | Feedback de Seleção | Transição automática (200ms) destacando Maranhão em amarelo. |
| **Tela 4** | Estado Confirmado | Exibição de Maranhão selecionado e botão "CONTINUAR >". |
| **Tela 5** | Seleção de Temas | 9 pílulas de temas (seleção de 1 a 3 temas simultâneos) e botão "CONTINUAR >". |
| **Tela 6** | Acervo de Conteúdos | Lista com os 13 temas/tópicos de saúde disponíveis. |
| **Tela 7** | Feedback do Tópico | Transição automática (200ms) destacando o tema escolhido em amarelo. |
| **Tela 8** | Launcher de Destino | Botão *"Clique aqui"* que abre a pasta no Google Drive em nova aba, link de retorno e botão de avanço. |
| **Tela 9** | Conclusão e Reinício | Tela de encerramento com botão para reiniciar o fluxo de navegação. |

---

## ⚙️ Regras de Seleção e Validação (Tela 5)

1. **Mínimo 1 e máximo 3 temas**: Seleções válidas podem conter 1, 2 ou 3 temas.
2. **Toggle sem navegação**: Clicar em um tema apenas alterna entre selecionado e não selecionado.
3. **Limite de 3 temas**: Se 3 temas já estiverem marcados e o usuário clicar no 4º, o sistema não adiciona e exibe:
   > `"Selecione entre 1 e 3 opções"`
4. **Validação no botão CONTINUAR**:
   - Com 0 temas selecionados -> bloqueia e exibe: `"Selecione entre 1 e 3 opções"`
   - Combinação sem rota no CSV -> bloqueia e exibe: `"A combinação selecionada não possui rota disponível."`
   - Combinação válida -> direciona para a Tela 6.
5. **Independência de ordem**: A rota é a mesma independentemente da ordem em que os temas forem clicados (ex.: `Saúde + SUS` = `SUS + Saúde`).

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (v18 ou superior) instalado.

### 1. Clonar ou abrir a pasta
```powershell
cd "C:\Users\Diego\OneDrive\Documentos\Acervo-Digital-App"
```

### 2. Instalar dependências
```powershell
npm install
```

### 3. Rodar o servidor de desenvolvimento
```powershell
npm run dev
```
Abra o navegador em [http://localhost:5173/](http://localhost:5173/). O Vite atualiza a tela automaticamente a cada arquivo alterado!

---

## 🧪 Testes Automatizados

O projeto possui **26 testes unitários e de integração** automatizados com **Vitest**:

```powershell
npm test
```

### Cobertura dos Testes:
- `routeEngine.test.ts`: normalização de texto, remoção de acentos, comparação com ordem independente e rejeição de rotas inexistentes.
- `useAppFlow.test.ts`: ciclo completo de navegação, limites de temas (0, 1, 2, 3 e 4), mensagens de erro e histórico do navegador.
- `ScreenView.test.tsx`: calibração dos hotspots da Tela 2 (Maranhão vs outros estados), pílulas da Tela 5 e botões da Tela 8.

---

## 🌐 Como Atualizar a Publicação na Vercel

Sempre que a equipe fizer edições e quiser colocar a nova versão no ar:

```powershell
# 1. Compilar para verificar erros
npm run build

# 2. Publicar diretamente em produção
npx vercel --prod
```

O link [https://acervo-digital-app.vercel.app](https://acervo-digital-app.vercel.app) será atualizado instantaneamente!

---

## 📂 Estrutura de Arquivos

```
Acervo-Digital-App/
├── public/
│   └── assets/              # As 9 imagens oficiais (tela-1.png até tela-9.png)
├── src/
│   ├── components/
│   │   ├── Hotspot.tsx          # Botão clicável invisível com acessibilidade
│   │   ├── ScreenView.tsx       # Renderização das 9 telas e hotspots calibrados
│   │   ├── ToastAlert.tsx       # Mensagens de alerta no rodapé
│   │   └── ViewportContainer.tsx # Contêiner responsivo 9:16 mobile-first
│   ├── data/
│   │   ├── rotas.json           # Tabela de rotas e combinações de temas
│   │   └── ma_saude_sus.json    # Os 13 tópicos de saúde e links do Google Drive
│   ├── state/
│   │   ├── routeEngine.ts       # Algoritmo de busca determinística de rotas
│   │   ├── types.ts             # Definições de tipos TypeScript
│   │   └── useAppFlow.ts        # Hook principal de estado e navegação
│   ├── App.tsx
│   └── index.css            # Estilização visual e responsividade
├── vercel.json              # Configuração de roteamento SPA da Vercel
└── package.json
```
