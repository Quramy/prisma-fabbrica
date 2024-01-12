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
  return ts.addSyntheticLeadingComment(
    insertLeadingBreakMarker(node),
    ts.SyntaxKind.MultiLineCommentTrivia,
    comment,
    true,
  );
}

function isNodeArray(x: any): x is ts.NodeArray<any> {
  return Array.isArray(x);
}

export function insertLeadingBreakMarker<T extends ts.Node | ts.NodeArray<any>>(node: T): T {
  if (!isNodeArray(node)) {
    const comments = ts.getSyntheticLeadingComments(node);
    if (comments?.length) return node;
    return ts.addSyntheticLeadingComment(node, ts.SyntaxKind.SingleLineCommentTrivia, "%BR%", true) as T;
  } else {
    return node as T;
  }
}
