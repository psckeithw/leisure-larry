import type { ItemId, QuestId, DialogueNodeId, NpcId, SceneId } from '../types/game';

export type { ItemId, QuestId, DialogueNodeId, NpcId, SceneId };

export interface Item {
  id: ItemId;
  name: string;
  description: string;
  icon: string;
  combinable?: { with: ItemId[]; result: ItemId; description: string };
  usableOn?: { target: string; result: string; removeItem?: boolean; giveItem?: ItemId };
  consumable?: boolean;
  keyItem?: boolean;
}

export interface QuestObjective {
  id: string;
  description: string;
  completed?: boolean;
  hidden?: boolean;
}

export interface Quest {
  id: QuestId;
  title: string;
  description: string;
  objectives: QuestObjective[];
  completed?: boolean;
  rewardReputation?: number;
  rewardItems?: ItemId[];
  triggersQuest?: QuestId;
  onComplete?: string;
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextNode: DialogueNodeId | 'end';
  condition?: (state: GameState) => boolean;
  effect?: (state: GameState) => void;
  reputation?: number;
}

export interface DialogueNode {
  id: DialogueNodeId;
  speaker: NpcId | 'player' | 'system';
  text: string;
  choices: DialogueChoice[];
  onEnter?: (state: GameState) => void;
}

export interface DialogueTree {
  npcId: NpcId;
  greeting: DialogueNodeId;
  nodes: Record<DialogueNodeId, DialogueNode>;
}

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  targetScene?: SceneId;
  targetSpawn?: string;
  action?: string;
  requiredItem?: ItemId;
  requiredQuest?: { questId: QuestId; objectiveIndex: number };
  lockedMessage?: string;
}

export interface Scene {
  id: SceneId;
  name: string;
  description: string;
  background: string;
  width: number;
  height: number;
  hotspots: Hotspot[];
  npcs: NpcId[];
  music?: string;
  ambientSound?: string;
  onEnter?: string;
}

export interface Npc {
  id: NpcId;
  name: string;
  subtitle?: string;
  color: string;
  scene: SceneId;
  position: { x: number; y: number };
  sprite: string;
}

export interface GameState {
  currentScene: SceneId;
  visitedScenes: SceneId[];
  inventory: ItemId[];
  selectedItem: ItemId | null;
  reputation: number;
  quests: Record<QuestId, Quest>;
  dialogueHistory: Record<NpcId, DialogueNodeId[]>;
  flags: Record<string, boolean | number | string>;
  playTime: number;
  ending: string | null;
  settings: GameSettings;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  textSpeed: number;
  volume: number;
}

export interface HotspotResult {
  id: string;
  success: boolean;
  message: string;
  itemsGiven?: string[];
  questsCompleted?: string[];
  sceneChanged?: string;
}

export interface DialogueEngineResult extends HotspotResult {
  currentNodeId?: string;
  speaker?: string;
  text?: string;
  canAdvance?: boolean;
  choices?: { id: string; text: string; nextNode: string }[];
}

export interface RendererLayer {
  id: string;
  render(offscreen: OffscreenCanvas | HTMLCanvasElement, renderer: any, state: GameState, computed: any): void;
}

export const STORAGE_KEY = 'conference-quest-save';

export const ITEMS: Item[] = [
  { id: 'conference-badge', name: 'Conference Badge', description: 'Official conference badge. Access to all general sessions and expo areas.', icon: 'badge.png', keyItem: true },
  { id: 'lost-badge', name: 'Lost Badge', description: 'A stray conference badge found near the parking garage.', icon: 'badge.png', keyItem: true },
  { id: 'laptop', name: 'Laptop', description: 'Your trusty development laptop. Battery at 23%.', icon: 'laptop.png', keyItem: true },
  { id: 'usb-drive', name: 'USB Drive', description: 'A standard USB 3.0 flash drive. 64GB, mostly empty.', icon: 'usb.png', keyItem: true },
  { id: 'mystery-flash-drive', name: 'Mystery Flash Drive', description: 'Unlabeled flash drive found near registration. Smells faintly of ocean.', icon: 'usb-red.png', keyItem: true },
  { id: 'power-bank', name: 'Power Bank', description: 'A 20000mAh battery pack.', icon: 'battery.png' },
  { id: 'vendor-coupon', name: 'Vendor Coupon', description: 'Free t-shirt coupon from CloudNine Systems. Sizes: M only.', icon: 'coupon.png' },
  { id: 'lost-keycard', name: 'Lost Keycard', description: 'A keycard to the VIP Rooftop Lounge.', icon: 'keycard.png', keyItem: true },
  { id: 'presentation-clicker', name: 'Presentation Clicker', description: 'Wireless presenter with laser pointer.', icon: 'clicker.png' },
  { id: 'coffee-voucher', name: 'Coffee Voucher', description: 'Free drink at the conference coffee bar. Expires at 5pm.', icon: 'coffee.png' },
  { id: 'speaker-pass', name: 'Speaker Pass', description: 'Official Speaker Pass. Backstage access.', icon: 'pass.png', keyItem: true },
  { id: 'napkins', name: 'Napkins', description: 'Napkins from the coffee bar. Good for emergency keyboard cleaning.', icon: 'napkins.png' },
  { id: 'badge-template', name: 'Badge Template', description: 'A blank badge template from Registration.', icon: 'badge-template.png' },
  { id: 'presentation-data', name: 'Presentation Data', description: 'The recovered keynote slides.', icon: 'data.png', keyItem: true },
  { id: 'startup-offer', name: 'Startup Offer', description: 'Formal job offer from QuantumByte.', icon: 'offer.png', keyItem: true },
];

