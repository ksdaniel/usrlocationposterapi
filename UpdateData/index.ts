import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosService } from "../Services/CosmosService";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const id = (req.query.id || (req.body && req.body.id));

    if (!id) {
        context.res = {
            status: 400,
            body: "Please pass an id on the query string or in the request body"
        };
        return;
    }

    const cosmosService = new CosmosService();

    const result = await cosmosService.updateItem(id, req.body);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: result
    };

};

export default httpTrigger;