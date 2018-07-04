const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

const hook = new Discord.WebhookClient('463785969473159170', 'c2tOFN4kqDypmk2aLAZlv2WsMakd9irZ1OgKdH5D-vgbiOHmyii0Z2b4lWOj6I3Z7-0G');
hook.send(`**Bot Aktif.**\n**Müzik API aktif**\nSunucular • ${client.guilds.size.toLocaleString()}\nKullanıcılar • ${client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}\n`);

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'sa') {
        setTimeout(() => {
      msg.react('🇸');
    }, 1000);
            setTimeout(() => {
      msg.react('🇦');
    }, 1500);
    msg.reply('Aleyküm Selam!');
  }
});

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

client.on ('message', message => {
if (message.content === prefix + "emojiler") {
  const emojiList = message.guild.emojis.map(e=>e.toString()).join(" **|** ");
  message.channel.send(emojiList);
}
})

client.on('message', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(' ')[0];
  command = command.slice(prefix.length);

  let args = message.content.split(' ').slice(1);

  if (command === 'bug-gönder' || command === 'bug') {
    let str = '<@406832593758322688>';
    let id = str.replace(/[<@!>]/g, '');
    let mesaj = args.slice(0).join(' ');
    if (mesaj.length < 1) return message.reply(`Bulduğunuz bug nedir?`);
    message.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription('<:basarili:442423661190709248> Bug bildirildi! Bug bildirdiğiniz için teşekkür ederiz!'));
    const embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle('Tavsiye bilgileri;')
    .addField('Tavsiye:', mesaj, true)
    .addField('Kullanıcı adı:', message.author.tag, true)
    .addField('Kullanıcı kimliği:', message.author.id, true)
    .addField('Sunucu adı:', message.guild.name, true)
    .addField('Sunucu kimliği:', message.guild.id, true)
    client.fetchUser(id)
    .then(user => {user.send({embed})})
  }
});

client.on('message', msg => {
  if (msg.content.startsWith(prefix + "yaz")) {
    if (msg.channel.type !== "dm"){
    let mesaj = msg.content.substring(2 + 3);
    msg.delete (msg.content == 'yaz' + mesaj)
    let embed = new Discord.RichEmbed()
    .setColor("RANDOM")
       .setDescription(mesaj)
return msg.channel.send({embed})}

    }
    });

     client.on('guildMemberAdd', member => {
  let guild = member.guild;
  let joinRole = guild.roles.find('name', 'Üye'); // Burada girişte verilcek rolu seçelim.
  member.addRole(joinRole); // seçtiğimiz rolu verelim.

  const channel = member.guild.channels.find('name', 's-log'); // burda ise kanalı belirleyelim hangi kanala atsın ben mod-log dedim.
  if (!channel) return;
  const embed = new Discord.RichEmbed()
  .setColor('RANDOM')
  .setAuthor(member.user.username, member.user.avatarURL)
  .setThumbnail(member.user.avatarURL)
  .setTitle('📥 | Lan Bakın Biri Geldi!')
  .setTimestamp()
  channel.sendEmbed(embed); // belirlediğimiz kanala mesaj gönderelim.
});

client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.find('name', 's-log');
  if (!channel) return;
  const embed = new Discord.RichEmbed()
  .setColor('RANDOM')
  .setAuthor(member.user.username, member.user.avatarURL)
  .setThumbnail(member.user.avatarURL)
  .setTitle('📤 | Sunucudan ayrıldı | Görüşmek üzere | Niye Gittin Leyn ~')
  .setTimestamp()
  channel.sendEmbed(embed); 
});

