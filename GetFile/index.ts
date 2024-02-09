import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobService } from "../Services/BlobService";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const filename = (req.query.filename || (req.body && req.body.filename));

    if (!filename) {
        context.res = {
            status: 400,
            body: "Please pass a filename on the query string or in the request body"
        };
        return;
    }

    // get an instance of the BlobService class

    const blobService = new BlobService();

    // retrive the file 

    const file = await blobService.getFileBytes('uploads', filename);

    // set the response message

    const responseMessage = file;

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};

export default httpTrigger;