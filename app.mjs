import {
  ENGINE_VERSION, VESSEL_SPEC_VERSION,
  scorePush, scorePull, scoreCardioVo2, scoreSquat, scoreCarry,
  classifyMobility, scoreBalance, calculateStrength, calculateEndurance,
  calculateMovement, calculateVessel, nextTierTarget
} from './engine.mjs';

const STORAGE_KEY = 'prime46.body.mvp.v0.1';
const defaults = {
  profile: { name:'Don', age:46, sex:'male', heightFt:5, heightIn:8, bodyweightLb:168 },
  tests: {
    push: { reps:40 }, pull:{ reps:5 }, squat:{ oneRmLb:'', estimated:false },
    carry:{ totalLoadLb:'', distanceM:40, timeSec:'', completed:true },
    cardio:{ vo2:'' }, mobility:{ deepSquat:'', overheadReach:'', limiter:'' },
    balance:{ leftSec:'', rightSec:'' }
  }
};
let state = loadState();
let currentStep = 0;

const steps = [
  {id:'profile', label:'Profile'}, {id:'push',label:'Push'}, {id:'pull',label:'Pull'},
  {id:'squat',label:'Squat'}, {id:'carry',label:'Carry'}, {id:'cardio',label:'Cardio'},
  {id:'mobility',label:'Mobility'}, {id:'balance',label:'Balance'}
];

const $ = s => document.querySelector(s);
const clone = o => JSON.parse(JSON.stringify(o));
function loadState(){ try { return {...clone(defaults), ...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}; } catch { return clone(defaults); } }
function saveState(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); const el=$('#saveState'); if(el){el.textContent='SAVED';setTimeout(()=>el.textContent='LOCAL SAVE',700);} }
function num(v){ const n=Number(v); return Number.isFinite(n)?n:null; }
function fmt(n,d=0){ return Number.isFinite(n)?n.toFixed(d):'—'; }
function bodyweight(){ return num(state.profile.bodyweightLb); }

function computed(){
  const t=state.tests, bw=bodyweight();
  const push = num(t.push.reps) !== null ? scorePush(num(t.push.reps)) : null;
  const pull = num(t.pull.reps) !== null ? scorePull(num(t.pull.reps)) : null;
  const squat = num(t.squat.oneRmLb)!==null && bw>0 ? scoreSquat({oneRmLb:num(t.squat.oneRmLb),bodyweightLb:bw,estimated:!!t.squat.estimated}) : null;
  const carry = num(t.carry.totalLoadLb)!==null && bw>0 ? scoreCarry({totalLoadLb:num(t.carry.totalLoadLb),bodyweightLb:bw,distanceM:num(t.carry.distanceM)??40,completed:!!t.carry.completed,timeSec:num(t.carry.timeSec)}) : null;
  const cardio = num(t.cardio.vo2)!==null ? scoreCardioVo2(num(t.cardio.vo2)) : null;
  const mobility = t.mobility.deepSquat && t.mobility.overheadReach ? classifyMobility({deepSquat:t.mobility.deepSquat,overheadReach:t.mobility.overheadReach}) : null;
  const balance = num(t.balance.leftSec)!==null && num(t.balance.rightSec)!==null ? scoreBalance({leftSec:num(t.balance.leftSec),rightSec:num(t.balance.rightSec)}) : null;
  const strength=calculateStrength({push,pull,squat,carry});
  const endurance=calculateEndurance({cardio});
  const movement=calculateMovement({balance,mobility});
  const vessel=calculateVessel({strength,endurance,movement});
  return {push,pull,squat,carry,cardio,mobility,balance,strength,endurance,movement,vessel};
}

function isComplete(id){
  if(id==='profile') return !!state.profile.name && num(state.profile.age)!==null && bodyweight()>0;
  const c=computed(); return id==='mobility' ? !!c.mobility : !!c[id];
}
function completedCount(){ return ['push','pull','squat','carry','cardio','mobility','balance'].filter(isComplete).length; }

function navigate(view){ location.hash=view; render(); }
window.addEventListener('hashchange',render);
document.addEventListener('click',e=>{ const b=e.target.closest('[data-nav]'); if(b) navigate(b.dataset.nav); });
$('#resetBtn').addEventListener('click',()=>{ if(confirm('Reset all locally saved PRIME 46 BODY assessment data?')){ state=clone(defaults); saveState(); render(); } });

