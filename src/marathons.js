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
];

export const marathonById = (id) => MARATHONS.find((race) => race.id === id);
