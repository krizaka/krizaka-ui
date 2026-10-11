import { CodeBlock, CodeTabs } from "@krizaka/ui/code-block";

const maven = `<parent>
  <groupId>com.krizaka</groupId>
  <artifactId>krizaka-parent</artifactId>
  <version>0.1.0</version>
</parent>`;
const gradle = `dependencies {
  implementation(platform("com.krizaka:krizaka-bom:0.1.0"))
}`;

// The same thing in several build tools: segmented tabs (arrow keys between them) above the samples.
export default function CodeBlockBuildTools() {
  const copy = { copyLabel: "Copy", copiedLabel: "Copied" };
  return (
    <CodeTabs
      className="w-full max-w-xl"
      label="Build tool"
      tabs={[
        { id: "maven", label: "Maven", content: <CodeBlock code={maven} language="xml" file="pom.xml" {...copy} /> },
        { id: "gradle", label: "Gradle", content: <CodeBlock code={gradle} language="kotlin" file="build.gradle.kts" {...copy} /> },
      ]}
    />
  );
}