function render(){
  const view=(location.hash||'#home').slice(1);
  if(view==='assessment') renderAssessment(); else if(view==='sheet') renderSheet(); else renderHome();
}
function useTemplate(id){ const app=$('#app'); app.innerHTML=''; app.append(document.querySelector(id).content.cloneNode(true)); }

function renderHome(){
  useTemplate('#homeTemplate'); const c=computed(); const n=completedCount();
  $('#homeProgress').style.width=`${n/7*100}%`; $('#homeProgressText').textContent=`${n} / 7 assessments complete`;
  $('#homeVesselStatus').textContent=c.vessel.status==='RANKED'?`${fmt(c.vessel.score,1)} · ${c.vessel.tier}`:'UNRANKED';
}

function renderAssessment(){
  useTemplate('#assessmentTemplate');
  const nav=$('#stepNav'); nav.innerHTML=steps.map((s,i)=>`<button class="step-btn ${i===currentStep?'active':''} ${isComplete(s.id)?'done':''}" data-step="${i}"><span class="step-num">${isComplete(s.id)?'✓':i+1}</span><span>${s.label}</span><span class="step-state">${isComplete(s.id)?'DONE':''}</span></button>`).join('');
  nav.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{currentStep=Number(b.dataset.step);renderAssessment();});
  renderStep(steps[currentStep].id);
}
function stepShell({eyebrow,title,desc,evidence,body,resultHtml}){
  $('#assessmentContent').innerHTML=`<div class="step-head"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${desc}</p></div>${evidence?`<span class="evidence-badge">${evidence}</span>`:''}</div>${body}${resultHtml||''}<div class="step-actions"><button class="ghost-btn" id="prevStep" ${currentStep===0?'disabled':''}>BACK</button><button class="primary-btn" id="nextStep">${currentStep===steps.length-1?'VIEW CHARACTER SHEET':'SAVE & CONTINUE'}</button></div>`;
  $('#prevStep').onclick=()=>{if(currentStep>0){currentStep--;renderAssessment();}};
  $('#nextStep').onclick=()=>{saveState(); if(currentStep<steps.length-1){currentStep++;renderAssessment();} else navigate('sheet');};
}
function bindInput(selector, fn){ const el=$(selector); if(!el)return; const event=el.type==='checkbox'?'change':'input'; el.addEventListener(event,()=>{fn(el);saveState();renderStep(steps[currentStep].id);}); }
function bindSelect(selector,fn){ const el=$(selector); if(el)el.onchange=()=>{fn(el);saveState();renderStep(steps[currentStep].id);}; }
function resultBlock(r,raw=''){ if(!r)return `<div class="live-result"><div><span>CAPABILITY</span><div class="empty">Enter a valid standardized result to calculate capability.</div></div><div></div></div>`; return `<div class="live-result"><div><span>CAPABILITY SCORE</span><div class="live-score">${fmt(r.score,1)}</div>${raw?`<small class="muted">${raw}</small>`:''}</div><div class="live-tier">${r.tier}<br><small>Evidence ${r.evidence?.grade||''}</small></div></div>`; }

