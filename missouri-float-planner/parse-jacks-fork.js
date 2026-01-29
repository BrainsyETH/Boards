const fs = require('fs');

const data = JSON.parse(fs.readFileSync('floatmissouri_mile_markers.json', 'utf8'));
const jacksAccessPoints = data.filter(m => 
  m.river_id === 'jacks-fork-river' && 
  m.is_access_point === true
);

console.log(`\n${'='.repeat(80)}`);
console.log(`JACKS FORK RIVER ACCESS POINTS (${jacksAccessPoints.length} total)`);
console.log('='.repeat(80));

jacksAccessPoints.forEach((ap, index) => {
  console.log(`\n${index + 1}. Mile ${ap.mile}`);
  console.log(`   Description: ${ap.description}`);
  console.log(`   Location: ${ap.location ? `Lat ${ap.location.coordinates[1]}, Lng ${ap.location.coordinates[0]}` : 'NO COORDINATES SET'}`);
});

console.log(`\n${'='.repeat(80)}\n`);
