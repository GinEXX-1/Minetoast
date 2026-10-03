/** Bounded arithmetic grammar. No code evaluation, properties, strings or assignments. */
type Ast={kind:'number';value:number}|{kind:'variable';name:string}|{kind:'unary';op:string;value:Ast}|{kind:'binary';op:string;left:Ast;right:Ast}|{kind:'call';name:string;args:Ast[]};
/** Seeded Bernoulli prefixes are repeatable experiments, never a convergence proof. */
const trialCache=new Map<string,Float64Array>();
export function trialFrequency(n:number,p:number,seed:number):number{
 const count=Math.floor(n);if(count<1||count>1000||p<0||p>1||!Number.isInteger(seed)||seed<1||seed>10)throw new Error('Invalid bounded trial experiment');
 const key=`${p}:${seed}`;let prefix=trialCache.get(key);
 if(!prefix){prefix=new Float64Array(1001);let state=seed;for(let i=1;i<=1000;i++){state=(Math.imul(state,1664525)+1013904223)>>>0;prefix[i]=prefix[i-1]+(state/4294967296<p?1:0);}if(trialCache.size>=32)trialCache.delete(trialCache.keys().next().value!);trialCache.set(key,prefix);}
 return prefix[count]/count;
}
const functions:Record<string,{arity:number;run:(...x:number[])=>number}>={floor:{arity:1,run:Math.floor},frequency:{arity:3,run:trialFrequency},sin:{arity:1,run:Math.sin},cos:{arity:1,run:Math.cos},tan:{arity:1,run:Math.tan},sqrt:{arity:1,run:Math.sqrt},abs:{arity:1,run:Math.abs},exp:{arity:1,run:Math.exp},log:{arity:1,run:Math.log},min:{arity:2,run:Math.min},max:{arity:2,run:Math.max}};
export function parseExpression(source:string):Ast{
 if(source.length>256||!source.trim())throw new Error('Expression size invalid');
 const tokens:string[]=[];const re=/\s*(?:(\d+(?:\.\d*)?|\.\d+)|([A-Za-z][A-Za-z0-9_]*)|([+\-*/^(),]))/y;let at=0;
 while(at<source.trimEnd().length){re.lastIndex=at;const m=re.exec(source);if(!m)throw new Error('Forbidden expression token');tokens.push(m[1]??m[2]??m[3]);at=re.lastIndex;}
 let pos=0,depth=0;const peek=()=>tokens[pos],take=()=>tokens[pos++];
 function expression(min=0):Ast{
  if(++depth>32)throw new Error('Expression nesting limit');
  const token=take();let left:Ast;
  if(token==='+'||token==='-')left={kind:'unary',op:token,value:expression(3)};
  else if(token==='('){left=expression();if(take()!==')')throw new Error('Missing closing parenthesis');}
  else if(token&&/^\d|^\./.test(token))left={kind:'number',value:Number(token)};
  else if(token&&/^[A-Za-z]/.test(token)){
   if(['constructor','prototype','__proto__'].includes(token))throw new Error('Forbidden identifier');
   if(peek()==='('){take();const args:Ast[]=[];if(peek()!==')'){args.push(expression());while(peek()===','){take();args.push(expression());}}if(take()!==')')throw new Error('Malformed function call');left={kind:'call',name:token,args};}
   else left={kind:'variable',name:token};
  }else throw new Error('Expected mathematical value');
  const precedence:Record<string,number>={'+':1,'-':1,'*':2,'/':2,'^':4};
  while(peek() in precedence&&precedence[peek()]>=min){const op=take(),p=precedence[op];left={kind:'binary',op,left,right:expression(op==='^'?p:p+1)};}
  depth--;return left;
 }
 const ast=expression();if(pos!==tokens.length)throw new Error('Unexpected expression suffix');return ast;
}
export function evaluateAst(ast:Ast,variables:Record<string,number>,expressions:Record<string,Ast>={},stack:string[]=[]):number{
 const ev=(x:Ast)=>evaluateAst(x,variables,expressions,stack);let value:number;
 switch(ast.kind){
 case 'number':value=ast.value;break;
 case 'variable':if(ast.name==='pi')value=Math.PI;else if(Object.hasOwn(variables,ast.name))value=variables[ast.name];else if(Object.hasOwn(expressions,ast.name)){if(stack.includes(ast.name)||stack.length>16)throw new Error('Cyclic expression');value=evaluateAst(expressions[ast.name],variables,expressions,[...stack,ast.name]);}else throw new Error(`Unknown variable ${ast.name}`);break;
 case 'unary':value=ast.op==='-'?-ev(ast.value):ev(ast.value);break;
 case 'binary':{const a=ev(ast.left),b=ev(ast.right);value=ast.op==='+'?a+b:ast.op==='-'?a-b:ast.op==='*'?a*b:ast.op==='/'?a/b:a**b;break;}
 case 'call':{const args=ast.args.map(ev),f=functions[ast.name];if(f){if(args.length!==f.arity)throw new Error('Function arity invalid');value=f.run(...args);}else if(Object.hasOwn(expressions,ast.name)&&args.length===1){if(stack.includes(ast.name)||stack.length>16)throw new Error('Cyclic function');value=evaluateAst(expressions[ast.name],{...variables,x:args[0]},expressions,[...stack,ast.name]);}else throw new Error(`Unknown function ${ast.name}`);break;}
 }
 if(!Number.isFinite(value)||Math.abs(value)>1e10)throw new Error('Undefined or unbounded mathematical value');return value;
}
export const compileExpression=(source:string)=>{const ast=parseExpression(source);return (variables:Record<string,number>,expressions:Record<string,Ast>={})=>evaluateAst(ast,variables,expressions);};
