# Manual do Gabinete — eproc

Manual de consulta rápida das rotinas do Gabinete da 1ª Relatoria da 1ª Turma Recursal dos Juizados Especiais (TJPR) no eproc: receber o processo, minutar, conferir e pautar, lançar o evento 12311.

Material de apoio, com telas do ambiente de treinamento (dados fictícios). Não é documento oficial do tribunal.

## Como abrir

Página estática (HTML, CSS e JavaScript puros, sem build e sem internet): abra `index.html` no navegador.

Para os vídeos aparecerem, copie os MP4 para a pasta `videos/` (eles ficam fora do git, ver `.gitignore`). Os nomes esperados estão no atributo `src` de cada clipe em `index.html`, por exemplo `videos/clipe_1C_trocar_localizador.mp4`.

## Estrutura

```
index.html            conteúdo (uma seção por etapa)
css/                  tokens (cores), base, layout, componentes, impressão
js/manual.js          rodapé dos passos, destaque da seção atual, filtro da tabela, gaveta no celular, impressão
assets/img/           imagens do documento do gabinete
assets/fonts/         Inter (local, licença OFL)
videos/               clipes MP4 (não versionados) e quadros de capa
docs/                 conferência contra o documento-base
```

## Design

Cores do próprio eproc (cabeçalho petróleo, azul dos botões, amarelo dos ícones) e uma cor por etapa: 1 azul, 2 roxo, 3 verde, 4 laranja. Linha do tempo lateral, passos em cartões numerados, caixas Dica, Atenção, Regra do gabinete e Resultado esperado, e modo foco inspirado em tours guiados.

## Como incluir um vídeo que ainda está em produção

1. Salve o MP4 em `videos/` e um quadro de capa em `videos/posters/` (mesmo nome, `.jpg`).
2. Em `index.html`, troque o bloco `<figure class="clipe pendente">` pelo bloco de um clipe pronto (copie o do clipe 1C) e ajuste id, arquivo, duração e legenda.

## Como atualizar uma seção

Edite o texto em `index.html`, atualize a linha “Seção revisada em” e registre a mudança em “Histórico de revisões”.

## Commits

Conventional Commits, em português: `feat`, `fix`, `content`, `style`, `docs`, `build`, `chore`. Um assunto por commit.

## Impressão e PDF

O botão **Imprimir** (ou Ctrl+P) abre todas as seções e troca os vídeos pela legenda. Escolha “Salvar como PDF”.

## Repositório git

O histórico de commits vem no arquivo `..\manual.bundle` (pasta acima desta). Para ativar o repositório nesta pasta, dê dois cliques em `ativar-git.bat` (precisa do Git instalado). Depois disso, `git log` mostra todos os commits e `git status` deve vir limpo.