export const QUESTS: Quest[] = [
  {
    id: 'main-quest',
    title: 'The Road to Keynote',
    description: 'Become the surprise keynote speaker before the conference ends.',
    objectives: [
      { id: 'get-badge', description: 'Recover your lost conference badge' },
      { id: 'earn-rep', description: 'Earn reputation with conference attendees' },
      { id: 'recover-slides', description: 'Discover why keynote slides disappeared' },
      { id: 'deliver-keynote', description: 'Earn speaker credentials and deliver the keynote' },
    ],
    completed: false,
    rewardReputation: 50,
  },
  {
    id: 'badge-quest',
    title: 'Lost and Found',
    description: "Someone found your badge. Track it down.",
    objectives: [
      { id: 'talk-registration', description: 'Ask the Registration Manager about your badge' },
      { id: 'find-badge', description: 'Retrieve your badge from the grabber machine in Expo Hall' },
    ],
    completed: false,
    rewardItems: ['conference-badge'],
    rewardReputation: 5,
    triggersQuest: 'main-quest',
  },
  {
    id: 'vendor-quest',
    title: 'Demo Day Rescue',
    description: "A vendor's demo is broken. Help them save face.",
    objectives: [
      { id: 'visit-vendor', description: 'Visit Vendor Row and talk to the Vendor Rep' },
      { id: 'get-usb', description: 'Get the deployment USB from IT in Coffee Bar or Server Room' },
      { id: 'fix-demo', description: 'Return the USB and fix the demo' },
    ],
    completed: false,
    rewardItems: ['vendor-coupon'],
    rewardReputation: 15,
  },
  {
    id: 'slide-quest',
    title: 'Mystery of the Missing Slides',
    description: 'The keynote slides vanished. Find out what happened.',
    objectives: [
      { id: 'ask-organizer', description: 'Ask the Conference Organizer about the missing slides' },
      { id: 'find-courier', description: 'Locate the VIP courier and recover the presentation data' },
    ],
    completed: false,
    rewardItems: ['presentation-data'],
    rewardReputation: 25,
  },
  {
    id: 'rooftop-quest',
    title: 'VIP Access',
    description: 'You need the Speaker Pass and a VIP invite to access the private keynote suite.',
    objectives: [
      { id: 'get-keycard', description: 'Find the lost VIP keycard' },
      { id: 'get-pass', description: 'Earn the Speaker Pass from the conference organizer' },
      { id: 'reach-rooftop', description: 'Reach the Rooftop Lounge VIP event' },
    ],
    completed: false,
    rewardItems: ['speaker-pass'],
    rewardReputation: 20,
  },
  {
    id: 'keynote-quest',
    title: 'The Main Event',
    description: "You're ready. Deliver the keynote and blow everyone away.",
    objectives: [
      { id: 'deliver', description: 'Deliver the keynote speech' },
    ],
    completed: false,
    rewardItems: ['presentation-clicker'],
    rewardReputation: 30,
  },
  {
    id: 'startup-quest',
    title: 'Headhunted',
    description: "A startup founder is impressed with your problem-solving skills.",
    objectives: [
      { id: 'meet-founder', description: 'Talk to the Startup Founder at Vendor Row' },
      { id: 'impress-founder', description: 'Complete at least two quests before accepting their offer' },
    ],
    completed: false,
    rewardItems: ['startup-offer'],
    rewardReputation: 10,
  },
  {
    id: 'wifi-quest',
    title: 'The Accidental Sysadmin',
    description: 'Reboot the conference server in the Server Room. Or don\'t.',
    objectives: [
      { id: 'fix-server', description: "Investigate the server rack in the Server Room" },
    ],
    completed: false,
    rewardItems: ['presentation-clicker'],
    rewardReputation: -20,
  },
];

