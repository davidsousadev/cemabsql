// ===== EDITOR =====
let editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "text/x-sql",
    theme: "material-darker",
    lineNumbers: true,
    inputStyle: "contenteditable",
    viewportMargin: Infinity,
    indentWithTabs: true,
    smartIndent: true,
    matchBrackets: true
});

// auto fechar (parênteses/colchetes)
editor.on("keydown", (cm, e) => {
    const pairs = { "(": ")", "[": "]" };
    if (e.key === "(" || e.key === "[") {
        e.preventDefault();
        let c = cm.getCursor();
        cm.replaceRange(e.key + pairs[e.key], c);
        cm.setCursor({ line: c.line, ch: c.ch + 1 });
    }
});

let saida = document.getElementById("saida");

// ===== TERMINAL STATE =====
let terminalTexto = "";

function renderCursor() {
    saida.innerHTML = "";
    const texto = document.createTextNode(terminalTexto);
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    saida.appendChild(texto);
    saida.appendChild(cursor);
    saida.scrollTop = saida.scrollHeight;
}

function print(txt) {
    terminalTexto += txt + "\n";
    renderCursor();
}

function printTable(columns, values) {
    if (!columns || columns.length === 0) {
        print("(sem colunas)");
        return;
    }
    const widths = columns.map((c, i) => {
        let w = String(c).length;
        values.forEach(row => {
            const v = row[i] === null ? "NULL" : String(row[i]);
            if (v.length > w) w = v.length;
        });
        return Math.min(w, 40);
    });
    const sep = "+" + widths.map(w => "-".repeat(w + 2)).join("+") + "+";
    const header = "| " + columns.map((c, i) => String(c).padEnd(widths[i])).join(" | ") + " |";
    print(sep);
    print(header);
    print(sep);
    values.forEach(row => {
        const line = "| " + row.map((v, i) => {
            const s = v === null ? "NULL" : String(v);
            return s.length > widths[i] ? s.slice(0, widths[i] - 1) + "…" : s.padEnd(widths[i]);
        }).join(" | ") + " |";
        print(line);
    });
    print(sep);
    print(`(${values.length} linha(s))`);
}

// ===== SQL.JS INIT =====
let SQL = null;
let db = null;
let dbPronto = false;

async function initDb() {
    try {
        print("Carregando engine SQL (SQLite)…");
        SQL = await initSqlJs({
            locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
        });
        db = new SQL.Database();
        dbPronto = true;
        print("Banco temporário em memória pronto. Use CREATE TABLE, INSERT, SELECT, UPDATE, DELETE etc.");
        print("Os dados duram apenas esta sessão (memória do navegador).");
    } catch (e) {
        print("Erro ao carregar engine SQL: " + e);
    }
}

// ===== EXECUTAR =====
function executar() {
    if (!dbPronto) {
        print("Engine SQL ainda carregando, aguarde…");
        return;
    }
    terminalTexto = "";
    renderCursor();

    const sql = editor.getValue().trim();
    if (!sql) {
        print("(editor vazio)");
        return;
    }

    try {
        const results = db.exec(sql);
        if (!results || results.length === 0) {
            const mod = db.getRowsModified();
            print(`✅ Comando executado com sucesso. Linhas afetadas: ${mod}`);
        } else {
            results.forEach((r, idx) => {
                if (results.length > 1) print(`-- Resultado ${idx + 1} --`);
                printTable(r.columns, r.values);
            });
        }
    } catch (e) {
        print("❌ Erro SQL: " + (e && e.message ? e.message : e));
    }
}

// ===== LIMPAR =====
function limpar() {
    terminalTexto = "";
    renderCursor();
}

// ===== RESETAR BD =====
function resetar() {
    if (!dbPronto) return;
    try { db.close(); } catch (e) {}
    db = new SQL.Database();
    terminalTexto = "";
    renderCursor();
    print("🗑️ Banco temporário resetado. Todas as tabelas/dados foram apagados.");
}

// ===== SALVAR =====
function salvar() {
    let nome = window.prompt("Nome do arquivo:", "consulta.sql");
    if (nome === null) return;
    nome = nome.trim();
    if (!nome) return;
    if (!nome.toLowerCase().endsWith(".sql")) {
        alert("O nome do arquivo deve terminar com .sql");
        return;
    }
    const blob = new Blob([editor.getValue()], { type: "text/sql" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nome;
    link.click();
    URL.revokeObjectURL(link.href);
}

// ===== INIT =====
function refreshEditor() {
    setTimeout(function () { try { editor.refresh(); } catch (e) {} }, 150);
}
window.addEventListener("resize", refreshEditor);
if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", refreshEditor);
}

renderCursor();
initDb();
