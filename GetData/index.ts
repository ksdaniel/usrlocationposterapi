import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosService } from "../Services/CosmosService";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const filter = req.query.filter;
    const filterValue = req.query.filterValue;

    // Get an instance of the CosmosService

    const cosmosService = new CosmosService();

    // Call the getItems method

    const results = await cosmosService.getItems(filter, filterValue);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: results
    };

};

export default httpTrigger;