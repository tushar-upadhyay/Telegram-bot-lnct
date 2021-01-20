
const token = process.env.TOKEN;
const { Telegraf, Markup } = require('telegraf')
const { deleteUser, getUser } = require('./db')
const { getAttendance, login } = require('./login')


const bot = new Telegraf(token)

bot.start(ctx=>ctx.reply('Welcome please type /menu to view all options '))
bot.command('login',(ctx) => {
  if(getUser({chatId:ctx.chat.id})) return  ctx.reply('Already Logged In');
  ctx.reply('Login',_login(ctx) )
}
)
function _login(ctx){
  return Markup.inlineKeyboard([
    Markup.button.url('Login', `https://lnctbot.herokuapp.com/login#${ctx.chat.id}`),
  ])
}
function _logout(ctx){
  return ctx.reply(deleteUser({chatId:ctx.chat.id}));
}
bot.command('logout',_logout);
bot.command('/help',ctx=>ctx.reply('Type /menu for all options'))
bot.command('attendance',async(ctx)=>ctx.reply(await getAttendance({chatId:ctx.chat.id})));
bot.action('delete', ({ deleteMessage }) => deleteMessage())

bot.command('menu', (ctx) => {
  return ctx.reply(
    'Menu',
    Markup.inlineKeyboard([
      Markup.button.callback('login','login'),
      Markup.button.callback('attendance', 'attendance'),
      Markup.button.callback('logout','logout')
    ])
  )
})
bot.action('login', (ctx, next) => {
  return ctx.reply('Login',_login(ctx)).then(()=>next())
})
bot.action('logout',_logout)
bot.action('attendance', async(ctx, next) => {
  return ctx.reply(await getAttendance({chatId:ctx.chat.id})).then(()=>next())
})
bot.launch()


process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
module.exports.bot = bot;
