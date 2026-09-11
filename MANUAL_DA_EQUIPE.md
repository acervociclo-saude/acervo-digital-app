# 📘 Manual de Uso e Edição — Acervo Digital Ciclo Saúde Proteção Social

Este documento foi preparado para orientar toda a equipe sobre o funcionamento, arquitetura, manutenção e edição contínua da aplicação do **Acervo Digital**.

---

## 🔗 Links Oficiais

* **Aplicação no Ar (Produção):** [https://acervo-digital-app.vercel.app](https://acervo-digital-app.vercel.app)
* **Repositório de Código no GitHub:** [https://github.com/acervociclo-saude/acervo-digital-app](https://github.com/acervociclo-saude/acervo-digital-app)
* **Pasta de Trabalho Local:** `C:\Users\Diego\OneDrive\Documentos\Acervo-Digital-App`

---

## 🎯 1. O que é o Acervo Digital?

O **Acervo Digital Ciclo Saúde Proteção Social** não armazena arquivos diretamente. Ele funciona como uma **camada de navegação, experiência visual e arquitetura da informação sobre o repositório existente no Google Drive**.

O objetivo é que profissionais de saúde, gestores e articuladores não precisem se perder na hierarquia técnica de pastas do Google Drive. Eles apenas escolhem:
> **Estado (Maranhão)** -> **Temas de Interesse (1 a 3 temas)** -> **Tópico Específico** -> **Pasta Aberta no Google Drive**.

---

## 📱 2. Como Funciona a Navegação (As 9 Telas)

A aplicação foi desenvolvida em formato mobile-first (proporção 9:16) baseada no design oficial:

1. **Tela 1:** Início com o seletor de estado fechado.
2. **Tela 2:** Lista suspensa de estados. Atualmente, apenas **Maranhão (MA)** está ativo. Ao clicar em qualquer outro estado (PA, RJ, MG, ES), o sistema exibe o aviso: *"Atualmente apenas os arquivos do Maranhão estão disponíveis."*.
3. **Tela 3:** Feedback visual automático (200ms) destacando a opção Maranhão em amarelo.
4. **Tela 4:** Confirmação do estado e botão **"CONTINUAR >"**.
5. **Tela 5:** Seleção de temas:
   - O usuário pode marcar entre **1 e 3 temas** (Saúde, Campanha, CRAS, Proteção Social, Cuidado, SUS, UBS, Ass. Social, SUAS).
   - Cada clique apenas marca ou desmarca a pílula (toggle).
   - Ao tentar selecionar um 4º tema: bloqueia e avisa *"Selecione entre 1 e 3 opções"*.
   - Ao clicar em CONTINUAR sem nenhum tema: avisa *"Selecione entre 1 e 3 opções"*.
   - Se a combinação não tiver rota cadastrada na planilha: avisa *"A combinação selecionada não possui rota disponível."*.
   - Se for uma rota válida: direciona para a Tela 6.
   - **Ordem independente:** selecionar `Saúde + SUS` produz o mesmo resultado que `SUS + Saúde`.
6. **Tela 6:** Lista com os 13 temas/tópicos do acervo do Maranhão.
7. **Tela 7:** Feedback visual automático (200ms) destacando o tópico clicado.
8. **Tela 8:** Tela de destino com:
   - Botão **"Clique aqui"** (abre a pasta oficial do Google Drive em nova aba).
   - Link **"<< Voltar pra seleção"** (retorna para a Tela 6 para escolher outro tema).
   - Botão **"CONTINUAR >"** (avança para o encerramento).
9. **Tela 9:** Tela final com botão de reiniciar o fluxo para a Tela 1.

---

## 🛠️ 3. Como a Equipe Edita o Projeto

Todas as informações da aplicação foram organizadas em arquivos simples para que qualquer pessoa consiga alterar sem complicação.

### 📍 Cenário A: Como alterar ou adicionar Links do Google Drive
Os 13 tópicos e seus links do Drive ficam salvos no arquivo:
📁 **`src/data/ma_saude_sus.json`**

Cada tópico segue esta estrutura:
```json
{
  "numero": "01",
  "tema": "Saúde da Mulher",
  "linkDrive": "https://drive.google.com/drive/folders/SEU_LINK_AQUI"
}
```
* **Para atualizar um link:** basta substituir a URL do Drive correspondente ao tópico.
* **Para renomear um tema:** altere o texto dentro do campo `"tema"`.

---

### 📍 Cenário B: Como alterar ou adicionar Rotas e Combinações de Temas
As rotas mapeadas a partir da planilha oficial ficam no arquivo:
📁 **`src/data/rotas.json`**

Exemplo de uma rota de 2 temas:
```json
{
  "estado": "MA",
  "themes": ["Saúde", "SUS"],
  "routeCode": "MA_SAUDE_SUS",
  "destinationSheet": "MA_SAUDE_SUS"
}
```
* Se a equipe quiser liberar uma nova combinação de temas (exemplo: `CRAS` + `Proteção Social`), basta adicionar um novo bloco com os nomes exatos dos temas na lista `themes`.

---

### 📍 Cenário C: Como atualizar as Imagens das Telas
Se a equipe de design criar uma nova versão gráfica de qualquer tela:
As 9 imagens ficam salvas na pasta:
📁 **`public/assets/`**
- `tela-1.png`
- `tela-2.png`
- ... até `tela-9.png`

Basta substituir a imagem antiga pela nova, mantendo o **mesmo nome do arquivo** e a proporção de 9:16 (`3375x6000` px).

---

## 💻 4. Como Rodar no Computador da Equipe

Qualquer membro da equipe que quiser testar ou fazer alterações locais:

1. **Baixar o repositório:**
   ```powershell
   git clone https://github.com/acervociclo-saude/acervo-digital-app.git
   cd acervo-digital-app
   ```

2. **Instalar dependências (apenas na 1ª vez):**
   ```powershell
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```powershell
   npm run dev
   ```
   Abra no navegador em `http://localhost:5173/`. Qualquer alteração salva nos arquivos será exibida na hora na tela!

4. **Rodar os testes automáticos de validação:**
   ```powershell
   npm test
   ```
   O projeto conta com 26 testes unitários que garantem que nenhuma rota ou clique quebrou.

---

## 🚀 5. Como Publicar as Alterações no Ar

Depois de fazer as alterações e testar no computador:

### Passo 1: Salvar e enviar para o GitHub
```powershell
git add .
git commit -m "Descreva aqui o que foi alterado"
git push
```

### Passo 2: Atualizar o site na Vercel
```powershell
npx vercel --prod
```
Em menos de 30 segundos a Vercel compila e substitui a versão antiga pela nova em:
👉 **[https://acervo-digital-app.vercel.app](https://acervo-digital-app.vercel.app)**

---

## 🔒 6. Segurança e Permissões no Google Drive

* **Quem tem acesso aos arquivos?** Quem tem o link do Drive.
* **Recomendação obrigatória:** Todas as pastas e arquivos no Google Drive devem estar configurados com nível de permissão **"Leitor"** (Visualizador).
* Nunca compartilhe com permissão de "Editor" para o público em geral, garantindo que nenhum usuário apague ou altere os arquivos originais do acervo.