function renderStep(id){
  const c=computed(), t=state.tests, p=state.profile;
  if(id==='profile'){
    stepShell({eyebrow:'PLAYER',title:'CREATE YOUR CHARACTER',desc:'The player is the character. These values anchor bodyweight-relative tests and your character sheet.',body:`<div class="form-grid"><div class="field full"><label>PLAYER NAME</label><input id="name" value="${p.name||''}"></div><div class="field"><label>AGE</label><input id="age" type="number" min="13" max="100" value="${p.age??''}"></div><div class="field"><label>SEX</label><select id="sex"><option value="male" ${p.sex==='male'?'selected':''}>Male</option><option value="female" ${p.sex==='female'?'selected':''}>Female</option></select></div><div class="field"><label>HEIGHT — FEET</label><input id="ft" type="number" min="3" max="8" value="${p.heightFt??''}"></div><div class="field"><label>HEIGHT — INCHES</label><input id="inch" type="number" min="0" max="11" value="${p.heightIn??''}"></div><div class="field full"><label>BODYWEIGHT (LB)</label><input id="bw" type="number" min="50" step="0.1" value="${p.bodyweightLb??''}"><small>Used by Squat and Carry relative-strength calculations.</small></div></div>`});
    bindInput('#name',e=>p.name=e.value);bindInput('#age',e=>p.age=e.value);bindSelect('#sex',e=>p.sex=e.value);bindInput('#ft',e=>p.heightFt=e.value);bindInput('#inch',e=>p.heightIn=e.value);bindInput('#bw',e=>p.bodyweightLb=e.value);return;
  }
  if(id==='push'){
    stepShell({eyebrow:'STRENGTH · PUSH',title:'STRICT PUSH-UPS',desc:'Maximum strict push-ups to technical failure with no rest.',evidence:'GRADE A · NORMATIVE',body:`<div class="field"><label>MAX STRICT REPS</label><input id="push" type="number" min="0" step="1" value="${t.push.reps??''}"></div><div class="protocol"><h3>TEST STANDARD</h3><p>Use one continuous strict set. Stop at technical failure. Preserve the raw rep count even after capability score reaches its ceiling.</p></div>`,resultHtml:resultBlock(c.push,c.push?`${c.push.raw.reps} strict reps`:'')}); bindInput('#push',e=>t.push.reps=e.value);return;
  }
  if(id==='pull'){
    stepShell({eyebrow:'STRENGTH · PULL',title:'STRICT PULL-UPS',desc:'Maximum strict pull-ups. Criterion score — not a population percentile.',evidence:'GRADE B · CRITERION',body:`<div class="field"><label>MAX STRICT REPS</label><input id="pull" type="number" min="0" step="1" value="${t.pull.reps??''}"></div><div class="protocol"><h3>TEST STANDARD</h3><p>Use strict repetitions through your standardized range. PRIME records current capability separately from injury/recovery context and previous bests.</p></div>`,resultHtml:resultBlock(c.pull,c.pull?`${c.pull.raw.reps} strict reps`:'')}); bindInput('#pull',e=>t.pull.reps=e.value);return;
  }
  if(id==='squat'){
    const ratio=c.squat?.raw.ratio;
    stepShell({eyebrow:'STRENGTH · SQUAT',title:'BARBELL BACK SQUAT',desc:'Measured 1RM preferred. A standardized low-rep estimate may be entered but is explicitly labeled estimated.',evidence:'GRADE B · CRITERION',body:`<div class="form-grid"><div class="field"><label>1RM / ESTIMATED 1RM (LB)</label><input id="squat" type="number" min="0" step="1" value="${t.squat.oneRmLb??''}"></div><div class="field"><label>MEASUREMENT</label><select id="squatEst"><option value="false" ${!t.squat.estimated?'selected':''}>Measured 1RM</option><option value="true" ${t.squat.estimated?'selected':''}>Estimated 1RM</option></select></div></div><div class="protocol"><h3>CANONICAL TEST</h3><ul><li>Barbell back squat; controlled descent and standardized depth.</li><li>Full standing lockout; failed/incomplete rep does not count.</li><li>Machine loads are never converted into fake barbell equivalents.</li></ul></div>`,resultHtml:resultBlock(c.squat,c.squat?`${fmt(c.squat.raw.oneRmLb)} lb · ${fmt(ratio,2)}× bodyweight · ${c.squat.measurement.replaceAll('_',' ')}`:'')}); bindInput('#squat',e=>t.squat.oneRmLb=e.value);bindSelect('#squatEst',e=>t.squat.estimated=e.value==='true');return;
  }
  if(id==='carry'){
    stepShell({eyebrow:'STRENGTH · CARRY',title:'40 M FARMER CARRY',desc:'Carry equal implements for 40 meters. Capability is load relative to bodyweight; speed is recorded but does not change the score.',evidence:'GRADE C · PRIME CRITERION',body:`<div class="form-grid"><div class="field"><label>TOTAL LOAD — BOTH HANDS (LB)</label><input id="carryLoad" type="number" min="0" step="1" value="${t.carry.totalLoadLb??''}"></div><div class="field"><label>TIME (SECONDS) · OPTIONAL</label><input id="carryTime" type="number" min="0" step="0.1" value="${t.carry.timeSec??''}"></div><div class="field"><label>DISTANCE (M)</label><input id="carryDistance" type="number" min="0" step="1" value="${t.carry.distanceM??40}"></div><div class="field"><label>ATTEMPT</label><select id="carryComplete"><option value="true" ${t.carry.completed?'selected':''}>Completed without drop</option><option value="false" ${!t.carry.completed?'selected':''}>Incomplete / dropped</option></select></div></div><div class="protocol"><h3>CANONICAL TEST</h3><p>Equal implements. No straps. Controlled gait/posture. No drop or regrip on a successful 40 m attempt. Chalk may be used and recorded separately.</p></div>`,resultHtml:resultBlock(c.carry,c.carry?`${fmt(c.carry.raw.totalLoadLb)} lb total · ${fmt(c.carry.raw.ratio,2)}× BW · ${c.carry.canonicalAttempt?'VALID 40 M':'NOT A VALID 40 M COMPLETION'}`:'')}); bindInput('#carryLoad',e=>t.carry.totalLoadLb=e.value);bindInput('#carryTime',e=>t.carry.timeSec=e.value);bindInput('#carryDistance',e=>t.carry.distanceM=e.value);bindSelect('#carryComplete',e=>t.carry.completed=e.value==='true');return;
  }
  if(id==='cardio'){
    stepShell({eyebrow:'ENDURANCE · CARDIO',title:'VO₂MAX BASELINE',desc:'Enter the estimated or measured VO₂max produced by the standardized cardio assessment. PRIME scores the VO₂ value, not an arbitrary mile-time formula.',evidence:'GRADE A · NORMATIVE',body:`<div class="field"><label>VO₂MAX (ML/KG/MIN)</label><input id="vo2" type="number" min="10" max="90" step="0.1" value="${t.cardio.vo2??''}"><small>Locked progression: Rockport 1-mile fast walk → Run the Mile achievement → Cooper 1.5-mile advanced test.</small></div><div class="protocol"><h3>IMPORTANT</h3><p>The v1.0 engine does not invent a score-100 VO₂ anchor. Values above the highest locked reference anchor remain capped at the highest evidence-supported score until the canon is revised.</p></div>`,resultHtml:resultBlock(c.cardio,c.cardio?`VO₂max ${fmt(c.cardio.raw.vo2,1)} · approx. peer standing ${fmt(c.cardio.peerPercentileApprox,1)}th reference percentile`:'' )}); bindInput('#vo2',e=>t.cardio.vo2=e.value);return;
  }
  if(id==='mobility'){
    stepShell({eyebrow:'MOVEMENT · MOBILITY',title:'FUNDAMENTAL MOVEMENT SCREEN',desc:'Mobility is classified, not given fake 0–100 precision.',evidence:'CLASSIFICATION',body:`<div class="form-grid"><div class="field"><label>DEEP SQUAT</label><select id="deep"><option value="">Select...</option>${['LIMITED','FUNCTIONAL','PROFICIENT'].map(x=>`<option ${t.mobility.deepSquat===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>OVERHEAD REACH</label><select id="over"><option value="">Select...</option>${['LIMITED','FUNCTIONAL','PROFICIENT'].map(x=>`<option ${t.mobility.overheadReach===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field full"><label>LIMITER / OBSERVATION · OPTIONAL</label><input id="limiter" value="${t.mobility.limiter??''}" placeholder="Example: heels rise / trunk compensation / left-right difference"></div></div><div class="protocol"><h3>CLASSIFICATION</h3><p><b>LIMITED</b> = meaningful restriction prevents competent completion. <b>FUNCTIONAL</b> = sufficient range with some restriction/compensation. <b>PROFICIENT</b> = required range with good control and no meaningful compensation.</p></div>`,resultHtml:`<div class="live-result"><div><span>MOBILITY</span><div class="live-score" style="font-size:34px">${c.mobility?.classification||'—'}</div>${t.mobility.limiter?`<small class="muted">Limiter: ${t.mobility.limiter}</small>`:''}</div><div class="live-tier">NO FAKE<br>PRECISION</div></div>`}); bindSelect('#deep',e=>t.mobility.deepSquat=e.value);bindSelect('#over',e=>t.mobility.overheadReach=e.value);bindInput('#limiter',e=>t.mobility.limiter=e.value);return;
  }
  if(id==='balance'){
    stepShell({eyebrow:'MOVEMENT · BALANCE',title:'SINGLE-LEG STAND',desc:'Eyes open. Test both sides. Each side caps at 60 seconds; the weaker side receives 70% of the overall weight.',evidence:'GRADE B · HYBRID',body:`<div class="form-grid"><div class="field"><label>LEFT — BEST OF TEST (SEC)</label><input id="left" type="number" min="0" max="60" step="0.1" value="${t.balance.leftSec??''}"></div><div class="field"><label>RIGHT — BEST OF TEST (SEC)</label><input id="right" type="number" min="0" max="60" step="0.1" value="${t.balance.rightSec??''}"></div></div><div class="protocol"><h3>TEST STANDARD</h3><p>Hands on hips, eyes open. Timer ends when the raised foot touches down/supporting leg, hands leave hips, or the supporting foot substantially moves.</p></div>`,resultHtml:resultBlock(c.balance,c.balance?`L ${fmt(c.balance.raw.leftSec,1)}s · R ${fmt(c.balance.raw.rightSec,1)}s · asymmetry ${fmt(c.balance.raw.asymmetryPct,1)}%`:'')}); bindInput('#left',e=>t.balance.leftSec=e.value);bindInput('#right',e=>t.balance.rightSec=e.value);return;
  }
}

function metricRow(name,r,raw,locked=false){ return `<div class="metric-row ${locked?'locked':''}"><div class="metric-top"><span class="metric-name">${name}</span><span class="metric-value">${locked?'🔒':r?.score!=null?fmt(r.score,1):r?.classification||'—'}</span></div><div class="metric-meta"><span>${raw|| (locked?'Unlocks later':'Assessment required')}</span><span>${r?.tier||''}</span></div></div>`; }
function domainCard(name,d,rows){ const ranked=d?.status==='RANKED'; return `<section class="domain-card"><div class="domain-head"><div><span>${name}</span><b>${ranked?fmt(d.score,1):'—'}</b></div><small>${ranked?d.tier:'UNRANKED'}</small></div>${rows}</section>`; }
function renderSheet(){
  useTemplate('#sheetTemplate'); const c=computed(),p=state.profile,t=state.tests;
  $('#playerName').textContent=(p.name||'PLAYER ONE').toUpperCase(); $('#playerMeta').textContent=`Age ${p.age||'—'} · ${p.heightFt||'—'}'${p.heightIn||0}" · ${p.bodyweightLb||'—'} lb · Engine ${ENGINE_VERSION} · VESSEL Spec ${VESSEL_SPEC_VERSION}`;
  if(c.vessel.status==='RANKED'){ $('#vesselScore').textContent=fmt(c.vessel.score,1);$('#vesselTier').textContent=c.vessel.tier;$('#vesselGate').innerHTML=c.vessel.gate?`<b class="gold">MASTERY GATE</b><br>${c.vessel.gate.blockedTier} blocked until every domain reaches ${c.vessel.gate.requirement}.`:`<b class="good">MASTERY GATES CLEAR</b><br>Current domain minimum: ${fmt(c.vessel.minComponent,1)}.`; }
  else { $('#vesselGate').innerHTML=`<b>BASELINE INCOMPLETE</b><br>${completedCount()} / 7 assessments complete. Finish the missing tests to rank THE VESSEL.`; }
  $('#domainGrid').innerHTML =
    domainCard('STRENGTH',c.strength,
      metricRow('PUSH',c.push,c.push?`${c.push.raw.reps} reps`:'')+
      metricRow('PULL',c.pull,c.pull?`${c.pull.raw.reps} reps`:'')+
      metricRow('SQUAT',c.squat,c.squat?`${c.squat.raw.oneRmLb} lb · ${fmt(c.squat.raw.ratio,2)}× BW`:'')+
      metricRow('CARRY',c.carry,c.carry?`${c.carry.raw.totalLoadLb} lb · ${fmt(c.carry.raw.ratio,2)}× BW`:'') )+
    domainCard('ENDURANCE',c.endurance,
      metricRow('CARDIO',c.cardio,c.cardio?`VO₂ ${fmt(c.cardio.raw.vo2,1)}`:'')+metricRow('WORK CAPACITY',null,'',true))+
    domainCard('MOVEMENT',c.movement,
      metricRow('MOBILITY',c.mobility,c.mobility?`${c.mobility.screens.deepSquat} / ${c.mobility.screens.overheadReach}`:'')+
      metricRow('BALANCE',c.balance,c.balance?`L ${fmt(c.balance.raw.leftSec,1)}s · R ${fmt(c.balance.raw.rightSec,1)}s`:'')+metricRow('BODY CONTROL',null,'',true));

  const numeric=[['Push',c.push],['Pull',c.pull],['Squat',c.squat],['Carry',c.carry],['Cardio',c.cardio],['Balance',c.balance]].filter(x=>Number.isFinite(x[1]?.score)).sort((a,b)=>b[1].score-a[1].score);
  const strengths=numeric.filter(x=>x[1].score>=80).slice(0,3); const weaknesses=numeric.filter(x=>x[1].score<60).sort((a,b)=>a[1].score-b[1].score).slice(0,3);
  $('#strengths').innerHTML=strengths.length?strengths.map(([n,r])=>`<div class="insight-item"><b>${n.toUpperCase()} · ${fmt(r.score,1)}</b><small>${r.tier}</small></div>`).join(''):`<div class="empty">No scored capability has reached ADVANCED yet.</div>`;
  $('#weaknesses').innerHTML=weaknesses.length?weaknesses.map(([n,r])=>`<div class="insight-item"><b>${n.toUpperCase()} · ${fmt(r.score,1)}</b><small>${r.tier}</small></div>`).join(''):`<div class="empty">No scored branch is currently below STRONG.</div>`;
  const opp=[];
  if(c.pull){ const nt=nextTierTarget('pull',c.pull.raw.reps); if(nt) opp.push(`PULL ${fmt(c.pull.score,0)} → ${nt.targetScore}: target ${fmt(nt.targetValue,0)} strict reps`); }
  if(c.squat){ const ratio=c.squat.raw.ratio; const nt=nextTierTarget('squatRatio',ratio); if(nt) opp.push(`SQUAT ${fmt(c.squat.score,0)} → ${nt.targetScore}: target ${fmt(nt.targetValue,2)}× BW`); }
  if(c.carry){ const nt=nextTierTarget('carryRatio',c.carry.raw.ratio); if(nt) opp.push(`CARRY ${fmt(c.carry.score,0)} → ${nt.targetScore}: target ${fmt(nt.targetValue,2)}× BW`); }
  if(!c.squat)opp.push('Complete canonical Squat assessment'); if(!c.carry)opp.push('Complete 40 m Farmer Carry'); if(!c.cardio)opp.push('Establish VO₂max baseline'); if(!c.mobility)opp.push('Complete Mobility screen'); if(!c.balance)opp.push('Complete Balance test');
  $('#opportunities').innerHTML=opp.length?opp.slice(0,4).map(x=>`<div class="insight-item"><b>${x}</b><small>Next measurable step</small></div>`).join(''):`<div class="empty">All current assessment requirements are complete.</div>`;

  const rows=[
    ['Push',c.push?`${c.push.raw.reps} reps`:'—',c.push?.score,c.push?.tier,'A'],['Pull',c.pull?`${c.pull.raw.reps} reps`:'—',c.pull?.score,c.pull?.tier,'B'],
    ['Squat',c.squat?`${c.squat.raw.oneRmLb} lb / ${fmt(c.squat.raw.ratio,2)}× BW`:'—',c.squat?.score,c.squat?.tier,'B'],
    ['Carry',c.carry?`${c.carry.raw.totalLoadLb} lb / ${fmt(c.carry.raw.ratio,2)}× BW / ${c.carry.raw.distanceM}m`:'—',c.carry?.score,c.carry?.tier,'C'],
    ['Cardio',c.cardio?`VO₂ ${fmt(c.cardio.raw.vo2,1)}`:'—',c.cardio?.score,c.cardio?.tier,'A'],
    ['Mobility',c.mobility?`${c.mobility.classification}${t.mobility.limiter?` · ${t.mobility.limiter}`:''}`:'—',null,null,'CLASS'],
    ['Balance',c.balance?`L ${fmt(c.balance.raw.leftSec,1)}s / R ${fmt(c.balance.raw.rightSec,1)}s / ${fmt(c.balance.raw.asymmetryPct,1)}% asym.`:'—',c.balance?.score,c.balance?.tier,'B']
  ];
  $('#records').innerHTML=`<table class="records-table"><thead><tr><th>CAPABILITY</th><th>RAW PERFORMANCE</th><th>SCORE</th><th>TIER</th><th>EVIDENCE</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${r[0].toUpperCase()}</b></td><td>${r[1]}</td><td>${r[2]!=null?fmt(r[2],1):'—'}</td><td>${r[3]||'—'}</td><td><span class="status-pill">${r[4]}</span></td></tr>`).join('')}</tbody></table>`;
}

render();
