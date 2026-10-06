const fetch = globalThis.fetch;

async function audit() {
  const res = await fetch('http://localhost:5000/api/solutions');
  const list = await res.json();
  console.log('AUDIT OF ALL 9 SOLUTIONS RETURNED BY API:');
  list.forEach((s, idx) => {
    const subType = typeof s.sub_products;
    const isArr = Array.isArray(s.sub_products);
    const count = isArr ? s.sub_products.length : (s.sub_products ? 'STRING LEN: ' + s.sub_products.length : 0);
    console.log(`[${idx + 1}] "${s.title}" (${s.slug})`);
    console.log(`    - Hero Image: ${s.hero_image_url ? s.hero_image_url.substring(0, 60) + '...' : 'NONE'}`);
    console.log(`    - sub_products: type=${subType}, isArray=${isArr}, count=${count}`);
    console.log(`    - scope_cards: isArray=${Array.isArray(s.scope_cards)}, count=${s.scope_cards ? s.scope_cards.length : 0}`);
    console.log(`    - badge_highlights: isArray=${Array.isArray(s.badge_highlights)}, count=${s.badge_highlights ? s.badge_highlights.length : 0}`);
    console.log(`    - products_and_services: isArray=${Array.isArray(s.products_and_services)}, count=${s.products_and_services ? s.products_and_services.length : 0}`);
  });
}

audit().catch(console.error);
