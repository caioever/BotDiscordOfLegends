const Discord = require('discord.js');
const request = require('request');
const daesync = require('deasync');
//modulos meus
const campeoes = require('./CampeoesUtil');
const playerelo = require('./PlayerElo');
const config = require('./config.json');

const bot = new Discord.Client();

bot.login(config.tokenDiscord);

//BOT
bot.on("ready", () => {
    console.log("Bot Pronto LOCK AND LOADED!");
});

bot.on('message', (message) => {

    if (!message.content.startsWith(config.prefixo) || message.author.bot) return;

    const args = message.content.slice(config.prefixo.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    switch(comando) {
        case "partida" :
            let nome = args.slice(0).join(" ");
            message.reply(`Ok, deixa eu procurar a partida do ${nome}`);

            let configuracaoGetIdByName = {
                url: 'https://br1.api.riotgames.com/lol/summoner/v3/summoners/by-name/'+nome,
                method: 'GET',
                headers: {
                    'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Riot-Token': config.tokenLeagueOfLegends,
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
                }
            };
            request(configuracaoGetIdByName, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                    let callBackGetPartidaSumonerStatus = JSON.parse(body);

                    if (callBackGetPartidaSumonerStatus.summonerLevel < 30){
                        message.reply(`A mano, serim que teu nivel é ${callBackGetPartidaSumonerStatus.summonerLevel}`);
                    }

                    let configuracaoGetPartidaById = {
                        url: 'https://br1.api.riotgames.com//lol/spectator/v3/active-games/by-summoner/'+callBackGetPartidaSumonerStatus.id,
                        method: 'GET',
                        headers: {
                            'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'X-Riot-Token': config.tokenLeagueOfLegends,
                            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
                        }
                    };
                    request(configuracaoGetPartidaById, function (error, response, body) {
                        let callBackGetPartidaById = JSON.parse(body);

                        if (!error && response.statusCode == 200) {

                            //Divide os times
                            let timeAzul = [];

                            let timeVermelho = [];

                            for (var i = 0; i < callBackGetPartidaById.participants.length; i++) {
                                if (callBackGetPartidaById.participants[i].teamId == 100) {
                                    timeAzul.push(callBackGetPartidaById.participants[i]);
                                }
                                else if (callBackGetPartidaById.participants[i].teamId == 200){
                                    timeVermelho.push(callBackGetPartidaById.participants[i]);
                                }
                            }

                            const payloadTimeAzul = new Discord.RichEmbed()
                                .setTitle(`Time Azul`)
                                .setColor(0x4271b8)
                                //Time Azul
                                .addField(timeAzul[0].summonerName, campeoes.buscaNomeCampeao(timeAzul[0].championId), true)
                                .addField("SoloQ : ", playerelo.buscaEloSoloQDoJogador(timeAzul[0].summonerId).tier + playerelo.buscaEloSoloQDoJogador(timeAzul[0].summonerId).rank, true)
                                .addField("Flex: ", playerelo.buscaEloFlexDoJogador(timeAzul[0].summonerId).tier + playerelo.buscaEloFlexDoJogador(timeAzul[0].summonerId).rank, true)
                                .addField(timeAzul[1].summonerName, campeoes.buscaNomeCampeao(timeAzul[1].championId), true)
                                .addField("SoloQ: ", playerelo.buscaEloSoloQDoJogador(timeAzul[1].summonerId).tier + playerelo.buscaEloSoloQDoJogador(timeAzul[1].summonerId).rank, true)
                                .addField("Flex: ", playerelo.buscaEloFlexDoJogador(timeAzul[1].summonerId).tier + playerelo.buscaEloFlexDoJogador(timeAzul[1].summonerId).rank, true)
                                .addField(timeAzul[2].summonerName, campeoes.buscaNomeCampeao(timeAzul[2].championId), true)
                                .addField("SoloQ: ", playerelo.buscaEloSoloQDoJogador(timeAzul[2].summonerId).tier + playerelo.buscaEloSoloQDoJogador(timeAzul[2].summonerId).rank, true)
                                .addField("Flex: ", playerelo.buscaEloFlexDoJogador(timeAzul[2].summonerId).tier + playerelo.buscaEloFlexDoJogador(timeAzul[2].summonerId).rank, true)
                                .addField(timeAzul[3].summonerName, campeoes.buscaNomeCampeao(timeAzul[3].championId), true)
                                .addField("SoloQ: ", playerelo.buscaEloSoloQDoJogador(timeAzul[3].summonerId).tier + playerelo.buscaEloSoloQDoJogador(timeAzul[3].summonerId).rank, true)
                                .addField("Flex: ", playerelo.buscaEloFlexDoJogador(timeAzul[3].summonerId).tier + playerelo.buscaEloFlexDoJogador(timeAzul[3].summonerId).rank, true)
                                .addField(timeAzul[4].summonerName, campeoes.buscaNomeCampeao(timeAzul[4].championId), true)
                                .addField("SoloQ: ", playerelo.buscaEloSoloQDoJogador(timeAzul[4].summonerId).tier + playerelo.buscaEloSoloQDoJogador(timeAzul[4].summonerId).rank, true)
                                .addField("Flex: ", playerelo.buscaEloFlexDoJogador(timeAzul[4].summonerId).tier + playerelo.buscaEloFlexDoJogador(timeAzul[4].summonerId).rank, true);

                            const payloadTimeVermelho = new Discord.RichEmbed()
                                .setTitle(`Time Vermelho`)
                                .setColor(0xCC0000)
                                //Time Vermelho
                                .addField(timeVermelho[0].summonerName, campeoes.buscaNomeCampeao(timeVermelho[0].championId), true)
                                .addField("SoloQ: ", playerelo.buscaEloSoloQDoJogador(timeVermelho[0].summonerId).tier + playerelo.buscaEloSoloQDoJogador(timeVermelho[0].summonerId).rank, true)
                                .addField("Flex: ", playerelo.buscaEloFlexDoJogador(timeVermelho[0].summonerId).tier + playerelo.buscaEloFlexDoJogador(timeVermelho[0].summonerId).rank, true)
                                .addField(timeVermelho[1].summonerName, campeoes.buscaNomeCampeao(timeVermelho[1].championId), true)
                                .addField("SoloQ: ", playerelo.buscaEloSoloQDoJogador(timeVermelho[1].summonerId).tier + playerelo.buscaEloSoloQDoJogador(timeVermelho[1].summonerId).rank, true)
                                .addField("Flex: ", playerelo.buscaEloFlexDoJogador(timeVermelho[1].summonerId).tier + playerelo.buscaEloFlexDoJogador(timeVermelho[1].summonerId).rank, true)
                                .addField(timeVermelho[2].summonerName, campeoes.buscaNomeCampeao(timeVermelho[2].championId), true)
                                .addField("SoloQ: ", playerelo.buscaEloSoloQDoJogador(timeVermelho[2].summonerId).tier + playerelo.buscaEloSoloQDoJogador(timeVermelho[2].summonerId).rank, true)
                                .addField("Flex: ", playerelo.buscaEloFlexDoJogador(timeVermelho[2].summonerId).tier + playerelo.buscaEloFlexDoJogador(timeVermelho[2].summonerId).rank, true)
                                .addField(timeVermelho[3].summonerName, campeoes.buscaNomeCampeao(timeVermelho[3].championId), true)
                                .addField("SoloQ: ", playerelo.buscaEloSoloQDoJogador(timeVermelho[3].summonerId).tier + playerelo.buscaEloSoloQDoJogador(timeVermelho[3].summonerId).rank, true)
                                .addField("Flex: ", playerelo.buscaEloFlexDoJogador(timeVermelho[3].summonerId).tier + playerelo.buscaEloFlexDoJogador(timeVermelho[3].summonerId).rank, true)
                                .addField(timeVermelho[4].summonerName, campeoes.buscaNomeCampeao(timeVermelho[4].championId), true)
                                .addField("SoloQ: ", playerelo.buscaEloSoloQDoJogador(timeVermelho[4].summonerId).tier + playerelo.buscaEloSoloQDoJogador(timeVermelho[4].summonerId).rank, true)
                                .addField("Flex: ", playerelo.buscaEloFlexDoJogador(timeVermelho[4].summonerId).tier + playerelo.buscaEloFlexDoJogador(timeVermelho[4].summonerId).rank, true);
                            message.channel.send(payloadTimeAzul);
                            message.channel.send(payloadTimeVermelho);
                        }
                        else if (response.statusCode == 404) {
                            message.reply(` Você não está em uma partida`);
                            console.log(` Usuario não possui partida ativa.`);
                        }
                        else {
                            message.reply(` Não foi possivel encontrar por conta do erro ${response.statusCode}`);
                        }
                    });

                }
                else if (response.statusCode == 404) {
                    message.reply(` Não consegui te encontrar`)
                }
                else {
                    message.reply(` Não foi possivel encontrar por conta do erro: ${response.statusCode}`);
                }
            });

            break;
        case "atualizar":
            let retorno = campeoes.atualizaDadosDeCampeao();
            if (retorno = 'false'){
                message.reply(` Falha durante o update`);
            }
            else {
                message.reply(` Update feito com sucesso.`)
            }
            break
        default :
            message.channel.send(' Esse comando eu não conheco, tente !partida ou !atualizar ;)');
    }
});
