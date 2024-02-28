const { CosmosClient } = require("@azure/cosmos");
import { FilterService } from "./Filter";

export class CosmosService {


    private endpoint: string = process.env.AZURE_COSMOS_ENDPOINT;
    private key: string = process.env.AZURE_COSMOS_KEY;
    private databaseId: string = process.env.AZURE_COSMOS_DATABASE;
    private containerId: string = process.env.AZURE_COSMOS_CONTAINER;

    constructor() {
    }

    public async getItems(filter?: string): Promise<any> {

        const cosmosClient = new CosmosClient({ endpoint: this.endpoint, key: this.key });

        // const querySpec = {
        //     query: `SELECT * FROM ${this.containerId} c order by c.time desc OFFSET 0 LIMIT 2000`,
        //     parameters: []
        // };

        let orderBy = "order by c.time desc OFFSET 0 LIMIT 2000";
        let queryString = `SELECT * FROM ${this.containerId} c `;

        if (filter) {
            queryString += FilterService.stringToFilterString(filter);
        }

        queryString += ` ${orderBy}`;

        const querySpec = {
            query: queryString,
            parameters: []
        };


        const result = await cosmosClient
            .database(this.databaseId)
            .container(this.containerId)
            .items.query(querySpec)
            .fetchAll();

        if (result && result.resources) {
            // Process the retrieved items
            return result.resources;
        }

        return [];
    }

    public async deleteItem(id: string): Promise<any> {

        const cosmosClient = new CosmosClient({ endpoint: this.endpoint, key: this.key });

        const result = await cosmosClient
            .database(this.databaseId)
            .container(this.containerId)
            .item(id)
            .delete();

        return result;
    }

}