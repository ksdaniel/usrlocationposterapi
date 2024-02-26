export type Verbs = "eq" | "ne" | "gt" | "ge" | "lt" | "le" | "and" | "or" | "not" | "in" | "contains" | "startswith" | "endswith";

export interface Filter {
    field: string;
    verb: Verbs;
    value: string;
}

export class FilterService {

    public static verbToSqlOperator(verb: Verbs): string {
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

    public static isVerb(verb: string): boolean {
        
        
    }

    public static getFilterString(filter: Filter): string {
        let queryString = "";
        if (filter.field && filter.verb && filter.value) {
            queryString = ` WHERE c.${filter.field} ${this.verbToSqlOperator(filter.verb)} '${filter.value}'`;
        }
        return queryString;
    }

    public static stringToFilterString(filter: string): string {
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

        //check if verb is of type Verbs
        if (verb && !Object.values(Verbs).includes(verb as Verbs)) {
            throw new Error(`Invalid verb: ${verb}`);
        }

        let queryString = "";
        if (fieldName && verb && value) {
            queryString = ` WHERE c.${fieldName} ${verb} '${value}'`;
        } else {
            queryString = "";
        }

        return queryString;
    }
}