require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('FINDING DUPLICATE ACCESS POINTS FOR JACKS FORK');
  console.log('='.repeat(80));

  const { data: river } = await supabase
    .from('rivers')
    .select('id, name')
    .eq('slug', 'jacks-fork')
    .single();

  const { data: allPoints } = await supabase
    .from('access_points')
    .select('*')
    .eq('river_id', river.id);

  console.log(`\nTotal access points: ${allPoints.length}\n`);

  // Group by similar names
  const nameGroups = {};
  allPoints.forEach(ap => {
    const baseName = ap.name.toLowerCase()
      .replace(/access|campground|camp|creek|spring/gi, '')
      .trim();
    
    if (!nameGroups[baseName]) {
      nameGroups[baseName] = [];
    }
    nameGroups[baseName].push(ap);
  });

  const duplicates = Object.entries(nameGroups).filter(([_, points]) => points.length > 1);

  if (duplicates.length === 0) {
    console.log('✅ No duplicates found!\n');
    
    // Show all points
    console.log('All Jacks Fork Access Points:');
    console.log('='.repeat(80));
    allPoints.forEach((ap, i) => {
      const coords = ap.location_orig?.coordinates;
      console.log(`${i+1}. ${ap.name} (${ap.approved ? 'Approved' : 'Pending'})`);
      console.log(`   ID: ${ap.id}`);
      console.log(`   Coords: [${coords[1]}, ${coords[0]}]`);
      console.log('');
    });
    return;
  }

  console.log(`❌ Found ${duplicates.length} duplicate groups:\n`);

  duplicates.forEach(([baseName, points]) => {
    console.log(`\n🔴 "${baseName}" - ${points.length} entries:`);
    points.forEach((ap, i) => {
      const coords = ap.location_orig?.coordinates;
      console.log(`\n  ${i+1}. ${ap.name}`);
      console.log(`     ID: ${ap.id}`);
      console.log(`     Status: ${ap.approved ? '✅ Approved' : '⏸️  Pending'}`);
      console.log(`     Type: ${ap.type}`);
      console.log(`     Coords: [${coords[1]}, ${coords[0]}]`);
      console.log(`     Created: ${ap.created_at}`);
    });
  });

  console.log('\n' + '='.repeat(80) + '\n');
}

main().catch(console.error);
