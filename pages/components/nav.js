import Image from 'next/image'
import Link from "next/link";

export default function Nav() {
    return (
        <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/">
                    <Image src="/logo.png"
                           alt="logo"
                           width={36}
                           height={36}/>
                    Bigtable Emulator Frontend
                </Link>
            </div>
        </nav>
    );
}