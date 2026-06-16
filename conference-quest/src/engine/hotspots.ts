import { useGameStore } from '../store/gameStore';

export interface HotspotResult {
  message: string;
}

export function processHotspot(hotspot: { action?: string }, store: ReturnType<typeof useGameStore.getState>): HotspotResult | null {
  const updateQuest = (questId: string, objectiveId: string) => {
    const quest = store.quests[questId];
    if (!quest) return;
    const objectives = quest.objectives.map((obj) =>
      obj.id === objectiveId ? { ...obj, completed: true } : obj,
    );
    const completed = objectives.every((obj) => obj.completed);
    store.updateQuestObjective(questId, objectiveId, true);
  };

  if (hotspot.action === 'search-badge') {
    if (!store.inventory.includes('lost-badge') && !store.flags['badge-found']) {
      store.addToInventory('lost-badge');
      store.setFlag('badge-found', true);
      updateQuest('badge-quest', 'find-badge');
      return { message: "You found your conference badge behind the couch! It's crumpled but readable." };
    }
    return { message: "You've already searched here. Nothing more to find." };
  }

  if (hotspot.action === 'search-badge-desk') {
    if (!store.flags['desk-found']) {
      store.setFlag('desk-found', true);
      store.addToInventory('badge-template');
      updateQuest('badge-quest', 'talk-registration');
      return { message: 'Marlene hands you a blank badge template. "Fill this out at the kiosk."' };
    }
    return { message: 'The desk is already searched.' };
  }

  if (hotspot.action === 'use-grabber') {
    if (!store.inventory.includes('lost-badge') && !store.flags['badge-found']) {
      return { message: 'The grabber machine contains your badge but costs too many quarters. Try the lobby instead.' };
    }
    return { message: 'The machine makes sad beeping noises. You decide not to waste real money.' };
  }

  if (hotspot.action === 'talk-vendor') {
    store.setFlag('talked-to-vendor', true);
    updateQuest('vendor-quest', 'visit-vendor');
    return { message: "Chip from CloudNine nervously explains the demo is broken. He needs a deployment USB to fix it." };
  }

  if (hotspot.action === 'coffee-bar-action') {
    if (!store.inventory.includes('coffee-voucher')) {
      return { message: 'The barista stares at you blankly. "Coffee time is over, buddy. 5pm and counting."' };
    }
    store.removeFromInventory('coffee-voucher');
    store.setReputation(store.reputation + 5);
    return { message: 'You redeem your voucher. The coffee is... adequate. Caffeine restored.' };
  }

  if (hotspot.action === 'slot-machine') {
    const roll = Math.random();
    if (roll > 0.95) {
      store.addToInventory('lost-keycard');
      return { message: 'A slot machine pays out... and a VIP keycard! What incredible luck.' };
    }
    return { message: 'The reels spin fruitlessly. The casino house wins again.' };
  }

  if (hotspot.action === 'inspect-stage') {
    return { message: 'The stage is set for the keynote. A single clicker sits on the podium.' };
  }

  if (hotspot.action === 'vip-bar-action') {
    return { message: 'The VIP bar serves champagne and bad decisions in equal measure.' };
  }

  if (hotspot.action === 'talk-vip-speaker') {
    updateQuest('slide-quest', 'ask-organizer');
    store.setFlag('met-keynote-speaker', true);
    if (store.inventory.includes('presentation-data')) {
      return { message: "Dr. Mercer sees your USB and nods solemnly. 'The truth is, you should give this talk.'" };
    }
    return { message: "Dr. Alex Mercer takes a long sip of champagne. He admits he misplaced the USB for his keynote." };
  }

  if (hotspot.action === 'server-rack-action') {
    if (store.flags['server-rebooted-wi-fi-off']) {
      return { message: 'The server is rebooting again. Stay out of there.' };
    }
    store.setFlag('server-rebooted-wi-fi-off', true);
    store.setReputation(store.reputation - 20);
    if (store.quests['wifi-quest']) {
      store.completeQuest('wifi-quest');
    }
    return { message: 'You press a glowing button. The server room lights flicker. You may have just shut down conference Wi-Fi...' };
  }

  if (hotspot.action === 'demo-kiosk-action') {
    if (store.inventory.includes('usb-drive')) {
      store.removeFromInventory('usb-drive');
      store.setReputation(store.reputation + 15);
      updateQuest('vendor-quest', 'fix-demo');
      store.completeQuest('vendor-quest');
      store.addToInventory('vendor-coupon');
      return { message: "You plug in the USB and the demo comes alive! Chip is overjoyed. He gives you a t-shirt coupon." };
    }
    return { message: "The demo kiosk is frozen on a blue screen. A USB might save it." };
  }

  if (hotspot.action === 'rooftop-bar-action') {
    return { message: "The bartender slides a drink across the counter. 'Conference special. You look like you need it.'" };
  }

  return null;
}
