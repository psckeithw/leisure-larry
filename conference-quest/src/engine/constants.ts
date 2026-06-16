import Phaser from 'phaser';

export const SCENE_PHYSICS = {
  WIDTH: 1280,
  HEIGHT: 720,
  HOTSPOT_PADDING: 24,
  NPC_HITBOX_PADDING: 18,
};

export const COLORS = {
  SCANLINE: 0x120d20,
  BORDER: 0x1d1033,
  TEXT: '#e8d5ff',
  HOTSPOT_FILL: 0x2f1f52,
  HOTSPOT_STROKE: '#502a8f',
  PLAYER_FILL: 0xffb8f0,
  PLAYER_STROKE: '#b0578f',
  NPC_FILL: 0xffdf7f,
  NPC_STROKE: '#b89735',
};

export function producePalette(base: number, strength: number) {
  return Phaser.Display.Color.ValueToColor(base);
}
