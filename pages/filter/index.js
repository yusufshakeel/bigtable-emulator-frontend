import Head from 'next/head'
import {Fragment, useState} from "react";
import useSwr from 'swr'
import Nav from "@/pages/components/nav";
import Footer from "@/pages/components/footer";
import columnFamiliesAndColumnQualifiersList from "@/helpers/column-families-and-column-qualifiers-list";
import TableRowVertical from "@/pages/components/table-row-vertical";

const fetcher = url => fetch(url).then((res) => res.json())

export default function Filter() {
    const [filteredResult, setFilteredResult] = useState('');
    const {data, error, isLoading} = useSwr('/api/bigtable/query/tables', fetcher)

    if (error) return <div>Failed to load tables</div>
    if (isLoading) return <div>Loading...</div>
    if (!data) return null

    const getTables = () => {
        return (
            data.tables.sort().map(table => {
                return (
                    <option key={table} value={table}>{table}</option>
                );
            })
        )
    };

    const fetchRow = async (event) => {
        event.preventDefault();

        const selectedTable = event.target.elements['select-table'].value;
        const rowKey = event.target.elements['rowKey-input'].value;

        if (!rowKey?.length) {
            setFilteredResult('Enter Row Key')
            return;
        }

        const response = await fetcher(`/api/bigtable/query/table-row?tableName=${selectedTable}&rowKey=${rowKey}`);

        if (response.error) {
            setFilteredResult('Failed to load row')
        } else if (!response?.row?.data) {
            setFilteredResult('No record')
        } else {
            const columnFamiliesAndColumnQualifiers = columnFamiliesAndColumnQualifiersList([response.row]);
            setFilteredResult(TableRowVertical(columnFamiliesAndColumnQualifiers, response.row))
        }
    }

    return (
        <Fragment>
            <Head>
                <title>Bigtable Emulator Frontend</title>
                <meta name="description"
                      content="This project is a frontend for Google Bigtable emulator and runs on localhost."/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Nav/>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <h4 className="text-center">FILTER</h4>
                    </div>
                </div>
                <hr/>
                <form className="row g-3" onSubmit={fetchRow}>
                    <div className="col-auto">
                        <div className="form-floating mb-3">
                            <select className="form-select" id="select-table">{getTables()}</select>
                            <label htmlFor="select-table">Table</label>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="form-floating mb-3">
                            <input className="form-control" type="text" id="rowKey-input"/>
                            <label htmlFor="rowKey-input">Row Key </label>
                        </div>
                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary mb-3"><i className="bi bi-play-fill"></i>Run</button>
                    </div>
                </form>
                <hr/>
                <div className="row">
                    <div className="col-md-12">
                        {filteredResult}
                    </div>
                </div>
            </div>
            <hr/>
            <Footer/>
        </Fragment>
    )
}
