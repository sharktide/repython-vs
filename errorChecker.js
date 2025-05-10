"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDiagnostics = updateDiagnostics;
exports.getDeclaredVariables = getDeclaredVariables;
//@ts-ignore
var vscode = require("vscode");
// Function to update diagnostics for the document
function updateDiagnostics(doc, declaredVariables, collection) {
    var diagnostics = [];
    var text = doc.getText();
    var lines = text.split(/\r?\n/);
    lines.forEach(function (line, i) {
        var lineText = line.trim();
        // 1. Detect invalid `;;` at end of line (example)
        if (lineText.endsWith(';')) {
            var range = new vscode.Range(i, line.length - 2, i, line.length);
            diagnostics.push(new vscode.Diagnostic(range, "Unexpected ';' at end of line", vscode.DiagnosticSeverity.Error));
        }
    });
    collection.set(doc.uri, diagnostics);
}
// Function to detect and collect declared variables in the document
function getDeclaredVariables(document) {
    var declaredVariables = new Set();
    var text = document.getText();
    // Regular expression to match variable declarations (e.g., `x = 10`, `my_var = "hello"`)
    var varRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
    var match;
    while ((match = varRegex.exec(text)) !== null) {
        // Add variable names to the set (Set automatically avoids duplicates)
        declaredVariables.add(match[1]);
    }
    return declaredVariables;
}