export const SCENES: Scene[] = [
  {
    id: 'hotel-lobby',
    name: 'Hotel Lobby',
    description: 'A sprawling marble lobby with a glittering chandelier.',
    background: 'hotel-lobby.png',
    width: 1280,
    height: 720,
    hotspots: [
      { id: 'to-casino', x: 120, y: 400, width: 200, height: 250, label: 'Exit to Casino Floor', targetScene: 'casino-floor', targetSpawn: 'from-lobby' },
      { id: 'to-registration', x: 500, y: 500, width: 280, height: 150, label: 'Conference Registration Desk', targetScene: 'registration-desk', targetSpawn: 'from-lobby' },
      { id: 'lost-badge-hotspot', x: 900, y: 300, width: 300, height: 250, label: 'Look behind the couch', action: 'search-badge', lockedMessage: 'Waste of time. Nothing here.' },
    ],
    npcs: ['registration-manager', 'influencer'],
  },
  {
    id: 'registration-desk',
    name: 'Registration Desk',
    description: 'Rows of computers and volunteers flying name badges.',
    background: 'registration.png',
    width: 1280,
    height: 720,
    hotspots: [
      { id: 'to-lobby', x: 0, y: 300, width: 200, height: 400, label: 'Return to Hotel Lobby', targetScene: 'hotel-lobby', targetSpawn: 'from-registration' },
      { id: 'to-expo', x: 1100, y: 300, width: 180, height: 400, label: 'Enter Expo Hall', targetScene: 'expo-hall', targetSpawn: 'from-registration' },
      { id: 'search-desk', x: 500, y: 350, width: 300, height: 250, label: 'Search the desk for your badge', action: 'search-badge-desk', lockedMessage: 'Desk is locked. Manager holds the spare badges.' },
    ],
    npcs: ['registration-manager'],
  },
  {
    id: 'expo-hall',
    name: 'Expo Hall',
    description: 'Hundreds of booths stretching into the distance.',
    background: 'expo.png',
    width: 1280,
    height: 720,
    hotspots: [
      { id: 'to-registration', x: 0, y: 300, width: 200, height: 400, label: 'Exit to Registration', targetScene: 'registration-desk', targetSpawn: 'from-expo' },
      { id: 'to-vendor', x: 300, y: 550, width: 200, height: 170, label: 'Enter Vendor Row', targetScene: 'vendor-row', targetSpawn: 'from-expo' },
      { id: 'to-coffee', x: 1100, y: 400, width: 180, height: 300, label: 'Head to Coffee Bar', targetScene: 'coffee-bar', targetSpawn: 'from-expo' },
      { id: 'grabber-machine', x: 400, y: 200, width: 300, height: 250, label: 'Claw machine (contains a badge?)', action: 'use-grabber', lockedMessage: 'Requires patience. Probably more patience than you have.' },
    ],
    npcs: ['vendor-representative'],
  },
  {
    id: 'vendor-row',
    name: 'Vendor Row',
    description: 'The startup alley. T-shirts, stickers, and suspicious pitches.',
    background: 'vendor.png',
    width: 1280,
    height: 720,
    hotspots: [
      { id: 'to-expo', x: 0, y: 300, width: 200, height: 400, label: 'Return to Expo Hall', targetScene: 'expo-hall', targetSpawn: 'from-vendor' },
      { id: 'vendor-booth', x: 400, y: 350, width: 500, height: 300, label: 'Talk to Vendor Representative', action: 'talk-vendor' },
      { id: 'founder-pitch', x: 150, y: 350, width: 200, height: 300, label: 'Pitch from QuantumByte founder', action: 'talk-founder' },
    ],
    npcs: ['vendor-representative', 'startup-founder'],
  },
  {
    id: 'coffee-bar',
    name: 'Coffee Bar',
    description: 'A brightly lit caffeine station.',
    background: 'coffee.png',
    width: 1280,
    height: 720,
    hotspots: [
      { id: 'to-expo', x: 0, y: 300, width: 200, height: 400, label: 'Return to Expo Hall', targetScene: 'expo-hall', targetSpawn: 'from-coffee' },
      { id: 'to-theater', x: 1000, y: 350, width: 250, height: 350, label: 'Enter Conference Theater', targetScene: 'conference-theater', targetSpawn: 'from-coffee' },
      { id: 'coffee-counter', x: 450, y: 400, width: 400, height: 250, label: 'Order a drink', action: 'coffee-bar-action' },
    ],
    npcs: ['it-technician'],
  },
  {
    id: 'conference-theater',
    name: 'Conference Theater',
    description: 'A massive auditorium with a massive screen.',
    background: 'theater.png',
    width: 1280,
    height: 720,
    hotspots: [
      { id: 'to-coffee', x: 0, y: 300, width: 200, height: 400, label: 'Return to Coffee Bar', targetScene: 'coffee-bar', targetSpawn: 'from-theater' },
      { id: 'to-server', x: 1000, y: 350, width: 250, height: 350, label: 'Server Room (Staff Only)', targetScene: 'server-room', targetSpawn: 'from-theater', requiredItem: 'speaker-pass', lockedMessage: 'Staff only. You need the Speaker Pass.' },
      { id: 'stage', x: 500, y: 100, width: 300, height: 200, label: 'The main stage', action: 'inspect-stage' },
    ],
    npcs: ['conference-organizer'],
  },
  {
    id: 'rooftop-lounge',
    name: 'Rooftop Lounge',
    description: 'A sleek bar overlooking the Vegas skyline.',
    background: 'rooftop.png',
    width: 1280,
    height: 720,
    hotspots: [
      { id: 'to-elevator', x: 0, y: 300, width: 200, height: 400, label: 'Take elevator down to Casino Floor', targetScene: 'casino-floor', targetSpawn: 'from-rooftop' },
      { id: 'to-vip', x: 1000, y: 350, width: 250, height: 350, label: 'Enter VIP Private Event', targetScene: 'vip-event', targetSpawn: 'from-rooftop', requiredItem: 'lost-keycard', lockedMessage: 'VIP Only. Find the keycard first.' },
      { id: 'rooftop-bar', x: 500, y: 350, width: 300, height: 300, label: 'Rooftop bar', action: 'rooftop-bar-action' },
    ],
    npcs: ['bartender'],
  },
  {
    id: 'casino-floor',
    name: 'Casino Floor',
    description: 'Slot machines, card tables, and distant regret.',
    background: 'casino.png',
    width: 1280,
    height: 720,
    hotspots: [
      { id: 'to-lobby', x: 600, y: 0, width: 200, height: 250, label: 'Return to Hotel Lobby', targetScene: 'hotel-lobby', targetSpawn: 'from-casino' },
      { id: 'to-rooftop', x: 1200, y: 300, width: 80, height: 400, label: 'Elevator to Rooftop Lounge', targetScene: 'rooftop-lounge', targetSpawn: 'from-casino' },
      { id: 'casino-machine', x: 200, y: 300, width: 300, height: 300, label: 'Slot machine', action: 'slot-machine' },
    ],
    npcs: ['security-guard'],
  },
  {
    id: 'server-room',
    name: 'Server Room',
    description: 'Blinking lights, humming racks, and ozone.',
    background: 'server.png',
    width: 1280,
    height: 720,
    hotspots: [
      { id: 'to-theater', x: 0, y: 300, width: 200, height: 400, label: 'Exit to Conference Theater', targetScene: 'conference-theater', targetSpawn: 'from-server' },
      { id: 'server-rack', x: 450, y: 300, width: 400, height: 300, label: 'Conference main server', action: 'server-rack-action' },
    ],
    npcs: ['it-technician'],
  },
  {
    id: 'vip-event',
    name: 'VIP Private Event',
    description: 'An exclusive gathering for sponsors and speakers.',
    background: 'vip.png',
    width: 1280,
    height: 720,
    hotspots: [
      { id: 'to-rooftop', x: 0, y: 300, width: 200, height: 400, label: 'Return to Rooftop Lounge', targetScene: 'rooftop-lounge', targetSpawn: 'from-vip' },
      { id: 'vip-bar', x: 400, y: 300, width: 300, height: 300, label: 'VIP bar', action: 'vip-bar-action' },
      { id: 'vip-speaker', x: 800, y: 200, width: 350, height: 350, label: 'Keynote Speaker', action: 'talk-vip-speaker' },
    ],
    npcs: ['keynote-speaker'],
  },
  {
    id: 'demo-room',
    name: 'Demo Room',
    description: 'A small enclosed space for running live demos.',
    background: 'demo.png',
    width: 1280,
    height: 720,
    hotspots: [
      { id: 'to-vendor', x: 0, y: 300, width: 200, height: 400, label: 'Return to Vendor Row', targetScene: 'vendor-row', targetSpawn: 'from-demo' },
      { id: 'demo-kiosk', x: 500, y: 350, width: 300, height: 200, label: 'Demo kiosk', action: 'demo-kiosk-action' },
    ],
    npcs: ['vendor-representative'],
  },
];
export const scenes = SCENES;

