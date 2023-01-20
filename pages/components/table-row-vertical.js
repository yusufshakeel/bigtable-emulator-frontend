import randomString from "@/helpers/random-string";

export default function TableRowVertical(columnFamiliesAndColumnQualifiers, tableRow) {
    const getKeyForElement = (prefix = '') => prefix + randomString();

    const renderDataRows = () => {
        return columnFamiliesAndColumnQualifiers.map(cfAndCq => {
            const [cf, cq] = cfAndCq.split('.');
            const value = tableRow.data[cf]?.[cq];
            return (
                <tr key={getKeyForElement()}>
                    <td>{cfAndCq}</td>
                    <td>{value ? JSON.stringify(value) : ''}</td>
                </tr>
            )
        });
    };

    return (
        <div className="table-responsive">
            <table className="table table-striped table-bordered">
                <tbody>
                <tr>
                    <td>rowKey</td>
                    <td>{tableRow.rowKey}</td>
                </tr>
                {renderDataRows()}
                </tbody>
            </table>
        </div>
    );
}