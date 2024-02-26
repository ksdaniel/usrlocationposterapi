const { CosmosClient } = require("@azure/cosmos");

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
            queryString += this.getQueryFilterString(filter);
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


    //extract field name, verb and value from filter and return query filter
    private getQueryFilterString(filter: string) : string {
        let fieldName: string = "";
        let verb: string = "";
        let value: string = "";

        if (filter) {
            const filterParts = filter.split(" ");
            if (filterParts.length === 3) {
                fieldName = filterParts[0];
                verb = filterParts[1];
                value = filterParts[2];
            }
        }

        let queryString = "";
        if (fieldName && verb && value) {
            queryString = `WHERE c.${fieldName} ${verb} '${value}'`;
        } else {
            queryString = "";
        }

        return queryString;
    }

}