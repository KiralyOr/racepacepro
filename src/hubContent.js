// Distance specific content for the four pace chart hubs.
//
// The hubs were the thinnest pages on the site at around 165 words, and they
// target the most valuable queries here: "marathon pace chart", "5k pace
// chart" and so on. A page that is mostly a table gives a reader no reason to
// stay and a search engine little to rank.
//
// Figures that can be derived are derived. stepUpPenalty computes how much
// slower a longer race is per kilometre straight from the Riegel exponent, so
// the prose cannot drift away from the predictor.

import { POPULAR_DISTANCES_KM, RIEGEL_STANDARD } from './paceMath';

// How much slower, per unit of distance, a longer race is run than a shorter
// one. Riegel says time scales as (d2/d1)^e, so pace scales as (d2/d1)^(e-1).
export const stepUpPenalty = (fromKm, toKm, exponent = RIEGEL_STANDARD) =>
  Math.pow(toKm / fromKm, exponent - 1) - 1;

export const penaltyPercent = (fromKm, toKm) =>
  `${(stepUpPenalty(fromKm, toKm) * 100).toFixed(1)}%`;

const { '5K': KM_5, '10K': KM_10, 'Half Marathon': KM_HALF, Marathon: KM_FULL } =
  POPULAR_DISTANCES_KM;

