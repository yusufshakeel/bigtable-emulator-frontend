import {Fragment, useState} from "react";
import Head from "next/head";
import Nav from "@/pages/components/nav";
import Footer from "@/pages/components/footer";
import columnFamiliesAndColumnQualifiersList from "@/helpers/column-families-and-column-qualifiers-list";
import TableRows from "@/pages/components/table-rows";

export default function Query() {
    const [query, setQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [filteredResult, setFilteredResult] = useState('');

    const handler = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setFilteredResult('');

        if (query.length === 0) {
            return;
        }

        const response = await fetch(new Request('/api/bigtable/query/conditional', {
            method: 'POST',
            body: query.trim()
        }))
            .then(response => response.json())
            .catch(error => error.json());

        if (response.error) {
            setErrorMessage(response.error.message);
        } else if (!response.rows || response.rows.length === 0) {
            setFilteredResult('No Record')
        } else {
            const columnFamiliesAndColumnQualifiers = columnFamiliesAndColumnQualifiersList(response?.rows);
            const tableRows = TableRows(columnFamiliesAndColumnQualifiers, response?.rows ?? []);
            setFilteredResult(tableRows);
        }
    };

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
                        <h4 className="text-center">Query</h4>
                    </div>
                </div>
                <hr/>

                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <div className="mb-3">
                            <label htmlFor="query-textarea" className="form-label">Write your query</label>
                            <textarea className="form-control"
                                      value={query}
                                      onChange={(e) => setQuery(e.target.value)}
                                      rows="10"></textarea>
                        </div>
                        <div className="mb-1">{errorMessage}</div>
                        <button className="btn btn-primary my-1" id="button-run" onClick={handler}>Run</button>
                    </div>

                    <div className="col-sm-12 col-md-6" style={{overflow:"none"}}>
                        <p>Sample query</p>
                        <pre>{`{"from": "TABLE_NAME"}`}</pre>
                        <pre>{`{"from": "TABLE_NAME", "rowKey": "ROW_KEY"}`}</pre>
                        <pre>{`{"from": "TABLE_NAME", "rowContainsAnyOf": ["value1","value2"]}`}</pre>
                        <pre>{`{"from": "TABLE_NAME", "rowContainsAllOf": ["value1","value2"]}`}</pre>
                    </div>
                </div>

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
    );
}