import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const functionNames = ['print', 'input', 'len', 'str', 'int', 'float', 'bool', 'range'];

    // Register the CompletionItemProvider
    let provider = vscode.languages.registerCompletionItemProvider(
        { language: 'restructuredpython' },
        {
            provideCompletionItems() {
                return functionNames.map(fn => {
                    let item = new vscode.CompletionItem(fn, vscode.CompletionItemKind.Function);
                    item.insertText = fn + '()';
                    item.documentation = new vscode.MarkdownString(`A built-in function: \`${fn}()\``);
                    return item;
                });
            }
        },
        '.' // Trigger completions when typing a dot
    );

    // Add to context subscriptions
    context.subscriptions.push(provider);
}

export function deactivate() {}
