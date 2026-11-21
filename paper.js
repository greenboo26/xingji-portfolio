'use strict';

// Projection, contour interpolation, paper material and extraction adapted from Work A.
function mountPaperMap(root, onSelect) {
  const stage = root.querySelector('.paper-stage');
  const map = stage.querySelector('svg');
  const pinGroup = stage.querySelector('.paper-pins');
  const pins = Array.from(pinGroup.querySelectorAll('[data-paper-case]'));
  const viewButtons = root.querySelectorAll('[data-paper-view]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const angles = {angle:[.80,-.12], top:[Math.PI/2,0], front:[.26,-.14]};
  const reduced = () => motion.matches;
  const step = .135;
  const leftEdge=-7.8, rightEdge=7.8, nearEdge=-4.35, farEdge=4.35;
  const board = [[leftEdge,nearEdge],[rightEdge,nearEdge],[rightEdge,farEdge],[leftEdge,farEdge]];
  const pigments = {
    MAIN:['#eee5fa','#e1d4f5','#d3c0ee','#c0aae6','#ad92db','#9677cc','#8263bf'],
    A:['#e4f0fb','#d0e5fb','#bcd9f5','#a3caed','#83b5e1','#659ad1','#4e7fba'],
    B:['#eee5f5','#d9c9eb','#c7b0e3','#b298d2']
  };
  // Sections across each bank describe the slope from the river-facing toe to the ridge.
  const north = [
    [leftEdge,.24,2.04],[-6.92,.08,2.37],[-5.92,-.01,2.15],[-5.03,.18,1.85],[-4.15,.44,2.29],
    [-3.22,.50,2.48],[-2.34,.61,2.27],[-1.38,.6,1.98],[-.35,.74,2.28],
    [.66,1.21,2.78],[1.62,1.34,3.03],[2.55,1.16,2.65],[3.41,1.07,2.34],
    [4.33,1.13,2.59],[5.36,1.22,2.96],[6.29,1.32,2.75],[7.12,1.48,2.49],[rightEdge,1.58,2.63]
  ];
  const south = [
    [leftEdge,-2.05,-3.58],[-6.67,-2.01,-3.22],[-5.47,-2.18,-3.34],[-4.31,-2.08,-3.53],
    [-3.11,-1.84,-3.35],[-1.92,-1.92,-3.17],[-.7,-2.31,-3.33],[.53,-2.5,-3.59],
    [1.69,-2.42,-3.47],[2.78,-2.17,-3.25],[3.74,-2.3,-3.16],[4.68,-2.46,-3.51],
    [5.56,-2.79,-3.7],[6.61,-3.05,-3.58],[rightEdge,-2.99,-3.54]
  ];
  const ridgeCuts = {
    MAIN:{pull:[-2.5,.54,.61], edge:[
      [leftEdge,2.46],[-6.94,2.72],[-6.08,2.54],[-5.13,2.32],[-4.23,2.7],
      [-3.32,2.88],[-2.49,3.09],[-1.93,3.46],[-1.63,farEdge]
    ], rim:[[leftEdge,farEdge]]},
    A:{pull:[1.61,1.48,.60], edge:[
      [1.14,farEdge],[1.45,3.77],[2.12,3.09],[2.86,2.81],[3.75,2.66],
      [4.69,2.88],[5.52,3.07],[6.58,2.96],[rightEdge,2.99]
    ], rim:[[rightEdge,farEdge]]},
    B:{pull:[1.52,-2.19,.48], edge:[
      [1.29,nearEdge],[1.71,-3.91],[2.54,-3.63],[3.44,-3.47],[4.4,-3.57],
      [5.23,-3.9],[6.4,-3.94],[rightEdge,-3.83]
    ], rim:[[rightEdge,nearEdge]]}
  };
  function bankEdge(profile, level) {
    return profile.map(([x,toe,ridge],index)=>{
      const slope = 1+.46*Math.sin(index*.71)+.28*Math.cos(index*1.16);
      const ratio = level**slope;
      return [x,toe+(ridge-toe)*ratio];
    });
  }
  const pathNS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs, parent) {
    const node = document.createElementNS(pathNS,tag);
    for (const [name,value] of Object.entries(attrs)) node.setAttribute(name,value);
    parent?.append(node);
    return node;
  }
  const put = (node,key,value) => node.setAttribute(key,value);
  const defs = svg('defs',{},map);
  const shadow = svg('filter',{id:'paper-shadow',x:'-30%',y:'-200%',width:'160%',height:'500%'},defs);
  svg('feGaussianBlur',{stdDeviation:10},shadow);
  const grain = svg('pattern',{id:'paper-grain',width:112,height:112,patternUnits:'userSpaceOnUse'},defs);
  const canvas = document.createElement('canvas');
  canvas.width=canvas.height=112;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const bitmap=ctx.createImageData(112,112);
    let seed=3207;
    for (let offset=0;offset<bitmap.data.length;offset+=4) {
      seed=(Math.imul(1664525,seed)+1013904223)>>>0;
      const value=seed>>>24;
      bitmap.data[offset]=bitmap.data[offset+1]=bitmap.data[offset+2]=value>127?255:24;
      bitmap.data[offset+3]=Math.abs(value-127)*.30;
    }
    ctx.putImageData(bitmap,0,0);
    svg('image',{width:112,height:112,href:canvas.toDataURL()},grain);
  }
  function tint(hex, target, mix) {
    const channels=[1,3,5].map(i=>{
      const value=Math.round(parseInt(hex.slice(i,i+2),16)*(1-mix)+target*mix);
      return value.toString(16).padStart(2,'0');
    });
    return `#${channels.join('')}`;
  }
  function material(pigment, id) {
    const [first,last] = Array.isArray(pigment) ? pigment : [pigment,pigment];
    const gradient = svg('linearGradient',{id,x1:0,y1:0,x2:1,y2:.18},defs);
    svg('stop',{offset:0,'stop-color':tint(first,255,.12)},gradient);
    svg('stop',{offset:.34,'stop-color':first},gradient);
    svg('stop',{offset:.72,'stop-color':last},gradient);
    svg('stop',{offset:1,'stop-color':tint(last,45,.045)},gradient);
    return `url(#${id})`;
  }
  const drop=svg('path',{fill:'#211c39',opacity:.17,filter:'url(#paper-shadow)'},map);
  const terrain=svg('g',{},map);
  function makeSheet(edge,rim,z,pigment,id,key='') {
    const group = svg('g',{},terrain);
    const [first,last]=Array.isArray(pigment) ? pigment : [pigment,pigment];
    const thickness = Array.isArray(pigment) ? material([tint(first,16,.26),tint(last,16,.26)],`edge-${id}`) : tint(first,16,.26);
    const side = svg('path',{fill:thickness},group);
    const face = svg('path',{fill:material(pigment,`material-${id}`),stroke:tint(first,22,.20),'stroke-width':.55},group);
    const texture = svg('path',{fill:'url(#paper-grain)','pointer-events':'none',opacity:.38},group);
    if (key) {
      put(face,'data-paper-sheet',id);
      put(side,'data-paper-sheet',id);
    }
    return {key,id,outline:[...edge,...rim],rim:rim.length,z,side,face,texture,group,offset:0};
  }
  const ground = makeSheet([],board,0,'#d4cbe2','ground');
  const ridgeline = [.02,.19,.36,.53,.69,.86].map((level,index)=>
    makeSheet(bankEdge(north,level),[[rightEdge,farEdge],[leftEdge,farEdge]],step*(index+1),
      [pigments.MAIN[index],pigments.A[index]],`ridge-${index}`)
  );
  const foothills = [.04,.39,.77].map((level,index)=>
    makeSheet(bankEdge(south,level),[[rightEdge,nearEdge],[leftEdge,nearEdge]],step*(index+1),
      [pigments.MAIN[index],pigments.B[index]],`foothill-${index}`)
  );
  const topSheets = Object.fromEntries(Object.entries(ridgeCuts).map(([key,{edge,rim}])=>{
    const count=pigments[key].length;
    return [key, makeSheet(edge,rim,step*count,pigments[key].at(-1),`${key}-${count-1}`,key)];
  }));
  const sheets = [...ridgeline,...foothills,...Object.values(topSheets)].sort((a,b)=>a.z-b.z);
  sheets.forEach(sheet=>terrain.append(sheet.group));
  const sheetById = new Map(Object.values(topSheets).map(sheet=>[sheet.id,sheet]));

  // Full channel widths vary between bends; the marker positions are interior samples.
  const confluence = [.71,-.34,.57];
  const river = {
    MAIN:[[-7.42,-.77,.26],[-6.13,-.93,.38],[-5.21,-1.23,.48],[-4.25,-.97,.39],
      [-3.3,-.81,.35],[-2.38,-1.18,.49],[-1.34,-1.26,.55],[-.37,-.89,.53],confluence],
    A:[confluence,[1.6,.05,.38],[2.57,-.07,.35],[3.58,.04,.46],[4.53,.34,.41],
      [5.54,.32,.36],[6.42,.60,.28],[7.43,.82,.23]],
    B:[confluence,[1.46,-.73,.44],[2.38,-1.02,.36],[3.35,-1.35,.43],[4.33,-1.36,.35],
      [5.31,-1.74,.32],[6.34,-2.07,.27],[7.39,-2.35,.22]]
  };
  const riverStops = {MAIN:river.MAIN[2], A:river.A[5], B:river.B[2]};
  function riverRibbon(points, extra=0) {
    const sides=points.map(([x,y,width],i)=>{
      const prev=points[Math.max(0,i-1)], next=points[Math.min(i+1,points.length-1)];
      const dx=next[0]-prev[0], dy=next[1]-prev[1];
      const scale=(width/2+extra)/Math.hypot(dx,dy);
      return [[x-dy*scale,y+dx*scale],[x+dy*scale,y-dx*scale]];
    });
    return [...sides.map(pair=>pair[0]),...sides.reverse().map(pair=>pair[1])];
  }
  const riverInk = svg('g',{'pointer-events':'none'},terrain);
  terrain.insertBefore(riverInk,sheets[0].group);
  const banks = svg('g',{fill:'#777653'},riverInk);
  const water = svg('g',{fill:'#e4ef9d'},riverInk);
  const flow = Object.values(river).map(points=>({
    edge:riverRibbon(points,.027), channel:riverRibbon(points),
    bank:svg('path',{},banks), stream:svg('path',{},water)
  }));
  const footprints = Object.fromEntries(Object.keys(ridgeCuts).map(key=>[key,
    svg('path',{fill:'none',stroke:'#65518f','stroke-width':.85,'stroke-dasharray':'3 4','pointer-events':'none'},map)
  ]));
  const lifted = svg('g',{},map);

  const listen = (target,type,callback) => target.addEventListener(type,callback);
  const openRoutes = new Set();
  let drag;
  let camera=angles.angle, targetCamera=camera, frame=0, width=0, height=0, lastTime=0;
  let activeRoute='all';
  const bounds = [...board.map(([x,y])=>[x,y,-.15]),...sheets.flatMap(sheet=>sheet.outline.map(([x,y])=>[x,y,sheet.z]))];
  const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
  const wrap = value => Math.atan2(Math.sin(value),Math.cos(value));
  const xy = p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  function curve(points, closed=false) {
    const count = points.length;
    const at = closed
      ? index=>points[(index+count)%count]
      : index=>points[clamp(index,0,count-1)];
    let path = `M${xy(points[0])}`;
    const segments = closed ? count : count-1;
    for (let i=0;i<segments;i++) {
      const a=at(i-1), b=at(i), c=at(i+1), d=at(i+2);
      const from=[b[0]+(c[0]-a[0])/6,b[1]+(c[1]-a[1])/6];
      const to=[c[0]-(d[0]-b[0])/6,c[1]-(d[1]-b[1])/6];
      path+=`C${xy(from)} ${xy(to)} ${xy(c)}`;
    }
    return closed ? path+'Z' : path;
  }
  function cutPath(points, rim) {
    if (rim===points.length) return `M${points.map(xy).join('L')}Z`;
    return `${curve(points.slice(0,-rim))}L${points.slice(-rim).map(xy).join('L')}Z`;
  }
  function draw() {
    if (width<80 || height<80) return;
    const [pitch,yaw]=camera;
    const cy=Math.cos(yaw), sy=Math.sin(yaw), sp=Math.sin(pitch), cp=Math.cos(pitch);
    const viewPoint=(x,y,z)=>[x*cy-y*sy,-(x*sy+y*cy)*sp-z*cp];

    // Keep the same frame whether zero, one or all three sheets are pulled out.
    const reach = width < 580 ? .76 : 1;
    const travelBounds = Object.values(topSheets).flatMap(sheet=>{
      const [dx,dy,dz]=ridgeCuts[sheet.key].pull;
      return sheet.outline.map(([x,y])=>[x+dx*reach,y+dy*reach,sheet.z+dz]);
    });
    const projected = [...bounds,...travelBounds].map(point=>viewPoint(...point));
    const xs=projected.map(point=>point[0]), ys=projected.map(point=>point[1]);
    const left=Math.min(...xs), right=Math.max(...xs), top=Math.min(...ys), bottom=Math.max(...ys);
    const scale=Math.min((width-48)/(right-left),(height-76)/(bottom-top));
    const project=(x,y,z)=>{
      const [screenX,screenY]=viewPoint(x,y,z);
      return [width/2+(screenX-(left+right)/2)*scale,height/2-6+(screenY-(top+bottom)/2)*scale];
    };
    put(drop,'d',cutPath(board.map(([x,y])=>project(x,y,-.25)),board.length));
    const lift = new Map(Object.values(topSheets).map(sheet=>{
      const [dx,dy,dz]=ridgeCuts[sheet.key].pull;
      const offset=sheet.offset;
      return [sheet,[dx*offset*reach,dy*offset*reach,dz*Math.sin(offset*Math.PI/2)]];
    }));
    const renderSheet = sheet=>{
      const [dx,dy,dz]=lift.get(sheet) || [0,0,0];
      const z=sheet.z+dz;
      const upper=cutPath(sheet.outline.map(([x,y])=>project(x+dx,y+dy,z)),sheet.rim);
      const lower=cutPath(sheet.outline.map(([x,y])=>project(x+dx,y+dy,z-(sheet.z?.065:.15))),sheet.rim);
      put(sheet.face,'d',upper);
      put(sheet.texture,'d',upper);
      put(sheet.side,'d',lower);
      sheet.group.classList.toggle('paper-selected',sheet.offset>0);
    };
    renderSheet(ground);
    sheets.forEach((sheet,index)=>{
      const layer=sheet.offset>0 ? lifted : terrain;
      if (sheet.group.parentNode!==layer) {
        const next=sheets.slice(index+1).find(candidate=>candidate.group.parentNode===layer);
        layer.insertBefore(sheet.group,next?.group || null);
      }
      renderSheet(sheet);
    });
    for (const {edge,channel,bank,stream} of flow) {
      put(bank,'d',curve(edge.map(([x,y])=>project(x,y,.03)),true));
      put(stream,'d',curve(channel.map(([x,y])=>project(x,y,.03)),true));
    }
    for (const pin of pins) {
      const key=pin.dataset.paperCase;
      const sheet=topSheets[key];
      const [x,y]=project(riverStops[key][0],riverStops[key][1],.03);
      const footprint=footprints[key];
      const slot=sheet.offset ? cutPath(sheet.outline.map(([sx,sy])=>project(sx,sy,sheet.z)),sheet.rim) : '';
      put(footprint,'d',slot);
      put(footprint,'opacity',clamp(sheet.offset*1.5,0,.45));
      pin.style.left=x+'px';
      pin.style.top=y+'px';
    }
    pinGroup.hidden=false;
  }

  function tick(now) {
    frame=0;
    const elapsed=lastTime?clamp(now-lastTime,1,36):16;
    lastTime=now;
    let moving=false;
    function approach(value,target,duration) {
      if (reduced() || Math.abs(target-value)<.001) return target;
      moving=true;
      return value+(target-value)*(1-Math.exp(-elapsed/duration));
    }
    camera=camera.map((value,index)=>approach(value,targetCamera[index],76));
    for (const sheet of Object.values(topSheets)) {
      const goal=Number(openRoutes.has(sheet.key));
      if (sheet.offset===goal) continue;
      if (reduced()) { sheet.offset=goal; continue; }
      const travel=clamp((now-sheet.slideStart)/sheet.slideDuration,0,1);
      const ease=1-(1-travel)**3;
      sheet.offset=travel===1?goal:sheet.slideFrom+(goal-sheet.slideFrom)*ease;
      moving ||= travel<1;
    }
    draw();
    if (moving) request();
  }
  function request() { if (!frame) frame=requestAnimationFrame(tick); }
  const resize = new ResizeObserver(()=>{
    width=stage.clientWidth; height=stage.clientHeight;
    put(map,'viewBox',`0 0 ${width} ${height}`);
    request();
  });
  resize.observe(stage);

  listen(motion,'change',request);
  function setOpen(key, open) {
    if (open) openRoutes.add(key);
    else openRoutes.delete(key);
    const sheet=topSheets[key];
    sheet.slideFrom=sheet.offset;
    sheet.slideStart=performance.now();
    sheet.slideDuration=open ? 440 : 340;
  }
  function refreshSelection() {
    for (const pin of pins) pin.setAttribute('aria-pressed',String(openRoutes.has(pin.dataset.paperCase)));
    onSelect(activeRoute);
    request();
  }
  function toggleRoute(key) {
    const closing=openRoutes.has(key);
    setOpen(key,!closing);
    if (!closing) activeRoute=key;
    else if (activeRoute===key) activeRoute=Array.from(openRoutes).at(-1) ?? 'all';
    refreshSelection();
  }
  function selectRoute(key) {
    if (key!=='all' && !openRoutes.has(key)) setOpen(key,true);
    activeRoute=key;
    refreshSelection();
  }
  pins.forEach(pin=>listen(pin,'click',()=>toggleRoute(pin.dataset.paperCase)));
  function showView(key) { viewButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.paperView===key))); }
  showView(Object.keys(angles).find(key=>angles[key].every((value,i)=>Math.abs(wrap(camera[i]-value))<.001)));
  for (const button of viewButtons) listen(button,'click',()=>{
    const key=button.dataset.paperView, [pitch,yaw]=angles[key];
    targetCamera=[pitch,camera[1]+wrap(yaw-camera[1])];
    showView(key); request();
  });
  function orbit(horizontal,vertical) {
    camera=targetCamera=[clamp(camera[0]+vertical,.10,Math.PI/2),wrap(camera[1]+horizontal)];
    showView(''); request();
  }
  listen(stage,'pointerdown',event=>{
    if (drag || !event.isPrimary || event.button!==0 || event.target.closest('button')) return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,moved:false,sheet:sheetById.get(event.target.dataset.paperSheet)};
    stage.setPointerCapture(event.pointerId);
  });
  listen(stage,'pointermove',event=>{
    if (drag?.id!==event.pointerId) return;
    const dx=event.clientX-drag.x, dy=event.clientY-drag.y;
    if (!drag.moved && Math.hypot(dx,dy)<5) return;
    drag.moved=true; drag.x=event.clientX; drag.y=event.clientY;
    stage.classList.add('paper-grabbing');
    orbit(dx*.011,-dy*.009);
  });
  function release(event) {
    if (drag?.id!==event.pointerId) return;
    const {sheet,moved}=drag;
    drag=null; stage.classList.remove('paper-grabbing');
    if (event.type==='pointerup' && sheet && !moved) toggleRoute(sheet.key);
  }
  for (const type of ['pointerup','pointercancel','lostpointercapture']) listen(stage,type,release);
  const keys={ArrowLeft:[-.16,0],ArrowRight:[.16,0],ArrowUp:[0,.12],ArrowDown:[0,-.12]};
  listen(stage,'keydown',event=>{
    if (event.target!==stage || !Object.hasOwn(keys,event.key)) return;
    event.preventDefault(); orbit(...keys[event.key]);
  });
  request();
  return {selectRoute};
}
