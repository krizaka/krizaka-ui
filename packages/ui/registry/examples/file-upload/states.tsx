import { UploadList } from "@krizaka/ui/file-upload";

const noop = () => undefined;

// Each state with the actions it allows: pause while it sends, resume, retry, remove.
export default function FileUploadStates() {
  return (
    <UploadList
      className="max-w-lg"
      items={[
        { id: "a", name: "sunset-timelapse.mp4", size: 1_840_000_000, type: "video/mp4", progress: 0.42, status: "uploading", speed: 12_400_000 },
        { id: "b", name: "behind-the-scenes.mov", size: 620_000_000, type: "video/quicktime", progress: 0.71, status: "paused" },
        { id: "c", name: "interview.mp4", size: 240_000_000, type: "video/mp4", progress: 0.1, status: "error", error: "The connection was lost. Your upload resumes where it stopped." },
        { id: "d", name: "cover.jpg", size: 820_000, type: "image/jpeg", progress: 1, status: "done" },
      ]}
      onPause={noop}
      onResume={noop}
      onRetry={noop}
      onCancel={noop}
      onRemove={noop}
    />
  );
}
