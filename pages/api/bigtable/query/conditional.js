import bigtableInstance from "@/repository/bigtable-instance";
import bigtableRepository from "@/repository/bigtable-repository";
import columnFamiliesAndColumnQualifiersList from "@/helpers/column-families-and-column-qualifiers-list";

export default async function handler(req, res) {
    const fetchRowsByValues = async (instance, tableName, values) => {
        return await bigtableRepository().findRowsByFilter(instance, tableName, [
            {column: {cellLimit: 1}},
            {value: RegExp(values.join("|"))}
        ]);
    };

    switch (req.method) {
        case 'POST':
            try {
                const jsonBody = JSON.parse(req.body);
                const {from: tableName, rowKey, rowContainsAnyOf, rowContainsAllOf} = jsonBody;

                if (!tableName) {
                    res.status(400).json({error: {message: 'Mandatory field `from` missing'}});
                }

                const instance = bigtableInstance();
                if (rowKey) {
                    const row = await bigtableRepository().findByRowKey(instance, tableName, rowKey);
                    res.status(200).json({rows: [row]});
                } else if (rowContainsAnyOf) {
                    const rows = await fetchRowsByValues(instance, tableName, rowContainsAnyOf);
                    if (!rows.length) {
                        res.status(200).json({rows});
                    }
                    const rowKeys = rows.map(({rowKey}) => rowKey);
                    const enrichedRows = await bigtableRepository().findByRowKeys(instance, tableName, rowKeys);
                    res.status(200).json({rows: enrichedRows});
                } else if (rowContainsAllOf) {
                    const rows = await fetchRowsByValues(instance, tableName, rowContainsAllOf);
                    if (!rows.length) {
                        res.status(200).json({rows});
                    }
                    const rowKeys = rows.map(({rowKey}) => rowKey);
                    const enrichedRows = await bigtableRepository().findByRowKeys(instance, tableName, rowKeys);
                    const cfCqList = columnFamiliesAndColumnQualifiersList(enrichedRows);
                    const filteredRows = enrichedRows.filter(({data}) => {
                        const valuesInARow = cfCqList.reduce((result, cfCq) => {
                            const [cf,cq]= cfCq.split('.')
                            const cell = data[cf][cq];
                            return cell.length ? [...result, cell[0].value] : result;
                        }, []);
                        return rowContainsAllOf.every(v => valuesInARow.includes(v));
                    })
                    res.status(200).json({rows: filteredRows});
                } else if (!rowKey) {
                    const rows = await bigtableRepository().allRows(instance, tableName);
                    res.status(200).json({rows});
                }
            } catch (e) {
                res.status(400).json({rows: [], error: {message: e.message, errorData: e}});
            }
            break;

        default:
            res.status(400).json({rows: [], error: {message: 'Bad request!', errorData: {}}});
    }
}