// XSS対策：HTMLエスケープ関数

/**
 * HTMLエスケープ処理
 * 特殊文字をHTMLエンティティに変換して、XSS攻撃を防ぐ
 */
export function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * テキストを安全に表示するための関数
 * Reactでは通常自動的にエスケープされるが、念のため明示的に処理
 */
export function sanitizeText(text: string): string {
  if (!text) return "";
  // HTMLタグを除去（念のため）
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