export const HUB_CONTENT = {
  '5k': {
    pacing: [
      'The 5K is short enough that an even pace is close to optimal and long enough that going out too hard is unrecoverable. There is no cruising phase to settle into and no second half in which to fix a mistake, so the first kilometre matters more here than at any other distance.',
      'The pace should feel genuinely too easy for the first kilometre. If it feels correct, it is too fast. Nearly everyone runs their opening kilometre quickest and their third kilometre slowest, and the gap between those two is a fair measure of how well the race was judged.',
      'The third kilometre is where a 5K is decided. It is far enough in that the early adrenaline is gone, and far enough from the finish that you cannot yet see it. Runners who hold pace through that stretch usually hold it to the line.',
      'Unlike the longer distances, a 5K needs a real warm up. You are running at close to your maximum sustainable effort from the first stride, and starting cold means spending the opening kilometre getting ready rather than racing.',
    ],
    mistakes: [
      'Starting at a pace you can hold for two kilometres and hoping the third looks after itself.',
      'Skipping the warm up, then spending the first kilometre warming up instead of racing.',
      'Treating a 5K as an easy distance because it is the shortest one on this list.',
    ],
    faq: [
      {
        question: 'How far is a 5K in miles?',
        answer: `A 5K is 5 kilometres, or ${(KM_5 / 1.609344).toFixed(2)} miles. On a standard 400 metre outdoor track that is twelve and a half laps, which is exactly how a track 5000 metres is run.`,
      },
      {
        question: 'Should I negative split a 5K?',
        answer:
          'Slightly, if anything. A near even pace with a marginally quicker final kilometre is the fastest way to run one. A large deliberate negative split means the early kilometres were too slow, and over a distance this short there is not enough race left to make that back.',
      },
      {
        question: 'How much slower is 10K pace than 5K pace?',
        answer: `Roughly ${penaltyPercent(KM_5, KM_10)} slower per kilometre, following the Riegel formula. For most runners that is somewhere between ten and twenty seconds per kilometre.`,
      },
    ],
  },

  '10k': {
    pacing: [
      'The 10K sits between the two things that make a runner fast: the speed that wins a 5K and the endurance that carries a half. It is run at close to threshold effort for most people, which means hard but controlled, not the barely contained effort of a 5K.',
      `Expect to run it about ${penaltyPercent(KM_5, KM_10)} slower per kilometre than your 5K pace. That figure comes from the same formula the predictor uses, and it is a reasonable starting point if you have a recent 5K and no recent 10K.`,
      'The stretch between six and eight kilometres is where this race is won or lost. The novelty of the start has worn off, the finish is not close enough to sprint for, and the effort has been sustained long enough to hurt. Runners who are honest about their pace early have something to give there; runners who paced it like a 5K do not.',
      'Even pacing is the right plan. The 10K is short enough that there is no fuelling to think about and no real fatigue curve to plan around, so almost every complication is one you introduced yourself in the opening two kilometres.',
    ],
    mistakes: [
      'Pacing it like a 5K, which works for six kilometres and then stops working abruptly.',
      'Treating the last two kilometres as a formality. They are a third of the discomfort.',
      'Racing on a hilly course at the pace a flat course produced, rather than by effort.',
    ],
    faq: [
      {
        question: 'How far is a 10K in miles?',
        answer: `A 10K is 10 kilometres, or ${(KM_10 / 1.609344).toFixed(2)} miles. It is twice the 5K distance and twenty five laps of a standard 400 metre track, which makes it a common step up for anyone who has raced a 5K.`,
      },
      {
        question: 'Is 10K race pace the same as threshold pace?',
        answer:
          'For a well trained runner finishing in around forty minutes, a 10K is run close to threshold, so the two are near enough to treat as the same. For someone taking an hour or more, the race lasts longer than threshold effort can be held, so 10K pace sits below it. The distance is fixed but the effort it represents is not.',
      },
      {
        question: 'Do I need to fuel during a 10K?',
        answer:
          'No. At the pace most people race a 10K it is over well before stored carbohydrate becomes a limit. Arrive properly fed and hydrated, take water if it is hot, and skip the gels.',
      },
    ],
  },

  'half-marathon': {
    pacing: [
      'The half marathon is the distance most often misjudged, because the name suggests it is half a marathon in effort as well as distance. It is not. It is run much closer to 10K intensity than to marathon intensity, and the pacing discipline it needs is closer to a marathon.',
      `Against your 10K pace, expect roughly ${penaltyPercent(KM_10, KM_HALF)} slower per kilometre. Against a marathon, a half is run about ${penaltyPercent(KM_HALF, KM_FULL)} quicker per kilometre, which is why a marathon goal derived carelessly from a half time is usually optimistic.`,
      'This is the shortest distance where a small pacing error compounds into minutes. Five seconds per kilometre over the top costs you about a minute and three quarters across the race, and it costs it in the last five kilometres rather than spread evenly, which is what makes the finish feel so much worse than the number suggests.',
      'An even pace or a very slight negative split is the target. The second half should feel like a controlled effort you are gradually spending, not a rescue operation.',
      'Fuelling starts to matter here, but less than most people assume. The deciding factor is time on your feet rather than the distance itself: a runner out for two and a half hours has a genuine fuelling problem, while one finishing inside ninety minutes largely does not. Work out which of those you are before deciding how many gels to carry.',
    ],
    mistakes: [
      'Assuming half marathon effort sits halfway between 10K and marathon effort. It sits much closer to the 10K end.',
      'Going out at the pace your goal marathon would need, on the theory that a half should feel comfortable at that pace.',
      'Trying new gels or new shoes on race day because the distance feels manageable enough to experiment.',
    ],
    faq: [
      {
        question: 'How far is a half marathon in miles?',
        answer: `A half marathon is ${KM_HALF} kilometres, or ${(KM_HALF / 1.609344).toFixed(2)} miles. It is exactly half the marathon distance, which is where the name comes from and, unhelpfully, where most of the confusion about how hard to run it starts.`,
      },
      {
        question: 'Do I need to take gels in a half marathon?',
        answer:
          'For most runners one or two is enough, and plenty finish comfortably without any. It depends far more on how long you are out there than on the distance itself: a runner finishing in two and a half hours has a very different fuelling problem from one finishing in ninety minutes.',
      },
      {
        question: 'How much faster is half marathon pace than marathon pace?',
        answer: `About ${penaltyPercent(KM_HALF, KM_FULL)} per kilometre, using the Riegel formula. If you are hoping to run a marathon at close to your half pace, that gap is the reason it will not happen.`,
      },
    ],
  },

  marathon: {
    pacing: [
      'The marathon punishes pacing errors more than any other distance, and it punishes them late, when nothing can be done. A mistake in the first ten kilometres does not present itself until after thirty, by which point the only remaining decision is how much time you lose.',
      `Against a half marathon, expect roughly ${penaltyPercent(KM_HALF, KM_FULL)} slower per kilometre. Runners who set a marathon target by doubling a half time and adding a few minutes almost always end up with a number that was never achievable.`,
      'Five seconds per kilometre faster than planned feels like nothing for the first hour. Across the full distance it is about three and a half minutes, and because the deficit is repaid in the last ten kilometres rather than spread out, it is the difference between finishing strongly and walking.',
      'An even pace or a slight negative split is what almost every good marathon looks like. Banking time is the single most common plan and the single most reliable way to run a slow marathon: the energy cost of running faster than your sustainable pace is not linear, so the minute you gain early costs several later.',
    ],
    mistakes: [
      'Banking time early against the hills, the heat or the finish. It does not work, and the mechanism by which it fails is well understood.',
      'Setting the goal from a half marathon time without applying the endurance penalty.',
      'Changing anything on race day. Shoes, gels, breakfast and kit should all be things you have already run long in.',
    ],
    faq: [
      {
        question: 'How far is a marathon in miles?',
        answer: `A marathon is ${KM_FULL} kilometres, or ${(KM_FULL / 1.609344).toFixed(2)} miles. The awkward figure is the officially fixed distance rather than a rounding of something tidier, and every certified marathon course is measured to it.`,
      },
      {
        question: 'Should I bank time early in a marathon?',
        answer:
          'No. It is intuitive and it is wrong. Running above your sustainable pace costs disproportionately more energy than running at it, so time gained early is repaid with interest in the final ten kilometres. Nearly every personal best is run at an even pace or slightly negative.',
      },
      {
        question: 'How much slower is marathon pace than half marathon pace?',
        answer: `Around ${penaltyPercent(KM_HALF, KM_FULL)} slower per kilometre by the Riegel formula, and often more than that for anyone who has not done marathon specific long runs. Riegel assumes you are equally trained for both distances, which is rarely true of the marathon.`,
      },
    ],
  },
};

export const hubContentFor = (raceId) => HUB_CONTENT[raceId] || null;
