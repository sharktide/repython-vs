import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Python Keywords
    const pythonKeywords = [
        'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class',
        'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global',
        'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
        'try', 'while', 'with', 'yield'
    ];

    // Python Built-in Functions
    const pythonFunctions = [
        'abs', 'all', 'any', 'bin', 'bool', 'breakpoint', 'bytearray', 'bytes', 'callable', 'chr',
        'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval',
        'exec', 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash',
        'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'list',
        'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow',
        'print', 'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice',
        'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'
    ];

    // reStructuredPython-Specific Features
    const reStructuredPythonFeatures = [
        'include', 'define', 'metadata', 'section', 'directive', 'index', 'note',
        'warning', 'todo', 'deprecated', 'code-block', 'figure', 'table', 'contents'
    ];

    // reStructuredPython Built-in Decorators
    const availableDecorators = {
        'decorators.timer': ['timer'],
        'decorators.logging': ['logging'],
        'decorators.memoization': ['memoization'],
        'decorators.retry': ['retry'],
        'decorators.access_control': ['access_control'],
        'decorators': ['decorators.timer', 'decorators.logging', 'decorators.memoization', 'decorators.retry', 'decorators.access_control']
    };

    // Detect included decorators using regex for efficiency
    function getActiveDecorators(document: vscode.TextDocument): vscode.CompletionItem[] {
        let text = document.getText();
        let includedModules = Object.keys(availableDecorators).filter(module => new RegExp(`include\\s+'${module}'`).test(text));
        
        return includedModules.flatMap(module =>
            availableDecorators[module].map(d => {
                let item = new vscode.CompletionItem(d, vscode.CompletionItemKind.Function);
                item.documentation = new vscode.MarkdownString(`reStructuredPython built-in decorator: \`${d}\``);
                return item;
            })
        );
    }

    // Register CompletionItemProvider
    let provider = vscode.languages.registerCompletionItemProvider(
        { language: 'restructuredpython' },
        {
            provideCompletionItems(document: vscode.TextDocument) {
                let decorators = getActiveDecorators(document);
                let functions = pythonFunctions.map(f => {
                    let item = new vscode.CompletionItem(f, vscode.CompletionItemKind.Function);
                    item.insertText = f + '()';
                    item.documentation = new vscode.MarkdownString(`Python built-in function: \`${f}()\``);
                    return item;
                });

                let keywords = pythonKeywords.map(k => new vscode.CompletionItem(k, vscode.CompletionItemKind.Keyword));
                let features = reStructuredPythonFeatures.map(r => new vscode.CompletionItem(r, vscode.CompletionItemKind.Keyword));
                
                return [...decorators, ...functions, ...keywords, ...features];
            }
        },
        '@', '.' // Autocomplete triggers on decorators and dot notation
    );

    context.subscriptions.push(provider);
}

export function deactivate() {}
