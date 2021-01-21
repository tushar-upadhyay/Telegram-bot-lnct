
const token = process.env.TOKEN;
const { Telegraf, Markup,session,Scenes } = require('telegraf');

const { deleteUser, getUser } = require('./db')
const { getAttendance, getAttendanceByDate } = require('./login')


const bot = new Telegraf(token)

const dateWiseWizardScene = new Scenes.WizardScene('dateWiseWizardScene',
async (ctx)=>{
  let res = await getAttendanceByDate({chatId:ctx.chat.id,date:ctx.message.text});
  ctx.reply(res);
  ctx.reply('Enter Q to exit! or anything to try again');
    return ctx.wizard.next();
},
ctx=>{
  if(ctx.message.text=="Q") return ctx.scene.leave();
  ctx.scene.reenter();

}
)
dateWiseWizardScene.enter(ctx=>ctx.reply('Send me date in DDMMYYYY format'))
const stage = new Scenes.Stage([dateWiseWizardScene]);
bot.use(session()); // to  be precise, session is not a must have for Scenes to work, but it sure is lonely without one
bot.use(stage.middleware());

bot.hears('Login',(ctx) => {
  if(getUser({chatId:ctx.chat.id})) return  ctx.reply('Already Logged In');
  ctx.reply('Login',_login(ctx) )
}
)

function _login(ctx){
  return Markup.inlineKeyboard([
    Markup.button.url('Login', `${process.env.url}/login#${ctx.chat.id}`),
  ])
}
function _logout(ctx){
  return ctx.reply(deleteUser({chatId:ctx.chat.id}));
}
bot.hears('Logout',_logout);
bot.hears('Attendance',async(ctx)=>ctx.reply(await getAttendance({chatId:ctx.chat.id})));


bot.command('start', (ctx) => {
  return ctx.reply(
    'Menu',
    Markup.keyboard([
     ['Login','Logout'],
      ['Attendance','Date Wise']
    ]).resize()
  )
})

bot.hears('Date Wise', async(ctx, next) => {
  if(!getUser({chatId:ctx.chat.id})) return  ctx.reply('Login First!');
  ctx.scene.enter('dateWiseWizardScene')
})

bot.launch()


process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
module.exports.bot = bot;
