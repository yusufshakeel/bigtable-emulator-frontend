import Head from 'next/head'
import {useRouter} from 'next/router'
import {Fragment} from "react";
import useSwr from 'swr'
import Nav from "@/pages/components/nav";
import Footer from "@/pages/components/footer";
import columnFamiliesAndColumnQualifiersList from "@/helpers/column-families-and-column-qualifiers-list";
import TableRows from "@/pages/components/table-rows";

const fetcher = url => fetch(url).then((res) => res.json())

export default function Table() {
    const {query} = useRouter()
    const {data, error, isLoading} = useSwr(`/api/bigtable/query/all-rows?id=${query.id}`, fetcher);

    const handle = () => {
        if (error) return <div>Failed to load tables</div>
        if (isLoading) return <div>Loading...</div>
        if (!data) return null;

        const columnFamiliesAndColumnQualifiers = columnFamiliesAndColumnQualifiersList(data?.rows);

        return TableRows(columnFamiliesAndColumnQualifiers, data?.rows ?? [])
    };

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
