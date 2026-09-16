let mode="posture", demoTimer=null, demoRunning=false, stream=null, reps=0, correct=0, issues=0;

function goTo(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth"});}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}

function setMode(m){
  mode=m;
  document.querySelectorAll(".mode-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.mode===m));
  const names={posture:"Good alignment",squat:"Great squat depth",pushup:"Strong body line",lunge:"Balanced movement"};
  const cues={posture:"Keep your chest tall and shoulders relaxed.",squat:"Knees are tracking well. Keep your heels grounded.",pushup:"Keep a straight line from head to heels.",lunge:"Stay upright and keep the front knee stable."};
  document.querySelector("#feedback b").textContent=names[m];
  document.querySelector("#feedback p").textContent=cues[m];
  if(m==="posture"){document.getElementById("knee").textContent="92°";document.getElementById("hip").textContent="84°";document.getElementById("back").textContent="58°";}
  else if(m==="squat"){document.getElementById("knee").textContent="88°";document.getElementById("hip").textContent="82°";document.getElementById("back").textContent="56°";}
  else if(m==="pushup"){document.getElementById("knee").textContent="172°";document.getElementById("hip").textContent="94°";document.getElementById("back").textContent="166°";}
  else {document.getElementById("knee").textContent="90°";document.getElementById("hip").textContent="93°";document.getElementById("back").textContent="9°";}
  showToast(m==="posture"?"Posture mode selected":`${m[0].toUpperCase()+m.slice(1)} coach selected`);
}

function startDemo(){
  goTo("analyze");
  stopDemo();
  demoRunning=true;
  document.getElementById("cameraStatus").innerHTML='<i></i> Analyzing';
  document.getElementById("cameraEmpty").style.display="none";
  document.getElementById("demoSkeleton").style.display="block";
  let n=0;
  demoTimer=setInterval(()=>{
    n++;
    const base=mode==="posture"?84:82;
    const score=Math.round(base+Math.sin(n/2)*5);
    document.getElementById("liveScore").textContent=score;
    document.getElementById("scoreLabel").textContent=score>=85?"Excellent":"Good";
    if(mode!=="posture" && n%5===0){reps++; if(Math.random()>.25)correct++; else issues++;document.getElementById("reps").textContent=reps;document.getElementById("correct").textContent=correct;document.getElementById("issues").textContent=issues;}
    const sk=document.getElementById("demoSkeleton"); sk.style.transform=`translate(-50%,-50%) rotate(${Math.sin(n/3)*2}deg)`;
    if(n%8===0 && mode==="posture"){document.querySelector("#feedback b").textContent="Small posture drift";document.querySelector("#feedback p").textContent="Gently bring your head back over your shoulders."}
    else {const names={posture:"Good alignment",squat:"Great squat depth",pushup:"Strong body line",lunge:"Balanced movement"};document.querySelector("#feedback b").textContent=names[mode];}
  },650);
  showToast("Demo analysis started — use this for your walkthrough.");
}

function stopDemo(){if(demoTimer){clearInterval(demoTimer);demoTimer=null}demoRunning=false}

async function toggleCamera(){
  const panel=document.querySelector(".camera-panel");
  if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;panel.classList.remove("live");document.getElementById("cameraStatus").innerHTML='<i></i> Ready';showToast("Camera stopped");return}
  try{
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false});
    document.getElementById("video").srcObject=stream;
    panel.classList.add("live");
    stopDemo();
    document.getElementById("cameraStatus").innerHTML='<i></i> Camera live';
    showToast("Camera connected. For the prototype, use Demo Mode for pose scoring.");
  }catch(e){showToast("Camera unavailable — Demo Mode is ready.");startDemo()}
}

document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("demoSkeleton").style.display="none";
  // Animate hero skeleton subtly
  setInterval(()=>{const s=document.getElementById("heroSkeleton");if(s)s.style.transform=`translate(-50%,-50%) rotate(${Math.sin(Date.now()/900)*1.2}deg)`},80);
});