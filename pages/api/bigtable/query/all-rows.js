import bigtableInstance from "@/repository/bigtable-instance";
import bigtableRepository from "@/repository/bigtable-repository";

export default async function handler(req, res) {
    const {query: {id: tableName, filter}} = req;
    if (!tableName) {
        res.status(200).json({});
    }
    try {
        const instance = bigtableInstance();
        const rows = await bigtableRepository().allRows(instance, tableName, filter);
        res.status(200).json({rows});
    } catch (e) {
        res.status(404).json({rows: [], error: {message: e.message, errorData: e}});
    }
}