client.on('message', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(ayarlar.prefix)) return;

  let command = message.content.split(' ')[0];
  command = command.slice(ayarlar.prefix.length);

  let args = message.content.split(' ').slice(1);

  if (command === 'topla') {
    let numArray = args.map(n=> parseInt(n));
    let total = numArray.reduce( (p, c) => p+c);
    message.channel.sendMessage(`${total}`);
  }
  if (command === 'çıkar') {
    let numArray = args.map(n=> parseInt(n));
    let total = numArray.reduce( (p, c) => p-c);
    message.channel.sendMessage(`${total}`);
  }
  if (command === 'çarp') {
    let numArray = args.map(n=> parseInt(n));
    let total = numArray.reduce( (p, c) => p*c);
    message.channel.sendMessage(`${total}`);
  }
  if (command === 'böl') {
    let numArray = args.map(n=> parseInt(n));
    let total = numArray.reduce( (p, c) => p/c);
    message.channel.sendMessage(`${total}`);
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'd!desteksunucusu') {
    msg.channel.send(':inbox_tray: Destek sunucusuna katılmak için "https://discord.gg/Xc5c6gs" adresine tıklayabilirsiniz.');
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'd!reklamengelle') {
    msg.channel.send(':white_check_mark: Başarıyla reklam engelleme özelliği aktifleştirildi. Bu özellik "**Kullanıcıları Yasakla**" yetkisi olanlarda çalışmayacaktır. Bundan sonra `Discord sunucu davetleri`, `Facebook linkleri`, `YouTube linkleri`, `Dailymotion linkleri` ve `Google linkleri` gibi linkler engellenecek!');
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'd!küfürkoruması') {
    msg.channel.send(':white_check_mark: Başarıyla küfür engelleme özelliği aktifleştirildi. Bu özellik "**Kullanıcıları Yasakla**" yetkisi olanlarda çalışmayacaktır. Bundan sonra kanalda edilen küfürler engellenecek; lütfen bottan mesajları yönet yetkisini kaldırmayın!');
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'd!discordbots') {
    msg.channel.send('DesertHawk botunun` discordbots.org` üzerindeki profilini görmek için aşağıdaki linki kullanabilirsiniz; \n https://discordbots.org/bot/421303172766892052 ');
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'd!komutlar') {
    msg.channel.send('Bütün komutları ayrıntılı bir şekilde görmek için "http://komutlar.deserthawk.rf.gd/" adresini ziyaret edin :sunglasses:');
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'd!blog') {
    msg.channel.send('DesertHawk | Blog \n Tüm güncellemelerden, haberlerden veya hatalardan haberdar olmak istiyorsanız blogumuzu ziyaret edebilirsiniz! \n http://blog.deserthawk.rf.gd');
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === '-seviye') {
    msg.channel.send(':warning: Üzgünüm, seviye sistemi botu büyük zararlara uğrattığından dolayı kaldırıldı.');
  }
});

client.on('message', msg => {
 if(msg.content.startsWith(prefix + "kurucu")) {
  msg.channel.sendMessage(`**${msg.guild.name}** adlı Discord sunucusunun kurucusu; ${msg.guild.owner} adlı kullanıcıdır.`)
}
});

client.on('message', msg => {
 if(msg.content.startsWith(prefix + "discrim")) {
  msg.channel.sendMessage(`Eklencek!!!`)
}
});

client.on('message', msg => {
 if(msg.content.startsWith(prefix + "çal")) {
  msg.channel.sendMessage(`Müzik Komutları Eklenecek`)
}
});

client.on('guildCreate', guild => {
  const embed = new Discord.RichEmbed()
  .setColor('RANDOM')
  .setTitle('Sunucuya katıldı;')
  .setDescription(`Bot, 》${guild.name}《 adlı sunucuya katıldı [${guild.memberCount} üye]!`)
  .setFooter('VoVe', client.user.avatarURL)
  .setTimestamp()
  client.channels.get('456730080845234207').send(embed);
});

client.on('guildDelete', guild => {
  const embed = new Discord.RichEmbed()
  .setColor('RANDOM')
  .setTitle('Sunucudan ayrıldı;')
  .setDescription(`Bot, 》${guild.name}《 adlı sunucudan ayrıldı [${guild.memberCount} üye]!`)
  .setFooter('VoVe', client.user.avatarURL)
  .setTimestamp()
  client.channels.get('456730080845234207').send(embed);
});

client.on("message", message => {
    if (message.content.toLowerCase() === prefix + "sunucubilgi") {
        const embed = new Discord.RichEmbed()
    .setTimestamp()
    .setAuthor(message.guild.name, message.guild.iconURL)
    .addField('Sunucu Adı:', message.guild.name)
    .addField('Sunucu ID:', message.guild.id)
    .addField('Ana kanal:', message.guild.defaultChannel)
    .addField('Sunucu Bölgesi:', message.guild.region)
    .addField('Üye sayısı:', message.guild.memberCount)
    .addField('Sahibi:', message.guild.owner + ' (' + message.guild.ownerID + ')')
    .addField('Kanal sayısı:', message.guild.channels.size)
    .addField('Oluşturulma tarihi:', message.guild.createdAt)
            .setColor("RANDOM")

        return message.channel.sendEmbed(embed)
    }
    
    if (message.content.toLowerCase() === prefix + "bi") {
        const embed = new Discord.RichEmbed()
            .addField("Bot Sahibi", `<@419936204117770241>`, true)
            .addField("Version", "0.0.1", true)
            .addField("Toplam Sunucu Sayısı", client.guilds.size, true)
            .addField("Toplam Kullanıcı Sayısı", client.users.size, true)
            .addField("Toplam Kanal Sayısı", client.channels.size, true)
            .addField("Kitaplık Türü", "discord.js")
            .setColor("RANDOM")
        return message.channel.sendEmbed(embed)
    }
});

