/**
 * The Gemini Core menu — ported verbatim from legacy's GEMINI_CORE_MENU,
 * the same 20 real items (13 Signature Cocktails / "The Album", 7
 * Classics / "The Magnificent 7"). This is shared content, not two
 * datasets: legacy's own Mintaka screen routes its "Cocktail Menu" and
 * "Small Bites Menu" hotspots to the identical `openBar()` catalogue
 * Gemini Core uses — the same reuse-not-duplication proof this
 * migration already made twice in District II (DEPMG Sessions, Vault
 * Preservation), now proven a third time across a district boundary.
 *
 * Full ingredient/glass/flavor-tag detail is preserved in the data even
 * though the reference-slice UI surfaces only name/subtitle/description
 * — nothing about the source content was thinned to make this migration
 * easier, only what's rendered was scoped down.
 */
export interface MenuItem {
  id: string;
  name: string;
  category: 'Signature Cocktails' | 'Classics';
  collection: string;
  tag: string;
  subtitle: string;
  glass: string;
  ingredients: string[];
  flavor: string[];
  desc: string;
}

export const GEMINI_CORE_MENU: MenuItem[] = [
  { id: 'gemini-speakeasy', name: 'Gemini Speakeasy', category: 'Signature Cocktails', collection: 'The Album', tag: 'Track 01',
    subtitle: '"Welcome To The Mind."', glass: 'Crystal Nick & Nora',
    ingredients: ['Rémy Martin 1738 Cognac', 'Amontillado Sherry', 'Benedictine', 'Orange Bitters', 'Black Walnut Bitters', 'Orange Peel Oils'],
    flavor: ['Warm', 'Sophisticated', 'Smooth', 'Layered', 'Timeless'],
    desc: 'The sound of the front door opening. Cognac brings warmth, sherry brings depth, Benedictine adds mystery — the first step into a world built on music, memory and conversation.' },
  { id: 'potentially', name: 'Potentially', category: 'Signature Cocktails', collection: 'The Album', tag: 'Track 02',
    subtitle: '"Maybe Is A Beautiful Place."', glass: 'Stemmed Coffee Coupe',
    ingredients: ['Vanilla Vodka', 'Irish Cream', 'Cold Brew Concentrate', 'Honey Syrup', 'Cinnamon Syrup', 'Orange Bitters', 'Light Cream Float'],
    flavor: ['Smooth', 'Warm', 'Sweet', 'Comforting', 'Hopeful'],
    desc: "Lives somewhere between friendship and fate. Coffee for the conversation, honey for the warmth, cream for the comfort — the drink you order when you're not ready to leave." },
  { id: 'untouchable', name: 'Untouchable', category: 'Signature Cocktails', collection: 'The Album', tag: 'Track 03',
    subtitle: '"Nothing Can Touch Me Today."', glass: 'Nick & Nora Coupe',
    ingredients: ['VSOP Cognac', 'Elderflower Liqueur', 'Fresh Lemon Juice', 'Honey Syrup', 'Sparkling White Tea', 'Champagne Float'],
    flavor: ['Bright', 'Sophisticated', 'Clean', 'Effortless', 'Confident'],
    desc: "Tastes like the day everything finally makes sense — the bills are paid, the phone is quiet, the future looks exactly how you imagined it. Or at least that's what you tell yourself." },
  { id: 'bad-way', name: 'Bad Way', category: 'Signature Cocktails', collection: 'The Album', tag: 'Track 04',
    subtitle: '"The Second One Is The Mistake."', glass: 'Coupe Glass',
    ingredients: ['Dark Rum', 'Espresso Liqueur', 'Black Cherry Liqueur', 'Red Wine Reduction Syrup', 'Chocolate Bitters', 'Smoked Cinnamon'],
    flavor: ['Dark', 'Rich', 'Bitter-Sweet', 'Seductive'],
    desc: "Some choices feel like comfort, some feel like escape — Bad Way feels like both. It's the detour you didn't plan, but took anyway." },
  { id: '4-the-night', name: '4 the Night', category: 'Signature Cocktails', collection: 'The Album', tag: 'Track 05',
    subtitle: '"We Both Knew."', glass: 'Champagne Coupe',
    ingredients: ['Grey Goose Vodka', 'St-Germain Elderflower Liqueur', 'Pear Liqueur', 'Fresh Lemon Juice', 'Honey Syrup', 'Brut Champagne', 'Edible Gold Shimmer'],
    flavor: ['Elegant', 'Bright', 'Floral', 'Smooth', 'Expensive'],
    desc: "Isn't about love — it's about recognition. That moment across the room when two people already know where the evening is headed. No games, no speeches, just chemistry dressed in expensive clothes." },
  { id: 'sticky', name: 'Sticky', category: 'Signature Cocktails', collection: 'The Album', tag: 'Track 06',
    subtitle: '"Got Me Fiendin\' For Your Sticky Sweet."', glass: 'Nick & Nora Coupe',
    ingredients: ['Rémy Martin 1738 Cognac', 'Peach Liqueur', 'Nectarine Syrup', 'Honey Syrup', 'Fresh Lemon Juice', 'Orange Bitters', 'Vanilla Cream'],
    flavor: ['Sweet', 'Juicy', 'Velvety', 'Addictive', 'Seductive'],
    desc: "Isn't love — it's the part you crave after. Peach, nectarine, honey, heat: sweet enough to pull you in, dangerous enough to keep you there." },
  { id: 'cinnamon', name: 'Cinnamon', category: 'Signature Cocktails', collection: 'The Album', tag: 'Track 07',
    subtitle: '"The Room Changed When She Walked In."', glass: 'Nick & Nora Glass',
    ingredients: ['Rémy Martin 1738 Cognac', 'Vanilla Bean Syrup', 'Cinnamon Cream', 'Maple Syrup', 'Fresh Espresso', 'Nutmeg'],
    flavor: ['Warm', 'Velvety', 'Spiced', 'Creamy', 'Intimate'],
    desc: "Warmth in motion. She's soft, she's dangerous, and the room changes when she walks in — velvet, spice, and something sweet you'll never forget." },
  { id: 'clock-it', name: 'Clock It', category: 'Signature Cocktails', collection: 'The Album', tag: 'Track 08',
    subtitle: '"She Is The Beat."', glass: 'Black Coupe Glass',
    ingredients: ['Vanilla Vodka', 'Mr Black Coffee Liqueur', 'Crème de Violette', 'Cold Brew Concentrate', 'Vanilla Syrup', 'Chocolate Bitters', 'Edible Gold Shimmer'],
    flavor: ['Rich', 'Floral', 'Coffee', 'Velvet', 'Magnetic'],
    desc: "Isn't about seeing her — it's about feeling her. The room notices, the lights notice, the music notices, and before your mind catches up, your body already made the decision." },
  { id: 'driver', name: 'DRIVER', category: 'Signature Cocktails', collection: 'The Album', tag: 'Track 09',
    subtitle: '"Real Or Illusion?"', glass: 'Tall Highball Glass',
    ingredients: ['Premium Tequila Blanco', 'Passionfruit Puree', 'Blood Orange Juice', 'Fresh Lime Juice', 'Agave Syrup', 'Chili Tincture', 'Sparkling Citrus Soda'],
    flavor: ['Tropical', 'Citrus', 'Passionfruit', 'Heat', 'Addictive'],
    desc: "The feeling that takes the wheel before you know where you're going. Bright, dangerous, impossible to hold onto — you swear you'll catch it, then it's gone." },
  { id: 'mine', name: 'MINE', category: 'Signature Cocktails', collection: 'The Album', tag: 'Track 10',
    subtitle: '"The Decision Was Already Made."', glass: 'Crystal Nick & Nora',
    ingredients: ['Rye Whiskey', 'Cognac', 'Blackberry Liqueur', 'Black Cherry Syrup', 'Black Walnut Bitters', 'Chocolate Bitters', 'Orange Oil Mist'],
    flavor: ['Dark Fruit', 'Smoke', 'Oak', 'Rich', 'Seductive'],
    desc: "Some people flirt, some people chase — MINE is what happens after both of those are over. The room already knows; everybody's just waiting for it to happen." },
  { id: 'what-are-we-doing', name: "What Are We Doin'?", category: 'Signature Cocktails', collection: 'The Album', tag: 'Track 11',
    subtitle: '"The Lie Tastes Better."', glass: 'Black Coupe Glass',
    ingredients: ['Vanilla Vodka', 'Espresso Liqueur', 'Black Cherry Liqueur', 'Red Wine Reduction Syrup', 'Fresh Espresso', 'Chocolate Bitters'],
    flavor: ['Dark Cherry', 'Coffee', 'Chocolate', 'Rich', 'Addictive'],
    desc: "Lives in the space between desire and consequence. The texts get deleted, the memories don't — and somehow that's never enough to make anybody stop." },
  { id: 'fixation', name: 'Fixation', category: 'Signature Cocktails', collection: 'The Album', tag: 'Track 12',
    subtitle: '"Look What You Made Me Love."', glass: 'Smoked Coupe Glass',
    ingredients: ['Rye Whiskey', 'Amaro Averna', 'Espresso Liqueur', 'Black Walnut Bitters', 'Chocolate Bitters', 'Burnt Orange Oil'],
    flavor: ['Bitter', 'Dark Coffee', 'Burnt Orange', 'Oak', 'Addictive'],
    desc: "It never starts with the addiction — it starts with the reward. Fixation is the moment pleasure becomes dependence, and dependence starts calling itself love." },
  { id: 'ghost', name: 'Ghost', category: 'Signature Cocktails', collection: 'The Album', tag: 'Track 13',
    subtitle: '"The Moment You Realize They\'re Not Coming Back."', glass: 'Nick & Nora Glass',
    ingredients: ['Grey Goose Vodka', 'St-Germain Elderflower Liqueur', 'White Cranberry Juice', 'Fresh Lemon Juice', 'Lavender Honey Syrup', 'Saline Solution'],
    flavor: ['Floral', 'Delicate', 'Clean', 'Melancholy', 'Beautiful'],
    desc: "Isn't about death — it's about the people who leave fingerprints on your soul, and the version of yourself that leaves with them." },
  { id: 'richfraz', name: 'RichFraz', category: 'Classics', collection: 'The Magnificent 7', tag: 'No. 1',
    subtitle: '"Three Cities. One Soul."', glass: 'Rocks Glass',
    ingredients: ['Hennessy VSOP Cognac', 'Woodford Reserve Bourbon', 'Brown Sugar Syrup', 'Black Walnut Bitters', 'Smoked Cherry Syrup', 'Peach Liqueur', 'Orange Peel'],
    flavor: ['Warm', 'Smoky', 'Smooth', 'Slightly Sweet'],
    desc: "The official house drink of GEMINI, where three worlds collide — Harlem's soul, the Poconos' solitude, and Atlanta's pulse. Smooth, warm, and layered with intention." },
  { id: 'depmg', name: 'DEPMG', category: 'Classics', collection: 'The Magnificent 7', tag: 'No. 2',
    subtitle: '"Warp Velocity."', glass: 'Smoked Coupe',
    ingredients: ['Japanese Whisky', 'Black Vodka', 'Blackberry Liqueur', 'Elderflower Liqueur', 'Fresh Lemon Juice', 'Activated Charcoal', 'Egg White (optional)', 'Silver Shimmer'],
    flavor: ['Floral', 'Dark Berry', 'Citrus', 'Mysterious'],
    desc: 'A tribute to exploration, intelligence and the unknown — cold, infinite, calculated, elegant. This is not just a drink. This is warp velocity.' },
  { id: 'jungle', name: 'Jungle', category: 'Classics', collection: 'The Magnificent 7', tag: 'No. 3',
    subtitle: '"Some Places Change You."', glass: 'Cut Crystal Highball',
    ingredients: ['Plantation Pineapple Rum', 'Aged Dark Rum', 'Fresh Pineapple Juice', 'Passionfruit Puree', 'Fresh Lime Juice', 'Honey Syrup', 'Aromatic Bitters'],
    flavor: ['Tropical', 'Bright', 'Rich', 'Exotic', 'Smooth'],
    desc: 'Adventure dressed in a tailored suit — sweet enough to invite you in, complex enough to keep you there. The wild, refined.' },
  { id: 'phantom', name: 'Phantom', category: 'Classics', collection: 'The Magnificent 7', tag: 'No. 4',
    subtitle: '"You Never Saw It Coming."', glass: 'Copper Mule Mug',
    ingredients: ['Premium Vodka', 'Cranberry Juice', 'Fresh Apple Cider', 'Fresh Lime Juice', 'Premium Ginger Beer'],
    flavor: ['Crisp Apple', 'Tart Cranberry', 'Bright Ginger', 'Clean', 'Refreshing', 'Mysterious'],
    desc: 'The memory that lingers after the last song — bright on the surface, haunted underneath. A toast to the ones who never really leave.' },
  { id: 'the-saxman', name: 'The Saxman', category: 'Classics', collection: 'The Magnificent 7', tag: 'No. 5',
    subtitle: '"You\'re In Danger, Girl."', glass: 'Nick & Nora Glass',
    ingredients: ['Reposado Tequila', 'Velvet Falernum', 'Passionfruit Liqueur', 'Fresh Lime Juice', 'Honey Syrup', 'Orange Bitters', 'Champagne Float'],
    flavor: ['Smooth', 'Velvet', 'Seductive', 'Dangerous', 'Unexpected'],
    desc: "Doesn't arrive loudly — it leans against the bar, orders something expensive, and watches. Sweet enough to lower your guard, strong enough to ruin your plans." },
  { id: 'noise-cancellation', name: 'Noise Cancellation', category: 'Classics', collection: 'The Magnificent 7', tag: 'No. 6',
    subtitle: '"Frequency Over Noise."', glass: 'Smoked Coupe',
    ingredients: ['Japanese Gin', 'Elderflower Liqueur', 'Cucumber Juice', 'Green Tea Syrup', 'Fresh Lemon Juice', 'Sea Salt Solution', 'Edible Silver Shimmer'],
    flavor: ['Clean', 'Crisp', 'Complex', 'Controlled', 'Modern'],
    desc: "Most people spend their lives chasing attention. This one isn't interested — it removes distractions and leaves only what matters. Clean signal, pure frequency." },
  { id: 'algorhythm', name: 'Algorhythm', category: 'Classics', collection: 'The Magnificent 7', tag: 'No. 7',
    subtitle: '"The Beat Was Already There."', glass: 'Heavy Crystal Rocks Glass',
    ingredients: ['Japanese Whisky', 'Cognac', 'Blackberry Liqueur', 'Ginger Liqueur', 'Black Walnut Bitters', 'Orange Bitters', 'Orange Oil Mist'],
    flavor: ['Bold', 'Layered', 'Smooth', 'Creative', 'Visionary'],
    desc: "Isn't luck — it's pattern recognition. The ability to hear music where other people hear noise, and to find rhythm hidden inside chaos." },
];
