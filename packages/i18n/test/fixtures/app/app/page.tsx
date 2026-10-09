export const metadata = { title: "Crawler title", description: "Crawler description" };
export async function generateMetadata() {
  return { title: "Dynamic crawler title" };
}
export default function Page() {
  return <main>{items.map((i) => <p key={i}>{i}</p>)}</main>;
}