client.on('message', message => {
if (message.content.toLowerCase() === prefix + "zekam") {
    var sans = ["11", "15", "20", "24", "28", "31", "39", "45", "49", "54", "58", "63", "67", "77", "73", "84", "80", "83", "96", "94", "99", "Albert Einstein mısın krdşm"];
    var sonuc = sans[Math.floor((Math.random() * sans.length))];
    const embed = new Discord.RichEmbed()
    .addField(`***___Zekan___***`, `${sonuc}`)
    return message.channel.sendEmbed(embed);
}
});

client.on('message', message => {
if (message.content.toLowerCase() === prefix + "şanslı-sayım") {
    var sans = ["11", "15", "20", "24", "28", "31", "39", "45", "49", "54", "58", "63", "67", "77", "73", "84", "80", "83", "96", "94", "99", "52"];
    var sonuc = sans[Math.floor((Math.random() * sans.length))];
    const embed = new Discord.RichEmbed()
    .addField(`***___Senin Şanslı Sayın___***`, `${sonuc}`)
    return message.channel.sendEmbed(embed);
}
});

const { Client, Util } = require('discord.js');
const ytdl = require("ytdl-core");
const { TOKEN, PREFIX, GOOGLE_API_KEY } = require('./ayarlar');
const YouTube = require('simple-youtube-api');


const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Müzik kodları Aktif! iyi dinlemeler moruk'));

client.on('disconnect', () => console.log('bağlantı kesildi. tekrar bağlanmaya çalışıyorum.'));

client.on('reconnecting', () => console.log('Tekrar bağlanıyorum..'));

