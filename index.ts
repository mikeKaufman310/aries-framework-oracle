import axios from'axios';
async function res(){
    const inBox: HTMLInputElement | null = document.getElementById('didInput') as HTMLInputElement;
    if(typeof inBox !== null && typeof inBox?.outerHTML !== "undefined"){
        //document.write(inBox.value);//did:orcl:wnVwpENoPYSytIVmOVbARXXxniYySLRstdzRXVtkJAvbQgXVBY
        try{
            const data = JSON.stringify({
                chaincode: 'didtest',
                args: ["GetDidDocumentById", inBox.value],
                sync: true,
            });
            let config = {
                url: 'didtest/api/v2/channels/elizabeth',
                method: "post",
                header:{
                    Authorization: 'Basic ed25519-2018',
                    "Content-Type": "application/json",
                },
                data: data,
            };
            const res = await axios(config);
            document.write(JSON.stringify(res.data.result.payload));//temporary
        }catch(err){
            console.log("demo did not work");
        }
    }
}