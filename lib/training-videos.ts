/**
 * Spelling Bee Training Mode: YouTube videos (M.T-5 teaches how to spell).
 * Add or edit entries here; each link opens on YouTube. No DB tracking.
 */
export type TrainingVideo = {
  title: string;
  url: string;
};

export const TRAINING_VIDEOS: TrainingVideo[] = [
  {
    title: "Introduction & How To Spell CAT",
    url: "https://youtube.com/shorts/DlCZrLgBEhQ?feature=shared",
  },
  {
    title: "ROAD TRIP SONG",
    url: "https://youtube.com/shorts/lZwVfeJnA_Y?feature=shared",
  },
  {
    title: "Episode 2",
    url: "https://youtube.com/shorts/8j2oovq1Olw?si=vZFBYQoxHVmlLXXs",
  },
];
