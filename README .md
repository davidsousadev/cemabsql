# CEMAB SQL

Editor SQL online (playground) que permite escrever, executar e testar comandos SQL (SQLite) diretamente no navegador, com syntax highlighting (CodeMirror), terminal interativo com resultados em tabela e salvamento de arquivos `.sql`.

## ✨ Funcionalidades

- Editor com syntax highlighting para SQL
- Execução de SQL no navegador via SQLite (sql.js / WebAssembly)
- Suporte a CREATE TABLE, INSERT, SELECT, UPDATE, DELETE e demais comandos SQL
- Terminal interativo com resultados formatados em tabela
- Banco de dados temporário em memória (sessão): os dados duram apenas enquanto a página estiver aberta
- Reset do banco temporário
- Salvamento do código em arquivo `.sql`
- Layout responsivo e acessível

## 📁 Estrutura do projeto

```
.
├── index.html              # Página principal
├── sql/                    # Pasta com editor e terminal SQL
│   └── index.html
├── assets/
│   ├── css/styles.css      # Estilos
│   ├── js/app.js           # Lógica da aplicação (sql.js)
│   └── img/icon.jpeg       # Favicon / logo
├── 404.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── LICENSE
└── README.md
```

## 🚀 Como usar

Basta abrir o `index.html` em um navegador ou servir a pasta com qualquer servidor estático:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Depois acesse `http://localhost:8080`.

## 🗄️ Banco temporário

O banco de dados é criado em memória no navegador (equivalente a um armazenamento temporário de sessão). Ao recarregar a página ou encerrar a sessão, todos os dados e tabelas são apagados. Isso permite que os alunos pratiquem CREATE TABLE e operações CRUD sem persistência permanente.

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE).

## 👤 Autor

**David Sousa** — [@davidsousadev](https://github.com/davidsousadev)
