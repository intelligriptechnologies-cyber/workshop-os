import { invoiceTotals } from '../../src/invoice-math';
import { writeFileSync } from 'node:fs';
let seed=19483;
const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
const cases=[];
for(let i=0;i<500;i++){
 const lines=Array.from({length:1+Math.floor(random()*20)},()=>({qty:Math.round((.01+random()*20)*100)/100,rate:Math.round(random()*100000)/100,gst_rate:[0,5,9,12,18,28][Math.floor(random()*6)]}));
 const discount=i%9===0?100000:i%7===0?0:Math.round(random()*100000)/100;
 cases.push({lines,discount,expected:invoiceTotals(lines,discount)});
}
for(const lines of [[{qty:1,rate:1.005,gst_rate:18}],[{qty:.01,rate:.5,gst_rate:5},{qty:.01,rate:.5,gst_rate:28}],[{qty:1,rate:0,gst_rate:0}]]){
 cases.push({lines,discount:.01,expected:invoiceTotals(lines,.01)});
}
writeFileSync('backend/customer-slice/artifacts/calculation-reference.json',JSON.stringify(cases));
console.log(cases.length+' approved TypeScript calculation cases generated');
