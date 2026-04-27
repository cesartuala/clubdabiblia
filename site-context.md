# 📜 Manual de Identidade e Regras: Clube da Bíblia (v3.2)

Este documento é a diretriz mestre para a automação via API. Qualquer ficheiro gerado deve seguir rigorosamente estes padrões para garantir a integridade técnica, visual e teológica do projeto.

---

## 1. Protocolo de Integridade Absoluta (Anti-Simplificação)
* **Regra de Reescrita Integral:** A API deve devolver sempre o código completo. É terminantemente proibido o uso de placeholders como `// ... resto do código`.
* **Escopo de Geração:** A IA é responsável por gerar o ficheiro do livro (`[livro].html`), o ficheiro do quiz (`quiz_[livro].html`) e atualizar o `index.html`. 
* **Preservação de Back-End:** O ficheiro `api.php` **não deve ser modificado** pela IA, pois já contém todas as rotas para os 66 livros da Bíblia.
* **Escape de Caracteres:** É proibido o uso de crases (backticks \`) dentro das strings de texto do objeto `bibleData`. Utilize apenas aspas simples ou duplas para evitar quebras na sintaxe do JavaScript.

---

## 2. Padrões de Conteúdo (Exegese Teológica Profunda)
Cada ficheiro de leitura ([livro].html) deve seguir esta estrutura:
* **Estrutura por Capítulo:** Exatamente **3 blocos de conteúdo (H3)** detalhados:
    1. **Contexto e Exegese:** Fundo histórico e significado original.
    2. **Análise Teológica:** Doutrina e análise de termos.
    3. **Aplicação Prática:** Como aplicar o ensinamento hoje.
* **Rigor Linguístico:** Inclusão obrigatória de no mínimo **2 termos em Grego ou Hebraico** por capítulo.
    * **Formato:** *(Termo Original - Transliteração - Significado)*.
    * **Estilo:** Aplicar itálico `<i>` nos termos originais.

---

## 3. Arquitetura Front-End (Modern Dark Premium)
* **Glassmorphism:** Cards com `bg-slate-900/60`, `backdrop-blur-xl` e `border-white/10`.
* **Tipografia:** Títulos em `Cinzel` (Serif/Uppercase) com efeito glow. Corpo em `Lato` (Sans-serif).
* **Animação de Partículas:** Todo ficheiro `.html` deve inicializar o `particles.js` ao final, com a cor Hex correspondente ao tema do livro.
* **Garantia de Visibilidade:** As seções de conteúdo (`<section class="reveal">`) devem ser geradas de forma a garantir que a classe `.active` seja aplicada pelo JavaScript, evitando que o texto fique invisível (`opacity-0`).

---

## 4. Programação Defensiva (Resiliência)
Para evitar que falhas no banco de dados interrompam o funcionamento do site:
* **Validação de Dados:** Na função `carregarComentarios`, a IA deve obrigatoriamente validar se a resposta da API é um Array antes de tentar processá-la.
    * *Exemplo:* `if(!Array.isArray(data)) return;`
* **Tratamento de Erros:** Todas as chamadas de `fetch` devem possuir um bloco `.catch()` para tratar falhas de conexão de forma amigável.

---

## 5. Lógica de Status do index.html (Os 3 Status)
O `index.html` deve ser reorganizado dinamicamente seguindo esta hierarquia:

1. **STATUS "LEITURA ATUAL" (Topo):**
   - O novo livro assume o topo. Selo: "Leitura Atual". 
   - Botão de Quiz: Desativado (`opacity-50`, `pointer-events-none`).
2. **STATUS "DESAFIO ABERTO":**
   - O livro que estava no topo desce para esta seção. Selo: "Desafio Aberto". 
   - Botão de Quiz: 100% Ativo. Ranking: Visível.
3. **STATUS "ARQUIVO/CONCLUÍDO":**
   - Livros antigos perdem os selos de destaque, permanecendo disponíveis na biblioteca.

---

## 6. Matriz Visual e Base de Dados
* **SQL:** Todas as tabelas `ranking_[livro]` já existem. A IA **não deve** tentar criar tabelas.
## 1. Antigo Testamento
### Pentateuco (A Lei) - Tons de Azul e Índigo (Fundação)
| Livro | Hex | Tailwind | Ícone FontAwesome |
| :--- | :--- | :--- | :--- |
| Gênesis | `#3b82f6` | `blue-500` | `fa-seedling` |
| Êxodo | `#6366f1` | `indigo-500` | `fa-person-walking-luggage` |
| Levítico | `#4f46e5` | `indigo-600` | `fa-fire-burner` |
| Números | `#1d4ed8` | `blue-700` | `fa-users-rays` |
| Deuteronômio | `#1e40af` | `blue-800` | `fa-scroll` |

### Históricos - Tons de Terra, Ouro e Bronze (Reinos e Conquistas)
| Livro | Hex | Tailwind | Ícone FontAwesome |
| :--- | :--- | :--- | :--- |
| Josué | `#b45309` | `amber-700` | `fa-chess-rook` |
| Juízes | `#92400e` | `amber-800` | `fa-gavel` |
| Rute | `#d97706` | `amber-600` | `fa-wheat-awn` |
| I Samuel | `#78350f` | `amber-900` | `fa-crown` |
| II Samuel | `#78350f` | `amber-900` | `fa-scroll` |
| I Reis | `#fbbf24` | `amber-400` | `fa-fort-awesome` |
| II Reis | `#fbbf24` | `amber-400` | `fa-temple` |
| I Crônicas | `#a16207` | `yellow-700` | `fa-list-ol` |
| II Crônicas | `#a16207` | `yellow-700` | `fa-landmark` |
| Esdras | `#71717a` | `zinc-500` | `fa-trowel-bricks` |
| Neemias | `#52525b` | `zinc-600` | `fa-shield-halved` |
| Ester | `#db2777` | `pink-600` | `fa-gem` |

### Poéticos e Sabedoria - Tons de Roxo e Rosa (Adoração e Alma)
| Livro | Hex | Tailwind | Ícone FontAwesome |
| :--- | :--- | :--- | :--- |
| Jó | `#4b5563` | `gray-600` | `fa-cloud-showers-heavy` |
| Salmos | `#d946ef` | `fuchsia-500` | `fa-music` |
| Provérbios | `#f59e0b` | `amber-500` | `fa-lightbulb` |
| Eclesiastes | `#6b7280` | `gray-500` | `fa-hourglass-half` |
| Cantares | `#be123c` | `rose-700` | `fa-heart` |

### Profetas Maiores - Tons de Fogo e Sangue (Avisos e Glória)
| Livro | Hex | Tailwind | Ícone FontAwesome |
| :--- | :--- | :--- | :--- |
| Isaías | `#dc2626` | `red-600` | `fa-sun` |
| Jeremias | `#991b1b` | `red-800` | `fa-droplet` |
| Lamentações | `#450a0a` | `red-950` | `fa-face-sad-tear` |
| Ezequiel | `#ea580c` | `orange-600` | `fa-eye` |
| Daniel | `#c2410c` | `orange-700` | `fa-lion` |

### Profetas Menores - Tons de Verde e Oliva (Colheita e Justiça)
| Livro | Hex | Tailwind | Ícone FontAwesome |
| :--- | :--- | :--- | :--- |
| Oseias | `#16a34a` | `green-600` | `fa-hands-holding-child` |
| Joel | `#15803d` | `green-700` | `fa-locust` |
| Amós | `#166534` | `green-800` | `fa-scale-balanced` |
| Obadias | `#064e3b` | `emerald-900` | `fa-mountain-sun` |
| Jonas | `#0891b2` | `cyan-600` | `fa-fish-fins` |
| Miqueias | `#059669` | `emerald-600` | `fa-city` |
| Naum | `#065f46` | `emerald-800` | `fa-cloud-bolt` |
| Habacuque | `#3f6212` | `lime-800` | `fa-tower-observation` |
| Sofonias | `#4d7c0f` | `lime-700` | `fa-magnifying-glass` |
| Ageu | `#65a30d` | `lime-600` | `fa-hammer` |
| Zacarias | `#84cc16` | `lime-500` | `fa-horse` |
| Malaquias | `#bef264` | `lime-300` | `fa-sun-bright` |

---
## 2. Novo Testamento

### Evangelhos - Tons de Ouro e Luz (A Vida de Cristo)
| Livro | Hex | Tailwind | Ícone FontAwesome |
| :--- | :--- | :--- | :--- |
| Mateus | `#fbbf24` | `amber-400` | `fa-money-bill-1` |
| Marcos | `#f59e0b` | `amber-500` | `fa-bolt-lightning` |
| Lucas | `#d97706` | `amber-600` | `fa-stethoscope` |
| **João** | `#fcd34d` | `amber-300` | `fa-fish` |

### História e Epístolas Paulinas - Cores Vibrantes (Ação da Igreja)
| Livro | Hex | Tailwind | Ícone FontAwesome |
| :--- | :--- | :--- | :--- |
| **Atos** | `#22d3ee` | `cyan-400` | `fa-fire` |
| **Romanos** | `#ef4444` | `red-500` | `fa-cross` |
| **I Coríntios** | `#a855f7` | `purple-500` | `fa-crown` |
| **II Coríntios** | `#10b981` | `emerald-500` | `fa-leaf` |
| **Gálatas** | `#f97316` | `orange-500` | `fa-dove` |
| **Efésios** | `#6366f1` | `indigo-500` | `fa-church` |
| Filipenses | `#ec4899` | `pink-500` | `fa-face-smile` |
| Colossenses | `#14b8a6` | `teal-500` | `fa-mountain` |
| I Tessalonicenses | `#06b6d4` | `cyan-500` | `fa-envelope` |
| II Tessalonicenses | `#0891b2` | `cyan-600` | `fa-clock` |
| I Timóteo | `#4ade80` | `green-400` | `fa-user-tie` |
| II Timóteo | `#22c55e` | `green-500` | `fa-pen-nib` |
| Tito | `#84cc16` | `lime-500` | `fa-clipboard-check` |
| Filemom | `#fb7185` | `rose-400` | `fa-handshake` |

### Epístolas Gerais e Revelação - Tons Diversos
| Livro | Hex | Tailwind | Ícone FontAwesome |
| :--- | :--- | :--- | :--- |
| Hebreus | `#9333ea` | `purple-600` | `fa-anchor` |
| Tiago | `#c084fc` | `purple-400` | `fa-hand-holding-heart` |
| I Pedro | `#38bdf8` | `sky-400` | `fa-shield-heart` |
| II Pedro | `#0ea5e9` | `sky-500` | `fa-triangle-exclamation` |
| I João | `#f472b6` | `pink-400` | `fa-heart-pulse` |
| II João | `#fb7185` | `rose-400` | `fa-walkie-talkie` |
| III João | `#fda4af` | `rose-300` | `fa-hospital-user` |
| Judas | `#450a0a` | `red-950` | `fa-skull-crossbones` |
| Apocalipse | `#ffffff` | `white` | `fa-cloud-sun` |

---
---

## 7. Quiz Engine
* **Padrão Oficial e Estrutura Progressiva:** Jamais invente um layout comprido empilhando perguntas. É obrigatório seguir a mesma arquitetura do molde de referência: exibir **apenas 1 pergunta por tela**, com barra de progresso, botões de opção interativos e Feedback visual imediato (Verde/Correto ou Vermelho/Incorreto) com uma justificativa teológica na tela.
* **Volume Dinâmico:** Cada arquivo `quiz_[livro].html` deve trazer no seu JavaScript um banco minucioso de **15 perguntas inéditas** (com a alternativa correta e o texto de justificativa), porém estruturado para embaralhar e mostrar apenas **10 questões** ao usuário final.
* **Autenticidade Visual (Cores e Ícones):** É TERMINANTEMENTE PROIBIDO arrastar as cores de um molde genérico (ex: as cores de Efésios). Você deve pesquisar na matriz deste manual (Seção 6) qual é a Paleta (Tailwind class / Hex) e o Ícone FontAwesome do livro em questão e aplicar essa identidade em todo o arquivo HTML, inclusive na engrenagem inicial do JS do `particles.js`.
* **Integração Back-End Rigorosa:** A etapa final do Quiz deve possuir ocultamente a exata montagem para não quebrar o banco de dados. Obrigatoriamente: `<form id="rankingForm"> <input type="hidden" name="acao" value="salvar_quiz_[nome_do_livro_em_minusculo_e_sem_acentos]"> <input type="hidden" name="pontos" id="inputPontos"> <input type="hidden" name="acertos" id="inputAcertos"> <input type="text" name="nome"> ... </form>`. Qualquer desvio ou criação de JSON destruirá a intercomunicação com o `api.php`.

---

## 8. Estrutura de Diretorias e Deploy
* **Localização:** Todos os ficheiros devem residir na diretoria `/hostinger`.
* **Deploy:** Realizado via Node.js (`basic-ftp`) para a pasta `/public_html` do servidor.
* **Mídias:** Uploads de ficheiros processados para a pasta `/uploads/`.

---

**Instrução para a IA:** Priorize a fidelidade visual e a **robustez do código**. Não simplifique a lógica teológica nem a programação. Garanta que o site seja resiliente a erros e visualmente impecável.

---

## 9. Padrão Estrito de Nomenclaturas e Base de Dados
Para evitar falhas de link (Erro 404) ou desconexão com o banco de dados e garantir a visualização correta na interface principal, todos os arquivos gerados, formulários de ranking e chamadas (fetch) devem obedecer **rigorosamente** a formatação abaixo (tudo minúsculo, sem acentos, sem espaços). Além disso, as datas descritas aqui devem ser seguidas fielmente na geração dos cards de `index.html`.

| Livro Agendado | Arquivo HTML | Ação DB (Salvar Quiz) | Ação DB (Ranking) | Período de Leitura |
| --- | --- | --- | --- | --- |
| 1 Tessalonicenses | `1tessalonicenses.html` | `salvar_quiz_1tessalonicenses` | `ranking_1tessalonicenses` | 27/04 a 01/05 |
| 2 Tessalonicenses | `2tessalonicenses.html` | `salvar_quiz_2tessalonicenses` | `ranking_2tessalonicenses` | 04/05 a 06/05 |
| 1 Timóteo | `1timoteo.html` | `salvar_quiz_1timoteo` | `ranking_1timoteo` | 07/05 a 14/05 |
| 2 Timóteo | `2timoteo.html` | `salvar_quiz_2timoteo` | `ranking_2timoteo` | 18/05 a 21/05 |
| Tito | `tito.html` | `salvar_quiz_tito` | `ranking_tito` | 25/05 a 27/05 |
| Filemon | `filemon.html` | `salvar_quiz_filemon` | `ranking_filemon` | 28/05 |
| Hebreus | `hebreus.html` | `salvar_quiz_hebreus` | `ranking_hebreus` | 29/05 a 17/06 |
| Tiago | `tiago.html` | `salvar_quiz_tiago` | `ranking_tiago` | 18/06 a 24/06 |
| 1 Pedro | `1pedro.html` | `salvar_quiz_1pedro` | `ranking_1pedro` | 25/06 a 01/07 |
| 2 Pedro | `2pedro.html` | `salvar_quiz_2pedro` | `ranking_2pedro` | 02/07 a 04/07 |
| 1 João | `1joao.html` | `salvar_quiz_1joao` | `ranking_1joao` | 06/07 a 10/07 |
| 2 João | `2joao.html` | `salvar_quiz_2joao` | `ranking_2joao` | 13/07 |
| 3 João | `3joao.html` | `salvar_quiz_3joao` | `ranking_3joao` | 14/07 |
| Judas | `judas.html` | `salvar_quiz_judas` | `ranking_judas` | 15/07 |
| Mateus | `mateus.html` | `salvar_quiz_mateus` | `ranking_mateus` | 16/07 a 22/08 |
| Marcos | `marcos.html` | `salvar_quiz_marcos` | `ranking_marcos` | 24/08 a 12/09 |
| Lucas | `lucas.html` | `salvar_quiz_lucas` | `ranking_lucas` | 14/09 a 15/10 |
| Apocalipse | `apocalipse.html` | `salvar_quiz_apocalipse` | `ranking_apocalipse` | 19/10 a 17/11 |
