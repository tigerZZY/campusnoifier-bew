const ACCESS_PASSWORD = "bewcdfz202405";
const ADMIN_PASSWORD = "lb666";
const targetDate = new Date("2026-07-01");
const TERM_START = new Date("2025-09-01");

let noticeList = JSON.parse(localStorage.getItem("clsNotice")) || [];
let lessonData = JSON.parse(localStorage.getItem("clsLesson")) || {
    time:"07:20 早读\n08:00 第一节课\n12:00 午饭\n14:00 下午课\n17:30 放学\n18:30 晚自习",
    schedule:"周一：语文 数学 英语\n周二：物理 化学 生物\n周三：历史 地理 政治"
};
let homeworkList = JSON.parse(localStorage.getItem("clsHomework")) || [];
let broadcastList = JSON.parse(localStorage.getItem("broadcastList")) || [];
let receiptList = JSON.parse(localStorage.getItem("receiptList")) || [];

// 周次计算
function getWeekInfo(){
    let now=new Date();
    let d=Math.floor((now-TERM_START)/(1000*60*60*24));
    let week=Math.floor(d/7)+1;
    document.getElementById("weekInfo").innerText=`本周：第${week}周`;
}

function checkAccess(){
    let v=document.getElementById("accessPwd").value;
    if(v==ACCESS_PASSWORD){
        document.getElementById("accessLock").style.display="none";
        document.getElementById("mainWrap").style.display="block";
        getWeekInfo();
        renderAll();
        checkBroadcast();
    }else alert("密码错误");
}

function renderAll(){
    renderNotice(); renderHomework();
    renderTimeTable(); renderSchedule();
    updateSchoolTimer(); updateCountdown();
}

function sendBroadcast(){
    let target=document.getElementById("broadTarget").value;
    let level=document.getElementById("broadLevel").value;
    let txt=document.getElementById("broadText").value;
    if(!txt)return alert("内容不能为空");

    let obj={time:new Date().toLocaleString(),target:target,level:level,content:txt};
    broadcastList.push(obj);
    localStorage.setItem("broadcastList",JSON.stringify(broadcastList));
    alert("广播已发送");
}

function checkBroadcast(){
    let b=broadcastList[broadcastList.length-1];
    if(!b)return;
    if(b.level=="urgent") showBroadcast(b);
}

function showBroadcast(b){
    document.getElementById("broadTitle").innerText=b.level=="urgent"?"⚠️ 紧急通知":"📢 通知广播";
    document.getElementById("broadContent").innerText=b.content;
    document.getElementById("broadcastModal").style.display="flex";
}

function confirmBroadcast(){
    let user=prompt("请输入姓名确认已读：");
    if(!user)return;
    receiptList.push({time:new Date().toLocaleString(),user:user,broadcast:broadcastList[broadcastList.length-1]?.content});
    localStorage.setItem("receiptList",JSON.stringify(receiptList));
    document.getElementById("broadcastModal").style.display="none";
    alert("确认成功");
}

function renderNotice(){
    let last=document.getElementById("latestNotice");
    if(noticeList.length==0){last.innerHTML="<p>暂无通知</p>";return;}
    let latest=noticeList[noticeList.length-1];
    last.innerHTML=`[${latest.time}]<br>${latest.content}`;
}

function renderHomework(){
    let h=document.getElementById("homeworkList");
    if(homeworkList.length==0){h.innerHTML="<p>暂无作业</p>";return;}
    h.innerHTML=homeworkList.map(i=>`<div>${i.time}<br>${i.content}</div>`).join("");
}

function renderTimeTable(){document.getElementById("timeTable").innerText=lessonData.time;}
function renderSchedule(){document.getElementById("scheduleTable").innerText=lessonData.schedule;}

function updateSchoolTimer(){
    let h=new Date().getHours(),m=new Date().getMinutes();
    let t="正常上课";
    if(h<7||(h==7&&m<20))t="距离早读："+(7*60+20-h*60-m)+"分钟";
    else if(h<12)t="上午课程";
    else if(h<14)t="午休";
    else if(h<17)t="下午课程";
    else t="放学/晚自习";
    document.getElementById("schoolTimer").innerText=t;
}

function updateCountdown(){
    let now=new Date();
    let diff=Math.ceil((targetDate-now)/(1000*60*60*24));
    document.getElementById("countdown").innerText=`距离假期：${diff}天`;
}

function adminLogin(){
    if(document.getElementById("adminPwd").value==ADMIN_PASSWORD){
        document.getElementById("loginBox").style.display="none";
        document.getElementById("adminPanel").style.display="block";
    }else alert("密码错误");
}

function pushNotice(){
    let txt=document.getElementById("noticeText").value;
    if(!txt)return;
    noticeList.push({content:txt,time:new Date().toLocaleString()});
    localStorage.setItem("clsNotice",JSON.stringify(noticeList));
    alert("发布成功");
}

function pushHomework(){
    let txt=document.getElementById("homeworkText").value;
    if(!txt)return;
    homeworkList.push({content:txt,time:new Date().toLocaleString()});
    localStorage.setItem("clsHomework",JSON.stringify(homeworkList));
    alert("作业发布成功");
}

setInterval(updateSchoolTimer,60000);