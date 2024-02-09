const { CosmosClient } = require("@azure/cosmos");

export class CosmosService {


    private endpoint: string = process.env.AZURE_COSMOS_ENDPOINT;
    private key: string = process.env.AZURE_COSMOS_KEY;
    private databaseId: string = process.env.AZURE_COSMOS_DATABASE;
    private containerId: string = process.env.AZURE_COSMOS_CONTAINER;

    constructor() {
    }

    public async getItems(): Promise<any> {

        const cosmosClient = new CosmosClient({ endpoint: this.endpoint, key: this.key });

        const querySpec = {
            query: `SELECT * FROM ${this.containerId} c`,
            parameters: []
        };

        const result = await cosmosClient
            .database(this.databaseId)
            .container(this.containerId)
            .items.query(querySpec)
            .fetchNext();


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