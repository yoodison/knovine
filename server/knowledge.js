// Original concept inventory and suggested connections, not an official curriculum export.
// The four domains follow the Korean MOE's 2022 framework; scope remains teacher-reviewable.
const groups = [
  ['numbers','Numbers & operations',[
    ['Whole numbers','Place value','Number line','Comparing numbers','Rounding','Addition','Subtraction','Multiplication','Division','Order of operations'],
    ['Factors','Multiples','Prime numbers','Prime factorization','Greatest common factor','Least common multiple','Divisibility'],
    ['Equal parts','Fractions','Equivalent fractions','Simplifying fractions','Comparing fractions','Adding fractions','Subtracting fractions','Multiplying fractions','Dividing fractions','Mixed numbers'],
    ['Decimals','Decimal operations','Percentages','Ratios','Rates','Proportions','Unit rates','Scale drawings'],
    ['Integers','Absolute value','Adding integers','Multiplying integers','Rational numbers','Powers','Square roots','Irrational numbers','Real numbers'],
    ['Properties of powers','Scientific notation','Negative exponents','Recurring decimals','Estimating square roots','Rationalizing denominators']
  ]],
  ['relations','Patterns & relationships',[
    ['Patterns','Variables','Algebraic expressions','Substitution','Like terms','Distributive property','Simplifying expressions'],
    ['Equality','Equations','One-step equations','Two-step equations','Linear equations','Word problems','Simultaneous equations','Substitution method','Elimination method'],
    ['Inequalities','Solving inequalities','Inequality word problems','Polynomials','Polynomial operations','Factoring','Quadratic equations','Quadratic formula'],
    ['Coordinates','Ordered pairs','Graphs','Proportional relationships','Functions','Slope','Intercepts','Linear functions','Inverse proportion','Quadratic functions','Interpreting graphs']
  ]],
  ['geometry','Geometry & measurement',[
    ['Points and lines','Line segments','Angles','Parallel lines','Transversals','Angle relationships','Geometric construction'],
    ['Triangles','Triangle angle sum','Congruence','Quadrilaterals','Polygons','Interior angles','Exterior angles','Symmetry','Transformations'],
    ['Length and units','Perimeter','Area','Triangle area','Circle circumference','Circle area','Surface area','Volume','Unit conversion'],
    ['Similarity','Similar triangles','Pythagorean theorem','Distance in coordinates','Right triangles','Trigonometric ratios','Circle theorems','Tangent lines','Inscribed angles']
  ]],
  ['data','Data & chance',[
    ['Data collection','Statistical questions','Sampling','Frequency tables','Relative frequency','Bar charts','Histograms','Reading distributions'],
    ['Mean','Median','Mode','Range','Quartiles','Interquartile range','Box plots','Variance','Standard deviation','Comparing distributions'],
    ['Outcomes','Sample spaces','Counting outcomes','Probability','Complementary events','Experimental probability','Theoretical probability','Independent events'],
    ['Scatter plots','Correlation','Interpreting association','Sampling variability','Sample mean','Confidence intervals'],
    ['Population and sample','Data bias','Outliers','Cumulative frequency']
  ]]
];
const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const key=s=>norm(s)||'concept';
const mathNodes=[],mathEdges=[];
for (const [group,label,chains] of groups) {
  for (const chain of chains) chain.forEach((label,i)=>{
    if(!mathNodes.some(n=>n.id===key(label)))mathNodes.push({id:key(label),label,group,source:'curated'});
    if(i)mathEdges.push({source:key(chain[i-1]),target:key(label),kind:'suggested',provenance:'Knovine concept guide'});
  });
}
for(const [a,b] of [['Division','Fractions'],['Fractions','Decimals'],['Fractions','Ratios'],['Ratios','Proportions'],['Proportions','Proportional relationships'],['Integers','Variables'],['Multiplication','Distributive property'],['Linear equations','Linear functions'],['Factoring','Quadratic equations'],['Square roots','Pythagorean theorem'],['Proportions','Similarity'],['Area','Pythagorean theorem'],['Fractions','Probability'],['Percentages','Relative frequency'],['Coordinates','Scatter plots'],['Mean','Sample mean'],['Sampling','Sampling variability']])mathEdges.push({source:key(a),target:key(b),kind:'suggested',provenance:'Knovine concept guide'});
const languageGroups=[['expression','Expression',['Introducing yourself','Asking questions','Describing people','Describing places','Daily routines','Past experiences','Future plans','Giving opinions','Giving reasons','Comparing options','Making suggestions','Clarifying meaning']],['comprehension','Comprehension',['Main idea','Supporting details','Context clues','Vocabulary in context','Inference','Listening for gist','Listening for details','Following instructions','Recognizing tone','Summarizing','Comparing viewpoints','Evaluating evidence']],['language','Language resources',['Nouns','Pronouns','Verbs','Present tense','Past tense','Future tense','Articles','Prepositions','Adjectives','Adverbs','Sentence structure','Question forms','Connectors','Conditionals','Relative clauses','Word families']],['interaction','Interaction',['Turn taking','Requesting help','Checking understanding','Paraphrasing','Polite requests','Negotiating meaning','Agreeing and disagreeing','Explaining a process','Presenting an argument','Responding to feedback','Revising writing','Self reflection']]];
const languageNodes=languageGroups.flatMap(([group,,labels])=>labels.map(label=>({id:key(label),label,group,source:'curated'})));
const languageEdges=languageGroups.flatMap(([, ,labels])=>labels.slice(1).map((label,i)=>({source:key(labels[i]),target:key(label),kind:'related',provenance:'Knovine communication guide; not prerequisite order'})));
export const packs=[
  {id:'discovery',title:'Start with my questions',subtitle:'No fixed syllabus',groups:[],nodes:[],edges:[],sources:[],note:'Your map grows from recorded questions and explanations.'},
  {id:'math',title:'Middle school mathematics',subtitle:'Numbers, algebra, geometry & data',groups:groups.map(([id,label])=>({id,label})),nodes:mathNodes,edges:mathEdges,sources:[{title:'Korean MOE — 2022 curriculum framework',url:'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=340&boardSeq=93073&lev=0&searchType=null&statusYN=W'},{title:'OpenStax Prealgebra 2e',url:'https://openstax.org/details/books/prealgebra-2e'}],note:'Original concept guide organized around the 2022 Korean math domains, with foundation and extension concepts. Connections are suggestions, not an official or exhaustive curriculum graph.'},
  {id:'english',title:'English communication',subtitle:'Skills, language & real situations',groups:languageGroups.map(([id,label])=>({id,label})),nodes:languageNodes,edges:languageEdges,sources:[],note:'An original communication-skills guide. Links indicate related skills, not a fixed prerequisite hierarchy or certified language level.'}
];
export const catalog=()=>packs.map(({nodes,edges,...p})=>({...p,conceptCount:nodes.length,connectionCount:edges.length}));
export function getPack(id){const p=packs.find(p=>p.id===id);if(!p)throw Error('INVALID_PACK');return structuredClone(p);}
const aliases={'분수':'Fractions','동치분수':'Equivalent fractions','동치인분수':'Equivalent fractions','약분':'Simplifying fractions','비율':'Ratios','비례':'Proportions','평균':'Mean','방정식':'Equations','일차방정식':'Linear equations','이차방정식':'Quadratic equations','함수':'Functions','일차함수':'Linear functions','확률':'Probability','피타고라스정리':'Pythagorean theorem','제곱근':'Square roots','평행선':'Parallel lines'};
export function conceptId(label){return key(aliases[norm(label)]||label);}
export function buildGraph(packId,observations=[],extra={nodes:[],edges:[]}){
  const p=getPack(packId),nodes=new Map(p.nodes.map(n=>[n.id,{...n,evidence:[],state:'unobserved'}]));
  const labels=new Map(p.nodes.map(n=>[conceptId(n.label),n.id])),mapping=new Map();
  for(const n of extra.nodes){const normalized=conceptId(n.label),id=labels.get(normalized)||n.id;mapping.set(n.id,id);if(!nodes.has(id)){nodes.set(id,{...n,id,evidence:[],state:'unobserved'});labels.set(normalized,id);}}
  const edges=[...p.edges];
  for(const e of extra.edges){const source=mapping.get(e.source)||e.source,target=mapping.get(e.target)||e.target;if(source!==target&&nodes.has(source)&&nodes.has(target)&&!edges.some(x=>x.source===source&&x.target===target))edges.push({...e,source,target});}
  if([...nodes.values()].some(n=>n.group==='custom')){p.groups.push({id:'custom',label:'Your course scope'});if(p.id==='discovery'){p.title='Your concept scope';p.note='User-provided concepts and related connections. Learning evidence is recorded separately; this is not an assessment.';}}
  const resolveId=label=>{const id=conceptId(label);return nodes.has(id)?id:[...nodes.values()].find(n=>conceptId(n.label)===id)?.id||id;};
  for(const o of [...observations].sort((a,b)=>(Date.parse(b.createdAt)||0)-(Date.parse(a.createdAt)||0))){
    const names=[...(o.path||[]),o.topic].filter(Boolean);
    for(const label of names){const id=resolveId(label);if(!nodes.has(id))nodes.set(id,{id,label,group:'discovered',source:'conversation',evidence:[],state:'unobserved'});const n=nodes.get(id);if(resolveId(o.topic)===id&&!n.evidence.some(x=>x.id===o.id)){if(!n.evidence.length)n.state=o.signal==='possible_confusion'?'worth-checking':o.signal==='learner_explanation'?'explained':'question';n.evidence.push(o);}}
    for(let i=1;i<(o.path||[]).length;i++){const a=resolveId(o.path[i-1]),b=resolveId(o.path[i]);if(a!==b&&!edges.some(e=>e.source===a&&e.target===b))edges.push({source:a,target:b,kind:'observed',provenance:'Conversation-suggested connection'});}
  }
  if([...nodes.values()].some(n=>n.group==='discovered'))p.groups.push({id:'discovered',label:'From your conversations'});
  const all=[...nodes.values()];return {...p,nodes:all,edges,observedCount:all.filter(n=>n.evidence.length).length,observationCount:observations.length};
}
export function findPath(graph,start,end){
  if(!graph.nodes.some(n=>n.id===start)||!graph.nodes.some(n=>n.id===end))return [];
  const queue=[[start]],seen=new Set([start]);
  for(const path of queue){const tail=path.at(-1);if(tail===end)return path;for(const e of graph.edges){const n=e.source===tail?e.target:e.kind==='related'&&e.target===tail?e.source:null;if(n&&!seen.has(n)){seen.add(n);queue.push([...path,n]);}}}return [];
}
