import Head from 'next/head'
import {useRouter} from 'next/router'
import {Fragment} from "react";
import useSwr from 'swr'
import Nav from "@/pages/components/nav";
import Footer from "@/pages/components/footer";

const fetcher = url => fetch(url).then((res) => res.json())

export default function Table() {
    const {query} = useRouter()
    const {data, error, isLoading} = useSwr(`/api/bigtable/query/all-rows?id=${query.id}`, fetcher);

    const handle = () => {
        if (error) return <div>Failed to load tables</div>
        if (isLoading) return <div>Loading...</div>
        if (!data) return null;

        const columnFamiliesAndColumnQualifiers = data?.rows?.reduce((result, row, index) => {
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

        const rowHeaderHtml = (
            <tr>
                <th>#</th>
                <th>rowKey</th>
                {columnFamiliesAndColumnQualifiers.map(v => (<th key={v}>{v}</th>))}
            </tr>
        )

        return (
            <Fragment>
                <div>
                    <p className="text-center">Total Rows: {data?.rows?.length ?? 0}</p>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <tbody>
                        {
                            data?.rows?.map(({rowKey, data: rowData}, index) => {
                                const rowIndexHtml = (<td>{index + 1}</td>)
                                const rowKeyHtml = (<td>{rowKey}</td>)
                                const rowDataHtml = columnFamiliesAndColumnQualifiers.map(cfAndCq => {
                                    const [cf, cq] = cfAndCq.split('.');
                                    const value = rowData[cf]?.[cq];
                                    if (value) {
                                        return (<td key={index + 1 + Math.random()}>{JSON.stringify(value)}</td>)
                                    }
                                    return (<td key={index + 1 + Math.random()}></td>)
                                })
                                return (
                                    <Fragment key={index + 1 + Math.random()}>
                                        {rowHeaderHtml}
                                        <tr key={index + 1 + Math.random()}>
                                            {rowIndexHtml}
                                            {rowKeyHtml}
                                            {rowDataHtml}
                                        </tr>
                                    </Fragment>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </Fragment>
        )
    }
        ;

        return (
            <Fragment>
                <Head>
                    <title>Bigtable Emulator Frontend - Table</title>
                    <meta name="description"
                          content="This project is a frontend for Google Bigtable emulator and runs on localhost."/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>
                <Nav/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="text-center">Table: <br/> {query.id}</h4>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        {handle()}
                    </div>
                </div>
                <hr/>
                <Footer/>
            </Fragment>
        )
    }
