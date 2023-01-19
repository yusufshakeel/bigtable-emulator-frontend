import bigtableInstance from "@/repository/bigtable-instance";
import bigtableRepository from "@/repository/bigtable-repository";

export default async function handler(req, res) {
    const instance = bigtableInstance();
    const [allTables] = await bigtableRepository().getTables(instance);
    const tables = allTables.map(({id}) => id);
    res.status(200).json({ tables })
}