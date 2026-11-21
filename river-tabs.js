'use strict';
(()=>{
const links={M01:'case-needs.html',M02:'case-needs.html#from-concept',M03:'case-needs.html#five-minutes',M04:'case-needs.html#feature-decisions',M05:'case-needs.html#question-order',M09:'case-interaction.html',M10:'case-evidence.html',M14:'case-interaction.html'};
const notes={
 M01:'早期方案同时包含数字自我、目标任务和陪伴形态。组会提出目标用户、家庭场景及信息可见范围等问题，尚未确定最终产品。',
 M02:'比较心理机制与青少年游戏案例，拆解行动启动、理解经历与陪伴体验，形成早期定位和功能取舍笔记。',
 M03:'通过五分钟学习任务的模拟情境，区分题目太难、害怕再失败、疲惫和外部目标等受阻原因；产品记录与心理效果测量分开设计。',
 M04:'逐项追问功能的必要性，讨论目标是否由孩子自主选择，以及表达入口、信息权限与下一步支持。提出方案与团队采纳分别记录。',
 M05:'参与题项统筹，团队收集42份探索性答卷。复核支持偏好、隐私顾虑及探索分析；不以小样本推断总体需求。',
 M06:'梳理休息、表达、真人支持及现有数字工具，形成快捷表达与自由输入等候选取舍。公开扫描不等于实际试用。',
 M07:'历史记录确认身心支持与亲子任务两路并行。此处表示当时的分工，后续方案变化需要继续沿记录追踪。',
 M08:'追问实体硬件、动作识别和压力测量分别解决什么问题，同时核查角色许可与替代形式。技术可行性尚待原型验证。',
 M09:'提出把身体动作接入故事，以动作触发线索或剧情，并构思一个可暂停、可退出的回合。提议被接收不等于工程实现。',
 M10:'逐项核对研究人群、测量、比较条件及原始试验，审查瑜伽、韧性与脑源性神经营养因子之间的论证；研究审查与团队采用状态分开。',
 M11:'以相同任务比较游戏、普通跟练和硬件条件，整理机制摘录，并将近期交付收敛为概念情境与最小交互。',
 M12:'团队提出家长安排、共同协商与孩子自定任务的差别，追问奖励是否带来压力。这里保留历史问题清单，后续沿革尚待核查。',
 M13:'按真实经历、已有应对、支持偏好和约束分别整理材料，进行问卷复核、试编码与定向二手研究。尚未完成新的目标用户访谈。',
 M14:'具身叙事工作稿将探索、情节触发的身体操作及恢复自由行动连接起来。它是继续探索的概念方案，未证明效果，也不是团队唯一方向。',
 M15:'第三次讨论从单一瑜伽与韧性方向转向亲子表达，开始梳理各自表达、建立连接、走向线下的连续体验。不是对历史亲子任务路线的简单合并。',
 M16:'创作动作和拟声留言后，先由本人预览，可重做、私存、删除或主动分享。私人把玩不自动成为发送给家长的数据。',
 M17:'双方都能发起和接续留言，也能暂缓回应。家长端按需提供简短回应支持，熟悉动作可带到见面后的相处中。',
 M18:'轮流操控角色、尝试不同回应，并自愿把互动延伸到现实。它是共同游戏的候选机制，亲子关系改善仍待验证。',
 M19:'围绕队友的树懒方案追问目标年龄、声音识别依据与亲子交流方式，提出声音记录、回放等候选。与贴贴的版本关系仍待核查。',
 M20:'树懒方案出现在11月17日评审记录中。现有材料没有可明确归属的口头点评，后续书面反馈尚未取得。'
};

const assignments={"6-6": "M01", "7-2": "M02", "7-5": "M03", "8-2": "M04", "7-0": "M05", "6-5": "M06", "7-4": "M07", "4-1": "M08", "5-3": "M09", "6-3": "M10", "5-4": "M11", "5-0": "M12", "4-2": "M13", "5-1": "M14", "6-4": "M15", "4-3": "M16", "8-3": "M17", "4-5": "M18", "7-3": "M19", "5-6": "M20"};
const data=window.TERRAIN_PREVIEW, NS='http://www.w3.org/2000/svg',map=document.querySelector('#paper-map'),vp=document.querySelector('.viewport');
const make=(tag,attrs={},parent=map)=>{const e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));parent.append(e);return e;};
const defs=make('defs'), shadow=make('filter',{id:'cut-shadow',x:'-20%',y:'-20%',width:'140%',height:'150%'},defs);
make('feDropShadow',{dx:0,dy:1.3,stdDeviation:.9,'flood-color':'#3c2e50','flood-opacity':.18},shadow);
const grain=make('pattern',{id:'grain',width:128,height:128,patternUnits:'userSpaceOnUse'},defs),canvas=document.createElement('canvas');canvas.width=canvas.height=128;
const ctx=canvas.getContext('2d'),bitmap=ctx.createImageData(128,128);let seed=37;
for(let i=0;i<bitmap.data.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const v=seed>>>24;bitmap.data[i]=bitmap.data[i+1]=bitmap.data[i+2]=v>127?255:20;bitmap.data[i+3]=Math.abs(v-127)*.34;}
ctx.putImageData(bitmap,0,0);make('image',{width:128,height:128,href:canvas.toDataURL()},grain);
const base=make('g'),river=make('g',{id:'river-valley','pointer-events':'none'}),ground=make('g',{id:'terrain-sheets'}),raised=make('g');
const parts=[],byNode=new Map(),openedOrder=[],associations=window.TERRAIN_SHEET_RECORDS;let active=null;const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const path=rings=>rings.map(r=>'M'+r.map(p=>p.join(',')).join('L')+'Z').join('');
let pitch=46,yaw=9,suppress=0,raf=0,last=0;
function project(x,y,z=0){const a=yaw*Math.PI/180,p=pitch*Math.PI/180;return [550+Math.cos(a)*(x-500)-Math.sin(a)*(y-325),360+Math.cos(p)*(Math.sin(a)*(x-500)+Math.cos(a)*(y-325))-Math.sin(p)*1.28*z];}
function matrix(z,dx=0,dy=0,lift=0,rotation=0,cx=0,cy=0){const r=rotation*Math.PI/180,co=Math.cos(r),si=Math.sin(r),at=(x,y)=>project(cx+co*(x-cx)-si*(y-cy)+dx,cy+si*(x-cx)+co*(y-cy)+dy,z+lift);const o=at(0,0),x=at(1,0),y=at(0,1);return `matrix(${x[0]-o[0]} ${x[1]-o[1]} ${y[0]-o[0]} ${y[1]-o[1]} ${o[0]} ${o[1]})`;}
const phases=[0,70,150,230,310,390,470,560],progress=[0,.02,.11,.32,.58,.82,.96,1],lifts=[0,1.5,3,4,5,6,5.5,5],rotations=[0,-.15,-.45,-.3,.15,.3,.1,0];
function sheet(rings,z,fill,edge,id=null,node=null){
 const d=path(rings),home=make('g',{},id?ground:base),g=make('g',{},home),side=make('path',{d,fill:edge,'fill-rule':'evenodd'},g),faceGroup=make('g',{},g);
 const face=make('path',{d,fill,stroke:edge,'stroke-width':.55,'stroke-linejoin':'round','fill-rule':'evenodd',filter:'url(#cut-shadow)'},faceGroup);
 make('path',{d,fill:'none',stroke:'#fff8ff','stroke-opacity':.38,'stroke-width':.6,'pointer-events':'none'},faceGroup);
 make('path',{d,fill:'url(#grain)',opacity:.27,'fill-rule':'evenodd','pointer-events':'none'},faceGroup);
 const xs=rings[0].map(p=>p[0]),ys=rings[0].map(p=>p[1]),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
 const part={id,node,rings,z,g,home,side,faceGroup,face,fill,cx,cy,time:0,goal:0,phase:-1,dx:cx<500?-105:105,dy:cy<325?-42:42};parts.push(part);
 if(id){
  home.dataset.home=id;face.id='paper-face-'+id;part.rim=make('path',{d,fill:'none',stroke:'#d9eb7c','stroke-width':2.4,'vector-effect':'non-scaling-stroke','fill-rule':'evenodd',opacity:0,'pointer-events':'none'},faceGroup);
  g.classList.add('whole-sheet');g.dataset.sheet=id;if(node)g.dataset.node=node.id;
  g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',node?node.title:'抽取地形纸层');g.setAttribute('aria-expanded','false');
  make('title',{},g).textContent=node?node.title:'点击抽出，再点放回';
  const footprint=make('path',{d,fill:'none',stroke:edge,'stroke-width':1,'stroke-dasharray':'4 5',opacity:0,'pointer-events':'none'},home);part.footprint=footprint;
  g.addEventListener('click',()=>{if(performance.now()>suppress)toggle(part);});
  g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(part);}});
  g.addEventListener('mouseenter',()=>document.querySelector('#hover-label').textContent=node?node.title:'整张纸层 · 点击抽出或放回');
  g.addEventListener('mouseleave',()=>document.querySelector('#hover-label').textContent='薄纸切边 / 独立抽层');
  if(node)byNode.set(node.id,part);
 }
 return part;
}
const board=[[[0,0],[1000,0],[1000,650],[0,650],[0,0]]];
for(let i=0;i<6;i++)sheet(board,-13+i*2.6,i%2?'#c2b8cd':'#d9d0e2','#a99db7');
sheet(board,3,'#e2dbea','#b6a9c5');
const purples=['#eee7f5','#e4d9ef','#d7c8e8','#c9b5e0','#bba0d7','#ab8bca','#9874bc','#8863ad','#77529d','#6b4890'];
const blues=['#e9f0f7','#d9e8f3','#c4deee','#b0d1e6','#99c1db','#80aed0','#699bc3','#5388b5','#4276a6','#396896'];
data.layers.forEach((layer,i)=>{const gradient=make('linearGradient',{id:'elevation-'+i,gradientUnits:'userSpaceOnUse',x1:0,y1:0,x2:1000,y2:0},defs);for(const[o,c]of [[0,purples[i]],[.35,purples[i]],[1,blues[i]]])make('stop',{offset:o,'stop-color':c},gradient);layer.shapes.forEach((rings,j)=>{const id=i+'-'+j,node=data.nodes.find(n=>n.id===assignments[id]);sheet(rings,layer.z+4,`url(#elevation-${i})`,'#91809f',id,node);});});
const valleyParts=[];
for(const layer of window.RIVER_VALLEY.layers){
 const g=make('g',{'data-kind':layer.kind,'data-z':layer.z},river);
 for(const rings of layer.shapes){
  const d=path(rings),face=make('path',{d,fill:layer.fill,stroke:layer.edge,'stroke-width':.45,'fill-rule':'evenodd','stroke-linejoin':'round',filter:layer.kind==='bank'?'url(#cut-shadow)':'none'},g);
  make('path',{d,fill:'url(#grain)',opacity:layer.kind==='water'?.14:.27,'fill-rule':'evenodd','pointer-events':'none'},g);
 }
 valleyParts.push({g,z:layer.z});
}
function render(force=false){
 for(const p of parts){
 // Restore stacking at the exact endpoint even when the last stepped pose already rendered.
 if(p.time===0&&p.g.parentNode!==p.home)p.home.prepend(p.g);
 else if(p.time>0&&p.g.parentNode!==raised)raised.append(p.g);
 let k=0;while(k<7&&p.time>=phases[k+1])k++;if(!force&&p.phase===k)continue;p.phase=k;
 const f=progress[k],args=[p.dx*f,p.dy*f,lifts[k],rotations[k],p.cx,p.cy];p.faceGroup.setAttribute('transform',matrix(p.z,...args));p.side.setAttribute('transform',matrix(p.z-2,...args));
 p.g.dataset.phase=k;p.g.dataset.time=p.time.toFixed(1);p.g.dataset.open=String(p.goal===560);
 if(p.footprint){p.footprint.setAttribute('transform',matrix(p.z));p.footprint.setAttribute('opacity',f*.55);}

 }
 updateConnector();
 if(force){for(const v of valleyParts)v.g.setAttribute('transform',matrix(v.z));map.dataset.yaw=yaw;map.dataset.pitch=pitch;}
}
function tick(now){const dt=Math.min(now-last,40);last=now;let moving=false;for(const p of parts){if(p.time!==p.goal){p.time+=Math.sign(p.goal-p.time)*Math.min(dt,Math.abs(p.goal-p.time));if(p.time!==p.goal)moving=true;}}render();if(moving)raf=requestAnimationFrame(tick);else raf=0;}
function showCard(p){
 active=p;
 for(const q of parts){if(!q.id)continue;q.rim.setAttribute('opacity',q===p?1:0);q.g.classList.toggle('is-current',q===p);q.chip?.setAttribute('aria-current',String(q===p));if(q.card)q.card.hidden=q!==p;}
 const empty=document.querySelector('#card-empty');empty.hidden=!!p;
 if(p){document.querySelector('#card-content').append(p.card);p.card.hidden=false;document.querySelector('#paper-card').dataset.sheet=p.id;}
 else {delete document.querySelector('#paper-card').dataset.sheet;}
 updateConnector();
}
function updateConnector(){
 const line=document.querySelector('#card-connector path');if(!active||innerWidth<1000){line.setAttribute('d','');return;}
 const wrapper=document.querySelector('.map-layout').getBoundingClientRect(),card=document.querySelector('#paper-card').getBoundingClientRect();
 const pt=new DOMPoint(active.anchor[0],active.anchor[1]).matrixTransform(active.faceGroup.getScreenCTM());
 const x=pt.x-wrapper.left,y=pt.y-wrapper.top,ex=card.left-wrapper.left+8,ey=card.top-wrapper.top+46;
 line.setAttribute('d',`M${x},${y} C${x+30},${y} ${ex-40},${ey} ${ex},${ey}`);
}
function toggle(p){
 p.goal=p.goal?0:560;const opened=!!p.goal;p.g.setAttribute('aria-expanded',String(opened));
 if(p.node)document.querySelector(`.tab-index [data-node="${p.node.id}"]`).setAttribute('aria-expanded',String(opened));
 const i=openedOrder.indexOf(p);if(i>=0)openedOrder.splice(i,1);
 if(opened){openedOrder.push(p);p.chip.hidden=false;showCard(p);}else{p.chip.hidden=true;p.card.hidden=true;if(active===p)showCard(openedOrder.at(-1)||null);}
 document.getElementById('announce').textContent=(opened?'已抽出':'已放回')+(p.node?p.node.title:'地形纸层');
 if(reduced.matches){p.time=p.goal;render();}else if(!raf){last=performance.now();raf=requestAnimationFrame(tick);}
}
for(const node of data.nodes){const p=byNode.get(node.id),b=document.createElement('button');b.dataset.node=node.id;b.textContent=node.title;b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','record-'+node.id);b.onclick=()=>toggle(p);document.querySelector('.tab-index').append(b);const article=document.createElement('article');article.id='record-'+node.id;article.hidden=true;
 const close=document.createElement('button');close.className='close';close.textContent='收回';close.setAttribute('aria-label','收回'+node.title);close.onclick=()=>toggle(p);article.append(close);
 for(const[tag,cls,txt]of [['p','meta',node.id+' / 研究记录'],['h2','',node.title],['p','status',node.status],['p','',notes[node.id]],['p','source','依据 · '+node.source]]){const e=document.createElement(tag);e.className=cls;e.textContent=txt;article.append(e);}if(links[node.id]){const a=document.createElement('a');a.href=links[node.id];a.textContent='阅读相关案例 ↗';article.append(a);}document.getElementById('records').append(article);p.card=article;}
