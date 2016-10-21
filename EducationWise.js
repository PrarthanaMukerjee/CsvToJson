var fs = require('fs');
var rl =require('readline');
var arr=[];
var head = true;
var key;
var array;

// Function to delete first line of file
function DeleteFirst(filePath){
  fs.readFile(filePath, function(err, data) { // read file to memory
    if (!err) {
        data = data.toString(); // stringify buffer
        var position = data.toString().indexOf('\n'); // find position of new line element
        if (position != -1) { // if new line element found
            data = data.substr(position + 1); // subtract string based on first line length

            fs.writeFile(filePath, data, function(err) { // write file
                if (err) { // if error, report
                    console.log (err);
                }
            });
        } else {
            console.log('no lines found');
        }
    } else {
        console.log(err);
    }
     });
}

function ReadAppend(file,appendFile){
       fs.readFile(appendFile, function(err, data){
          if (err) throw err;

       fs.appendFile(file, data, function(err){ // merging file
          if (err) throw err;
       });
       });

}

file="./India2011.csv";
appendFile="./IndiaSC2011.csv";
DeleteFirst(appendFile);// function calling
ReadAppend(file,appendFile);

appendFile="./IndiaST2011.csv";
DeleteFirst(appendFile);
ReadAppend(file,appendFile);

var rlemitter = rl.createInterface(
{
 input:fs.createReadStream("India2011.csv"),
 output:fs.createWriteStream("education.json")
});

rlemitter.on('line',function(line)
{
 //on reading file line by line
 if(head)
 {
   key = line.split(",");
   head = false;
   array =[];
   for(var i=0;i<key.length;i++)
   {
     if(key[i].indexOf("Educational level")>-1&&key[i].indexOf("Persons")>-1)
     {
       array.push(i);
     }
   }
 }
 else {
     var data = line.split(",");
    if(data[5]=="All ages"&&data[4]=="Total")
    {
      for(var i=0;i<array.length;i++)
      {
        if(arr.length>i)
        {
          var k = Object.keys(arr[i]);
          arr[i][k[1]] += Number(data[array[i]]);
        }
        else {
          var obj = {};
          obj["educat"]= generate(key[array[i]]);
          obj["catPopulation"] = Number(data[array[i]]);
          arr.push(obj);
        }

      }
    }
   }

});
rlemitter.on("close", function(close){

  fs.appendFile("education.json",JSON.stringify(arr),function(err){
    if(err) throw err;
    console.log("File1 Written Successfully");
 });

 //Truncate the file
 fs.truncate('./IndiaSC2011.csv');
 fs.truncate('./IndiaST2011.csv');

});
fs.writeFile('education.json',"", (err) => {
if (err) throw err;
});

// modifiying key
function generate(str)
{
  str = str.substring(str.indexOf("-")+1,str.lastIndexOf("-"));
  return str.trim();
}