export const NPCS: Npc[] = [
  { id: 'registration-manager', name: 'Marlene', subtitle: 'Registration Manager', color: '#4a90d9', scene: 'hotel-lobby', position: { x: 0.6, y: 0.65 }, sprite: 'marlene.png' },
  { id: 'vendor-representative', name: 'Chip', subtitle: 'CloudNine Systems', color: '#6c5ce7', scene: 'vendor-row', position: { x: 0.55, y: 0.6 }, sprite: 'chip.png' },
  { id: 'security-guard', name: 'Officer Dan', subtitle: 'Conference Security', color: '#2d3436', scene: 'casino-floor', position: { x: 0.75, y: 0.6 }, sprite: 'dan.png' },
  { id: 'startup-founder', name: 'Priya', subtitle: 'QuantumByte Founder', color: '#e17055', scene: 'vendor-row', position: { x: 0.25, y: 0.6 }, sprite: 'priya.png' },
  { id: 'conference-organizer', name: 'Derek', subtitle: 'Conference Organizer', color: '#d63031', scene: 'conference-theater', position: { x: 0.55, y: 0.6 }, sprite: 'derek.png' },
  { id: 'it-technician', name: 'Zane', subtitle: 'IT Technician', color: '#00b894', scene: 'server-room', position: { x: 0.5, y: 0.55 }, sprite: 'zane.png' },
  { id: 'keynote-speaker', name: 'Dr. Alex Mercer', subtitle: 'Keynote Speaker (MIA)', color: '#6c5ce7', scene: 'vip-event', position: { x: 0.8, y: 0.55 }, sprite: 'mercer.png' },
  { id: 'bartender', name: 'Marcus', subtitle: 'Rooftop Bartender', color: '#e17055', scene: 'rooftop-lounge', position: { x: 0.45, y: 0.58 }, sprite: 'marcus.png' },
  { id: 'influencer', name: 'Kyler', subtitle: 'Tech Influencer', color: '#fdcb6e', scene: 'hotel-lobby', position: { x: 0.3, y: 0.6 }, sprite: 'kyler.png' },
];

