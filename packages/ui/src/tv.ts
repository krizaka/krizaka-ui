import { createTV } from "tailwind-variants";

import { twMergeConfig } from "./cn";

/** `tv` with the preset's utilities known to the merge engine (`twMergeConfig`): what a primitive wearing the material is styled with. */
export const tv = createTV({ twMergeConfig });
