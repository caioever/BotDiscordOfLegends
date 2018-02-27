const request = require('request');
const daesync = require('deasync');
const fs = require('fs');
const config = require('./config.json');
let dadosCampeao = require('./dadosCampeao.json');

function getChampInfo (callback) {
    let configuracaoGetChampInfo = {
        url: 'https://br1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&champListData=keys&dataById=false',
        method: 'GET',
        headers: {
            'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Riot-Token': config.tokenLeagueOfLegends,
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        }
    };
    request(configuracaoGetChampInfo, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body);
        }
        else {
            callback(false);
        }
    });
}

exports.atualizaDadosDeCampeao = function () {
    let sync = true;
    let resultado = null;
    getChampInfo( function (callback) {
        resultado = callback;
        sync = false;
    });

    while (sync) {daesync.sleep(5);}

    if (resultado != false) {
        fs.writeFileSync('./dadosCampeao.json', resultado);
        console.log("sucesso ao atualizar a lista");
    }
    else {
        console.log(resultado);
    }

};

exports.buscaNomeCampeao = function(idCampeao) {
    return dadosCampeao.keys[idCampeao];
};