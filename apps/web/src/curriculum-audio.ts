import {usePreferences} from './settings/preferences';

export interface CurriculumAudioController {
  playClick: () => void;
  playAchievement: () => void;
}

export function createCurriculumAudioController():CurriculumAudioController {
  let clickAudio:HTMLAudioElement|undefined;
  let achievementAudio:HTMLAudioElement|undefined;
  // Warm the local asset and surface missing static files early; playback always uses this asset.
  void fetch('/audio/click_stereo.ogg',{method:'HEAD'}).catch(()=>{});
  const play=(audio:HTMLAudioElement)=>{audio.volume=usePreferences.getState().volume;if(audio.volume===0)return;try{audio.currentTime=0;}catch{/* Media metadata may still be loading. */}void audio.play().catch(()=>{/* Sound must never block a knowledge interaction. */});};
  return {
    playClick(){
      clickAudio??=new Audio('/audio/click_stereo.ogg');clickAudio.preload='auto';play(clickAudio);
    },
    playAchievement(){
      achievementAudio??=new Audio('/audio/Challenge_complete.ogg');achievementAudio.preload='auto';play(achievementAudio);
    },
  };
}
