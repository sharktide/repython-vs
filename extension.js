"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
//@ts-ignore
var vscode = require("vscode");
var errorChecker_1 = require("./errorChecker"); // Import error checking functions
function activate(context) {
    var diagnostics = vscode.languages.createDiagnosticCollection('restructuredpython');
    context.subscriptions.push(diagnostics);
    // Variable List (Keeps track of variables declared in the document)
    var declaredVariables = new Set();
    // Register CompletionItemProvider
    var provider = vscode.languages.registerCompletionItemProvider({ language: 'restructuredpython' }, {
        provideCompletionItems: function (document) {
            // Refresh the list of declared variables each time the document changes
            declaredVariables = (0, errorChecker_1.getDeclaredVariables)(document);
            var pythonKeywords = [
                'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class',
                'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global',
                'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
                'try', 'while', 'with', 'yield'
            ];
            var pythonFunctions = [
                'abs', 'all', 'any', 'bin', 'bool', 'breakpoint', 'bytearray', 'bytes', 'callable', 'chr',
                'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval',
                'exec', 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash',
                'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'list',
                'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow',
                'print', 'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice',
                'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'
            ];
            var reStructuredPythonFeatures = [
                'include', 'define', 'metadata', 'section', 'directive', 'index', 'note',
                'warning', 'todo', 'deprecated', 'code-block', 'figure', 'table', 'contents'
            ];
            var availableDecorators = {
                'decorators.timer': ['timer'],
                'decorators.logging': ['logging'],
                'decorators.memoization': ['memoization'],
                'decorators.retry': ['retry'],
                'decorators.access_control': ['access_control'],
                'decorators': ['decorators.timer', 'decorators.logging', 'decorators.memoization', 'decorators.retry', 'decorators.access_control']
            };
            // Get active decorators (simplified version)
            var decorators = Object.values(availableDecorators).flat().map(function (d) {
                var item = new vscode.CompletionItem(d, vscode.CompletionItemKind.Function);
                item.documentation = new vscode.MarkdownString("reStructuredPython built-in decorator: `".concat(d, "`"));
                return item;
            });
            // Provide function, keyword, feature, and variable completions
            var functions = pythonFunctions.map(function (f) {
                var item = new vscode.CompletionItem(f, vscode.CompletionItemKind.Function);
                item.insertText = f + '()';
                item.documentation = new vscode.MarkdownString("Python built-in function: `".concat(f, "()`"));
                return item;
            });
            var keywords = pythonKeywords.map(function (k) { return new vscode.CompletionItem(k, vscode.CompletionItemKind.Keyword); });
            var features = reStructuredPythonFeatures.map(function (r) { return new vscode.CompletionItem(r, vscode.CompletionItemKind.Keyword); });
            var variableCompletions = Array.from(declaredVariables).map(function (variable) {
                var item = new vscode.CompletionItem(variable, vscode.CompletionItemKind.Variable);
                item.documentation = new vscode.MarkdownString("Variable: `".concat(variable, "`"));
                return item;
            });
            return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], decorators, true), functions, true), keywords, true), features, true), variableCompletions, true);
        }
    }, '@', '.' // Autocomplete triggers on decorators and dot notation
    );
    context.subscriptions.push(provider);
    // Register diagnostics checker
    vscode.workspace.onDidChangeTextDocument(function (event) {
        if (event.document.languageId === 'restructuredpython') {
            // Update diagnostics every time the document changes
            (0, errorChecker_1.updateDiagnostics)(event.document, declaredVariables, diagnostics);
        }
    });
    vscode.workspace.onDidOpenTextDocument(function (doc) {
        if (doc.languageId === 'restructuredpython') {
            // Initial diagnostics check when document is opened
            (0, errorChecker_1.updateDiagnostics)(doc, declaredVariables, diagnostics);
        }
    });
}
function deactivate() { }