export const DIALOGUES: DialogueTree[] = [
  {
    npcId: 'registration-manager',
    greeting: 'rm-greeting',
    nodes: {
      'rm-greeting': {
        id: 'rm-greeting',
        speaker: 'registration-manager',
        text: 'Welcome to DevConnect 2026! I\'m Marlene, Registration Manager. Are you lost, or are you actually supposed to be here?',
        choices: [
          { id: 'c1', text: 'I lost my badge. Can you reprint it?', nextNode: 'rm-badge' },
          { id: 'c2', text: 'Just browsing. Which talks are good?', nextNode: 'rm-talks' },
          { id: 'c3', text: 'Right, I should be around. Thanks!', nextNode: 'end' },
        ],
      },
      'rm-badge': {
        id: 'rm-badge',
        speaker: 'registration-manager',
        text: "We got a report of a badge found in the Expo Hall near the grabber machine. Want me to send Security? Or would you rather... retrieve it yourself?",
        choices: [
          { id: 'c1', text: "I'll go get it myself. Thanks!", nextNode: 'rm-badge-go', effect: (s: GameState) => { if(!s.quests['badge-quest']) s.quests['badge-quest'] = { id: 'badge-quest', title: 'Lost and Found', description: "Someone found your badge. Track it down.", objectives: [{ id: 'talk-registration', description: "Ask the Registration Manager about your badge", completed: true }, { id: 'find-badge', description: 'Retrieve your badge' }], completed: false }; } },
          { id: 'c2', text: "Send Security, I'm too important to run errands.", nextNode: 'rm-badge-sec', reputation: -5 },
          { id: 'c3', text: 'Never mind, I\'ll figure it out.', nextNode: 'end' },
        ],
      },
      'rm-badge-go': {
        id: 'rm-badge-go',
        speaker: 'registration-manager',
        text: "Great. Also, your talk proposal was borderline. Maybe try networking more?",
        choices: [
          { id: 'c1', text: 'Noted. I\'ll make friends fast.', nextNode: 'end', reputation: 2 },
        ],
      },
      'rm-badge-sec': {
        id: 'rm-badge-sec',
        speaker: 'registration-manager',
        text: "Wow. Alright, I'll note your preference for VIP service. 'Too important' it is. Sorry, j/k, I actually can't do that.",
        choices: [
          { id: 'c1', text: "Just kidding. I'll go get it myself.", nextNode: 'rm-badge-go', effect: (s: GameState) => { if(s.quests['badge-quest']) s.quests['badge-quest'].objectives[0].completed = true; } },
        ],
      },
      'rm-talks': {
        id: 'rm-talks',
        speaker: 'registration-manager',
        text: 'Everything sounds the same this year. "AI-powered blockchain for serverless puppies." The only unique talk got cancelled.',
        choices: [
          { id: 'c1', text: 'Cancelled? What happened?', nextNode: 'rm-cancelled' },
          { id: 'c2', text: 'Thanks, Marlene. You rule.', nextNode: 'end', reputation: 3 },
        ],
      },
      'rm-cancelled': {
        id: 'rm-cancelled',
        speaker: 'registration-manizer',
        text: 'The keynote speaker had a last-minute family emergency. Also, he left a very dramatic note. The organizer is definitely stressed.',
        choices: [
          { id: 'c1', text: 'I can help with that.', nextNode: 'rm-cancelled-interest', reputation: 5 },
          { id: 'c2', text: 'Interesting...', nextNode: 'end' },
        ],
      },
    },
  },
  {
    npcId: 'vendor-representative',
    greeting: 'vr-greeting',
    nodes: {
      'vr-greeting': {
        id: 'vr-greeting',
        speaker: 'vendor-representative',
        text: 'Hi! Welcome to CloudNine Systems! Have you tried our new AI-Powered Cloud Toaster?',
        choices: [
          { id: 'c1', text: 'Looks like your demo is crashing.', nextNode: 'vr-crash' },
          { id: 'c2', text: 'Can I help with anything?', nextNode: 'vr-help' },
          { id: 'c3', text: 'No thanks, just looking.', nextNode: 'end' },
        ],
      },
      'vr-greeting-quest-active': {
        id: 'vr-greeting-quest-active',
        speaker: 'vendor-representative',
        text: 'My demo is STILL broken. The debug console is showing... colors. That\'s bad.',
        choices: [
          { id: 'c1', text: "I'll check it out.", nextNode: 'vr-demo-check', condition: (s: GameState) => s.inventory.includes('usb-drive') },
          { id: 'c2', text: 'Do you have a USB with the fix?', nextNode: 'vr-demo-no-usb' },
        ],
      },
      'vr-help': {
        id: 'vr-help',
        speaker: 'vendor-representative',
        text: "My demo kiosk keeps blue-screening. The IT tech said the deployment USB might be corrupted. Can you grab a replacement from the server room?",
        choices: [
          { id: 'c1', text: "Sure, I'll head to the server room.", nextNode: 'vr-help-accept', effect: (s: GameState) => { if(!s.quests['vendor-quest']) s.quests['vendor-quest'] = { id: 'vendor-quest', title: 'Demo Day Rescue', description: "A vendor's demo is broken.", objectives: [{ id: 'visit-vendor', description: 'Visit Vendor Row', completed: true }, { id: 'get-usb', description: 'Get the deployment USB', completed: false }, { id: 'fix-demo', description: 'Return the USB and fix the demo', completed: false }], completed: false }; } },
          { id: 'c2', text: 'That sounds like a YOU problem.', nextNode: 'end', reputation: -5 },
        ],
      },
      'vr-help-accept': {
        id: 'vr-help-accept',
        speaker: 'vendor-representative',
        text: "You're a lifesaver! The IT tech is usually near the Theater or Coffee bar. If this works, I'll give you our premium swag.",
        choices: [
          { id: 'c1', text: 'A t-shirt? I\'ve never been more motivated.', nextNode: 'end', reputation: 5 },
        ],
      },
      'vr-crash': {
        id: 'vr-crash',
        speaker: 'vendor-representative',
        text: 'Yes! It\'s been crashing since this morning. Every time someone important looks at it, it blue-screens.',
        choices: [
          { id: 'c1', text: 'Do you have a USB with the fix?', nextNode: 'vr-demo-no-usb' },
          { id: 'c2', text: "I'll go talk to IT about it.", nextNode: 'vr-demo-fix', condition: (s: GameState) => s.inventory.includes('usb-drive') },
        ],
      },
      'vr-demo-no-usb': {
        id: 'vr-demo-no-usb',
        speaker: 'vendor-representative',
        text: "I used the original USB as a drink coaster. Don't ask. The IT guy in the server room might have a replacement.",
        choices: [
          { id: 'c1', text: 'I know a guy who might have one.', nextNode: 'end' },
          { id: 'c2', text: 'Let me check the Coffee Bar or Server Room.', nextNode: 'end', effect: (s: GameState) => { if(s.quests['vendor-quest'] && !s.quests['vendor-quest'].objectives[1].completed) s.quests['vendor-quest'].objectives[1].completed = true; } },
        ],
      },
      'vr-demo-fix': {
        id: 'vr-demo-fix',
        speaker: 'vendor-representative',
        text: 'You have a USB? Is it clean? Has it seen action? Okay, let\'s do this. Plug it in.',
        choices: [
          { id: 'c1', text: 'Here goes nothing.', nextNode: 'end', effect: (s: GameState) => { s.inventory = s.inventory.filter(i => i !== 'usb-drive'); if(s.quests['vendor-quest']) { s.quests['vendor-quest'].completed = true; s.quests['vendor-quest'].objectives.forEach(o => o.completed = true); } s.reputation += 15; } },
        ],
      },
    },
  },
  {
    npcId: 'security-guard',
    greeting: 'sg-greeting',
    nodes: {
      'sg-greeting': {
        id: 'sg-greeting',
        speaker: 'security-guard',
        text: 'Good evening. I\'m Officer Dan. This is my conference. Please move along unless you have pressing business.',
        choices: [
          { id: 'c1', text: "I'm looking for the VIP Rooftop Lounge.", nextNode: 'sg-vip', condition: (s: GameState) => s.inventory.includes('lost-keycard') },
          { id: 'c2', text: 'Just lost, sorry.', nextNode: 'end' },
        ],
      },
      'sg-vip': {
        id: 'sg-vip',
        speaker: 'security-guard',
        text: "That keycard is from our previous event. The account's been disabled... but between us? I'll cut you a break.",
        choices: [
          { id: 'c1', text: 'Thanks, Dan. I won\'t tell anyone.', nextNode: 'end', reputation: 3 },
        ],
      },
    },
  },
  {
    npcId: 'startup-founder',
    greeting: 'sf-greeting',
    nodes: {
      'sf-greeting': {
        id: 'sf-greeting',
        speaker: 'startup-founder',
        text: 'Hey! I\'m Priya from QuantumByte. We\'re disrupting the disruption space. You seem like you know things.',
        choices: [
          { id: 'c1', text: "What's QuantumByte do?", nextNode: 'sf-what' },
          { id: 'c2', text: 'Disrupt me harder, baby.', nextNode: 'end', reputation: -3 },
        ],
      },
      'sf-what': {
        id: 'sf-what',
        speaker: 'startup-founder',
        text: "We make AI-powered stress balls for devs. Series A funded, 12 employees, and our CTO is a very good golden retriever named Pixel.",
        choices: [
          { id: 'c1', text: "I'm sold. What do you need?", nextNode: 'sf-need' },
          { id: 'c2', text: 'This sounds insane.', nextNode: 'end', reputation: -5 },
        ],
      },
      'sf-need': {
        id: 'sf-need',
        speaker: 'startup-founder',
        text: "I need someone who can handle pressure. If you help out at least two people around here, I want to make you an offer.",
        choices: [
          { id: 'c1', text: "I'm already busy with quests.", nextNode: 'end', effect: (s: GameState) => { if(!s.quests['startup-quest']) s.quests['startup-quest'] = { id: 'startup-quest', title: 'Headhunted', description: "A startup founder is impressed.", objectives: [{ id: 'meet-founder', description: 'Talk to the Startup Founder', completed: true }, { id: 'impress-founder', description: 'Complete at least two quests', completed: false }], completed: false }; } },
        ],
      },
    },
  },
  {
    npcId: 'conference-organizer',
    greeting: 'co-greeting',
    nodes: {
      'co-greeting': {
        id: 'co-greeting',
        speaker: 'conference-organizer',
        text: "I'm Derek, Conference Organizer. I have not slept in 36 hours and the keynote speaker just bailed on us.",
        choices: [
          { id: 'c1', text: "I can help! What do you need?", nextNode: 'co-help', reputation: 5 },
          { id: 'c2', text: "That's rough. Have you tried coffee?", nextNode: 'co-coffee' },
        ],
      },
      'co-help': {
        id: 'co-help',
        speaker: 'conference-organizer',
        text: 'The speaker\'s USB went missing. Also, the only way to get a Speaker Pass is if... hmm, actually nobody\'s ever asked me this before.',
        choices: [
          { id: 'c1', text: 'I can deliver the keynote.', nextNode: 'co-interested' },
          { id: 'c2', text: "Let me investigate the missing USB.", nextNode: 'co-usb', effect: (s: GameState) => { if(!s.quests['slide-quest']) s.quests['slide-quest'] = { id: 'slide-quest', title: 'Missing Slides', description: 'The keynote slides vanished.', objectives: [{ id: 'ask-organizer', description: 'Ask Organizer', completed: true }, { id: 'find-courier', description: 'Recover presentation data' }], completed: false }; } },
        ],
      },
      'co-coffee': {
        id: 'co-coffee',
        speaker: 'conference-organizer',
        text: "I've consumed enough caffeine to reanimate a Victorian child. But jokes aside, you seem helpful.",
        choices: [
          { id: 'c1', text: "I'm listening. What happened?", nextNode: 'co-help', reputation: 2 },
        ],
      },
      'co-interested': {
        id: 'co-interested',
        speaker: 'conference-organizer',
        text: 'Do at least two good deeds here and prove you\'re not a flake. Then I\'ll consider issuing a Speaker Pass.',
        choices: [
          { id: 'c1', text: 'Challenge accepted.', nextNode: 'end', effect: (s: GameState) => { if(!s.quests['rooftop-quest']) s.quests['rooftop-quest'] = { id: 'rooftop-quest', title: 'VIP Access', description: 'You need the Speaker Pass to prove yourself.', objectives: [{ id: 'get-keycard', description: 'Find the lost VIP keycard', completed: false }, { id: 'get-pass', description: 'Earn Speaker Pass', completed: false }, { id: 'reach-rooftop', description: 'Reach Rooftop Lounge', completed: false }], completed: false }; } },
        ],
      },
      'co-usb': {
        id: 'co-usb',
        speaker: 'conference-organizer',
        text: 'Visit me once you\'ve recovered the data. Check the casino — our courier was last seen there.',
        choices: [
          { id: 'c1', text: "Will do. Let's find this USB.", nextNode: 'end' },
        ],
      },
    },
  },
  {
    npcId: 'it-technician',
    greeting: 'it-greeting',
    nodes: {
      'it-greeting': {
        id: 'it-greeting',
        speaker: 'it-technician',
        text: "Zane, IT. If your laptop is making a noise like a dying bird, I'm not fixing it. But I'm always happy to help.",
        choices: [
          { id: 'c1', text: "The Vendor's demo USB is corrupted. Can you make a new one?", nextNode: 'it-usb', condition: (s: GameState) => s.quests['vendor-quest'] && !s.quests['vendor-quest'].completed },
          { id: 'c2', text: 'Can you tell me about the server room?', nextNode: 'it-server' },
          { id: 'c3', text: 'Do you have a spare USB drive?', nextNode: 'it-spare' },
        ],
      },
      'it-usb': {
        id: 'it-usb',
        speaker: 'it-technician',
        text: "Ah, CloudNine's kiosk again. Classic. I've got fresh deployment media here. Grab one and don't wipe it, I have family photos.",
        choices: [
          { id: 'c1', text: "Thanks! Hope the photos are safe.", nextNode: 'end', effect: (s: GameState) => { if(!s.inventory.includes('usb-drive')) s.inventory.push('usb-drive'); } },
        ],
      },
      'it-usb-has': {
        id: 'it-usb-has',
        speaker: 'it-technician',
        text: 'Looks like you already have one. Smart.',
        choices: [
          { id: 'c1', text: "Foresight is my middle name.", nextNode: 'end', reputation: 2 },
        ],
      },
      'it-server': {
        id: 'it-server',
        speaker: 'it-technician',
        text: "It's just through the Theater. Speaker Pass only. Don't go in there and start rebooting things. Last conference, an attendee accidentally brought down the entire hotel for three hours.",
        choices: [
          { id: 'c1', text: 'Three hours? That\'s impressive.', nextNode: 'end', reputation: 1 },
          { id: 'c2', text: "I'll be careful.", nextNode: 'end' },
        ],
      },
      'it-server-impressed': {
        id: 'it-server-impressed',
        speaker: 'it-technician',
        text: "To this day no one knows what he did. He just kept pressing buttons and laughing. True legend.",
        choices: [
          { id: 'c1', text: 'A man of culture.', nextNode: 'end', reputation: 2 },
        ],
      },
      'it-spare': {
        id: 'it-spare',
        speaker: 'it-technician',
        text: "Of course. I'm a walking USB drive at this point. Here. Don't install anything weird on it.",
        choices: [
          { id: 'c1', text: 'Promises, promises.', nextNode: 'end', effect: (s: GameState) => { if(!s.inventory.includes('usb-drive')) s.inventory.push('usb-drive'); } },
        ],
      },
    },
  },
  {
    npcId: 'keynote-speaker',
    greeting: 'ks-greeting',
    nodes: {
      'ks-greeting': {
        id: 'ks-greeting',
        speaker: 'keynote-speaker',
        text: "Oh. You found me. Look, it's not what you think. I'm not bailing. I'm exploring alternative engagement formats.",
        choices: [
          { id: 'c1', text: 'Your slides went missing. What do you know?', nextNode: 'ks-slides' },
          { id: 'c2', text: "You're a keynote speaker. You have obligations.", nextNode: 'ks-obligations' },
        ],
      },
      'ks-slides': {
        id: 'ks-slides',
        speaker: 'keynote-speaker',
        text: "The USB? I handed it to a courier before I left. Then I came here and... honestly? This talk is terrible. I wrote it in 45 minutes with predictive text. You should give it.",
        choices: [
          { id: 'c1', text: "Give me the courier's info.", nextNode: 'ks-courier' },
          { id: 'c2', text: "You owe them a talk.", nextNode: 'ks-owes' },
        ],
      },
      'ks-obligations': {
        id: 'ks-obligations',
        speaker: 'keynote-speaker',
        text: "You're right. But honestly? You should give it.",
        choices: [
          { id: 'c1', text: "I'll give it IF I can get the slides back.", nextNode: 'ks-slides' },
          { id: 'c2', text: 'No way. You\'re giving the talk.', nextNode: 'end', reputation: -5 },
        ],
      },
      'ks-courier': {
        id: 'ks-courier',
        speaker: 'keynote-speaker',
        text: "Her name is Chloe. She works VIP concierge. She said she'd be near the Casino floor. Tell her I said the slides are at the bar.",
        choices: [
          { id: 'c1', text: "Alright, I'll find her.", nextNode: 'end', effect: (s: GameState) => { s.flags['found-courier-hint'] = true; } },
        ],
      },
      'ks-owes': {
        id: 'ks-owes',
        speaker: 'keynote-speaker',
        text: "Just... take the slides. The USB is at the bar counter. I'll tell Security you're a guest.",
        choices: [
          { id: 'c1', text: 'Deal. You owe me.', nextNode: 'end', effect: (s: GameState) => { s.inventory.push('presentation-data'); s.quests['slide-quest'].completed = true; } },
        ],
      },
    },
  },
  {
    npcId: 'influencer',
    greeting: 'inf-greeting',
    nodes: {
      'inf-greeting': {
        id: 'inf-greeting',
        speaker: 'influencer',
        text: "Oh my GOD. Are you a REAL developer or are you just here for the content? Follow for follow?",
        choices: [
          { id: 'c1', text: "I'm a real developer. I fix things.", nextNode: 'inf-real' },
          { id: 'c2', text: 'Can I at least get a photo?', nextNode: 'inf-photo' },
        ],
      },
      'inf-real': {
        id: 'inf-real',
        speaker: 'influencer',
        text: 'Prove it. I saw a vendor demo crash earlier. If you fix it, I\'ll give you a shoutout to my 2.4M followers.',
        choices: [
          { id: 'c1', text: "I'll look into it.", nextNode: 'end', effect: (s: GameState) => { s.reputation += 3; }, reputation: 3 },
          { id: 'c2', text: "My code doesn't beg for validation.", nextNode: 'end', reputation: -2 },
        ],
      },
      'inf-photo': {
        id: 'inf-photo',
        speaker: 'influencer',
        text: "Ugh. Fine. But I'm not doing the duck face. I have standards. Post it with #DevConnectVibes.",
        choices: [
          { id: 'c1', text: 'Perfect. Now I\'m famous.', nextNode: 'end', reputation: 1 },
        ],
      },
    },
  },
];

export const ITEM_MAP = new Map(ITEMS.map(item => [item.id, item]));
export const SCENE_MAP = new Map(SCENES.map(scene => [scene.id, scene]));
export const NPC_MAP = new Map(NPCS.map(npc => [npc.id, npc]));
export const QUEST_MAP = new Map(QUESTS.map(quest => [quest.id, quest]));
export const DIALOGUE_TREE_MAP = new Map(DIALOGUES.map(tree => [tree.npcId, tree]));
export const SCENE_ORDER = SCENES.map(s => s.id);
