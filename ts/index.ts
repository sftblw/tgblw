'use strict';
import * as Telegraf from 'telegraf';
import fs = require('fs');

const bot = new Telegraf(fs.readFileSync('config/token.txt'));

bot.on('text', (ctx, next) => {
  console.log('log : ' + ctx.message.text);
  return next(ctx);
});

bot.onCommand = (command: string | Array<string>, fn) => {

  const addHandler = (handlerCommand: string, handlerFunction) => {
    bot.on('text', (handlerContext, next) => {
      if (handlerContext.message.text.search(handlerCommand) !== -1) {
        console.log(handlerCommand + ' : ' + handlerContext.message.text);
        handlerFunction(handlerContext);
      }
      return next(handlerContext);
    });
  }

  if (typeof command === 'object' && command instanceof Array) {
    command.forEach((eachCmd) => {
      addHandler(eachCmd, fn);
    });
  }
  else {
    addHandler(command, fn);
  }
  
};

bot.onCommand(['/greet', '인사해'], (ctx) => ctx.reply('안녕하세요!'));
bot.onCommand(['/yesno', '예아니오'], (ctx) => {
  let randval = Math.random() * 100;
  return ctx.reply((Math.round(randval) >= 50 ? "예" : "아니오") + " (" + Math.round(randval) + "%)");
});
bot.onCommand(['/vs', '골라줘'], (ctx) => {
  let vslist = ctx.message.text.replace('/vs ', '').replace(/골라줘/gi, '').replace(/\r\n|\n+| +|VS|Vs|vs/gi, ' ').replace(/ +/gi, ' ').trim().split(/\r\n|\n| |VS|Vs|vs/gi);
  if (vslist == undefined || vslist.length == 0 || (vslist.length === 1 && vslist[0] == '') ) { return ctx.reply('오류: vs(골라줘): 고를 항목이 없는 것 같아요.\r\n' + vslist); }
  else { return ctx.reply(vslist[Math.floor((Math.random()*vslist.length))]); }
});
bot.onCommand(['/echo', '따라말해'], (ctx) => ctx.reply( ctx.message.text.replace(/\/echo|따라말해/gi,'').trim() ));
bot.onCommand(['/help', '도움말'], (ctx) => ctx.reply('명령어:\r\n/greet (인사해) /yesno (예아니오) /vs (골라줘) /help (도움말) /echo (따라말해)'));

bot.startPolling();
console.log('tgblw: end of code');
