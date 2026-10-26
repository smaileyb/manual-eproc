# Manual do Gabinete — eproc

Manual de consulta rápida das rotinas do Gabinete da 1ª Relatoria da 1ª Turma Recursal dos Juizados Especiais (TJPR) no eproc: receber o processo, minutar, conferir e pautar, lançar o evento “Análise de Relator Concluída” (12311).

Material de apoio, com telas do ambiente de treinamento (dados fictícios). Não é documento oficial do tribunal.

## Como abrir

Página estática (HTML, CSS e JavaScript puros, sem build e sem internet): abra `index.html` no navegador.

Os vídeos ficam em `videos/` e fazem parte do repositório, então tudo funciona direto do download.

## Estrutura

```
index.html            conteúdo (uma seção por etapa)
css/                  tokens (cores), base, layout, componentes, impressão
js/manual.js          rodapé dos passos, trilho da seção atual, tema, transições, filtro, gaveta, impressão
assets/img/           imagens do documento do gabinete
assets/fonts/         Newsreader e Atkinson Hyperlegible (locais, licença OFL)
videos/               clipes MP4 e quadros de capa
docs/                 conferência contra o documento-base
```

## Design

O conceito é o **trilho**: o fluxo é uma sequência com uma bifurcação (A ou B na Etapa 2), e a página o desenha assim. A abertura, “O fluxo do gabinete”, traz o trilho com as 4 estações, desenhado uma vez ao carregar. O painel lateral é o mesmo trilho, com o trecho percorrido acompanhando a leitura, e cada passo é uma estação numerada no trilho da sua etapa.

- **Cores:** petróleo e amarelo vêm do próprio eproc. O amarelo serve só de marca-texto (foco do teclado, estação atual e sublinhado dos nomes de tela, como **Consultar**). Cada etapa tem uma cor: 1 azul, 2 roxo, 3 verde, 4 laranja. Os tokens ficam em `css/tokens.css`.
- **Tema escuro:** segue o sistema. O botão **Tema escuro / Tema claro** no topo troca o tema e guarda a escolha neste navegador. A impressão sai sempre no tema claro.
- **Tipografia:** Newsreader (serifa) nos títulos e nos numerais das etapas, Atkinson Hyperlegible Next no texto e Atkinson Hyperlegible Mono nos atalhos de teclado. Todas locais, em `assets/fonts/`.
- **Movimento:** o desenho do trilho na abertura é o único movimento automático. O resto responde a uma ação: troca de tema, recolhíveis, gaveta no celular, estação que pulsa ao seguir “Próximo passo”. Com “reduzir movimento” ligado no sistema, tudo fica instantâneo.
- Caixas Dica, Atenção, Regra do gabinete e Resultado esperado. Não há busca, barra de progresso nem modo foco.

## Como incluir um vídeo novo

1. Salve o MP4 em `videos/` e um quadro de capa em `videos/posters/` (mesmo nome, `.jpg`). Os MP4 entram no git como binários; mantenha cada um abaixo de 50 MB.
2. Em `index.html`, copie o bloco `<figure class="clipe">` de um clipe pronto (por exemplo, o do clipe 1C) para o ponto do passo e ajuste arquivo, capa, legenda e duração. O manual não mostra numeração de clipes nem espaços reservados: o que ainda falta gravar fica no plano do projeto (`../Plano.md`).

## Como atualizar uma seção

Edite o texto em `index.html`.

## Commits

Conventional Commits, em português: `feat`, `fix`, `content`, `style`, `docs`, `build`, `chore`. Um assunto por commit.

## Impressão e PDF

O botão **Imprimir** (ou Ctrl+P) abre todos os recolhíveis e troca os vídeos pela legenda. Escolha “Salvar como PDF”.
