const Fs = require("fs");
const CsvReadableStream = require("csv-reader");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let inputStream = Fs.createReadStream("deneytest.csv", "utf8");
let mergedList = {};
let listOne = [];
let listTwo = [];
let listThree = [];
let listFour = [];
let csvWriter;

const main = () => {
  inputStream
    .pipe(new CsvReadableStream({ delimiter: ";", parseNumbers: true, parseBooleans: true, trim: true, allowQuotes: true }))
    .on("data", (row) => {
      const objectRow = createModel(row);
      switch (objectRow.groupNumber) {
        case 1:
          listOne.push(objectRow);
          break;
        case 2:
          listTwo.push(objectRow);
          break;
        case 3:
          listThree.push(objectRow);
          break;
        case 4:
          listFour.push(objectRow);
          break;
        case null:
          listOne.push(objectRow);
          listTwo.push(objectRow);
          listThree.push(objectRow);
          listFour.push(objectRow);
          break;
      }
      mergedList[0] = balancedLatinSquare(listOne, 7);
      mergedList[1] = balancedLatinSquare(listTwo, 7);
      mergedList[2] = balancedLatinSquare(listThree, 7);
      mergedList[3] = balancedLatinSquare(listFour, 7);
    })
    .on("end", () => {
      for (let i = 0; i <= 3; i++) {
        csvWriter = createCsvWriter({
          path: `deney${i}.csv`,
          header: [
            { id: 'type', title: 'type' },
            { id: 'sentence', title: 'sentence' },
            { id: 'groupNumber', title: 'groupNumber' },
          ],
          fieldDelimiter: ","
        });
        csvWriter.writeRecords(mergedList[i]);
      }
    });
}

const createModel = (row) => {
  let response;
  if (row[0] === 'ungrammatical' || row[0] === 'grammatical' || row[0] === 'mediocre') {
    response = {
      "type": (() => {
        switch (row[0]) {
          case "ungrammatical":
            return "E";
          case "grammatical":
            return "F";
          case "mediocre":
            return "G";
        }
      })(),
      "sentence": row[1],
      "groupNumber": null
    }
  } else {
    response = {
      "type": (() => {
        switch (row[1]) {
          case "def":
            if (row[2] == "acc") {
              return "A";
            } else {
              return "C";
            }
          case "indef":
            if (row[2] == "acc") {
              return "B";
            } else {
              return "D";
            }
        }
      })(),
      "sentence": row[3],
      "groupNumber": row[5]
    }
  }
  return response;
}
function balancedLatinSquare(array, participantId) {
  result = [];
  // Based on "Bradley, J. V. Complete counterbalancing of immediate sequential effects in a Latin square design. J. Amer. Statist. Ass.,.1958, 53, 525-528. "
  for (var i = 0, j = 0, h = 0; i < array.length; ++i) {
    var val = 0;
    if (i < 2 || i % 2 != 0) {
      val = j++;
    } else {
      val = array.length - h - 1;
      ++h;
    }

    var idx = (val + participantId) % array.length;
    result.push(array[idx]);
  }

  if (array.length % 2 != 0 && participantId % 2 != 0) {
    result = result.reverse();
  }

  return result;
}

main();