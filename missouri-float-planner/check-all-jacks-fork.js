require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('ALL JACKS FORK ACCESS POINTS IN DATABASE');
  console.log('='.repeat(80));

  const { data: river } = await supabase
    .from('rivers')
    .select('id, name, slug')
    .eq('slug', 'jacks-fork')
    .single();

  console.log(`\nRiver: ${river.name} (ID: ${river.id})\n`);

  // Get ALL access points (approved and unapproved)
  const { data: accessPoints } = await supabase
    .from('access_points')
    .select('*')
    .eq('river_id', river.id)
    .order('created_at', { ascending: true });

  const pending = accessPoints.filter(ap => !ap.approved);
  const approved = accessPoints.filter(ap => ap.approved);

  console.log(`Total: ${accessPoints.length} access points`);
  console.log(`✅ Approved: ${approved.length}`);
  console.log(`⏸️  Pending (unapproved): ${pending.length}\n`);

  console.log('PENDING ACCESS POINTS (Need Review & Approval):');
  console.log('='.repeat(80));
  pending.forEach((ap, index) => {
    const coords = ap.location_orig?.coordinates;
    console.log(`\n${index + 1}. ${ap.name}`);
    console.log(`   ID: ${ap.id}`);
    console.log(`   Type: ${ap.type}`);
    console.log(`   Ownership: ${ap.ownership || 'N/A'}`);
    console.log(`   Public: ${ap.is_public ? 'Yes' : 'No'}`);
    console.log(`   Coordinates: [${coords[0]}, ${coords[1]}]`);
    console.log(`   Approved: ${ap.approved ? 'Yes' : 'No'}`);
  });

  if (approved.length > 0) {
    console.log('\n\n' + '='.repeat(80));
    console.log('APPROVED ACCESS POINTS:');
    console.log('='.repeat(80));
    approved.forEach((ap, index) => {
      const coords = ap.location_orig?.coordinates;
      console.log(`\n${index + 1}. ${ap.name}`);
      console.log(`   Coordinates: [${coords[0]}, ${coords[1]}]`);
    });
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

main().catch(console.error);
