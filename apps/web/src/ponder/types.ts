import type {MathModel,Parameters} from '../../../../packages/ponder/src/runtime';
import type {SceneDefinition} from '../../../../packages/ponder/src/schema';
import type {AnimationFrame} from '../../../../packages/ponder/src/animation';
export type RendererProps={frame:AnimationFrame;reduced:boolean;model:MathModel;parameters:Parameters;step:SceneDefinition['steps'][number];interactive:boolean;onParameter:(key:string,value:number)=>void;onInteraction:()=>void;showAuxiliary:boolean;cameraReset:number};
