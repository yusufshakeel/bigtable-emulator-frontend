export default function columnFamiliesAndColumnQualifiersList(arrayOfObjects) {
    return arrayOfObjects?.reduce((result, row) => {
        const {data} = row;

        const columnFamilies = Object.keys(data);

        const cfAndCqs = columnFamilies.reduce((result, cf) => {
            const cqs = Object.keys(data[cf]);
            return [...result, ...cqs.map(cq => `${cf}.${cq}`)];
        }, [])

        const filter = [];
        cfAndCqs.forEach(v => {
            if (!result.includes(v)) {
                filter.push(v);
            }
        });

        return [...result, ...filter];
    }, []).sort() ?? [];
}