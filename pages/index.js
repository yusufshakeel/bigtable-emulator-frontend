import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import {Fragment} from "react";
import useSwr from 'swr'
import Link from 'next/link'
import Nav from "@/pages/components/nav";
import Footer from "@/pages/components/footer";

const fetcher = url => fetch(url).then((res) => res.json())

export default function Home() {
    const {data, error, isLoading} = useSwr('/api/bigtable/query/tables', fetcher)

    const handle = () => {
        if (error) return <div>Failed to load tables</div>
        if (isLoading) return <div>Loading...</div>
        if (!data) return null

        const {tables} = data;
        return (
            data.tables.sort().map(table => {
                return (
                    <div key={table} className="col-md-4 p-2">
                        <Link className="card card-body nav-link" href="/tables/[id]" as={`/tables/${table}`}>
                            <h4><i className="bi bi-table pe-3"></i>{table}</h4>
                        </Link>
                    </div>
                );
            })
        )
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
                        <h4 className="text-center">TABLES</h4>
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
