import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Python keywords
    const pythonKeywords = [
        'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
        'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
        'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
        'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
    ];

    // Python built-in functions
    const pythonFunctions = [
        'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'breakpoint', 'bytearray', 'bytes',
        'callable', 'chr', 'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir',
        'divmod', 'enumerate', 'eval', 'exec', 'filter', 'float', 'format', 'frozenset',
        'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'include', 'input', 'int',
        'isinstance', 'issubclass', 'iter', 'len', 'list', 'locals', 'map', 'max', 'memoryview',
        'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'range',
        'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod',
        'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'
    ];

    // Merge keywords and functions into completion items
    const completionItems = [...pythonKeywords, ...pythonFunctions].map(token => {
        let item = new vscode.CompletionItem(token);
        item.kind = pythonKeywords.includes(token) ? vscode.CompletionItemKind.Keyword : vscode.CompletionItemKind.Function;
        item.insertText = pythonFunctions.includes(token) ? `${token}()` : token;
        item.documentation = new vscode.MarkdownString(`Python ${pythonKeywords.includes(token) ? "keyword" : "built-in function"}: \`${token}\``);
        return item;
    });

    // Register the provider
    let provider = vscode.languages.registerCompletionItemProvider(
        { language: 'restructuredpython' },
        {
            provideCompletionItems() {
                return completionItems;
            }
        },
        '.' // Trigger completions when typing a dot
    );

    context.subscriptions.push(provider);
}

export function deactivate() {}
