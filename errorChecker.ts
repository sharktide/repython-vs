//@ts-ignore
import * as vscode from 'vscode';

// Function to update diagnostics for the document
export function updateDiagnostics(doc: vscode.TextDocument, declaredVariables: Set<string>, collection: vscode.DiagnosticCollection): void {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = doc.getText();
    const lines = text.split(/\r?\n/);

    lines.forEach((line, i) => {
        const lineText = line.trim();

        // 1. Detect invalid `;;` at end of line (example)
        if (lineText.endsWith(';')) {
            const range = new vscode.Range(i, line.length - 2, i, line.length);
            diagnostics.push(new vscode.Diagnostic(range, "Unexpected ';' at end of line", vscode.DiagnosticSeverity.Error));
        }
    });

    collection.set(doc.uri, diagnostics);
}

// Function to detect and collect declared variables in the document
export function getDeclaredVariables(document: vscode.TextDocument): Set<string> {
    const declaredVariables = new Set<string>();
    const text = document.getText();
    
    // Regular expression to match variable declarations (e.g., `x = 10`, `my_var = "hello"`)
    const varRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
    let match;
    
    while ((match = varRegex.exec(text)) !== null) {
        // Add variable names to the set (Set automatically avoids duplicates)
        declaredVariables.add(match[1]);
    }

    return declaredVariables;
}
