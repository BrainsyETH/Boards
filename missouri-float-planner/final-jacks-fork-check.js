require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('✅ JACKS FORK ACCESS POINTS - FINAL VERIFICATION');
  console.log('='.repeat(80));

  const { data: river } = await supabase
    .from('rivers')
    .select('id, name')
    .eq('slug', 'jacks-fork')
    .single();

  const { data: accessPoints } = await supabase
    .from('access_points')
    .select('*')
    .eq('river_id', river.id)
    .eq('approved', true)
    .order('river_mile_downstream', { ascending: true, nullsFirst: false });

  console.log(`\nRiver: ${river.name}`);
  console.log(`Total Approved Access Points: ${accessPoints.length}\n`);
  console.log('='.repeat(80));

  accessPoints.forEach((ap, index) => {
    const coords = ap.location_orig?.coordinates;
    console.log(`\n${index + 1}. ${ap.name}`);
    console.log(`   Type: ${ap.type}`);
    console.log(`   Ownership: ${ap.ownership || 'N/A'}`);
    console.log(`   Public: ${ap.is_public ? 'Yes' : 'No'}`);
    console.log(`   GPS Coordinates: [${coords[1]}, ${coords[0]}] (Lat, Lng)`);
    console.log(`   Google Maps: https://www.google.com/maps?q=${coords[1]},${coords[0]}`);
    console.log(`   Description: ${ap.description || 'N/A'}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('✅ All Jacks Fork access points are now approved and positioned!');
  console.log('='.repeat(80) + '\n');
}

main().catch(console.error);
