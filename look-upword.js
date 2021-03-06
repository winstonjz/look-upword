var axios = require('axios')
var parseString = require('xml2js').parseString;
var util = require('./util/util');


var lookUpword = function (apiKey, queryString, suggestionCallback, wordsCallback, done) {
    var baseUrl = 'http://www.dictionaryapi.com/api/v1/references/thesaurus/xml/';
    var res
    axios
        .get(baseUrl + queryString + apiKey)
        .then(function(response) {
            var wordsWithSynonyms;
            // I separated the words by part of speech and formatted it
            parseString(response.data, function(err, result){
                var parsedJson =
                    JSON.parse(JSON.stringify(result.entry_list));
                if (parsedJson.suggestion) {
                    var formattedSuggestion = {
                        word: queryString,
                        related: parsedJson.suggestion
                    }
                    res =  formattedSuggestion
                    // var newSuggested = new Suggested(formattedSuggestion)
                    // newSuggested.save(function(err) {
                    // })
                    // res.json({related: parsedJson.suggestion});
                } else {
                    res =
                    util.convertXMLResultsToWords(queryString, result);
                }
            });
            /* if wordsWithSynonyms is populated then I can save all the words
             to the database*/
        }).catch(function(error) {
            console.log(error);
        }).then(function() {
            if (res.related) {
                suggestionCallback(res)
            } else {
                wordsCallback(res)
            }
        }).then(function (){
            if (done) {
                done();
            }
        })
}

var queryString = 'information';
var apiKey = '?key=0b966b02-dd99-4a31-a735-2206edb9a8a5' ;

var callbacks = {
    suggestionCallback: function (res) {
    },
    wordsCallback: function (res) {
    }
}
lookUpword(apiKey, queryString, callbacks.suggestionCallback, callbacks.wordsCallback)
module.exports = {
    lookUpword
}
