import ts from "typescript";

export function wrapWithTSDoc<T extends ts.Node>(text: string, node: T): T {
  const comment =
    "*\n" +
    text
      .trim()
      .split("\n")
      .map(line => ` * ${line}`)
      .join("\n") +
    "\n ";
  return ts.addSyntheticLeadingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, comment, true);
}

export function insertLeadingBreakMarker<T extends ts.Node>(node: T): T {
  return ts.addSyntheticLeadingComment(node, ts.SyntaxKind.SingleLineCommentTrivia, "%BR%", true);
}
