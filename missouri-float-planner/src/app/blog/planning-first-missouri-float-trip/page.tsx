import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Planning Your First Missouri Float Trip: Complete Guide',
  description: 'Everything you need to know to plan your first float trip in Missouri. Learn about choosing rivers, essential gear, safety protocols, camping, and Leave No Trace principles.',
  keywords: [
    'Missouri float trips',
    'float trip planning',
    'first float trip',
    'Missouri rivers',
    'Current River',
    'Jacks Fork River',
    'Meramec River',
    'kayaking Missouri',
    'canoeing Ozarks',
    'float trip gear',
    'river camping Missouri',
  ],
  openGraph: {
    title: 'Planning Your First Missouri Float Trip: Complete Guide',
    description: 'Complete beginner\'s guide to planning and enjoying your first Missouri float trip - from choosing rivers to packing gear and camping safely',
    type: 'article',
  },
};

export default function PlanningFirstTripPage() {
  return (
    <article className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <Link href="/blog" className="hover:text-blue-600">← Back to Blog</Link>
            <span>•</span>
            <time dateTime="2026-01-31">January 31, 2026</time>
            <span>•</span>
            <span>18 min read</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Planning Your First Missouri Float Trip: Complete Guide
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            Planning your first float trip in Missouri? You&apos;re in for an unforgettable adventure! 
            Missouri&apos;s pristine rivers offer some of the most scenic and accessible float experiences 
            in the United States. This comprehensive guide will walk you through everything you need to know.
          </p>

          <div className="relative w-full h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src="/blog/planning-first-trip/06-friends-floating-missouri-river.png"
              alt="Friends floating down a Missouri river with Eddy the Otter leading the group"
              fill
              className="object-cover"
              priority
            />
          </div>
        </header>

        {/* Table of Contents */}
        <nav className="bg-blue-50 rounded-lg p-6 mb-12 border border-blue-100">
          <h2 className="font-bold text-lg mb-4">Quick Navigation</h2>
          <ul className="space-y-2">
            <li><a href="#why-missouri" className="text-blue-600 hover:underline">Why Missouri Rivers?</a></li>
            <li><a href="#choose-river" className="text-blue-600 hover:underline">Step 1: Choose Your River</a></li>
            <li><a href="#trip-length" className="text-blue-600 hover:underline">Step 2: Plan Trip Length</a></li>
            <li><a href="#rentals" className="text-blue-600 hover:underline">Step 3: Rentals vs. Own Gear</a></li>
            <li><a href="#gear" className="text-blue-600 hover:underline">Step 4: Essential Gear</a></li>
            <li><a href="#safety" className="text-blue-600 hover:underline">Step 5: River Safety</a></li>
            <li><a href="#campsites" className="text-blue-600 hover:underline">Step 6: Choose Campsites</a></li>
            <li><a href="#leave-no-trace" className="text-blue-600 hover:underline">Step 7: Leave No Trace</a></li>
            <li><a href="#rules" className="text-blue-600 hover:underline">Step 8: Rules & Regulations</a></li>
            <li><a href="#best-times" className="text-blue-600 hover:underline">Step 9: Best Times to Float</a></li>
            <li><a href="#checklist" className="text-blue-600 hover:underline">Step 10: Pre-Trip Checklist</a></li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          
          {/* Why Missouri Rivers */}
          <section id="why-missouri" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Missouri Rivers Are Perfect for Beginners</h2>
            
            <p className="text-gray-700 mb-4">
              Missouri is blessed with some of the cleanest, most beautiful rivers in the country. 
              Here&apos;s why they&apos;re ideal for first-time floaters:
            </p>

            <h3 className="text-2xl font-bold mb-3">Gentle Currents</h3>
            <p className="text-gray-700 mb-4">
              Most Missouri float rivers have mild currents that are perfect for beginners. The Current River, 
              Jacks Fork, and Meramec River are all Class I waters, meaning they&apos;re calm and easy to 
              navigate even with minimal paddling experience.
            </p>

            <h3 className="text-2xl font-bold mb-3">Stunning Natural Beauty</h3>
            <p className="text-gray-700 mb-4">
              Missouri&apos;s float rivers wind through the Ozark Mountains, offering breathtaking scenery including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Towering limestone bluffs</li>
              <li>Crystal-clear spring-fed waters</li>
              <li>Lush forests and wildlife</li>
              <li>Natural springs and caves</li>
              <li>Gravel bars perfect for breaks and camping</li>
            </ul>

            <div className="relative w-full h-96 rounded-xl overflow-hidden mb-6">
              <Image
                src="/blog/planning-first-trip/07-missouri-river-bluffs.png"
                alt="Stunning Missouri river bluffs with Eddy the Otter as your guide"
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-2xl font-bold mb-3">Excellent Infrastructure</h3>
            <p className="text-gray-700 mb-4">
              Missouri has well-established float trip infrastructure:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Numerous outfitters offering rentals and shuttles</li>
              <li>Designated camping areas and gravel bars</li>
              <li>Access points at regular intervals</li>
              <li>Support services throughout popular float corridors</li>
            </ul>
          </section>

          {/* Step 1: Choose Your River */}
          <section id="choose-river" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Step 1: Choose Your River</h2>
            
            <p className="text-gray-700 mb-6">
              Your first decision is selecting the right river. Here are the top Missouri rivers for beginners:
            </p>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
              <h3 className="text-2xl font-bold mb-2">Current River (Top Choice for Beginners)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="font-bold text-green-800">Location</div>
                  <div className="text-green-700">Southeast Missouri</div>
                </div>
                <div>
                  <div className="font-bold text-green-800">Length</div>
                  <div className="text-green-700">135 miles</div>
                </div>
                <div>
                  <div className="font-bold text-green-800">Difficulty</div>
                  <div className="text-green-700">Class I (easy)</div>
                </div>
                <div>
                  <div className="font-bold text-green-800">Best For</div>
                  <div className="text-green-700">First-timers, families</div>
                </div>
              </div>
              <p className="text-gray-700">
                The Current River is Missouri&apos;s most famous float river and arguably the best choice for 
                your first trip. As the first National Scenic Riverway in the United States, it offers pristine 
                water quality, well-maintained access points, and abundant camping options.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <h3 className="text-2xl font-bold mb-2">Jacks Fork River</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="font-bold text-blue-800">Location</div>
                  <div className="text-blue-700">Southeast Missouri</div>
                </div>
                <div>
                  <div className="font-bold text-blue-800">Length</div>
                  <div className="text-blue-700">45 miles</div>
                </div>
                <div>
                  <div className="font-bold text-blue-800">Difficulty</div>
                  <div className="text-blue-700">Class I (easy)</div>
                </div>
                <div>
                  <div className="font-bold text-blue-800">Best For</div>
                  <div className="text-blue-700">Clear water enthusiasts</div>
                </div>
              </div>
              <p className="text-gray-700">
                Jacks Fork is the Current River&apos;s little sister, offering even clearer water and more 
                intimate scenery. It&apos;s slightly more remote, which means fewer crowds but also less development.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-6">
              <h3 className="text-2xl font-bold mb-2">Meramec River</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="font-bold text-purple-800">Location</div>
                  <div className="text-purple-700">Central Missouri</div>
                </div>
                <div>
                  <div className="font-bold text-purple-800">Length</div>
                  <div className="text-purple-700">218 miles</div>
                </div>
                <div>
                  <div className="font-bold text-purple-800">Difficulty</div>
                  <div className="text-purple-700">Class I-II</div>
                </div>
                <div>
                  <div className="font-bold text-purple-800">Best For</div>
                  <div className="text-purple-700">St. Louis area</div>
                </div>
              </div>
              <p className="text-gray-700">
                The Meramec is easily accessible from St. Louis and offers excellent day trip options. 
                It&apos;s slightly more developed than Current or Jacks Fork but still maintains beautiful natural scenery.
              </p>
            </div>
          </section>

          {/* Step 2: Plan Trip Length */}
          <section id="trip-length" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Step 2: Plan Your Trip Length and Route</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
              <h3 className="text-xl font-bold mb-2">Day Trips (4-8 hours floating)</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Pros:</strong> No camping gear needed, easier planning, lower cost</li>
                <li><strong>Cons:</strong> Less immersive experience, time pressure</li>
                <li><strong>Recommended for:</strong> First-time floaters, testing the waters</li>
              </ul>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-6">
              <h3 className="text-xl font-bold mb-2">Overnight Trips (2-3 days)</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Pros:</strong> Full river experience, camping under stars, relaxed pace</li>
                <li><strong>Cons:</strong> More gear required, more planning needed</li>
                <li><strong>Recommended for:</strong> Adventurous beginners with camping experience</li>
              </ul>
            </div>

            <p className="text-gray-700 mb-4">
              <strong>Planning Your Daily Distance:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>Beginner pace:</strong> 1-2 miles per hour (including breaks)</li>
              <li><strong>Typical day trip:</strong> 8-15 miles (4-8 hours on the water)</li>
              <li><strong>Comfortable overnight pace:</strong> Plan for 10-12 miles per day</li>
            </ul>

            <div className="bg-blue-100 border border-blue-300 rounded-lg p-6 mb-6">
              <p className="text-gray-800 font-semibold mb-2">💡 Pro Tip:</p>
              <p className="text-gray-700">
                Use <Link href="/" className="text-blue-600 hover:underline">Float Planner</Link> to 
                visualize your route, calculate trip times, find access points and campsites, check 
                current river conditions, and plan resupply points.
              </p>
            </div>
          </section>

          {/* Step 3: Rentals vs Own Gear */}
          <section id="rentals" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Step 3: Decide on Rentals vs. Your Own Gear</h2>
            
            <h3 className="text-2xl font-bold mb-3">Option 1: Rent from an Outfitter (Recommended for First Trip)</h3>
            <p className="text-gray-700 mb-3"><strong>Pros:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              <li>No equipment investment needed</li>
              <li>Everything provided (canoes/kayaks, paddles, life jackets)</li>
              <li>Shuttle service included (they drive your car to the takeout)</li>
              <li>Expert advice on routes and conditions</li>
              <li>Less to worry about</li>
            </ul>

            <p className="text-gray-700 mb-3"><strong>Cons:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
              <li>Higher cost per trip ($40-80 per person for day trips)</li>
              <li>Less flexibility in scheduling</li>
              <li>Rental gear may not be top quality</li>
            </ul>

            <p className="text-gray-700 mb-6">
              <strong>For your first trip, we recommend renting.</strong> This lets you test the activity 
              before investing in gear, and you&apos;ll learn what features matter most to you.
            </p>
          </section>

          {/* Step 4: Essential Gear */}
          <section id="gear" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Step 4: Essential Gear and Packing List</h2>

            <div className="relative w-full h-96 rounded-xl overflow-hidden mb-6">
              <Image
                src="/blog/planning-first-trip/03-float-trip-essential-gear.png"
                alt="Essential float trip gear organized with Eddy the Otter"
                fill
                className="object-cover"
              />
            </div>
            
            <h3 className="text-2xl font-bold mb-3">Safety Equipment (Absolute Must-Haves)</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>Personal Flotation Devices (PFDs / Life Jackets):</strong> One Coast Guard-approved 
                PFD per person. Required by Missouri law for children under 7, recommended for all.</li>
              <li><strong>Whistle:</strong> Attach to your PFD for emergencies</li>
              <li><strong>First Aid Kit (Waterproof):</strong> Bandages, antiseptic, pain relievers, 
                antihistamine, tweezers, tick removal tool, moleskin, personal medications</li>
              <li><strong>River Knife:</strong> For cutting rope in emergencies</li>
            </ul>

            <h3 className="text-2xl font-bold mb-3">Clothing and Sun Protection</h3>
            <p className="text-gray-700 mb-3"><strong>What to Wear:</strong></p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Swimsuit or quick-dry shorts (avoid cotton - it stays wet)</li>
              <li>Synthetic or wool t-shirt (not cotton)</li>
              <li>Water shoes or sandals with straps (Chacos, Tevas, Keens) - NEVER flip-flops</li>
              <li>Wide-brimmed hat with chin strap</li>
              <li>Sunglasses with retainer strap</li>
              <li>Lightweight long-sleeve shirt for sun protection</li>
            </ul>

            <p className="text-gray-700 mb-3"><strong>Sun Protection (Critical!):</strong></p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Waterproof sunscreen SPF 30+ (reapply every 2 hours - river reflection intensifies exposure)</li>
              <li>Lip balm with SPF</li>
              <li>Buff or bandana for neck protection</li>
            </ul>

            <h3 className="text-2xl font-bold mb-3">Food and Water</h3>
            <p className="text-gray-700 mb-4">
              <strong>Hydration (Most Important!):</strong> 1 gallon of water per person per day minimum. 
              Bring reusable water bottles (2-3 per person) and electrolyte tablets or sports drinks. 
              DO NOT drink river water untreated.
            </p>

            <h3 className="text-2xl font-bold mb-3">Waterproofing Your Gear</h3>
            <p className="text-gray-700 mb-3"><strong>Dry Bags (Essential!):</strong></p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>20L dry bag for clothes</li>
              <li>10L dry bag for electronics and valuables</li>
              <li>5L dry bag for first aid kit</li>
              <li><strong>Roll-top technique:</strong> Fold top 3-4 times, then clip</li>
            </ul>

            <p className="text-gray-700 mb-3"><strong>What MUST Stay Dry:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
              <li>Change of clothes</li>
              <li>Sleeping bag and sleeping pad (overnight trips)</li>
              <li>Matches/lighter</li>
              <li>Phone and electronics</li>
              <li>First aid kit</li>
            </ul>
          </section>

          {/* Step 5: River Safety */}
          <section id="safety" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Step 5: Understand River Safety</h2>

            <div className="relative w-full h-96 rounded-xl overflow-hidden mb-6">
              <Image
                src="/blog/planning-first-trip/05-float-trip-safety-gear.png"
                alt="Safety gear for float trips with Eddy the Otter"
                fill
                className="object-cover"
              />
            </div>
            
            <h3 className="text-2xl font-bold mb-3">Basic Paddling Skills</h3>
            <p className="text-gray-700 mb-3"><strong>Before You Launch:</strong></p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Practice paddling strokes on calm water</li>
              <li>Learn how to steer and stop</li>
              <li>Practice getting in/out of your boat safely</li>
              <li>Know how to recover if you tip</li>
            </ul>

            <h3 className="text-2xl font-bold mb-3">Common Hazards</h3>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
              <p className="text-red-900 font-bold mb-2">⚠️ Strainers (Deadly - Avoid at All Costs)</p>
              <p className="text-gray-700 mb-2">
                Fallen trees or branches in water. Water flows through, but you can&apos;t.
              </p>
              <p className="text-gray-700">
                <strong>If caught:</strong> Lean into it and climb on top
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
              <p className="text-red-900 font-bold mb-2">⚠️ Low-Head Dams (Extremely Dangerous)</p>
              <p className="text-gray-700">
                Check your route for dams beforehand. ALWAYS portage around dams - never go over. 
                Recirculating currents can trap and drown.
              </p>
            </div>

            <h3 className="text-2xl font-bold mb-3">What to Do If You Tip</h3>
            <p className="text-gray-700 mb-3"><strong>Stay Calm:</strong></p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
              <li>Hold onto your paddle</li>
              <li>Get on upstream side of boat (don&apos;t get pinned between boat and rock)</li>
              <li>Keep feet up and float on your back, feet downstream</li>
              <li>Swim to calm water (eddy or shore)</li>
              <li>Recover your boat and gear</li>
            </ol>

            <h3 className="text-2xl font-bold mb-3">Emergency Protocols</h3>
            <p className="text-gray-700 mb-3"><strong>Before You Launch:</strong></p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Tell someone your float plan (route, expected return time)</li>
              <li>Carry a whistle (three blasts = distress signal)</li>
              <li>Know the location of access points for emergency exit</li>
            </ul>

            <p className="text-gray-700 mb-3"><strong>Emergency Contacts:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
              <li><strong>911</strong> (limited cell service on rivers)</li>
              <li><strong>Missouri State Water Patrol:</strong> 573-751-3333</li>
              <li><strong>National Park Service (Current/Jacks Fork):</strong> 573-323-4236</li>
            </ul>
          </section>

          {/* Step 6: Choose Campsites */}
          <section id="campsites" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Step 6: Choose Your Campsites</h2>

            <div className="relative w-full h-96 rounded-xl overflow-hidden mb-6">
              <Image
                src="/blog/planning-first-trip/04-missouri-river-campsite.png"
                alt="Riverside campsite in Missouri with Eddy the Otter"
                fill
                className="object-cover"
              />
            </div>
            
            <h3 className="text-2xl font-bold mb-3">Gravel Bar Camping (Most Common)</h3>
            <p className="text-gray-700 mb-4">
              Gravel bars are natural beaches along the river - exposed gravel and sand areas perfect for camping.
            </p>

            <p className="text-gray-700 mb-3"><strong>Rules and Etiquette:</strong></p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>Ozark National Scenic Riverways:</strong> Free, no permit needed</li>
              <li>Camp only on gravel bars below the high-water mark</li>
              <li>No camping on private property (look for "No Trespassing" signs)</li>
              <li>First-come, first-served (no reservations)</li>
            </ul>

            <p className="text-gray-700 mb-3"><strong>Choosing a Good Gravel Bar:</strong></p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>Size:</strong> Large enough for your group with space between other campers</li>
              <li><strong>Elevation:</strong> Above current water level (watch for rising water)</li>
              <li><strong>Flat areas:</strong> For tent pitching</li>
              <li><strong>Some shade:</strong> Trees nearby for afternoon heat</li>
              <li><strong>Established fire rings:</strong> Indicates common camping spot</li>
            </ul>

            <p className="text-gray-700 mb-3"><strong>Gravel Bar Camping Tips:</strong></p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Arrive early (popular bars fill up on weekends)</li>
              <li>Set up camp ABOVE potential high-water line</li>
              <li>Use a ground cloth (gravel is rough on tent floors)</li>
              <li>Bring extra tent stakes (gravel doesn&apos;t hold stakes well)</li>
              <li>Hang food away from camp (raccoons are smart)</li>
            </ul>
          </section>

          {/* Step 7: Leave No Trace */}
          <section id="leave-no-trace" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Step 7: Practice Leave No Trace Principles</h2>
            
            <p className="text-gray-700 mb-6">
              Missouri&apos;s rivers are pristine because floaters respect them. Follow these principles:
            </p>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
              <h3 className="text-xl font-bold mb-2">1. Plan Ahead and Prepare</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Know regulations and special concerns</li>
                <li>Prepare for extreme weather and emergencies</li>
                <li>Pack out all trash</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
              <h3 className="text-xl font-bold mb-2">2. Dispose of Waste Properly</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Pack out ALL trash (not even orange peels)</li>
                <li>Human waste: Dig catholes 6-8 inches deep, 200 feet from water</li>
                <li>Pack out toilet paper in sealed plastic bag</li>
                <li>Strain dishwater, scatter gray water 200 feet from water</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
              <h3 className="text-xl font-bold mb-2">3. Minimize Campfire Impact</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Use established fire rings on gravel bars</li>
                <li>Keep fires small</li>
                <li>Burn wood completely to ash</li>
                <li>Extinguish completely - drown and stir until cold</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
              <h3 className="text-xl font-bold mb-2">4. Be Considerate of Others</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Keep noise levels respectful</li>
                <li>Give other groups space</li>
                <li>Let faster groups pass</li>
                <li>Don&apos;t monopolize popular spots</li>
              </ul>
            </div>
          </section>

          {/* Step 8: Rules and Regulations */}
          <section id="rules" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Step 8: Know the Rules and Regulations</h2>
            
            <h3 className="text-2xl font-bold mb-3">Ozark National Scenic Riverways (Current & Jacks Fork)</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Free to float (no permits needed)</li>
              <li>Life jackets required for children under 7</li>
              <li>No littering (pack it in, pack it out)</li>
              <li>No glass containers on gravel bars</li>
              <li>Fires allowed in established rings only</li>
              <li>Pets allowed (must be leashed in developed areas)</li>
            </ul>

            <h3 className="text-2xl font-bold mb-3">Missouri State Regulations</h3>
            <p className="text-gray-700 mb-3"><strong>Fishing License:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
              <li>Required for anglers 16-64 (with exceptions)</li>
              <li>Available online at mdc.mo.gov</li>
              <li>Daily limits apply (check current regulations)</li>
            </ul>
          </section>

          {/* Step 9: Best Times to Float */}
          <section id="best-times" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Step 9: Best Times to Float</h2>
            
            <h3 className="text-2xl font-bold mb-3">Spring (March - May)</h3>
            <p className="text-gray-700 mb-2"><strong>Pros:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-3">
              <li>Highest water levels (faster current, easier navigation)</li>
              <li>Wildflowers blooming</li>
              <li>Fewer crowds</li>
              <li>Cooler temperatures</li>
            </ul>
            <p className="text-gray-700 mb-2"><strong>Cons:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
              <li>Cold water (hypothermia risk)</li>
              <li>Unpredictable weather</li>
              <li>Spring rains can cause flooding</li>
            </ul>

            <h3 className="text-2xl font-bold mb-3">Summer (June - August)</h3>
            <p className="text-gray-700 mb-2"><strong>Pros:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-3">
              <li>Warmest water temperatures (perfect for swimming)</li>
              <li>Consistent weather (mostly sunny)</li>
              <li>Peak season - all outfitters operating</li>
              <li>Long daylight hours</li>
            </ul>
            <p className="text-gray-700 mb-2"><strong>Cons:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
              <li>Crowded (especially weekends)</li>
              <li>Hottest temperatures (heat exhaustion risk)</li>
              <li>Lower water levels (may scrape bottom in spots)</li>
            </ul>
            <p className="text-gray-700 mb-6">
              <strong>Best for:</strong> Beginners, families, first-time floaters. Float weekdays to avoid crowds.
            </p>

            <h3 className="text-2xl font-bold mb-3">Fall (September - November)</h3>
            <p className="text-gray-700 mb-2"><strong>Pros:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-3">
              <li>Spectacular fall foliage (peak: mid-October)</li>
              <li>Cooler comfortable temperatures</li>
              <li>Fewer crowds</li>
              <li>Lower rental prices</li>
            </ul>
            <p className="text-gray-700 mb-2"><strong>Cons:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
              <li>Shorter daylight hours</li>
              <li>Colder water</li>
              <li>Some outfitters close after Labor Day</li>
            </ul>
          </section>

          {/* Step 10: Pre-Trip Checklist */}
          <section id="checklist" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Step 10: Pre-Trip Checklist</h2>
            
            <h3 className="text-2xl font-bold mb-3">Two Weeks Before:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Book outfitter rental (if using one)</li>
              <li>Check weather forecast trends</li>
              <li>Invite friends and confirm group size</li>
              <li>Create packing list</li>
              <li>Purchase any missing gear</li>
            </ul>

            <h3 className="text-2xl font-bold mb-3">One Week Before:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Check detailed weather forecast</li>
              <li>Verify outfitter reservation</li>
              <li>Check current river levels (USGS.gov)</li>
              <li>Plan daily route on <Link href="/" className="text-blue-600 hover:underline">Float Planner</Link></li>
              <li>Buy food and supplies</li>
              <li>Tell someone your float plan</li>
            </ul>

            <h3 className="text-2xl font-bold mb-3">Day Before:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Pack all gear using checklist</li>
              <li>Waterproof critical items in dry bags</li>
              <li>Charge phone, camera, headlamp</li>
              <li>Check weather one final time</li>
              <li>Get good night&apos;s sleep</li>
            </ul>

            <h3 className="text-2xl font-bold mb-3">Launch Day Morning:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Check in with outfitter (if using one)</li>
              <li>Apply sunscreen (first application)</li>
              <li>Safety briefing with your group</li>
              <li>Distribute gear evenly in boats</li>
              <li>Secure all dry bags</li>
              <li>Put on life jackets</li>
              <li>Review route and checkpoints</li>
              <li>Launch!</li>
            </ul>
          </section>

          {/* Conclusion */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Conclusion: You&apos;re Ready to Float!</h2>
            
            <p className="text-gray-700 mb-6">
              Planning your first Missouri float trip doesn&apos;t have to be overwhelming. By following this 
              guide, you&apos;ll be well-prepared for a safe, enjoyable adventure on one of Missouri&apos;s 
              beautiful rivers.
            </p>

            <p className="text-gray-700 mb-6">
              Missouri&apos;s rivers are waiting for you. The crystal-clear water, stunning bluffs, peaceful 
              gravel bars, and memories you&apos;ll make are worth every bit of planning.
            </p>

            <div className="bg-blue-100 border border-blue-300 rounded-lg p-6 mb-6">
              <p className="text-gray-800 font-semibold mb-2">Ready to start planning?</p>
              <p className="text-gray-700 mb-4">
                Visit <Link href="/" className="text-blue-600 hover:underline">Float Planner</Link> to 
                map your route, check conditions, and get your trip dialed in.
              </p>
              <Link 
                href="/"
                className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Plan Your Float Trip →
              </Link>
            </div>

            <p className="text-gray-700 mb-4">
              Now get out there and float! 🚣‍♂️🏞️
            </p>
          </section>

          {/* Related Articles */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/blog/best-float-rivers-missouri-2026" className="text-blue-600 hover:underline">
                  Best Float Rivers in Missouri: Complete Guide 2026
                </Link>
              </li>
            </ul>
          </section>

        </div>
      </div>
    </article>
  );
}
