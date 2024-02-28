export interface Filter {
    field: string;
    verb: string;
    value: string;
}

export class FilterService {

    public static verbToSqlOperator(verb: string): string {
        switch (verb) {
            case "eq":
                return "=";
            case "ne":
                return "<>";
            case "gt":
                return ">";
            case "ge":
                return ">=";
            case "lt":
                return "<";
            case "le":
                return "<=";
            case "and":
                return "AND";
            case "or":
                return "OR";
            case "not":
                return "NOT";
            case "in":
                return "IN";
            case "contains":
                return "LIKE";
            case "startswith":
                return "LIKE";
            case "endswith":
                return "LIKE";
            default:
                return "=";
        }
    }

    //check if verb is valid verb
    public static isValidVerb(verb: string): boolean {
        switch (verb) {
            case "eq":
            case "ne":
            case "gt":
            case "ge":
            case "lt":
            case "le":
            case "and":
            case "or":
            case "not":
            case "in":
            case "contains":
            case "startswith":
            case "endswith":
                return true;
            default:
                return false;
        }
    }


    public static getFilterString(filter: Filter): string {
        let queryString = "";
        if (filter.field && filter.verb && filter.value) {
            queryString = `WHERE c.${filter.field} ${this.verbToSqlOperator(filter.verb)} '${filter.value}'`;
        }
        return queryString;
    }

    public static stringToFilterString(filter: string): string {
        let fieldName: string = "";
        let verb: string = "";
        let value: string = "";

        if (filter) {
            const filterArray = filter.split(" ");
            if (filterArray.length === 3) {
                fieldName = filterArray[0];
                verb = filterArray[1];
                value = filterArray[2];
            }
        }
        return this.getFilterString({ field: fieldName, verb: verb, value: value } as Filter);
    }
}