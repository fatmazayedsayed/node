/*
assumbtions:
- csv file contains data for persons
- birth date in the csv file formated as MM/DD/YYYY
- birth time formated as 12 hour (am, pm)

Task requirements:
- change the birth date format to matach the person country format (as posible)
- calculate the age of the person in 1st October 2025
- add the calculated age to the person data
- create a paragraph from the formated data
- save new data in a new file
*/
import { DateTime, Zone } from 'luxon'
import * as fs from 'fs'
import { parse } from 'csv-parse'

var inputFilePath = './data.csv';
let data = fs.readFileSync(inputFilePath, { encoding: 'utf-8', flag: 'r' });
var arr_keys = ['id', 'gender', 'full name', 'email', 'date', 'time', 'country code', 'country', 'language code', 'zone']
fs.createReadStream(inputFilePath)
    .pipe(parse())
    .on('data', function (data) {
        try {
            let data_str;
            for (let index = 0; index < arr_keys.length; index++) {
                let rowData = ""; // Initialize an empty string for each row
                for (let i = 0; i <= index; i++) {
                    rowData += arr_keys[i] + ": " + data[i]; // Concatenate the key-value pair

                    // Add a comma and space separator if it's not the last element
                    if (i < index) {
                        rowData += ", ";
                    }
                }
                //change the birth date format to matach the person country format (as posible)

                let fullDate = DateTime.fromFormat(`${data[4]} ${data[5]}`, "MM/dd/yyyy t",
                    { Zone: data[9] });
                let localDate = fullDate
                    .setLocale(`${data[8]}-${data[6]}`)
                    .toLocaleString(DateTime.DATETIME_FULL);
                // console.log(localDate); // date formated

                //calculate the age of the person in 1st October 2025
                let ageCalculatedFrom = DateTime.fromFormat('2025-10-01 00:00:00',
                    'yyyy-MM-dd hh:mm:ss', { Zone: data[9] });
                let dateDiff = ageCalculatedFrom.diff(fullDate, 'year');
                let gender = data[1] == 'male' ? 'his' : 'her';

                //create a paragraph from the formated data
                let template = `${data[0]} -${data[2]} is born in ${data[7]} on ${localDate} 
                    the age in onctober will be ${Math.round(dateDiff.years)} years
                    ${gender} contact information is ${data[3]}
                    -------------------------
                    `;
               // console.log("----------------------------")
                console.log(template); // Log the row data in one line for each round
                data_str += template;
            }
            //save new data in a new file
            //console.log(data_str);
            fs.writeFileSync('./file_created', data_str, { encoding: 'utf-8' });
            console.log('file is saved');
        }
        catch (err) {
            //error handler
        }
    })
    .on('end', function () {
        //some final operation
    });  
