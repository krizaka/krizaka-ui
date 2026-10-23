import { Flock } from "@krizaka/ui/flock";
import { TapedPhoto } from "@krizaka/ui/taped-photo";

// The flock's scene as a print taped at two corners — how www.krizaka.com opens its home.
export default function TapedPhotoScene() {
  return (
    <TapedPhoto className="max-w-2xl" caption="Plate I · The flock — five promises">
      <div style={{ background: "linear-gradient(var(--kz-surface-sunken), var(--kz-surface-raised))" }}>
        <Flock
          tone="own"
          ratio={3}
          birds={[
            { bird: "falcon", x: 14, y: 92, size: 13 },
            { bird: "owl", x: 32, y: 92, size: 13 },
            { bird: "duck", x: 50, y: 92, size: 13 },
            { bird: "flamingo", x: 68, y: 92, size: 13 },
            { bird: "pigeon", x: 86, y: 92, size: 13 },
          ]}
        />
      </div>
    </TapedPhoto>
  );
}
