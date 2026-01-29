require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('CLEANUP & APPROVE JACKS FORK ACCESS POINTS');
  console.log('='.repeat(80));

  const { data: river } = await supabase
    .from('rivers')
    .select('id')
    .eq('slug', 'jacks-fork')
    .single();

  // IDs of OLD/DUPLICATE entries to DELETE (these have incorrect coordinates)
  const toDelete = [
    '4376f6a0-83f2-4139-88cd-d6b822d6cd82', // Old Alley Spring
    '38cbf960-1a28-428f-a942-f2253526484a', // Hwy (duplicate)
    '01909fe7-4d55-419d-b35c-ea7815cc6732', // Hwy 17 Bridge (duplicate)
    '1274e13e-efc3-410a-8d44-875c29e31ea6', // Old Salvation Army
    'e1d083fe-926b-4ece-b398-3a319bf531d2', // Old Rymers
    '9b6b56fe-1fea-4444-a17f-57ed1ea9f170', // Old Bunker Hill
    '6b55821a-0048-46cd-85f6-e4dccb6d6cd4', // Old Bay Creek
    'f70977d5-27e0-47a5-8d4c-c9d35d54a061', // Old Shawnee Creek
    '1781d976-3391-49d9-aa49-3ea9aa0a4ce5', // Old Confluence
  ];

  // IDs of NEW entries to APPROVE (these have correct coordinates)
  const toApprove = [
    '9c3345bc-a8d2-4b3c-a673-bed32ae53859', // MDC South Prong Access
    '5fbc1c15-1cde-4cdb-b441-c9c9717de529', // Buck Hollow
    'dbe5204e-d5cd-40c1-8c3c-4bcf63acc7e7', // Salvation Army Camp
    '06af1da7-5086-4d68-93e8-8980d870ac7f', // Rymers Access
    'c45bb3e7-2e97-4572-a9ad-bbf73e21ab86', // Bunker Hill
    '662788dc-b203-4896-81fb-c604c31e610a', // Bay Creek
    '981c0426-720e-4a15-ac83-7f34a9ad3fa4', // Shawnee Creek
    '98dd4907-9362-4f03-8629-69e198c790f9', // Two Rivers
  ];

  console.log(`\nDeleting ${toDelete.length} old/duplicate entries...`);
  
  for (const id of toDelete) {
    const { error } = await supabase
      .from('access_points')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.log(`❌ Error deleting ${id}:`, error.message);
    } else {
      console.log(`✅ Deleted: ${id}`);
    }
  }

  console.log(`\n\nApproving ${toApprove.length} new access points with correct coordinates...`);
  
  for (const id of toApprove) {
    const { error } = await supabase
      .from('access_points')
      .update({ 
        approved: true,
        approved_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.log(`❌ Error approving ${id}:`, error.message);
    } else {
      console.log(`✅ Approved: ${id}`);
    }
  }

  // Final count
  const { data: final } = await supabase
    .from('access_points')
    .select('id, name, approved')
    .eq('river_id', river.id);

  const approvedCount = final.filter(ap => ap.approved).length;
  const pendingCount = final.filter(ap => !ap.approved).length;

  console.log('\n' + '='.repeat(80));
  console.log('FINAL SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Access Points: ${final.length}`);
  console.log(`✅ Approved: ${approvedCount}`);
  console.log(`⏸️  Pending: ${pendingCount}`);
  console.log('='.repeat(80) + '\n');
}

main().catch(console.error);
