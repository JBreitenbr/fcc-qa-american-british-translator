const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
genDicts(){
let titles={...americanToBritishTitles};
let dict_1 = { ...americanOnly, ...americanToBritishSpelling };
let dict_2 = {...britishOnly};
let arr1=[];
for(let k of Object.keys(dict_1)){
  arr1.push([k+" ",dict_1[k]+" "]);
}
for(let k of Object.keys(dict_2)){
  if(!Object.keys(dict_1).includes(dict_2[k])){
  arr1.push([dict_2[k]+" ",k+" "]);
}
  }
for(let k of Object.keys(titles)){
  arr1.push([k+" ",titles[k]+" "]);
}
let arr2=[];
for(let k of Object.keys(dict_2)){
  arr2.push([k+" ",dict_2[k]+" "]);
}
for(let k of Object.keys(dict_1)){
  if(!Object.keys(dict_2).includes(dict_1[k])){
  arr2.push([dict_1[k]+" ",k+" "]);
}
}
for(let k of Object.keys(titles)){
  arr2.push([titles[k]+" ",k+" "]);
}
let AmToBrit={};
for(let i=0;i<arr1.length;i++){
  AmToBrit[arr1[i][0]]=arr1[i][1];
}

let BritToAm={};
for(let i=0;i<arr2.length;i++){
  BritToAm[arr2[i][0]]=arr2[i][1];
}
  return [AmToBrit,BritToAm];
}
  
textPrep(txt){
let lst=[".","?","!"];
let incl=lst.includes(txt[txt.length-1]);
if(incl){
  txt=txt.slice(0,txt.length-1)+" ";
}
else{
  txt=txt+" ";
}
  return txt;
  }

  transPhrase(txt,dict){
    let txt2=this.textPrep(txt);
    let rex=new RegExp(Object.keys(dict).join("|"),"gi");
    let tr=txt2.replace(rex,(term)=>dict[term]);
    let tr_hl=txt2.replace(rex,(term)=>'<span class="highlight">'+dict[term].slice(0,dict[term].length-1)+'</span> ');
    if([".","?","!"].includes(txt[txt.length-1])){
      tr=tr.slice(0,tr.length-1)+txt[txt.length-1];
      tr_hl=tr_hl.slice(0,tr_hl.length-1)+txt[txt.length-1];
    }
    else {
      tr=tr.slice(0,tr.length-1);
      tr_hl=tr_hl.slice(0,tr_hl.length-1);
    }
    return [tr,tr_hl];
  }

genTrans(text,mode){
  let timeRegex=/([0-9]|0[0-9]|1[0-9]|2[0-3])[\.|:][0-5][0-9]/g;
  let repl;
  let repl_hl;
  if(mode=="american-to-british"){
    let resu=this.transPhrase(text,this.genDicts()[0]);let tst=resu[0].match(timeRegex);
let tst_hl=resu[1].match(timeRegex);
    if(tst && tst_hl){
    for(let i=0;i<tst.length;i++){
      repl=tst[i].replace(":",".");
repl_hl='<span class="highlight">'+tst_hl[i].replace(":",".")+'</span>';
resu[0]=resu[0].replace(tst[i],repl);
resu[1]=resu[1].replace(tst_hl[i],repl_hl);}
return [resu[0],resu[1]];
    }
    else {
      return resu;
    }
  }
  if(mode=="british-to-american"){
    let resu=this.transPhrase(text,this.genDicts()[1]);let tst=resu[0].match(timeRegex);
let tst_hl=resu[1].match(timeRegex);
    if(tst && tst_hl){
    for(let i=0;i<tst.length;i++){
      repl=tst[i].replace(".",":");
repl_hl='<span class="highlight">'+tst_hl[i].replace(".",":")+'</span>';
resu[0]=resu[0].replace(tst[i],repl);
resu[1]=resu[1].replace(tst_hl[i],repl_hl);}
return [resu[0],resu[1]];
    }
    else {
      return resu;
    }
    }
  }
}

module.exports = Translator;
