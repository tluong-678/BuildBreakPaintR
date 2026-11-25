export type Tool = "build" | "break" | "paint";
export type BlockData = { id: string; x: number; y: number; z: number; color: string };
export type WorldData = { version: 1; blocks: BlockData[] };
