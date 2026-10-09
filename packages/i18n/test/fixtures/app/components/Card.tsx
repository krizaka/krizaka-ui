export function Card({ ok, name }: { ok: boolean; name: string }) {
  const [, setError] = useState("");
  setError("Something went wrong");
  setError(ok ? "Saved" : `Failed for ${name}`);
  setError(name);
  if (!ok) alert("Are you sure?");
  window.confirm(name);
  const items = [{ label: "Open the vault" }, { label: "OK" }, { id: "plain value" }];
  return (
    <section title="Card title" aria-label={name} className="text only words">
      Hello world
      <Acme />
      {ok && "Shown when ok"}
      {name ?? "Anonymous person"}
      {name || ("Fallback text")}
      {ok ? name : "Nothing here"}
      {`Template ${name} text`}
      {`${name}`}
      {1 + 2}
      <img alt="Picture of the team" src="/x.png" />
      <input placeholder={ok ? "Type here" : name} title="OK" />
      Acme Krizaka
      {/* i18n-ignore */}
      Ignored words
      <b>Also ignored</b>{/* i18n-ignore */}
    </section>
  );
}
