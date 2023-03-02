import bigtableInstance from "@/repository/bigtable-instance";
import bigtableRepository from "@/repository/bigtable-repository";

export default async function handler(req, res) {
    switch (req.method) {
        case 'POST':
            try {
                const jsonBody = JSON.parse(req.body);
                const {from: tableName, rowKey} = jsonBody;

                if (!tableName) {
                    res.status(400).json({error: {message: 'Mandatory field `from` missing'}});
                }

                const instance = bigtableInstance();
                if (!rowKey) {
                    const rows = await bigtableRepository().allRows(instance, tableName);
                    res.status(200).json({rows});
                } else if (rowKey) {
                    const row = await bigtableRepository().findByRowKey(instance, tableName, rowKey);
                    res.status(200).json({rows: [row]});
                }
            } catch (e) {
                res.status(400).json({rows: [], error: {message: e.message, errorData: e}});
            }
            break;

        default:
            res.status(400).json({rows: [], error: {message: 'Bad request!', errorData: {}}});
    }
}