// A card for every extractable sheet. Context collections describe geometric nesting only.
for(const p of parts.filter(p=>p.id)){
 const meta=associations[p.id],recordIds=p.node?[p.node.id]:meta.records;
 if(!p.card){
  p.card=document.createElement('article');p.card.id='paper-record-'+p.id;p.card.hidden=true;
  const close=document.createElement('button');close.className='close';close.textContent='收回';close.onclick=()=>toggle(p);p.card.append(close);
  const label=document.createElement('p');label.className='meta';label.textContent=recordIds.length?'同一地形中的记录':'地形留白';p.card.append(label);
  const title=document.createElement('h2');title.textContent=recordIds.length?`${recordIds.length} 项记录`:'这片尚未绑定研究';p.card.append(title);
  const explanation=document.createElement('p');explanation.className='collection-note';explanation.textContent=recordIds.length?'以下记录位于这片地形的叠层中，可分别打开。':'这片只承担地形构图，不代表新增研究或成果。';p.card.append(explanation);
  for(const id of recordIds){const n=data.nodes.find(n=>n.id===id),b=document.createElement('button');b.className='related-record';b.textContent=n.title;b.dataset.node=id;b.onclick=()=>{const q=byNode.get(id);if(q.goal)showCard(q);else toggle(q);};p.card.append(b);}
  document.querySelector('#records').append(p.card);
 }
 p.card.dataset.sheet=p.id;p.card.dataset.records=recordIds.join(',');p.g.setAttribute('aria-controls',p.card.id);
 const bounds=p.face.getBBox();
 p.anchor=[p.cx,p.cy];let distance=Infinity;
 for(let iy=1;iy<12;iy++)for(let ix=1;ix<12;ix++){const pt=new DOMPoint(bounds.x+bounds.width*ix/12,bounds.y+bounds.height*iy/12);if(p.face.isPointInFill(pt)){const d=(pt.x-p.cx)**2+(pt.y-p.cy)**2;if(d<distance){distance=d;p.anchor=[pt.x,pt.y];}}}
 const thumb=make('svg',{viewBox:`${bounds.x-4} ${bounds.y-4} ${bounds.width+8} ${bounds.height+8}`,class:'paper-thumbnail','aria-hidden':'true'},p.card);make('use',{href:'#paper-face-'+p.id},thumb);p.card.prepend(thumb);
 const chip=document.createElement('button');chip.hidden=true;chip.dataset.sheet=p.id;chip.textContent=p.node?p.node.title:recordIds.length?`同片记录 · ${recordIds.length} 项`:'地形留白';chip.onclick=()=>showCard(p);p.chip=chip;document.querySelector('#opened-papers').append(chip);
}
window.addEventListener('resize',updateConnector);
let drag=null;map.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,yaw,pitch,moved:false};});
map.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.hypot(dx,dy)<5)return;drag.moved=true;map.setPointerCapture(e.pointerId);vp.classList.add('rotating');yaw=drag.yaw+dx*.22;pitch=Math.max(8,Math.min(70,drag.pitch-dy*.18));render(true);});
const release=()=>{if(drag?.moved)suppress=performance.now()+300;drag=null;vp.classList.remove('rotating');};window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);
vp.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')yaw-=5;if(e.key==='ArrowRight')yaw+=5;if(e.key==='ArrowUp')pitch=Math.min(70,pitch+4);if(e.key==='ArrowDown')pitch=Math.max(8,pitch-4);render(true);});
document.querySelector('#home-view').onclick=()=>{yaw=9;pitch=46;document.querySelector('#view').setAttribute('aria-pressed','false');render(true);};
document.querySelector('#view').onclick=e=>{const top=e.currentTarget.getAttribute('aria-pressed')!=='true';yaw=top?0:9;pitch=top?0:46;e.currentTarget.setAttribute('aria-pressed',String(top));render(true);};
document.querySelector('#zoom').onclick=e=>{e.currentTarget.setAttribute('aria-pressed',String(vp.classList.toggle('zoom')));updateConnector();};vp.addEventListener('scroll',updateConnector);
render(true);
})();
