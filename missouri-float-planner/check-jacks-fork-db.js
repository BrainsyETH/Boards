require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('JACKS FORK ACCESS POINTS IN DATABASE');
  console.log('='.repeat(80));

  // First, find the Jacks Fork river ID
  const { data: river, error: riverError } = await supabase
    .from('rivers')
    .select('id, name, slug')
    .or('slug.eq.jacks-fork,slug.eq.jacks-fork-river,name.ilike.%jacks%fork%')
    .single();

  if (riverError) {
    console.error('Error finding Jacks Fork river:', riverError);
    return;
  }

  console.log(`\nRiver found: ${river.name} (ID: ${river.id})`);
  console.log(`Slug: ${river.slug}`);

  // Get access points for Jacks Fork
  const { data: accessPoints, error: apError } = await supabase
    .from('access_points')
    .select('*')
    .eq('river_id', river.id)
    .order('river_mile_downstream', { ascending: true, nullsFirst: false });

  if (apError) {
    console.error('Error fetching access points:', apError);
    return;
  }

  console.log(`\nFound ${accessPoints.length} access points:\n`);

  const pending = accessPoints.filter(ap => !ap.approved);
  const approved = accessPoints.filter(ap => ap.approved);

  console.log(`✅ Approved: ${approved.length}`);
  console.log(`⏸️  Pending: ${pending.length}\n`);

  if (pending.length > 0) {
    console.log('PENDING ACCESS POINTS (Need Coordinates):');
    console.log('-'.repeat(80));
    pending.forEach((ap, index) => {
      const coords = ap.location_orig?.coordinates;
      console.log(`\n${index + 1}. ${ap.name}`);
      console.log(`   ID: ${ap.id}`);
      console.log(`   Type: ${ap.type}`);
      console.log(`   River Mile: ${ap.river_mile_downstream || 'N/A'}`);
      console.log(`   Current Coords: ${coords ? `[${coords[0]}, ${coords[1]}]` : 'NONE'}`);
    });
  }

  if (approved.length > 0) {
    console.log('\n\nAPPROVED ACCESS POINTS:');
    console.log('-'.repeat(80));
    approved.forEach((ap, index) => {
      const coords = ap.location_orig?.coordinates;
      console.log(`\n${index + 1}. ${ap.name}`);
      console.log(`   River Mile: ${ap.river_mile_downstream || 'N/A'}`);
      console.log(`   Coords: ${coords ? `[${coords[0]}, ${coords[1]}]` : 'NONE'}`);
    });
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

main().catch(console.error);
