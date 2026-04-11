# Manual de Identidade e Regras do Projeto: Clube da Bíblia
Este documento serve como guia mestre para a automação no GitHub Actions gerar novos arquivos (Leitura e Quizzes) mantendo o padrão visual e arquitetural exato do site.


## 1. Padrões de Estilo e UI/UX (Interface Premium)
### Visão Geral
O design utiliza uma estética "Modern Dark Premium" focada em imersão, utilizando princípios de **Glassmorphism**, fundos animados com partículas e efeitos de brilho (Glow).

### Regras Base de Estilo
* **Background Primário:** Tons escuros profundos que variam sutilmente conforme o livro (ex: `#1a0d00` para laranja, `#050510` para índigo, `#0f172a` para neutro).
* **Painéis (Glass-cards/Glass-panels):** Fundo translúcido (ex: `rgba(15, 15, 25, 0.6)`) combinado com `backdrop-blur(10px)` ou `12px` e bordas semi-transparentes mapeadas com a cor do tema.
* **Fundo Animado:** Uso obrigatório da biblioteca `particles.js` (desenhada via canvas no final do body) com partículas na cor primária do tema em baixa opacidade (`rgba(..., 0.15)`).
* **Tipografia:**
    * **Títulos:** `Cinzel` (Serif) - Em maiúsculas (uppercase), tracking espaçado (`tracking-widest`) e sombras brilhantes (`[cor]-glow`).
    * **Corpo do Texto:** `Lato` (Sans-serif) - Peso leve (`font-light`), textos na cor `text-slate-300` ou `text-slate-400`, com espaçamento entrelinhas elevado (`leading-relaxed`).

### Matriz de Temas e Acentos (Restrito aos Livros Atuais)
Cada livro possui uma identidade visual única injetada nas classes do Tailwind, no FontAwesome e no CSS (Glow e Blur).

# Matriz de Identidade Visual: Todos os Livros da Bíblia
Esta tabela define as constantes de estilo que o script de automação deve injetar no `tailwind.config` e nos elementos de UI (Glow, Borders, Icons) de cada página gerada.

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


## 2. Estrutura de Diretórios e Arquivos (Atualização)

* **Repositório Local (GitHub):** Todos os arquivos do site devem ser gerados e mantidos dentro de uma pasta raiz chamada `/hostinger`. 
* **Servidor (Hostinger):** O conteúdo da pasta `/hostinger` do repositório espelha exatamente a pasta `/public_html/` do servidor.
* Os arquivos `index.html`, `api.php`, `[livro].html` e `quiz_[livro].html` ficam todos soltos na raiz dessa pasta, junto com o diretório `/uploads/`.

---

## 3. Diretrizes de Banco de Dados (Atualização)

* **Back-End Exclusivo:** O sistema utiliza unicamente o banco de dados MySQL hospedado na Hostinger.
* **Sem dependências externas:** Não há uso do Supabase para processamento de dados neste fluxo; tudo é resolvido via PHP/PDO localmente.

---

## 4. Fluxo de Atualização de Código (Reescrita Completa)

A automação não utilizará âncoras ou marcadores de injeção. O fluxo de atualização para arquivos existentes (`index.html` e `api.php`) será:
1. O script lerá o conteúdo integral do arquivo atual.
2. A inteligência artificial receberá o código completo e a instrução da nova atualização.
3. A inteligência artificial deverá devolver o **código inteiro e completo** já com as modificações aplicadas (sem omitir partes para "encurtar").
4. O arquivo antigo será totalmente sobrescrito pelo novo arquivo gerado.

---

## 5. Deploy

* O deploy é feito via Node.js utilizando a biblioteca `basic-ftp`.
* O script de upload lê a pasta local `/hostinger` e faz o espelhamento para a pasta `/public_html` no servidor FTP.
* **Segurança:** O script de deploy não deve conter credenciais expostas no código. Deve utilizar variáveis de ambiente (`process.env.FTP_USER`, `process.env.FTP_PASS`, `process.env.FTP_HOST`).
