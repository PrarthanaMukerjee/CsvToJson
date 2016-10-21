var fs = require('fs');
var rl =require('readline');
var arr=[];
var head = true;
var key;
var firstData;
var secondData;

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


//Append File
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
DeleteFirst(appendFile);
ReadAppend(file,appendFile);

appendFile="./IndiaST2011.csv";
DeleteFirst(appendFile);
ReadAppend(file,appendFile);


var rlemitter = rl.createInterface(
{
 input:fs.createReadStream("India2011.csv"),
 output:fs.createWriteStream("age.json")
});

rlemitter.on('line',function(line)
{
 //on reading file line by line
 if(head)
 {
   key = line.split(",");
   for(var i=0;i<key.length;i++)
   {
     if(key[i]=="Age-group")
     {
       firstData = i;
     }
     if(key[i]=="Literate - Persons")
     {
       secondData = i;
     }
   }
   head = false;
 }
 else {
     var data = line.split(",");
     var obj = {};
     if(data[firstData-1]=="Total"&&(data[firstData]!="Age not stated"&&data[firstData]!="All ages"))
     {
     obj["AgeGroup"]=data[firstData];
     obj["Population"]=Number(data[secondData]);
     arr.push(obj);
   }
 }
});
rlemitter.on("close", function(close){
  var keys = Object.keys(arr[0]);
  for(var i=0;i<arr.length;i++)
  {
    for(var j=i+1;j<arr.length;j++)
     {
       if(arr[i][keys[0]]==arr[j][keys[0]])
       {
         arr[i][keys[1]]+= arr[j][keys[1]];
         arr.splice(j,j);
       }
    }
  }
  arr.pop();
  fs.appendFile("age.json",JSON.stringify(arr),function(err){
    if(err) throw err;
    console.log("File1 Written Successfully");
  });
  fs.truncate('./IndiaSC2011.csv');
  fs.truncate('./IndiaST2011.csv');
});
fs.writeFile('age.json',"", (err) => {
if (err) throw err;
});
