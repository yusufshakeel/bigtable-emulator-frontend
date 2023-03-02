export default function bigtableRepository() {
    const defaultFilter = [
        {
            column: {
                cellLimit: 1 // Only retrieve the most recent version of the cell.
            }
        }
    ];

    const getTable = (instance, tableName) => {
        return instance.table(tableName);
    };

    const getTables = async instance => {
        return instance.getTables();
    };

    const getColumnFamilies = async (instance, tableName) => {
        return instance.table(tableName).getFamilies();
    };

    const allRows = async (instance, tableName, filter) => {
        const table = getTable(instance, tableName);
        const [allRows] = await (filter ? table.getRows({filter}) : table.getRows());
        if (allRows.length) {
            return allRows.map(({id, data}) => ({rowKey: id, data}));
        }
        return [];
    };

    const findByRowKey = async (instance, tableName, rowKey, filter) => {
        const table = getTable(instance, tableName);
        const [singleRow] = await (filter ? table.row(rowKey).get({filter}) : table.row(rowKey).get({}));
        return singleRow?.id && {rowKey: singleRow.id, data: singleRow.data};
    };

    const readRowsWithFilter = (table, option) =>
        new Promise((resolve, reject) => {
            const result = [];
            table
                .createReadStream(option)
                .on('error', err => {
                    return reject(err);
                })
                .on('data', row => {
                    const {id, data} = row;
                    result.push({rowKey: id, data});
                })
                .on('end', () => {
                    return resolve(result);
                });
        });

    const findRowsByFilter = async (instance, tableName, filter) => {
        const table = getTable(instance, tableName);
        return readRowsWithFilter(table, {filter});
    };

    const findByRowKeys = async (bigtableInstance, tableName, rowKeys, filters) => {
        const filterToUse = filters ?? defaultFilter;
        const table = getTable(bigtableInstance, tableName);
        const [allRows] = await table.getRows({ filter: filterToUse, keys: rowKeys });
        if (allRows.length) {
            return allRows.map(({ id, data }) => ({ rowKey: id, data }));
        }
    };

    return {
        getTable,
        getTables,
        getColumnFamilies,
        allRows,
        findByRowKey,
        findByRowKeys,
        findRowsByFilter
    };
}