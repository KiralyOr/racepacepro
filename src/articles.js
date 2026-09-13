// Long-form guides rendered as static pages by scripts/generate-pages.js.
// A section is a heading plus blocks; a block is either a paragraph string or
// { list: [...] }. Deliberately no markdown parser: the shape is small and the
// generator stays dependency free.

export const ARTICLES = [
  {
    slug: 'guides/first-marathon',
    title: 'How to Run Your First Marathon',
    description:
      'What first marathon training actually involves: the base you need, how the long run builds, picking a goal time, and the pacing mistake that costs most first-timers their race.',
    heading: 'How to run your first marathon',
    intro:
      'A first marathon is less about talent than about consistency and restraint. Most people who miss their target were fit enough on the day and spent that fitness too early. Here is what the training looks like and where the race is usually won or lost.',
    sections: [
      {
        heading: 'Start with an honest look at your base',
        blocks: [
          'Most marathon plans assume you can already run about 25 to 30 km a week comfortably before week one. If you cannot yet run for 45 minutes without stopping, spend two or three months building that first. The plan will not adjust itself to the fact that you started behind, and beginning a marathon block from nothing is the most reliable way to get injured in the first month.',
          'There is no rush. A marathon you run next year having trained properly will be a better experience than one you limp through in six months.',
        ],
      },
      {
        heading: 'How long the training takes',
        blocks: [
          'Sixteen to twenty weeks is standard from a reasonable base. Expect four runs in a typical week: three easy or moderate, and one long. Peak weeks for a first-timer usually land somewhere between 50 and 70 km.',
          'The strongest predictor of how race day goes is not your best session. It is how many weeks you completed without missing runs. Consistency beats intensity by a wide margin at this distance.',
        ],
      },
      {
        heading: 'The long run is the whole point',
        blocks: [
          'Everything else in the week supports it. Build it gradually, adding no more than about 2 km a week, and take an easier week every third or fourth so the load has somewhere to settle.',
          'Most plans peak at 30 to 32 km roughly three weeks out. Running the full 42.195 km in training is not necessary and costs more in recovery than it gives back in fitness.',
          'Run it slowly. Considerably slower than goal pace, to the point where it feels almost too easy at the start. If you can hold a conversation, you are about right. The long run trains your ability to keep going, not your ability to go fast.',
        ],
      },
      {
        heading: 'Pick a goal time you can defend',
        blocks: [
          'Do not choose a round number because it sounds good. Four hours is not a training plan, it is a wish. Run a half marathon or a 10K six to eight weeks out and work forwards from a result you actually produced.',
          'As a rough guide, double your half marathon time and add ten to twenty minutes. First-timers should sit at the slower end of that, because nobody has an efficient first marathon.',
        ],
      },
      {
        heading: 'Pacing is where most first marathons are lost',
        blocks: [
          'At the start line you are rested, full of adrenaline, and surrounded by people going out too hard. Goal pace will feel trivially easy for the first hour. That feeling is not information.',
          'Runners who bank time early almost always give back more than they gained after 30 km, and they give it back at a much worse exchange rate. Two minutes saved in the first half routinely costs five or ten in the second.',
          'Run the first 5 km slightly slower than goal pace, settle into rhythm, and let the race come to you. If you feel strong at 30 km, that is when to spend it.',
          'Print or screenshot your splits and carry them. Doing arithmetic at 35 km is not a plan.',
        ],
      },
      {
        heading: 'Fuelling',
        blocks: [
          'You have roughly 90 minutes of stored carbohydrate available at marathon effort. After that you need to take some in, or the last hour makes the decision for you.',
          'Aim for 30 to 60 grams of carbohydrate an hour, starting at around 45 minutes rather than waiting until you feel empty. Gels, chews, drink mix, real food: the form matters far less than the timing.',
          'Practise it on long runs. Race day is a poor time to discover that a particular gel disagrees with you.',
          'Drink to thirst. Deliberate overdrinking is a real risk at the back of a marathon field and is more dangerous than mild dehydration.',
        ],
      },
      {
        heading: 'The taper',
        blocks: [
          'Cut volume by roughly half across the final two to three weeks while keeping a little intensity so you do not feel flat. Keep the frequency of runs and shorten them.',
          'You will feel sluggish, restless, and convinced you are losing fitness. Everyone does. It is not a sign of anything, and the training is already banked.',
        ],
      },
      {
        heading: 'What the last 10 km is actually like',
        blocks: [
          'Worth saying plainly: even a well paced marathon is hard from about 32 km. That part is not a sign you did something wrong. The difference between a good day and a bad one is how much you have left when it arrives, and that was decided in the first half.',
          'Finish it, and the next one is a much better informed attempt.',
        ],
      },
    ],
  },
  {
    slug: 'guides/marathon-goal-time',
    title: 'How to Set a Realistic Marathon Goal Time',
    description:
      'Use a recent race result rather than a round number. The Riegel formula, worked examples, the adjustments worth making, and how to sanity check the pace before you commit to it.',
    heading: 'How to set a realistic marathon goal time',
    intro:
      'Most marathon goals are chosen because the number is round. A better method is to start from a race you have actually run and convert it, then adjust for the things a formula cannot see.',
    sections: [
      {
        heading: 'Why round numbers are a trap',
        blocks: [
          'Sub-four, sub-three-thirty and sub-three are appealing because they are memorable, not because they reflect anyone in particular. If your fitness says 4:07, chasing 3:59 means running the first half about eight seconds per kilometre too fast, which is exactly the margin that turns the last 10 km into a walk.',
          'The goal should come out of the arithmetic, not be imposed on it.',
        ],
      },
      {
        heading: 'Convert from a race you have run',
        blocks: [
          'The standard method is the Riegel formula, which predicts one distance from another:',
          'predicted time = known time x (new distance / known distance) ^ 1.06',
          'The 1.06 exponent is what accounts for slowing down as distance grows. Some coaches use 1.07 or 1.08 for the marathon specifically, which gives a more conservative and often more accurate prediction for anyone who is not highly trained.',
        ],
      },
      {
        heading: 'A worked example',
        blocks: [
          'Say you ran a half marathon in 1:45:00, which is 6300 seconds over 21.0975 km.',
          'The ratio of distances is 42.195 / 21.0975, which is exactly 2. Two to the power of 1.06 is about 2.085. So 6300 x 2.085 gives roughly 13,135 seconds, or about 3:38:55.',
          'The quicker shorthand version, doubling your half and adding ten to twenty minutes, gives 3:40 to 3:50 from the same input. Both are in the same territory, and the shorthand is more honest about the uncertainty.',
        ],
      },
      {
        heading: 'Adjustments the formula cannot make',
        blocks: [
          'Riegel assumes you are equally trained for both distances. That is rarely true, so adjust:',
          {
            list: [
              'First marathon: add ten to fifteen minutes. The formula does not know that you have never been past 32 km.',
              'Low weekly volume: if your long run peaked below 28 km, add more. Endurance is the limiter, not speed.',
              'Heat: expect to lose two to four percent in warm conditions, and more if you are not acclimatised.',
              'Hills: a rolling course costs more than the elevation profile suggests, because the downhills do not give back what the climbs take.',
              'Old result: a race from six months ago describes six-month-old fitness.',
            ],
          },
        ],
      },
      {
        heading: 'If you have no recent race',
        blocks: [
          'Plenty of first-time marathoners have never raced anything, which leaves the formula with nothing to work from. Two options are better than guessing.',
          'The first is to go and race something. A parkrun or a local 10K six to eight weeks out costs you one weekend and replaces speculation with a number. It is comfortably the most valuable session in the block.',
          'The second is to use your long runs. If you can complete 30 km at a genuinely comfortable, conversational effort, your marathon pace is somewhere near that effort, not faster. Take the average pace of your best long run and add a little for the extra 12 km. It is cruder than a race result but it is grounded in something you actually did.',
          'What does not work is picking a pace from a training plan written for someone else, or from what a friend of similar build ran. Neither has any information about you in it.',
        ],
      },
      {
        heading: 'Sanity check the pace, not the time',
        blocks: [
          'A finish time is abstract. The pace it demands is not. Convert your target into minutes per kilometre or mile and ask an honest question: could you hold that for a two hour training run today, and still feel like there was more?',
          'If the answer is no, the goal is too fast. Marathon pace should feel comfortable and slightly boring for the first two hours. If it feels like work at 10 km, it is the wrong number.',
        ],
      },
      {
        heading: 'Set two targets, not one',
        blocks: [
          'Pick an A goal for a good day and a B goal you are confident of on an ordinary one, and start at B pace. If you reach 30 km feeling strong, the A goal is still available. If conditions turn or the day is simply not there, you have a race you can still finish well rather than a target you abandoned at halfway.',
          'Starting at A pace gives you one outcome if it goes right and no outcome at all if it does not.',
        ],
      },
    ],
  },
];

export const articleBySlug = (slug) => ARTICLES.find((a) => a.slug === slug);
