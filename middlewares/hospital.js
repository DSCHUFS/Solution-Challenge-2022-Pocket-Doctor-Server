const mysql = require('mysql2/promise');
const dbconfig = require('./config/index').mysql;
const pool = mysql.createPool(dbconfig);

const request = require('request');

const url = 'http://apis.data.go.kr/B551182/hospInfoService1/getHospBasisList1';
let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + process.env.serviceKey; /* Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('2'); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('20'); /* */
queryParams += '&' + encodeURIComponent('sidoCd') + '=' + encodeURIComponent('110000'); /* */
queryParams += '&' + encodeURIComponent('zipCd') + '=' + encodeURIComponent('2070'); /* */
// queryParams += '&' + encodeURIComponent('clCd') + '=' + encodeURIComponent('21'); /* */
queryParams += '&' + encodeURIComponent('dgsbjtCd') + '=' + encodeURIComponent('03'); /* */
queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* */

request({
    url: url + queryParams,
    method: 'GET'
}, function (error, response, body) {
    if(error){
        throw new Error(error);
    }

    let info = JSON.parse(body);


    const dbTest = async () => {
    
        for(i in info['response']['body']['items']['item']){
            
            let name = info['response']['body']['items']['item'][i]['yadmNm'];
            let homepage = info['response']['body']['items']['item'][i]['hospUrl'];
            let location = info['response']['body']['items']['item'][i]['addr'];
            let tel = info['response']['body']['items']['item'][i]['telno'];
            if(homepage == undefined){
                homepage = '';
            }

            try{
            
                let connection = await pool.getConnection(async (conn) => conn);
            
                await connection.beginTransaction();
                await connection.query(
                `
                    INSERT INTO
                    hospitals(name, homepage, location, tel)
                    VALUE
                    (?, ?, ?, ?);
                `,
                [name, homepage, location, tel]
                );
                await connection.commit();
                await connection.release();
            } catch(err) {
                console.log('error');
            }
        }
    }

    dbTest();
});
