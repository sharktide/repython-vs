//@ts-ignore
import * as vscode from 'vscode';
import { updateDiagnostics, getDeclaredVariables } from './errorChecker'; // Import error checking functions

export function activate(context: vscode.ExtensionContext) {
    const diagnostics = vscode.languages.createDiagnosticCollection('restructuredpython');
    context.subscriptions.push(diagnostics);

    // Variable List (Keeps track of variables declared in the document)
    let declaredVariables: Set<string> = new Set();

    // Register CompletionItemProvider
    let provider = vscode.languages.registerCompletionItemProvider(
        { language: 'restructuredpython' },
        {
            provideCompletionItems(document: vscode.TextDocument) {
                // Refresh the list of declared variables each time the document changes
                declaredVariables = getDeclaredVariables(document);

                const pythonKeywords = [
                    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class',
                    'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global',
                    'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
                    'try', 'while', 'with', 'yield'
                ];

                const pythonFunctions = [
                    'abs', 'all', 'any', 'bin', 'bool', 'breakpoint', 'bytearray', 'bytes', 'callable', 'chr',
                    'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval',
                    'exec', 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash',
                    'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'list',
                    'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow',
                    'print', 'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice',
                    'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'
                ];

                const reStructuredPythonFeatures = [
                    'include', 'define', 'metadata', 'section', 'directive', 'index', 'note',
                    'warning', 'todo', 'deprecated', 'code-block', 'figure', 'table', 'contents'
                ];

                const availableDecorators = {
                    'decorators.timer': ['timer'],
                    'decorators.logging': ['logging'],
                    'decorators.memoization': ['memoization'],
                    'decorators.retry': ['retry'],
                    'decorators.access_control': ['access_control'],
                    'decorators': ['decorators.timer', 'decorators.logging', 'decorators.memoization', 'decorators.retry', 'decorators.access_control']
                };

                // Get active decorators (simplified version)
                const decorators = Object.values(availableDecorators).flat().map(d => {
                    let item = new vscode.CompletionItem(d, vscode.CompletionItemKind.Function);
                    item.documentation = new vscode.MarkdownString(`reStructuredPython built-in decorator: \`${d}\``);
                    return item;
                });

                // Provide function, keyword, feature, and variable completions
                const functions = pythonFunctions.map(f => {
                    let item = new vscode.CompletionItem(f, vscode.CompletionItemKind.Function);
                    item.insertText = f + '()';
                    item.documentation = new vscode.MarkdownString(`Python built-in function: \`${f}()\``);
                    return item;
                });

                const keywords = pythonKeywords.map(k => new vscode.CompletionItem(k, vscode.CompletionItemKind.Keyword));
                const features = reStructuredPythonFeatures.map(r => new vscode.CompletionItem(r, vscode.CompletionItemKind.Keyword));

                const variableCompletions = Array.from(declaredVariables).map(variable => {
                    let item = new vscode.CompletionItem(variable, vscode.CompletionItemKind.Variable);
                    item.documentation = new vscode.MarkdownString(`Variable: \`${variable}\``);
                    return item;
                });

                return [...decorators, ...functions, ...keywords, ...features, ...variableCompletions];
            }
        },
        '@', '.' // Autocomplete triggers on decorators and dot notation
    );

    context.subscriptions.push(provider);

    // Register diagnostics checker
    vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'restructuredpython') {
            // Update diagnostics every time the document changes
            updateDiagnostics(event.document, declaredVariables, diagnostics);
        }
    });

    vscode.workspace.onDidOpenTextDocument(doc => {
        if (doc.languageId === 'restructuredpython') {
            // Initial diagnostics check when document is opened
            updateDiagnostics(doc, declaredVariables, diagnostics);
        }
    });
}

export function deactivate() {}
