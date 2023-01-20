import {Fragment} from "react";
import randomString from "@/helpers/random-string";

export default function TableRows(columnFamiliesAndColumnQualifiers, tableRows) {
    const rowHeaderHtml = (
        <tr>
            <th>#</th>
            <th>rowKey</th>
            {columnFamiliesAndColumnQualifiers.map(v => (<th key={v}>{v}</th>))}
        </tr>
    );

    const getKeyForElement = (prefix = '') => prefix + randomString();

    return (
        <Fragment>
            <div>
                <p className="text-center">Total Rows: {tableRows.length}</p>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <tbody>
                    {
                        tableRows.map(({rowKey, data: rowData}, index) => {
                            const rowIndexHtml = (<td>{index + 1}</td>);
                            const rowKeyHtml = (<td>{rowKey}</td>);
                            const rowDataHtml = columnFamiliesAndColumnQualifiers.map(cfAndCq => {
                                const [cf, cq] = cfAndCq.split('.');
                                const value = rowData[cf]?.[cq];
                                return (<td key={getKeyForElement()}>{value ? JSON.stringify(value) : ''}</td>);
                            });
                            return (
                                <Fragment key={getKeyForElement()}>
                                    {rowHeaderHtml}
                                    <tr key={getKeyForElement()}>
                                        {rowIndexHtml}
                                        {rowKeyHtml}
                                        {rowDataHtml}
                                    </tr>
                                </Fragment>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
}