client.on('message', async msg => { // eslint-disable-line
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(PREFIX.length)

	if (command === 'oynat') {
    if (!msg.guild) {
      const ozelmesajuyari = new Discord.RichEmbed()
      .setDescription(`You can not use commands here.`)
      return msg.author.sendEmbed(ozelmesajuyari); }
		const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription(' ❎ | İlk olarak sesli bir kanala giriş yapmanız gerek.'));
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
      return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
      .setDescription('🚫 | Şuanda olduğunuz kanala girmek için gerekli izinlere sahip değilim.'));
		}
		if (!permissions.has('SPEAK')) {
      return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
      .setDescription('🚫 | Şarkı başlatılamıyor. Lütfen mikrofonumu açınız.'));
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // ehehehehu videomuzu bulalım
				await handleVideo(video2, msg, voiceChannel, true); // ve gönderelim
			}
      return msg.channel.sendEmbed(new Discord.RichEmbed)
      .setDescription(`✔ | Playlist ➢ **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					msg.channel.sendEmbed(new Discord.RichEmbed().setDescription(`
__**Şarkı seçimi:**__ \n 
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
 \n **lütfen 1-10 arasında bir rakam seciniz 30 saniye içinde liste iptal edilecektir.**
`)
          .setColor('RANDOM'));
					// en fazla 5 tane 
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
            return msg.channel.sendEmbed(new Discord.RichEmbed()
            .setColor('RANDOM')
            .setDescription('❎ | Şarkı seçimi iptal edildi. '));
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
          return msg.channel.sendEmbed(new Discord.RichEmbed()
          .setColor('RANDOM')
          .setDescription(' ❎ | Herhangi bir arama sonucu elde edemedim.'));
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'geç') {
    if (!msg.guild) {
      const ozelmesajuyari = new Discord.RichEmbed()
      .setDescription(`You can not use commands here.`)
      return msg.author.sendEmbed(ozelmesajuyari); }
    if (!msg.member.voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription(' ❎ | Lütfen öncelikle sesli bir kanala katılınız.'));
		if (!serverQueue) return msg.channel.send(' ❎ | Kuyruk boş olduğu için geçemiyorum. ');
		serverQueue.connection.dispatcher.end('Geç komudu kullanıldı.');
		return undefined;
	} else if (command === 'qweqweqwedosgjsdflkh242309857238957y239856239856012356') {
    if (!msg.guild) {
      const ozelmesajuyari = new Discord.RichEmbed()
      .setDescription(`You can not use commands here.`)
      return msg.author.sendEmbed(ozelmesajuyari); }
    if (!msg.member.voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription(' ❎ | Lütfen öncelikle sesli bir kanala katılınız.'));
    if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription(' ❎ | Şu anda herhangi bir şarkı çalmıyorum.'));
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Kapat komutu kullanıldı!');
		return undefined;
	} else if (command === 'ses') {
    if (!message.guild) {
      if (!msg.guild) {
        const ozelmesajuyari = new Discord.RichEmbed()
        .setDescription(`You can not use commands here.`)
        return msg.author.sendEmbed(ozelmesajuyari); }
    if (!msg.member.voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
  .setDescription(' ❎ | Lütfen öncelikle sesli bir kanala katılınız.'));
    if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
   .setDescription(' ❎ | Şu anda herhangi bir şarkı çalmıyorum.'));
    if (!args[1]) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription(` <:hope:412142425838977024> | Ses seviyesi: **${serverQueue.volume}**`));
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    return msg.channel.sendEmbed(new Discord.RichEmbed()
    (` <:hope:412142425838977024> | Yeni ses seviyesi: **${args[1]}**`));
      }
	} else if (command === 'şarkıadı') {
    if (!msg.guild) {
      const ozelmesajuyari = new Discord.RichEmbed()
      .setDescription(`<:uyari:405162608631480320> | Şu anda hiçbir şey çalmıyorum.`)
      return msg.author.sendEmbed(ozelmesajuyari); }
    if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription('There is nothing playing.'));
    return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription(`🎶 Şu anda çalınan şarkı: **${serverQueue.songs[0].title}**`));
	} else if (command === 'kuyruk') {
		if (!serverQueue) return msg.channel.send('❎ | Şu anda hiçbir şey çalmıyorum. ');
		return msg.channel.send(`
__**Şarkı listesi:**__ \n 
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
\n **Şu anda çalınan:** ${serverQueue.songs[0].title}
		`);
	} else if (command === 'durdur') {
    if (!msg.guild) {
      const ozelmesajuyari = new Discord.RichEmbed()
      .setDescription(`You can not use commands here.`)
      return msg.author.sendEmbed(ozelmesajuyari); }
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
      return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setDescription('⏸ | Müzik durduruldu.')
      .setColor('RANDOM'));
		}
		return msg.channel.send('🚫 | Şu anda hiçbir şey çalmıyorum.');
	} else if (command === 'devamet') {
    if (!msg.guild) {
      const ozelmesajuyari = new Discord.RichEmbed()
      .setDescription(`You can not use commands here.`)
      return msg.author.sendEmbed(ozelmesajuyari); }
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
      return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
      .setDescription('▶ | Müzik şu anda devam ediyor..'));
		}
		return msg.channel.send('❎ | Şu anda hiçbir şey çalmıyorum.');
  }

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: video.title, 
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
    else return msg.channel.sendEmbed(new Discord.RichEmbed()
  .setDescription(`✔ | **${song.title}** adlı şarkı başarıyla kuyruğa eklendi.`)
  .setColor('RANDOM'));
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  serverQueue.textChannel.sendEmbed(new Discord.RichEmbed()
  .setDescription(`🎶 Çalınan şarkı: **${song.title}**`)
  .setColor('RANDOM'));
}


client.on('message', (message) => {
    if (message.content.toLowerCase() === prefix + 'gir') {
        if (!message.guild) {
            const ozelmesajuyari = new Discord.RichEmbed()
            .setDescription(`You can not use commands here.`)
            return message.author.sendEmbed(ozelmesajuyari); }
        try 
    {
    message.member.voiceChannel.join();
     return message.channel.sendEmbed(new Discord.RichEmbed()
     .setDescription(' Başarılı ➢**' + message.member.voiceChannel+ '** adlı kanala giriş yaptım. ')
     .setColor('RANDOM'));
    }
    catch(e) 
    {
    return message.channel.sendEmbed(new Discord.RichEmbed()
    .setDescription('❎ | Lütfen öncelikle sesli bir kanala katılınız.')
    .setColor('RANDOM'));
    }
    }

    if (message.content.toLocaleLowerCase() === prefix + 'kapat') {
        if (!message.guild) {
            const ozelmesajuyari = new Discord.RichEmbed()
            .setDescription(`You can not use commands here.`)
            return message.author.sendEmbed(ozelmesajuyari); }
            try
            {
                message.member.voiceChannel.leave();
                return message.channel.sendEmbed(new Discord.RichEmbed()
                .setDescription(' Başarılı ➢**' + message.member.voiceChannel+ '** adlı kanaldan çıkış yaptım.')
                .setColor('RANDOM'));
               }
               catch(e) 
               {
               return message.channel.sendEmbed(new Discord.RichEmbed()
               .setDescription('<:uyari:405162608631480320> | Lütfen öncelikle sesli bir kanala katılınız.')
               .setColor('RANDOM'));
               }
              }
          if (message.content.toLowerCase() === prefix + 'kanal bilgi' ) {
            if (!message.guild) {
              const ozelmesajuyari = new Discord.RichEmbed()
              .setDescription(`You can not use commands here.`)
              return message.author.sendEmbed(ozelmesajuyari); }
            try 
            {
           message.channel.sendEmbed(new Discord.RichEmbed().addField(' __Sesli kanal bilgileri__', ` **•** kanal ismi: **${message.member.voiceChannel.name}** \n **•** MAX kullanıcı sayısı: **${message.member.voiceChannel.userLimit}** \n **•** Bit hızı: **${message.member.voiceChannel.bitrate}** \n **•** kanal ID: **${message.member.voiceChannelID} ** \n **•** Kanal pozisyonu **${message.member.voiceChannel.position}**`).setColor('RANDOM'));
              }
              catch(e)
              {
                message.channel.sendEmbed(new Discord.RichEmbed()
                .setDescription('❎ | Lütfen öncelikle sesli bir kanala katılınız.')
                .setColor('RANDOM'));
              };
            }           
        });

client.on('message', message => {
if (message.content.toLowerCase() === prefix + "zar-at") {
    var sans = ["https://cdn.discordapp.com/attachments/458004691402489856/458006572828721163/1_nokta.png", "https://cdn.discordapp.com/attachments/458004691402489856/458006604747374592/2_nokta.png", "https://cdn.discordapp.com/attachments/458004691402489856/458006636867354644/3_noktal.png", "https://cdn.discordapp.com/attachments/458004691402489856/458006663488733206/4_noktal.png", "https://cdn.discordapp.com/attachments/458004691402489856/458006700369117194/5_noktal.png","https://cdn.discordapp.com/attachments/458004691402489856/458006716882092032/6_noktal.png",];
    var sonuc = sans[Math.floor((Math.random() * sans.length))];
    const embed = new Discord.RichEmbed()
    .addField(`***___Zar Sayın___***`, `${sonuc}`)
    return message.channel.sendEmbed(embed);
}
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === prefix + 'i') {
		if (!msg.guild.member(msg.author).hasPermission("BAN_MEMBERS")) {
			msg.channel.sendMessage(`Sunucu Sayısı: **${client.guilds.size}** Sunucu | Kanal Sayısı: **${client.channels.size.toLocaleString()}** Kanal | Kullanıcı Sayısı: **${client.users.size}** Kullanıcı | Botun Pingi: **${client.ping}** ms | Discord.JS Sürümü: **v${Discord.version}**`);
		} else {
		msg.channel.sendMessage(`Sunucu Sayısı: **${client.guilds.size}** Sunucu | Kanal Sayısı: **${client.channels.size.toLocaleString()}** Kanal | Kullanıcı Sayısı: **${client.users.size}** Kullanıcı | Botun Pingi: **${client.ping}** ms | Discord.JS Sürümü: **v${Discord.version}**`);
		}
	}
});

bot.on('ready', () => {
	console.log("Yükleniyor...");
	setTimeout(function(){
	console.log("Bot Hazır Yusuf'um.");
	}, 1000);
	function botStatus() {
        let status = [
            `Prefix ${botconfig.prefix}.`,
            `${bot.guilds.size} .`,
            `s!yardım.`,
            `Geliştiricim Yusuf#2022`,
            `botu ${bot.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} Kullanıcı.`
        ];
        let rstatus = Math.floor(Math.random() * status.length);

        bot.user.setActivity(status[rstatus], {Type: 'STREAMING'});        // BOT STATUS
      }; setInterval(botStatus, 20000)
        setInterval(() => {
        dbl.postStats(bot.guilds.size)
        }, 1800000);
	})

client.login(process.env.BOT_TOKEN);
