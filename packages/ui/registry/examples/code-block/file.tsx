import { CodeBlock } from "@krizaka/ui/code-block";

const code = `spring:
  application:
    name: billing # one name, used by logs and traces
krizaka:
  messaging:
    dead-letter: true`;

// A sample in its file: the language, the file name, a copy button that says it copied. Long lines scroll sideways.
export default function CodeBlockFile() {
  return <CodeBlock className="w-full max-w-xl" code={code} language="yaml" file="application.yml" copyLabel="Copy" copiedLabel="Copied" />;
}
