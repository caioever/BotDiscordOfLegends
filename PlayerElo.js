const request = require('request');
const daesync = require('deasync');
const fs = require('fs');
const config = require('./config.json');
let dadosCampeao = require('./dadosCampeao.json');

function getEloDoInvocador (idDoPlayer, callback) {
    let configuracaoGetChampInfo = {
        url: 'https://br1.api.riotgames.com/lol/league/v3/positions/by-summoner/' + idDoPlayer,
        method: 'GET',
        headers: {
            'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Riot-Token': config.tokenLeagueOfLegends,
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        }
    };
    request(configuracaoGetChampInfo, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(JSON.parse(body));
        }
        else {
            callback(false);
        }
    });
}

exports.buscaEloSoloQDoJogador = function (idDoPlayer) {
    let sync = true;
    let resultado = null;
    getEloDoInvocador(idDoPlayer,  function (callback) {

        if (callback === false){
            resultado = {tier: "Falha durante a busca do tier", rank: " "};
        }
        else if (callback.length === 0){
            resultado = {tier: "Unranked", rank: " "};
        }
        else {
            for (let i = 0 ; i < callback.length; i++) {
                if (callback[i].queueType === "RANKED_SOLO_5x5") {
                    resultado = callback[i];
                }
            }
            if (resultado === null) {
                resultado = {tier: "Unranked", rank: " "};
            }
        }
        sync = false;
    });

    while (sync) {daesync.sleep(1);}

    return resultado;
};
exports.buscaEloFlexDoJogador = function (idDoPlayer) {
    let sync = true;
    let resultado = null;
    getEloDoInvocador(idDoPlayer,  function (callback) {

        if (callback === false){
            resultado = {tier: "Falha durante a busca do tier", rank: " "};
        }
        else if (callback.length === 0){
            resultado = {tier: "Unranked", rank: " "};
        }
        else {
            for (let i = 0 ; i < callback.length; i++) {
                if (callback[i].queueType === "RANKED_FLEX_SR") {
                    resultado = callback[i];
                }
            }
            if (resultado === null) {
                resultado = {tier: "Unranked", rank: " "};
            }
        }
        sync = false;
    });

    while (sync) {daesync.sleep(1);}

    return resultado;
};
exports.buscaElo3x3DoJogador = function (idDoPlayer) {
    let sync = true;
    let resultado = null;
    getEloDoInvocador(idDoPlayer,  function (callback) {

        if (callback === false){
            resultado = {tier: "Falha durante a busca do tier", rank: " "};
        }
        else if (callback.length === 0){
            resultado = {tier: "Unranked", rank: " "};
        }
        else {
            for (let i = 0 ; i < callback.length; i++) {
                if (callback[i].queueType === "RANKED_FLEX_TT") {
                    resultado = callback[i];
                }
            }
            if (resultado === null) {
                resultado = {tier: "Unranked", rank: " "};
            }
        }
        sync = false;
    });

    while (sync) {daesync.sleep(1);}

    return resultado;
};