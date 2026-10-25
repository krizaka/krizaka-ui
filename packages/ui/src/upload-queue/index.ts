/** @krizaka/ui/upload-queue — `UploadQueue` (rows: state in words, live progress, result chip, one quiet action), `TaskTray` (the non-blocking container), `QueueStatus`, `tally`. Client. */
export { isWorking, progressOf, QueueStatus, type QueueTally, tally } from "./model";
export { TaskTray, type TaskTrayProps, UploadQueue, type UploadQueueItem, type UploadQueueProps } from "./upload-queue";
