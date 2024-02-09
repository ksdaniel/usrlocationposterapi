import parseMultipartFormData from "@anzp/azure-function-multipart";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobService } from "../Services/BlobService";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const { fields, files } = await parseMultipartFormData(req);

    // Add the code to upload the file to Azure Blob Storage here

    let randomFileNames = [];

    const uploadPromises = files.map(async (file) => {
        const containerName = 'uploads';
        const fileName = file.filename;
        const fileBuffer = file.bufferFile;

        // Create a new instance of the BlobService class

        const blobService = new BlobService();

        //Get the file extensions 

        const fileExtension = fileName.split('.').pop();

        // Create a random file name 
    
        const randomFileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Add the file extension to the random file name

        const randomFileNameWithExtension = `${randomFileName}.${fileExtension}`;

        // Upload the file to Azure Blob Storage

        await blobService.uploadFile(containerName, randomFileNameWithExtension, fileBuffer);

        // Add the random file name to the array

        randomFileNames.push(randomFileNameWithExtension);

    })

    // Wait for all the files to be uploaded

    await Promise.all(uploadPromises);

    // Create the object that will be stored in Cosmos
    // Add all the fields and the filename array to the object

    const data = {
        ...fields.map(f => ({ [f.name]: f.value })).reduce((a, b) => ({ ...a, ...b }), {}),
        files: randomFileNames,
        // set the id to a random value 
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    };


    context.log('Data:', data);

    // Add the code to store the data in Cosmos DB here

    context.bindings.cosmosOut = data;

    // Return a 200 OK status

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: 'OK'
    };

};

export default httpTrigger;