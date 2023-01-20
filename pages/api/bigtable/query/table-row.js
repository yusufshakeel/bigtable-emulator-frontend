import bigtableInstance from "@/repository/bigtable-instance";
import bigtableRepository from "@/repository/bigtable-repository";

export default async function handler(req, res) {
    const {query: {tableName, rowKey, filter}} = req;
    if (!tableName || !rowKey) {
        res.status(400).json({error: {message: 'mandatory fields missing'}});
    } else {
        try {
            const instance = bigtableInstance();
            const row = await bigtableRepository().findByRowKey(instance, tableName, rowKey, filter);
            res.status(200).json({row});
        } catch (e) {
            res.status(404).json({row: {}, error: {message: e.message, errorData: e}});
        }
    }
}