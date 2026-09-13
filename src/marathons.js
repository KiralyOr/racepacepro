// One page per well known marathon, written around pacing the course rather
// than dates and entry.
//
// Deliberately no dates, ballot windows or entry deadlines. Those change every
// year, this project cannot verify them, and a wrong ballot deadline published
// as fact is the worst thing this site could do to a reader. Every page links
// to the official site for anything time sensitive.
//
// `month` is safe to state because these races sit in the same month every
// year. A specific date is not.
//
// Several official URLs carry a title sponsor in the domain, so they change
// when the sponsor does. A stale link here is a nuisance rather than a
// hazard, unlike a stale date, but it is worth a check now and then.

export const MARATHONS = [
  {
    id: 'berlin',
    name: 'Berlin Marathon',
    city: 'Berlin',
    country: 'Germany',
    month: 'September',
    profile: 'Flat and fast',
    officialUrl: 'https://www.bmw-berlin-marathon.com/',
    summary:
      'The flattest and fastest of the big city marathons, and the course where most marathon world records have been set. Wide roads, few sharp turns, and cool late September air.',
    pacing: [
      'Berlin is the one major where holding a single pace for the whole race is genuinely realistic. There is almost no elevation to plan around and few corners tight enough to break rhythm, so the pace you set in the first 10 km is close to the pace you will still be running at 35 km if you judged it right.',
      'That is also the trap. A course with no natural brake makes it very easy to run the first half two or three seconds per kilometre quick without noticing, because nothing pushes back. On a hilly course you feel the mistake early. Here you feel it at 32 km.',
      'The field is large and the early kilometres are congested. Losing 20 or 30 seconds in the first two kilometres is normal and not worth chasing back. Let the crowd thin and settle into target pace by 5 km.',
    ],
    watchFor: [
      'Cool conditions favour going out at goal pace rather than conservatively, but only if you have run the pace in training.',
      'Wide roads mean you can drift off the racing line without noticing. Run the tangents.',
      'A flat course loads the same muscles for the entire distance, which is its own kind of fatigue.',
    ],
  },
  {
    id: 'london',
    name: 'London Marathon',
    city: 'London',
    country: 'United Kingdom',
    month: 'April',
    profile: 'Flat with a downhill start',
    officialUrl: 'https://www.tcslondonmarathon.com/',
    summary:
      'A fast, flat course through the city from Blackheath to The Mall, with an early descent, enormous crowds, and a long stretch through the Docklands in the second half.',
    pacing: [
      'The opening few kilometres drop away from Blackheath, and with fresh legs and a tightly packed field this is where goal pace feels absurdly easy. Runners routinely arrive at 10 km a minute or more ahead of plan and pay for it after 30 km.',
      'The crowd support is the loudest of any marathon and it genuinely lifts pace without you deciding to. Check your watch more often than feels necessary through the first half, particularly around Tower Bridge at halfway where the noise peaks.',
      'The Docklands section in the twenties is the quiet part, with more turns and a more enclosed feel. This is where a race that started too fast comes apart, and where an even effort starts paying you back.',
    ],
    watchFor: [
      'The early downhill is free speed only if you do not spend it. Hold target pace rather than banking time.',
      'Tower Bridge is not halfway to the metre, so do not use it as your split marker.',
      'April in London can be anything from cold rain to unseasonable heat. Have a plan for both.',
    ],
  },
  {
    id: 'boston',
    name: 'Boston Marathon',
    city: 'Boston',
    country: 'United States',
    month: 'April',
    profile: 'Net downhill, deceptively hard',
    officialUrl: 'https://www.baa.org/races/boston-marathon',
    summary:
      'A point to point course from Hopkinton that loses height overall but is nothing like flat. The early descent is severe, the Newton hills arrive when you are already tired, and entry generally requires a qualifying time.',
    pacing: [
      'Boston is the clearest example of why net elevation is a useless number. The course drops sharply in the opening miles, and running those downhills at the pace they invite does quadriceps damage that you do not feel until the hills in Newton, roughly two thirds of the way in.',
      'The standard advice is to run the first 10 km deliberately slower than target, which feels ridiculous while every runner around you is flying. It is still the right call. The finish rewards whoever has functioning legs at 35 km, and the descent is what takes them away.',
      'The Newton hills are not individually steep. What makes them hard is where they sit. Treat them as an effort based section rather than a pace based one, and accept losing time there.',
      'After the last climb the course descends again to the finish. Quads that were wrecked at mile 6 cannot use that descent, which is the whole argument for restraint at the start.',
    ],
    watchFor: [
      'Downhill running at speed causes eccentric muscle damage. Train for descents specifically if you can.',
      'A qualifying time is generally required, and the standards change. Check the official site.',
      'The point to point layout means a tailwind or headwind affects the entire race in one direction.',
    ],
  },
  {
    id: 'chicago',
    name: 'Chicago Marathon',
    city: 'Chicago',
    country: 'United States',
    month: 'October',
    profile: 'Flat and fast',
    officialUrl: 'https://www.chicagomarathon.com/',
    summary:
      'A flat loop through the city neighbourhoods that starts and finishes in Grant Park. Fast, well supported, and one of the more reliable places to chase a personal best.',
    pacing: [
      'Like Berlin, the flatness means an even pace plan is realistic. Unlike Berlin, the course turns frequently as it works through the neighbourhoods, and the turns add distance if you run them wide.',
      'The tall buildings downtown interfere with GPS. Watches routinely over-read early, telling you that you are running faster than you are, which encourages exactly the wrong correction. Trust the kilometre and mile markers over the watch, particularly in the first few kilometres.',
      'The second half moves through quieter stretches with less crowd noise than the start. Runners who fed off the early atmosphere often find the pace harder to hold there for no physiological reason.',
      'Long straight avenues make up much of the middle of the race, with little to break up the effort. Without corners or gradient to mark progress the kilometres blur together, and drifting off pace in either direction is easy to miss. Thinking of the race as a sequence of named neighbourhoods rather than a number line helps more than it sounds like it should.',
    ],
    watchFor: [
      'GPS drift among the downtown buildings makes your watch pace unreliable. Use course markers.',
      'A loop course means wind direction changes repeatedly rather than helping or hurting throughout.',
      'October in Chicago is usually cool, but warm years happen and the course has almost no shade.',
    ],
  },
  {
    id: 'new-york',
    name: 'New York City Marathon',
    city: 'New York',
    country: 'United States',
    month: 'November',
    profile: 'Rolling, with bridges',
    officialUrl: 'https://www.nyrr.org/tcsnycmarathon',
    summary:
      'Five boroughs, five bridges, and the hardest course of the big city marathons to run a fast time on. Spectacular, and not the place to chase a personal best.',
    pacing: [
      'The race opens with a climb over the Verrazzano-Narrows Bridge in the first mile, which means the slowest split of your day is the first one. That is correct and you should let it happen.',
      'The Queensboro Bridge in the second half is the defining stretch. It climbs, it is closed to spectators so it falls silent after miles of noise, and it arrives at the point where the race starts to hurt. Runners describe it as the psychological low of the day. Plan to lose time there and to get it back on First Avenue afterwards.',
      'First Avenue is loud, straight and slightly downhill, which is a combination that produces a burst of pace nobody intends. It is a long way from there to the finish.',
      'Central Park at the end rolls continuously. There is no flat run-in.',
    ],
    watchFor: [
      'Expect uneven splits by design. A flat pace plan does not fit this course.',
      'The bridges are exposed and the wind on them can be significant.',
      'Entry is usually by ballot, time qualification or charity. Check the official site.',
    ],
  },
  {
    id: 'tokyo',
    name: 'Tokyo Marathon',
    city: 'Tokyo',
    country: 'Japan',
    month: 'March',
    profile: 'Flat with out and back sections',
    officialUrl: 'https://www.marathon.tokyo/en/',
    summary:
      'A flat, superbly organised course through central Tokyo with several out and back sections. Cool March conditions and famously precise crowd management.',
    pacing: [
      'The course is flat enough that pace discipline is the only real variable. There are a few underpasses and gentle gradients but nothing that should change your plan.',
      'The out and back sections are a mixed blessing. You can see faster runners coming the other way, which is motivating and also a reliable way to accidentally lift your pace. They also involve turnarounds, which break rhythm and cost a few seconds each.',
      'Field management is strict and the start is organised by wave. The early kilometres are less congested than at comparably large races, so you can reach target pace sooner.',
      'The field holds its line and its pace unusually well, so there is less weaving and surging than at other races this size. That makes running your own race easier, and it also makes it easy to settle in behind a group moving slightly quicker than you planned without registering that you have done it. Check your watch rather than trusting the group.',
    ],
    watchFor: [
      'March in Tokyo is usually cool, which is good for pacing, but it can be wet.',
      'Turnarounds cost more rhythm than the seconds suggest. Do not try to make them up.',
      'Entry is typically heavily oversubscribed through a ballot. Check the official site.',
    ],
  },
  {
    id: 'valencia',
    name: 'Valencia Marathon',
    city: 'Valencia',
    country: 'Spain',
    month: 'December',
    profile: 'Flat and very fast',
    officialUrl: 'https://www.valenciaciudaddelrunning.com/en/marathon/',
    summary:
      'Flat, cool and organised around going fast. Valencia has built a reputation as the place to run a personal best, and the December date puts conditions close to ideal.',
    pacing: [
      'This is about as favourable as marathon pacing gets. Flat throughout, cool air, and a field where a large proportion of runners are chasing a specific time and running in disciplined groups.',
      'Those groups are the thing to use. Finding a pack running your target pace removes both the wind and the constant arithmetic, and Valencia has more of them at more paces than most races. Choose one that is running your pace rather than one that is slightly quicker.',
      'Because conditions are so good, the temptation is to revise the target upwards on the start line. Do not. Good conditions are worth a modest amount, not a new personal best target invented that morning.',
      'The opening kilometres carry a field made up almost entirely of runners in personal best shape, so the pace around you will be quicker than your target whatever your target happens to be. Let it go. Valencia rewards patience precisely because so many people spend theirs in the first 5 km.',
    ],
    watchFor: [
      'Cool December conditions mean you will need less fluid than at a warm race, but do not skip fuelling.',
      'Pace groups are a genuine advantage here. Identify yours before the start.',
      'Entry has moved toward a ballot as demand has grown. Check the official site for the current process.',
    ],
  },
  {
    id: 'prague',
    name: 'Prague Marathon',
    city: 'Prague',
    country: 'Czech Republic',
    month: 'May',
    profile: 'Flat, with cobbled sections',
    officialUrl: 'https://www.runczech.com/en/events/prague-marathon',
    summary:
      'A flat loop through the old city, starting and finishing on Old Town Square, with river embankment stretches that are fast and cobbled sections that are not.',
    pacing: [
      'The elevation profile is close to flat, with roughly 50 to 130 metres of total climb depending on whose measurement you use. None of it is steep enough to plan a pace change around.',
      'The cobbles are the real feature. Old Town sections and the Charles Bridge crossings are uneven underfoot, and they cost both rhythm and a little pace. They are also where the footing is worst in the wet.',
      'The embankment stretches along the Vltava are the fastest part of the course, straight and smooth. If you are going to be slightly ahead of target anywhere, this is a more sensible place than the cobbles.',
      'The start on Old Town Square funnels a large field into narrow streets almost immediately, so the first split will be slow and crowded. Treat that as the cost of the course rather than a deficit to chase back, because there is not much room to overtake cleanly until the route reaches the river.',
    ],
    watchFor: [
      'Cobbles reward a shorter, quicker stride than you would use on tarmac.',
      'Wet cobbles are genuinely slippery. Adjust rather than fight for pace.',
      'May in Prague can be warm by the later stages even when the start is cool.',
    ],
  },
  {
    id: 'paris',
    name: 'Paris Marathon',
    city: 'Paris',
    country: 'France',
    month: 'April',
    profile: 'Flat, with cobbles and tunnels',
    officialUrl: 'https://www.schneiderelectricparismarathon.com/',
    summary:
      'From the Champs-Elysees out through the Bois de Vincennes, back along the Seine and into the Bois de Boulogne. Gently rolling rather than hilly, with cobbled stretches and a series of riverside tunnels.',
    pacing: [
      'The elevation here is mild enough that an even pace plan is realistic. What interrupts it is the surface and the tunnels, not the gradient.',
      'The opening kilometres run down the Champs-Elysees: wide, crowded, and tilted very slightly downhill. It is the classic combination for arriving at 10 km a minute ahead of plan while feeling entirely comfortable, and Paris punishes that later than most courses because the difficulty is back loaded.',
      'The tunnels along the Seine are the distinctive problem, and they are a pacing problem rather than a running one. GPS drops inside them and the watch compensates when it reacquires, so your pace readings are simply wrong for a kilometre or two either side. Runners who react to those numbers make genuine pace errors chasing a figure that was never real. Use the course markers through that whole section and ignore the watch.',
      'Cobbled stretches appear in the older streets. They cost rhythm more than time, and a shorter, quicker stride handles them better than trying to hold your usual one.',
    ],
    watchFor: [
      'Tunnels break GPS. Trust the kilometre markers rather than your watch through the riverside sections.',
      'The downhill start is where the race is most often lost, because it does not feel like effort.',
      'April in Paris can be warm, and long stretches of the course have little shade.',
    ],
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam Marathon',
    city: 'Amsterdam',
    country: 'Netherlands',
    month: 'October',
    profile: 'Flat and fast',
    officialUrl: 'https://www.tcsamsterdammarathon.nl/',
    summary:
      'Starts and finishes inside the Olympic Stadium, with a long stretch out along the Amstel river between. Flat throughout, cool October air, and a dependable choice for a personal best.',
    pacing: [
      'There is almost no elevation to plan around, so pace discipline is the entire task. The same warning applies as at Berlin: a course with nothing to push back against makes drifting two or three seconds per kilometre quick very easy to miss.',
      'The Amstel section is what makes Amsterdam different from other flat courses. It is a long, straight, exposed stretch beside the water, and wind is a real variable there in a way it is not on a sheltered city course. Crucially it runs out and comes back, so a helping wind on one leg becomes a hindering one on the other, over a similar distance.',
      'That makes banking time with a tailwind a particularly bad idea here. The seconds you gain going one way cost more than they are worth coming back, because you pay them at a point when you are already tired. Run the exposed section on effort and let the pace be whatever it is.',
      'Tucking into a group matters more on this course than on a sheltered one, purely for the shelter it provides.',
    ],
    watchFor: [
      'The riverside is exposed. Plan for wind in both directions rather than hoping for one.',
      'A flat course and a quick field both encourage a fast start. Be settled at target pace by 5 km.',
      'The stadium entrance arrives later than most runners expect. Do not start the finishing effort at the gate.',
    ],
  },
  {
    id: 'rotterdam',
    name: 'Rotterdam Marathon',
    city: 'Rotterdam',
    country: 'Netherlands',
    month: 'April',
    profile: 'Flat, with two bridge crossings',
    officialUrl: 'https://www.nnmarathonrotterdam.org/',
    summary:
      'Flat and quick through a modern city, with the Erasmus Bridge crossed early and again close to the finish. A long standing personal best course with a fast field.',
    pacing: [
      'Flat almost everywhere, which means the two bridge crossings are the only features that will change your pace, and only one of them matters.',
      'The Erasmus Bridge is crossed in the opening kilometres, when it costs you essentially nothing, and again near the end, when tired legs feel every metre of the rise. Plan for the second crossing and forget the first. Runners who treat the early crossing as evidence that the bridge is easy get an unpleasant surprise later.',
      'Between the bridges the course is wide, fast and largely unremarkable, which is exactly what you want. The pacing task is to stay on your number and resist the pull of a field where a large proportion of runners are chasing a specific time.',
      'The closing kilometres after the second crossing are where the race is decided, so arrive at the bridge with something left rather than with a deficit to chase.',
    ],
    watchFor: [
      'The late bridge crossing is the one that counts. Keep something in reserve for it.',
      'An exposed riverside course in April can be windy.',
      'A fast field pulls you along early. Run your own pace for the first 5 km.',
    ],
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt Marathon',
    city: 'Frankfurt',
    country: 'Germany',
    month: 'October',
    profile: 'Flat and fast',
    officialUrl: 'https://www.mainova-frankfurt-marathon.de/',
    summary:
      'A flat loop through the city with an unusual ending: the last stretch moves indoors into the Festhalle, finishing on a red carpet under lights rather than on open road.',
    pacing: [
      'One of the reliably fast European courses. There is very little elevation, the roads are wide, and October conditions are usually cool, so an even pace plan is not just possible but expected.',
      'That puts the entire burden on you. Nothing about this course will force a pace change or give you a natural cue that you are running too hard, which is precisely why flat courses produce so many late collapses. Check your splits more often than the terrain suggests you need to.',
      'The indoor finish is worth knowing about in advance. Coming off the street into the Festhalle is a genuine lift, but it also means the closing few hundred metres are not the long open straight most runners have pictured. If you plan a sustained finishing effort, work out where it actually starts rather than assuming you will see the line from far out.',
      'The field contains a lot of runners chasing specific times in organised groups, which is an advantage if you join the right one and a trap if you join a quicker one by accident.',
    ],
    watchFor: [
      'Nothing on the course forces a pace change, so the discipline has to be yours.',
      'The indoor finish arrives suddenly. Know where your final effort begins.',
      'October mornings can be cold at the start. Dress for the race rather than the start line.',
    ],
  },
  {
    id: 'seville',
    name: 'Seville Marathon',
    city: 'Seville',
    country: 'Spain',
    month: 'February',
    profile: 'Among the flattest major courses',
    officialUrl: 'https://www.zurichmaratonsevilla.es/',
    summary:
      'Almost entirely flat through a compact historic city, run in cool February air. It has built a reputation as one of the fastest courses in Europe and draws a field that comes specifically for the time.',
    pacing: [
      'This is about as close to a controlled experiment in marathon pacing as a road race gets. There is barely any elevation, the temperature is usually close to ideal, and the course does not throw anything at you.',
      'Which means that if the day goes wrong, the pacing was the reason. There is no hill to blame and no heat to blame. That is worth knowing in advance, because it changes how conservative you should be early: on a course with no variables, an even effort really does produce an even pace, and there is no argument for banking time against difficulty later.',
      'The field is full of runners in personal best shape running in disciplined groups, which is a genuine advantage. Find one running your target pace rather than one running slightly quicker, and let it do the work of both the wind and the arithmetic.',
      'Some of the older streets are narrow, so the first kilometre or two will be congested and slow. That is the course, not a deficit.',
    ],
    watchFor: [
      'Good conditions tempt people into revising the target upward on the start line. That is a decision to make in training, not on the morning.',
      'Narrow early streets mean a slow first kilometre. Do not chase it back.',
      'Even in February the sun can be strong by late morning, and the course has limited shade.',
    ],
  },
  {
    id: 'vienna',
    name: 'Vienna City Marathon',
    city: 'Vienna',
    country: 'Austria',
    month: 'April',
    profile: 'Flat, shared with the half marathon',
    officialUrl: 'https://www.vienna-marathon.com/',
    summary:
      'Flat, along the Danube and through the centre of the city. The half marathon runs the same roads until the courses split, and that shared start is the defining pacing problem of the race.',
    pacing: [
      'The elevation is not the story here. The shared course is, and it catches out more runners at Vienna than any hill does elsewhere.',
      'For most of the first half you are running among people racing a distance half as long as yours, and pacing themselves accordingly. The effect is subtle and dangerous: the pace around you feels social and sustainable, because for everyone else it genuinely is sustainable, over 21 km. You are being set a pace by a field that is going to stop when you are halfway.',
      'When the courses split the field thins dramatically and the noise drops with it. Runners who let the half marathon field dictate their first half arrive at the split already in deficit, and now have to run the hard part alone and quiet. It is a brutal combination.',
      'The answer is unglamorous: run your own numbers from the first kilometre, let people go, and expect to be passing a lot of them later.',
    ],
    watchFor: [
      'Half marathon runners around you are racing a different event. Their pace is not your pace.',
      'The field and the atmosphere thin noticeably after the courses separate. Be ready for it mentally.',
      'The Danube stretches are exposed to wind.',
    ],
  },
  {
    id: 'athens',
    name: 'Athens Marathon',
    city: 'Athens',
    country: 'Greece',
    month: 'November',
    profile: 'Uphill for two thirds',
    officialUrl: 'https://www.athensauthenticmarathon.gr/',
    summary:
      'The original route, from the town of Marathon to the Panathenaic Stadium in Athens. It climbs almost continuously from roughly 10 km to 31 km, which makes it one of the hardest of the well known marathon courses.',
    pacing: [
      'No major marathon punishes an even pace plan more thoroughly than this one. The long climb between roughly 10 km and 31 km is not steep at any single point, and that is exactly what makes it dangerous. It is shallow enough that you can run it at goal pace, and long enough that doing so will empty you completely.',
      'Plan the race as three separate sections rather than one. A controlled, deliberately unexciting opening on the flat. Then an effort based climb where you accept losing time and stop looking at pace altogether. Then a descent into the city where some of it comes back, provided you have legs left to use it.',
      'The single most useful piece of preparation is setting the right target. A goal time earned on a flat course does not transfer here, and arriving with a flat course number in your head is the surest way to blow up on the climb while still believing you are on schedule.',
      'The finish inside the Panathenaic Stadium is one of the great endings in the sport, and it is worth being in a state to enjoy it.',
    ],
    watchFor: [
      'Run the long climb by effort, not by pace. Time lost there cannot be forced back.',
      'Set the target from this course, not from your flat course personal best.',
      'November in Athens is usually mild, but the climb is exposed and a warm year makes it much harder.',
    ],
  },
  {
    id: 'rome',
    name: 'Rome Marathon',
    city: 'Rome',
    country: 'Italy',
    month: 'March',
    profile: 'Flat, with extensive cobbles',
    officialUrl: 'https://www.runromethemarathon.com/',
    summary:
      'A loop through the historic centre past the Colosseum and across the river toward the Vatican. The elevation is gentle; the basalt setts the old city is paved with are what shape the race.',
    pacing: [
      'The gradient is mild enough to ignore in a pace plan. The surface is not, and Rome is the clearest example on this list of a course where what is underfoot matters more than what the profile says.',
      'The squared basalt setts of the historic centre are uneven, and they do not arrive in one convenient block that you can survive and forget. They recur throughout, breaking rhythm each time. Individually the cost is small. Cumulatively they leave your calves and feet in a worse state at 35 km than the elevation profile would ever suggest.',
      'A shorter, quicker stride handles them far better than trying to hold your usual one, and fighting to keep pace across a cobbled stretch costs more than the seconds it saves. Give the pace up on the setts and take it back on the smooth sections.',
      'In the wet they become genuinely slippery, and that changes the race rather than merely slowing it. Adjust early rather than after the first bad step.',
    ],
    watchFor: [
      'Cobbles reward a shorter, quicker stride and more cushioning than you might otherwise choose.',
      'Wet setts are slippery. Adjust rather than fight for pace on them.',
      'The scenery is a distraction in both directions. Enjoy it, but keep checking your splits.',
    ],
  },
  {
    id: 'dublin',
    name: 'Dublin Marathon',
    city: 'Dublin',
    country: 'Ireland',
    month: 'October',
    profile: 'Rolling, with the hills late',
    officialUrl: 'https://www.irishlifedublinmarathon.ie/',
    summary:
      'Out through Phoenix Park and back into the city, rolling rather than flat, with the hardest climbing saved for the last third when it does the most damage.',
    pacing: [
      'This is not a flat course, and more importantly its difficulty is back loaded. Any pacing plan that treats it as flat will work beautifully for 30 km and then fall apart.',
      'The early kilometres through Phoenix Park are open, comfortable and quick, and the crowd support in Dublin is genuinely among the best anywhere. Both of those pull your pace up without you deciding anything. The temptation to bank time while it feels this easy is strong and it is the wrong call here more than on most courses.',
      'The climbing around Roebuck and the approach back into the city arrives after 30 km, which is precisely when a fast start comes due. Runners who ran the park section on feel rather than on their watch tend to meet those hills with nothing left.',
      'Get through the first half a little slower than feels natural and the last 10 km becomes a race you are still in rather than one you are surviving.',
    ],
    watchFor: [
      'The hardest hills come late. Bank effort rather than time.',
      'October in Dublin brings a real chance of both rain and wind.',
      'The run down to the finish is fast, but only if your legs still work.',
    ],
  },
  {
    id: 'edinburgh',
    name: 'Edinburgh Marathon',
    city: 'Edinburgh',
    country: 'United Kingdom',
    month: 'May',
    profile: 'Net downhill, coastal and exposed',
    officialUrl: 'https://www.edinburghmarathon.com/',
    summary:
      'Starts in the city and runs out along the coast into East Lothian. Net downhill overall, with a long exposed out and back section where the wind, not the gradient, decides how the day goes.',
    pacing: [
      'The net downhill profile gives this course a reputation for fast times, and it earns that reputation in the years when the wind cooperates. In the years it does not, the same course produces some very slow ones.',
      'The coastal out and back is the reason. It is exposed with very little shelter, and it runs away from the city and then comes back along broadly the same line. A tailwind on the outward leg becomes a headwind on the return, over a similar distance, at the point in the race where you are least equipped to deal with it.',
      'This makes a helping wind early into a warning rather than a gift. If the outward leg feels unexpectedly easy and your splits are unexpectedly quick, the most likely explanation is that you will pay for both on the way back. Run that section on effort and let the pace read whatever it reads.',
      'The early descent is free speed in the same way any downhill start is: only if you do not spend it.',
    ],
    watchFor: [
      'Treat a helping wind on the outward leg as a warning about the return leg.',
      'The coastal stretch is exposed with almost no shelter to run behind.',
      'Net downhill does not mean uniformly downhill. There is still climbing in the profile.',
    ],
  },
  {
    id: 'marine-corps',
    name: 'Marine Corps Marathon',
    city: 'Washington',
    country: 'United States',
    month: 'October',
    profile: 'Rolling, with a hard finish',
    officialUrl: 'https://www.marinemarathon.com/',
    summary:
      'A rolling course through Washington and Arlington, known for its organisation and its atmosphere, and for a finish that climbs to the Marine Corps War Memorial.',
    pacing: [
      'Rolling rather than flat, with the difficulty deliberately stacked toward the end. Both of the features this race is known for arrive when you are already tired.',
      'The long bridge crossing in the thirties is the first. It is exposed, it is monotonous, and it lands almost exactly where most marathons start to hurt, so it functions as a psychological low as much as a physical one. There is also a course cut-off associated with it, which adds real time pressure for runners at the back and is worth checking on the official site before race day rather than discovering on the bridge.',
      'The second is the climb to the memorial at the finish. It is short, but it is the last thing you do, and planning a flat-out final kilometre on the assumption of level ground is a mistake this course punishes visibly every year.',
      'Plan for a final 10 km slower than your first, and treat anything better than that as a bonus.',
    ],
    watchFor: [
      'The long bridge is exposed and arrives at the worst possible moment.',
      'There is a cut-off on the course. Know the pace it requires before the start.',
      'The finish climbs. Do not plan a level sprint.',
    ],
  },
  {
    id: 'big-sur',
    name: 'Big Sur Marathon',
    city: 'Big Sur',
    country: 'United States',
    month: 'April',
    profile: 'Hilly, exposed and scenic',
    officialUrl: 'https://www.bigsurmarathon.org/',
    summary:
      'A point to point along the Pacific coast highway, taking in a long climb to Hurricane Point and the crossing at Bixby Bridge. Spectacular, exposed, and slow by design rather than by accident.',
    pacing: [
      'The most important pacing decision at Big Sur is made weeks before the start: do not come here for a personal best. Setting one as the goal is the single most common way runners have a bad day on this course, and no amount of in-race discipline fixes a target that was wrong to begin with.',
      'The climb to Hurricane Point is the defining feature, a long sustained ascent in the first half that has to be run on effort. Attacking it because it is still early is a mistake, because the second half of this course offers no recovery.',
      'That is the part runners underestimate. There is no flat run-in and no easy stretch to make up time; the closing miles roll continuously, so whatever you spend on the climb is simply gone.',
      'Wind off the ocean is common, frequently a headwind, and on an exposed coastal highway there is nothing to hide behind. Build it into the plan rather than treating it as bad luck.',
    ],
    watchFor: [
      'Set your goal from this course. A flat course time is not a useful reference here.',
      'Coastal wind can be strong and is often against you, with no shelter available.',
      'The rolling second half gives nothing back. Pace the first half with that in mind.',
    ],
  },
  {
    id: 'honolulu',
    name: 'Honolulu Marathon',
    city: 'Honolulu',
    country: 'United States',
    month: 'December',
    profile: 'Hot and humid, with Diamond Head twice',
    officialUrl: 'https://www.honolulumarathon.org/',
    summary:
      'A large, welcoming race with no time limit, run in tropical conditions with two passes of Diamond Head. Heat and humidity, rather than the elevation profile, are what shape the pacing.',
    pacing: [
      'The course itself is not especially difficult. The conditions are, and they are the whole pacing problem, so a plan built around the elevation profile is answering the wrong question.',
      'Heat and humidity work differently from ordinary fatigue. An early start helps but does not solve it, because the second half is run as the sun comes up. A pace that feels comfortable in the dark at 6 km becomes unsustainable by 30 km not because your legs are tired in the usual sense but because you can no longer shed heat fast enough to keep going at that effort.',
      'The practical consequence is that you must slow down before you feel you need to. By the time humidity has caught you, easing off no longer recovers the situation, it just limits the damage. Set a target well off your cool weather pace and drink at every station from the very first one.',
      'Diamond Head is climbed on the way out and again on the way back, and the second pass is much harder than the first suggests.',
    ],
    watchFor: [
      'Add real time to your flat, cool weather goal, not a token amount.',
      'Take fluid at every station from the start, not from when you first feel thirsty.',
      'There is no time limit, which makes finishing realistic but keeps the course busy for a long time.',
    ],
  },
  {
    id: 'gold-coast',
    name: 'Gold Coast Marathon',
    city: 'Gold Coast',
    country: 'Australia',
    month: 'July',
    profile: 'Flat and fast',
    officialUrl: 'https://goldcoastmarathon.com.au/',
    summary:
      'A flat out and back along the coast, run in the middle of the southern winter, which on this stretch of Queensland coast means mild and dry. One of the fastest courses in the southern hemisphere.',
    pacing: [
      'Flat, well organised, and run in conditions that are usually close to ideal, which puts this firmly in the category of courses where your pacing is the only real variable.',
      'The out and back layout is the feature to plan around. Wind works with you for one half of the race and against you for the other, and because the two legs are of similar length, any time you take from a tailwind is time you will hand back with interest into a headwind while more tired.',
      'This is a familiar pattern on every out and back course, and the answer is always the same: run the outward leg on effort rather than on the number your watch is showing, and do not let a fast early split become a target you feel obliged to defend.',
      'The field is large and quick, and on a flat coastal road with a good forecast the first 5 km is where most of the damage gets done.',
    ],
    watchFor: [
      'Wind reverses on you at the turn. Plan for both directions.',
      'Winter here is mild. Overdressing is a more common mistake than underdressing.',
      'A fast field on a flat course makes the opening kilometres the danger, not the closing ones.',
    ],
  },
];

// The home page links a subset rather than all of them. Twenty two chips is a
// wall of near identical text, and the full list belongs on the index page.
// These keep their full race names as the link text, because "Berlin Marathon"
// is what people search for and anchor text is part of what makes the target
// page rank for it.
export const FEATURED_IDS = [
  'berlin',
  'london',
  'boston',
  'chicago',
  'new-york',
  'tokyo',
  'valencia',
  'prague',
];

export const FEATURED_MARATHONS = FEATURED_IDS.map((id) =>
  MARATHONS.find((race) => race.id === id)
);

export const marathonById = (id) => MARATHONS.find((race) => race.id === id);

// Each race page used to link every other race. At eight races that was a
// useful footer; at twenty two it is a wall of links that helps nobody and
// spreads the page's own link weight thinly. Prefer races in the same country,
// then races with a similar course profile, then fall back to list order.
export const RELATED_LIMIT = 6;

export const relatedRaces = (race, limit = RELATED_LIMIT) => {
  const others = MARATHONS.filter((other) => other.id !== race.id);
  const score = (other) =>
    (other.country === race.country ? 2 : 0) + (other.profile === race.profile ? 1 : 0);
  return [...others]
    .map((other, index) => ({ other, index, score: score(other) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.other);
};
